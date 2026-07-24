from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "CareerOS"
    
    # URLs
    DATABASE_URL: str
    REDIS_URL: str
    FRONTEND_URL: str = "http://localhost:3000"
    
    # Auth
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # MinIO
    MINIO_URL: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET_NAME: str = "careeros"
    
    # AI
    GEMINI_API_KEY: str | None = None
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    AI_MODEL: str = "llama3"
    
    # Crypto
    ENCRYPTION_KEY: str

    model_config = SettingsConfigDict(
        # Procura o .env na raiz do monorepo
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))), ".env"),
        extra="ignore"
    )

settings = Settings()
