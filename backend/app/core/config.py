from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Chicago Collective API"
    API_V1_STR: str = "/api/v1"
    
    # Supabase PostgreSQL Database credentials
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@db.supabase.co:5432/postgres"
    
    # Supabase Auth specifics
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""
    SUPABASE_SERVICE_KEY: str = ""
    HOSPITABLE_ACCESS_TOKEN: str = ""
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
