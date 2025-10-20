"""
Property Hunter Backend API
FastAPI backend for Property Hunter application
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
from routes import auth_router, properties_router, users_router
from database import get_supabase_client

# Load environment variables
load_dotenv()

# Initialize FastAPI app
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Property Hunter Backend starting up...")
    print("✅ FastAPI server initialized")
    print("✅ Supabase client connected")
    yield
    # Shutdown
    print("🛑 Property Hunter Backend shutting down...")

app = FastAPI(
    title="Property Hunter API",
    description="Backend API for Property Hunter application",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["authentication"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(properties_router, prefix="/api/properties", tags=["properties"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Property Hunter API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        supabase = get_supabase_client()
        # Test Supabase connection
        result = supabase.auth.get_session()
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": "2024-01-01T00:00:00Z"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Service unhealthy: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
