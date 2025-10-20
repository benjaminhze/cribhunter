"""
Property management routes
"""

from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import List, Optional
from models import PropertyCreate, PropertyUpdate, PropertyResponse, MessageResponse, UserResponse
from auth import get_current_user, get_current_user_optional
from database import get_supabase_client

router = APIRouter()

@router.get("/", response_model=List[PropertyResponse])
async def get_properties(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    property_type: Optional[str] = Query(None),
    listing_type: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    bedrooms: Optional[int] = Query(None, ge=0),
    bathrooms: Optional[int] = Query(None, ge=0),
    current_user: Optional[UserResponse] = Depends(get_current_user_optional)
):
    """Get properties with optional filters"""
    supabase = get_supabase_client()
    
    # Build query
    query = supabase.table("properties").select("*").eq("is_active", True)
    
    # Apply filters
    if property_type:
        query = query.eq("property_type", property_type)
    if listing_type:
        query = query.eq("listing_type", listing_type)
    if min_price:
        query = query.gte("price", min_price)
    if max_price:
        query = query.lte("price", max_price)
    if bedrooms:
        query = query.gte("bedrooms", bedrooms)
    if bathrooms:
        query = query.gte("bathrooms", bathrooms)
    
    # Apply pagination
    query = query.range(skip, skip + limit - 1)
    
    try:
        result = query.execute()
        properties = []
        for prop in result.data:
            properties.append(PropertyResponse(**prop))
        return properties
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch properties: {str(e)}"
        )

@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(
    property_id: str,
    current_user: Optional[UserResponse] = Depends(get_current_user_optional)
):
    """Get a specific property by ID"""
    supabase = get_supabase_client()
    
    try:
        result = supabase.table("properties").select("*").eq("id", property_id).eq("is_active", True).execute()
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found"
            )
        
        return PropertyResponse(**result.data[0])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch property: {str(e)}"
        )

@router.post("/", response_model=PropertyResponse)
async def create_property(
    property_data: PropertyCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Create a new property (agents only)"""
    if current_user.user_type != "agent":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only agents can create properties"
        )
    
    supabase = get_supabase_client()
    
    try:
        result = supabase.table("properties").insert({
            "title": property_data.title,
            "description": property_data.description,
            "address": property_data.address,
            "price": property_data.price,
            "bedrooms": property_data.bedrooms,
            "bathrooms": property_data.bathrooms,
            "size": property_data.size,
            "property_type": property_data.property_type,
            "listing_type": property_data.listing_type,
            "features": property_data.features,
            "amenities": property_data.amenities,
            "images": property_data.images,
            "lat": property_data.lat,
            "lng": property_data.lng,
            "contact_name": property_data.contact_name,
            "contact_phone": property_data.contact_phone,
            "contact_email": property_data.contact_email,
            "owner_id": current_user.id
        }).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create property"
            )
        
        return PropertyResponse(**result.data[0])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create property: {str(e)}"
        )

@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: str,
    property_update: PropertyUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update a property (owner only)"""
    supabase = get_supabase_client()
    
    # Check if property exists and user owns it
    result = supabase.table("properties").select("*").eq("id", property_id).eq("owner_id", current_user.id).execute()
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found or you don't have permission to update it"
        )
    
    # Prepare update data
    update_data = {k: v for k, v in property_update.dict().items() if v is not None}
    
    try:
        result = supabase.table("properties").update(update_data).eq("id", property_id).execute()
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update property"
            )
        
        return PropertyResponse(**result.data[0])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update property: {str(e)}"
        )

@router.delete("/{property_id}", response_model=MessageResponse)
async def delete_property(
    property_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Delete a property (owner only)"""
    supabase = get_supabase_client()
    
    # Check if property exists and user owns it
    result = supabase.table("properties").select("id").eq("id", property_id).eq("owner_id", current_user.id).execute()
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found or you don't have permission to delete it"
        )
    
    try:
        # Soft delete by setting is_active to False
        supabase.table("properties").update({"is_active": False}).eq("id", property_id).execute()
        return MessageResponse(message="Property deleted successfully")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete property: {str(e)}"
        )

@router.get("/user/{user_id}", response_model=List[PropertyResponse])
async def get_user_properties(
    user_id: str,
    current_user: Optional[UserResponse] = Depends(get_current_user_optional)
):
    """Get properties by a specific user"""
    supabase = get_supabase_client()
    
    try:
        result = supabase.table("properties").select("*").eq("owner_id", user_id).eq("is_active", True).execute()
        properties = [PropertyResponse(**prop) for prop in result.data]
        return properties
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch user properties: {str(e)}"
        )
