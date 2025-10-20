"""
Authentication routes
"""

from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials
from datetime import timedelta
from models import UserCreate, UserLogin, UserResponse, Token, MessageResponse
from auth import create_access_token, verify_password, get_password_hash, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from database import get_supabase_client

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    """Register a new user"""
    supabase = get_supabase_client()
    
    # Check if user already exists
    existing_user = supabase.table("users").select("id").eq("email", user_data.email).execute()
    if existing_user.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Validate agent-specific fields
    if user_data.user_type == "agent":
        if not user_data.phone or not user_data.agent_license:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Phone number and agent license are required for agents"
            )
    else:
        # Clear agent-specific fields for hunters
        user_data.phone = None
        user_data.agent_license = None
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Create user in Supabase
    try:
        result = supabase.table("users").insert({
            "name": user_data.name,
            "email": user_data.email,
            "user_type": user_data.user_type,
            "phone": user_data.phone,
            "agent_license": user_data.agent_license,
            "password_hash": hashed_password
        }).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user"
            )
        
        user = result.data[0]
        return UserResponse(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            user_type=user["user_type"],
            phone=user.get("phone"),
            agent_license=user.get("agent_license"),
            created_at=user["created_at"]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(login_data: UserLogin):
    """Login user and return access token"""
    supabase = get_supabase_client()
    
    # Get user by email
    result = supabase.table("users").select("*").eq("email", login_data.email).execute()
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    user = result.data[0]
    
    # Verify password
    if not verify_password(login_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"]}, 
        expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, token_type="bearer")

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserResponse = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: UserResponse = Depends(get_current_user)):
    """Logout user (client should discard token)"""
    return MessageResponse(message="Successfully logged out")

@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: UserResponse = Depends(get_current_user)):
    """Refresh access token"""
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user.id}, 
        expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token, token_type="bearer")
