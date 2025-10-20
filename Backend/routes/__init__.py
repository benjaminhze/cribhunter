# Routes package
from .auth import router as auth_router
from .users import router as users_router
from .properties import router as properties_router

__all__ = ["auth_router", "users_router", "properties_router"]
