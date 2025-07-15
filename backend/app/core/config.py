from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    app_name: str = "NutriMate"
    debug: bool = False
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    
    # Database
    database_url: str
    
    # AI Service
    deepseek_api_key: str
    deepseek_api_url: str = "https://api.deepseek.com/v1"
    
    class Config:
        env_file = ".env"

settings = Settings()