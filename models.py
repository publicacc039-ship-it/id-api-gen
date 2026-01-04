"""
Pydantic models and schemas for id-api-gen.
"""

from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr, validator
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema with common fields."""
    username: str = Field(..., min_length=1, max_length=255, description="User's username")
    email: EmailStr = Field(..., description="User's email address")
    full_name: Optional[str] = Field(None, max_length=255, description="User's full name")
    is_active: bool = Field(default=True, description="Whether the user is active")


class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str = Field(..., min_length=8, description="User's password (min 8 characters)")

    @validator('password')
    def validate_password(cls, v):
        """Validate password complexity."""
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v


class UserUpdate(BaseModel):
    """Schema for updating user information."""
    full_name: Optional[str] = Field(None, max_length=255)
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None


class User(UserBase):
    """User schema with database fields."""
    id: int = Field(..., description="User's unique identifier")
    created_at: datetime = Field(..., description="Timestamp when user was created")
    updated_at: datetime = Field(..., description="Timestamp when user was last updated")

    class Config:
        from_attributes = True


class TokenData(BaseModel):
    """Schema for JWT token data."""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration time in seconds")


class ErrorResponse(BaseModel):
    """Schema for error responses."""
    detail: str = Field(..., description="Error message")
    code: Optional[str] = Field(None, description="Error code")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Error timestamp")


class HealthCheck(BaseModel):
    """Schema for health check endpoint."""
    status: str = Field(..., description="Service status")
    version: str = Field(..., description="API version")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Health check timestamp")


class PaginationParams(BaseModel):
    """Schema for pagination parameters."""
    skip: int = Field(default=0, ge=0, description="Number of records to skip")
    limit: int = Field(default=10, ge=1, le=100, description="Number of records to return")


class PaginatedResponse(BaseModel):
    """Schema for paginated responses."""
    data: List = Field(..., description="List of items")
    total: int = Field(..., description="Total number of items")
    skip: int = Field(..., description="Number of items skipped")
    limit: int = Field(..., description="Number of items returned")
