# ============================================================================
# BASIC API ENDPOINTS - Simple way to talk to our AI coaches
# ============================================================================
# This file contains the simple API endpoints for direct interaction with
# our AI coaches (Hanif and Fariza). These are the basic chat endpoints
# without the advanced orchestration features.

from fastapi import APIRouter, HTTPException, UploadFile, File, Form  # FastAPI tools for building endpoints
from pydantic import BaseModel  # For data validation and serialization
from typing import Optional  # For optional parameters
import os  # For file operations
import uuid  # For generating unique IDs
from app.services.ai_service import ai_service  # Our AI service that talks to Claude
from app.services.pdf_service import pdf_service  # Service for handling PDF files
from app.core.config import settings  # Our configuration settings

# Create a router - this groups related endpoints together
router = APIRouter()


# ============================================================================
# DATA MODELS - Define the structure of our requests and responses
# ============================================================================
# These classes define what data we expect to receive and what we send back.
# Pydantic automatically validates the data and converts it to/from JSON.

class ChatRequest(BaseModel):
    """What we expect to receive when someone wants to chat with our AI coaches"""
    message: str  # The user's question or message
    user_id: Optional[int] = None  # Optional user ID for tracking
    has_uploaded_pdf: Optional[bool] = False  # Whether they've uploaded their E-DNA results


class ChatResponse(BaseModel):
    """What we send back after processing a chat request"""
    response: str  # The AI coach's response
    personality_used: str  # Which coach responded (Hanif or Fariza)
    user_id: Optional[int] = None  # User ID for tracking
    needs_pdf_upload: Optional[bool] = False  # Whether they still need to upload PDF
    redirected: Optional[bool] = False  # Whether we suggested switching coaches


class UploadResponse(BaseModel):
    """What we send back after someone uploads their E-DNA PDF"""
    success: bool  # Whether the upload was successful
    message: str  # Success or error message
    edna_analysis: Optional[dict] = None  # The analyzed E-DNA profile
    file_id: str  # Unique ID for the uploaded file


# ============================================================================
# USER SESSION STORAGE - Keep track of user data during their session
# ============================================================================
# Store user sessions (in production, use database)
# This is like a temporary memory that remembers what each user has done
# In a real production system, this would be stored in a database
user_sessions = {}


# ============================================================================
# PDF UPLOAD ENDPOINT - Handle E-DNA quiz results upload
# ============================================================================
# This endpoint allows users to upload their E-DNA quiz results PDF.
# The system then analyzes the PDF to understand the user's entrepreneurial profile.

@router.post("/upload", response_model=UploadResponse)  # POST request to /upload
async def upload_edna_pdf(
    file: UploadFile = File(...),  # The PDF file being uploaded
    user_id: Optional[int] = Form(None)  # Optional user ID
):
    """
    Upload E-DNA quiz results PDF
    This endpoint receives a PDF file, saves it, analyzes it, and stores the results
    """
    try:
        # ============================================================================
        # FILE VALIDATION - Make sure it's actually a PDF file
        # ============================================================================
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(
                status_code=400, detail="Only PDF files are allowed")

        # ============================================================================
        # FILE SAVING - Save the uploaded file to our server
        # ============================================================================
        # Generate unique file ID - this prevents file name conflicts
        file_id = str(uuid.uuid4())  # Creates a unique identifier like "abc123-def456"
        file_path = os.path.join(settings.UPLOAD_DIR, f"{file_id}.pdf")  # Full path to save file

        # Save file to disk
        with open(file_path, "wb") as buffer:  # Open file in write-binary mode
            content = await file.read()  # Read the uploaded file content
            buffer.write(content)  # Write it to disk

        # ============================================================================
        # PDF ANALYSIS - Extract and analyze the E-DNA results
        # ============================================================================
        # Extract and analyze PDF content
        pdf_text = pdf_service.extract_text_from_pdf(file_path)  # Get text from PDF
        edna_analysis = pdf_service.analyze_edna_results(pdf_text)  # Analyze the E-DNA results

        # ============================================================================
        # SESSION STORAGE - Remember this user's profile for future conversations
        # ============================================================================
        # Store in session (in production, save to database)
        user_sessions[user_id or "anonymous"] = {  # Use user_id or "anonymous" if no ID
            "file_id": file_id,  # Remember which file this is
            "edna_profile": edna_analysis,  # Store the analyzed profile
            "has_uploaded_pdf": True  # Mark that they've uploaded their results
        }

        return UploadResponse(
            success=True,
            message="E-DNA results uploaded and analyzed successfully!",
            edna_analysis=edna_analysis,
            file_id=file_id
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat/architect", response_model=ChatResponse)
async def chat_with_architect(request: ChatRequest):
    """
    Chat specifically with AI Architect (Hanif)
    """
    try:
        # Check if user has uploaded PDF
        user_session = user_sessions.get(request.user_id or "anonymous", {})
        has_uploaded_pdf = user_session.get("has_uploaded_pdf", False)
        edna_profile = user_session.get("edna_profile")

        response = await ai_service.chat_with_claude(
            message=request.message,
            personality="architect",
            user_edna_profile=edna_profile,
            has_uploaded_pdf=has_uploaded_pdf
        )

        # Check if response contains redirection
        is_redirected = "AI Alchemist" in response and "switch to chat" in response

        return ChatResponse(
            response=response,
            personality_used="architect",
            user_id=request.user_id,
            needs_pdf_upload=not has_uploaded_pdf,
            redirected=is_redirected
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat/alchemist", response_model=ChatResponse)
async def chat_with_alchemist(request: ChatRequest):
    """
    Chat specifically with AI Alchemist (Fariza)
    """
    try:
        # Check if user has uploaded PDF
        user_session = user_sessions.get(request.user_id or "anonymous", {})
        has_uploaded_pdf = user_session.get("has_uploaded_pdf", False)
        edna_profile = user_session.get("edna_profile")

        response = await ai_service.chat_with_claude(
            message=request.message,
            personality="alchemist",
            user_edna_profile=edna_profile,
            has_uploaded_pdf=has_uploaded_pdf
        )

        # Check if response contains redirection
        is_redirected = "AI Architect" in response and "switch to chat" in response

        return ChatResponse(
            response=response,
            personality_used="alchemist",
            user_id=request.user_id,
            needs_pdf_upload=not has_uploaded_pdf,
            redirected=is_redirected
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """
    Check if AI service is working
    """
    try:
        test_response = await ai_service.chat_with_claude("Hello", "architect", has_uploaded_pdf=True)
        return {
            "status": "healthy",
            "bedrock_accessible": True,
            "claude_model": "working",
            "test_response_length": len(test_response)
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "bedrock_accessible": False
        }
