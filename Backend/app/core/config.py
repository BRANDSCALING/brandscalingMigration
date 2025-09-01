# ============================================================================
# CONFIGURATION FILE - All the settings and secrets for our application
# ============================================================================
# This file contains all the configuration settings for our AI coaching system.
# It loads environment variables (like API keys) from a .env file to keep secrets safe.
# Environment variables are like settings that can be different on different computers.

import os  # For accessing environment variables
from dotenv import load_dotenv  # For loading .env file

# Load environment variables from .env file
# This reads a file called .env that contains our secret settings
load_dotenv()

class Settings:
    """
    Settings class - holds all configuration values for our application
    This keeps all our settings organized in one place
    """
    
    # ============================================================================
    # AWS CONFIGURATION - Settings for Amazon Web Services
    # ============================================================================
    # These are the credentials and settings needed to use AWS Bedrock (our AI service)
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")  # Your AWS account access key
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")  # Your AWS account secret key
    AWS_REGION = os.getenv("AWS_REGION", "eu-north-1")  # Which AWS region to use (default: Europe)
    CLAUDE_MODEL_ID = os.getenv("CLAUDE_MODEL_ID")  # Which Claude AI model to use
    
    # ============================================================================
    # DATABASE CONFIGURATION - Settings for storing data
    # ============================================================================
    # This is where we store user profiles, conversation history, etc.
    DATABASE_URL = os.getenv("DATABASE_URL")  # Connection string to our database
    
    # ============================================================================
    # API CONFIGURATION - Settings for our web API
    # ============================================================================
    # These control how our API works and appears
    API_V1_STR = os.getenv("API_V1_STR", "/api/v1")  # Base path for all API endpoints
    PROJECT_NAME = os.getenv("PROJECT_NAME", "Brandscaling AI Backend")  # Name of our project
    UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")  # Where to store uploaded files
    
    # ============================================================================
    # CORS CONFIGURATION - Security settings for web browsers
    # ============================================================================
    # CORS (Cross-Origin Resource Sharing) controls which websites can access our API
    # This is important for security - we only want trusted websites to use our API
    ALLOWED_ORIGINS = [
        "http://localhost:3000",  # Munawar's frontend (local development)
        "https://brandscaling-worlds-first-ai-powered-os-11-info5797.replit.app",  # Current live site
        "*"  # Allow all origins (only for development - remove in production!)
    ]

# ============================================================================
# CREATE SETTINGS INSTANCE - Make our settings available to the rest of the app
# ============================================================================
# This creates one instance of our Settings class that other parts of the app can use
settings = Settings()
