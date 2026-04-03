from typing import AsyncGenerator, Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import AsyncSessionLocal
from app.core.security import verify_supabase_token

# Specifies how FastAPI extracts the token from headers
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to get the database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    """
    Dependency to get the current authenticated user from Supabase token.
    Raises 401 if token is missing or invalid.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    payload = verify_supabase_token(token)
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload

async def get_admin_user(current_user: dict = Depends(get_current_user)):
    """
    Ensures the authenticated user has admin privileges.
    Custom logic can be adjusted based on Supabase role/custom claims.
    """
    # For now, we allow any valid authenticated user to access admin.
    # To restrict further, check current_user.get("role") or user metadata.
    return current_user
