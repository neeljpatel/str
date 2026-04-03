from pydantic import BaseModel, Field

class PasswordResetRequest(BaseModel):
    user_id: str
    new_password: str = Field(..., min_length=6, description="The new password for the user.")
