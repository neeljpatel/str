from fastapi import HTTPException, status
from supabase import create_client
from app.core.config import settings

def verify_supabase_token(token: str) -> dict:
    """
    Verifies a Supabase JWT token using the Supabase API to ensure
    it is active and has not been revoked.
    """
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Supabase credentials are not fully configured."
        )

    try:
        supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        # Return a dictionary mimicking the JWT payload for compatibility
        return {"sub": user_response.user.id, "email": user_response.user.email}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
