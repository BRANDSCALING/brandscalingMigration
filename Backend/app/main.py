# ============================================================================
# MAIN APPLICATION FILE - This is where everything starts!
# ============================================================================
# This file is the entry point of our AI business coaching system.
# It sets up the web server, connects all the different parts together,
# and defines the main endpoints that users can access.

# Import the tools we need to build our AI business coaching website
from fastapi import FastAPI  # The main web framework we use
from fastapi.middleware.cors import CORSMiddleware  # Allows frontend to talk to backend
from app.core.config import settings  # Our configuration settings (API keys, etc.)
from app.api.bedrock import router as bedrock_router  # Simple chat endpoints
from app.api.orchestrated import router as orchestrated_router  # Advanced chat with smart routing

# ============================================================================
# CREATE OUR WEBSITE/API - This is like building the main building
# ============================================================================
# Here we create the main FastAPI application that will serve our AI coaching service.
# This is like the foundation of our building - everything else connects to this.

# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,  # Name that appears in API documentation
    description="AI Backend for Brandscaling - Powers AI Architect (Hanif) and AI Alchemist (Fariza) with LangGraph orchestration",  # Description for API docs
    version="2.0.0"  # Current version of our API
)

# ============================================================================
# SET UP SECURITY - Allow frontend websites to talk to our backend
# ============================================================================
# CORS (Cross-Origin Resource Sharing) is a security feature that controls
# which websites can access our API. Without this, frontend websites
# (like React apps) wouldn't be able to communicate with our backend.

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # List of allowed frontend URLs
    allow_credentials=True,  # Allow cookies and authentication headers
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Allow all request headers
)

# ============================================================================
# CONNECT ALL THE PIECES - Link our different services together
# ============================================================================
# Here we connect all the different parts of our system.
# Each router contains a group of related endpoints (like pages on a website).
# The prefix adds a common path to all endpoints in that router.

# Include API routes
app.include_router(bedrock_router, prefix=settings.API_V1_STR,  # /api/v1/...
                   tags=["Basic AI Agents"])  # Groups endpoints in API documentation
app.include_router(orchestrated_router,
                   prefix=f"{settings.API_V1_STR}/orchestrated",  # /api/v1/orchestrated/...
                   tags=["Orchestrated AI Agents"])  # Groups endpoints in API documentation


# ============================================================================
# WELCOME PAGE - When someone visits our website, show them this info
# ============================================================================
# This endpoint is like the front door of our building.
# When someone visits the root URL (like https://oursite.com/),
# they get information about our service and all available endpoints.

@app.get("/")  # This means: when someone visits the root URL "/"
async def root():
    """
    Root endpoint - This is like the front door of our building
    Returns information about our AI coaching service and available endpoints
    """
    return {
        "message": "Brandscaling AI Backend with LangGraph Orchestration",  # Main title
        "description": "Powers AI Architect (Hanif) and AI Alchemist (Fariza) with advanced conversation management",  # What we do
        "version": "2.0.0",  # Current version
        "features": [  # List of what our system can do
            "Basic AI agent chat",  # Simple chat with either coach
            "LangGraph orchestration",  # Advanced conversation management
            "Agent collaboration",  # Coaches can work together
            "Conversation memory",  # Remembers what you talked about
            "Smart workflow routing"  # Automatically picks the right coach
        ],
        "endpoints": {  # All the different ways to interact with our system
            # Basic endpoints (backward compatible) - Simple way to talk to our coaches
            "upload_edna": f"{settings.API_V1_STR}/upload",  # Upload your E-DNA quiz results
            "chat_architect": f"{settings.API_V1_STR}/chat/architect",  # Talk to Hanif (strategy coach)
            "chat_alchemist": f"{settings.API_V1_STR}/chat/alchemist",  # Talk to Fariza (branding coach)
            "health": f"{settings.API_V1_STR}/health",  # Check if system is working

            # New orchestrated endpoints - Advanced way with smart routing
            "start_conversation": f"{settings.API_V1_STR}/orchestrated/conversation/start",  # Start advanced conversation
            "upload_to_conversation": f"{settings.API_V1_STR}/orchestrated/conversation/{{conversation_id}}/upload",  # Upload files to specific conversation
            "orchestrated_chat": f"{settings.API_V1_STR}/orchestrated/conversation/chat",  # Smart chat that picks the right coach
            "conversation_history": f"{settings.API_V1_STR}/orchestrated/conversation/{{conversation_id}}/history",  # Get chat history
            "orchestrator_health": f"{settings.API_V1_STR}/orchestrated/health/orchestrator"  # Check advanced system health
        }
    }


# ============================================================================
# HEALTH CHECK - Make sure our system is working properly
# ============================================================================
# This endpoint lets us check if our system is running correctly.
# It's like a heartbeat monitor - if this fails, we know something is wrong.
# Other systems (like monitoring tools) can call this to check our status.

@app.get("/health")  # When someone visits /health
async def health():
    """
    Health check endpoint - Like checking if all systems are working
    Returns a simple status message to confirm the system is running
    """
    return {"status": "healthy", "service": "Brandscaling AI Backend with LangGraph"}

# ============================================================================
# START THE SERVER - This runs our website when we start the program
# ============================================================================
# This is the entry point when we run this file directly (python main.py).
# It starts the web server that will serve our API to the internet.

if __name__ == "__main__":  # Only run this if we're running this file directly
    import uvicorn  # The web server that runs our FastAPI app
    uvicorn.run(app, host="0.0.0.0", port=8000)  # Start server on all network interfaces, port 8000
