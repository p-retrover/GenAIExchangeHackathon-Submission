from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # database settings
    PROJECT_NAME: str = "Satori"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@db:5432/satori"
    DB_ECHO_LOG: bool = False  # Enable SQL query logging. Set to True for debugging.
    API_V1_STR: str = "/api/v1"

    # Test database URL
    TEST_DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@db:5432/satori_test"

    # jwt settings
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # in minutes
    ALGORITHM: str = "HS256"

    # Google Gemini API settings
    GOOGLE_API_KEY: str

    # Pydantic v2 syntax for loading from .env file
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
