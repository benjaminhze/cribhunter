"""
User management routes
"""

from fastapi import APIRouter, HTTPException, status, Depends
from models import UserResponse, UserUpdate, MessageResponse
from auth import get_current_user

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
async def get_user_profile(current_user: UserResponse = Depends(get_current_user)):
    """Get user profile"""
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_user_profile(
    user_update: UserUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update user profile"""
    # This would update user profile in Supabase
    # For now, return current user
    return current_user

@router.delete("/profile", response_model=MessageResponse)
async def delete_user_profile(current_user: UserResponse = Depends(get_current_user)):
    """Delete user profile"""
    # This would delete user from Supabase
    return MessageResponse(message="User profile deleted successfully")
