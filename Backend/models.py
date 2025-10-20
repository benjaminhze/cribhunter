"""
Pydantic models for Property Hunter API
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserType(str, Enum):
    HUNTER = "hunter"
    AGENT = "agent"

class PropertyType(str, Enum):
    HDB = "hdb"
    CONDO = "condo"
    LANDED = "landed"

class ListingType(str, Enum):
    RENT = "rent"
    SALE = "sale"

# User Models
class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str
    user_type: UserType
    phone: Optional[str] = Field(None, pattern=r'^\d{8}$')
    agent_license: Optional[str] = Field(None, max_length=50)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "user_type": "hunter",
                "password": "password123",
                "phone": "81234567",
                "agent_license": "AG123456"
            }
        }

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None, pattern=r'^\d{8}$')
    agent_license: Optional[str] = Field(None, max_length=50)

class User(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    user_type: UserType
    phone: Optional[str] = None
    agent_license: Optional[str] = None
    created_at: datetime

# Property Models
class PropertyBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=2000)
    address: str = Field(..., min_length=1, max_length=500)
    price: float = Field(..., gt=0)
    bedrooms: int = Field(..., ge=0)
    bathrooms: int = Field(..., ge=0)
    size: float = Field(..., gt=0)
    property_type: PropertyType
    listing_type: ListingType
    features: List[str] = Field(default_factory=list)
    amenities: List[str] = Field(default_factory=list)
    images: List[str] = Field(default_factory=list)
    lat: Optional[float] = None
    lng: Optional[float] = None

class PropertyCreate(PropertyBase):
    contact_name: str = Field(..., min_length=1, max_length=100)
    contact_phone: str = Field(..., pattern=r'^\d{8}$')
    contact_email: str

class PropertyUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, min_length=1, max_length=2000)
    address: Optional[str] = Field(None, min_length=1, max_length=500)
    price: Optional[float] = Field(None, gt=0)
    bedrooms: Optional[int] = Field(None, ge=0)
    bathrooms: Optional[int] = Field(None, ge=0)
    size: Optional[float] = Field(None, gt=0)
    property_type: Optional[PropertyType] = None
    listing_type: Optional[ListingType] = None
    features: Optional[List[str]] = None
    amenities: Optional[List[str]] = None
    images: Optional[List[str]] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    contact_name: Optional[str] = Field(None, min_length=1, max_length=100)
    contact_phone: Optional[str] = Field(None, pattern=r'^\d{8}$')
    contact_email: Optional[str] = None

class Property(PropertyBase):
    id: str
    owner_id: str
    contact_name: str
    contact_phone: str
    contact_email: str
    created_at: datetime
    updated_at: datetime
    is_active: bool = True

class PropertyResponse(BaseModel):
    id: str
    title: str
    description: str
    address: str
    price: float
    bedrooms: int
    bathrooms: int
    size: float
    property_type: PropertyType
    listing_type: ListingType
    features: List[str]
    amenities: List[str]
    images: List[str]
    lat: Optional[float] = None
    lng: Optional[float] = None
    owner_id: str
    contact_name: str
    contact_phone: str
    contact_email: str
    created_at: datetime
    updated_at: datetime
    is_active: bool = True

# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

# Response Models
class MessageResponse(BaseModel):
    message: str
    success: bool = True

class ErrorResponse(BaseModel):
    detail: str
    success: bool = False
