"""
Authentication helpers for FastAPI routes
"""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext

from database import get_supabase_client
from models import UserResponse

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(tz=timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def _decode_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: Optional[str] = payload.get("sub")
        return user_id
    except JWTError:
        return None


async def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security)) -> UserResponse:
    if creds is None or creds.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    user_id = _decode_token(creds.credentials)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    supabase = get_supabase_client()
    result = supabase.table("users").select("*").eq("id", user_id).limit(1).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    u = result.data[0]
    return UserResponse(
        id=u["id"],
        name=u["name"],
        email=u["email"],
        user_type=u["user_type"],
        phone=u.get("phone"),
        agent_license=u.get("agent_license"),
        created_at=u["created_at"],
    )


async def get_current_user_optional(creds: Optional[HTTPAuthorizationCredentials] = Depends(security)) -> Optional[UserResponse]:
    try:
        return await get_current_user(creds)  # type: ignore[arg-type]
    except HTTPException:
        return None


