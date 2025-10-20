"""
Database configuration and Supabase client setup
"""

import os
from supabase import create_client, Client
from typing import Optional

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://fqjuaftiullmryhpnvgt.supabase.co")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxanVhZnRpdWxsbXJ5aHBudmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4OTIxMDksImV4cCI6MjA3NjQ2ODEwOX0.I2BELQBxwhb6-6PS_580t0uInmRmPE7BkP5aSvE56X4")

# Global Supabase client
_supabase_client: Optional[Client] = None

def get_supabase_client() -> Client:
    """Get or create Supabase client"""
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    return _supabase_client

def test_connection() -> dict:
    """Test Supabase connection"""
    try:
        supabase = get_supabase_client()
        # Test auth service
        result = supabase.auth.get_session()
        return {
            "success": True,
            "message": "Supabase connection successful",
            "auth_service": "accessible"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Supabase connection failed: {str(e)}",
            "error": str(e)
        }

# Database table names
TABLES = {
    "USERS": "users",
    "PROPERTIES": "properties",
    "FAVORITES": "favorites"
}
