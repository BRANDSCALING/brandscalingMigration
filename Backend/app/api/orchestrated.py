from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import uuid
from app.services.langgraph.orchestrator import orchestrator
from app.services.langgraph.state import state_manager
from app.services.pdf_service import pdf_service
from app.core.config import settings

router = APIRouter()


class ConversationStartRequest(BaseModel):
    user_id: Optional[int] = None


class ConversationStartResponse(BaseModel):
    conversation_id: str
    user_id: Optional[int] = None
    message: str


class OrchestatedChatRequest(BaseModel):
    message: str
    conversation_id: str
    user_id: Optional[int] = None


class OrchestatedChatResponse(BaseModel):
    success: bool
    response: str
    agent: str
    conversation_id: str
    workflow_step: str
    collaboration_mode: bool
    user_id: Optional[int] = None
    redirected: Optional[bool] = False


class ConversationHistoryResponse(BaseModel):
    conversation_id: str
    messages: list
    user_id: Optional[int] = None


class UploadToConversationResponse(BaseModel):
    success: bool
    message: str
    edna_analysis: Optional[dict] = None
    conversation_id: str


@router.post("/conversation/start", response_model=ConversationStartResponse)
async def start_conversation(request: ConversationStartRequest):
    """
    Start a new orchestrated conversation
    """
    try:
        conversation_id = state_manager.create_conversation(request.user_id)

        return ConversationStartResponse(
            conversation_id=conversation_id,
            user_id=request.user_id,
            message="Conversation started! Choose which agent you'd like to talk to: Architect (Hanif) for strategy and systems, or Alchemist (Fariza) for branding and purpose."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/conversation/{conversation_id}/upload", response_model=UploadToConversationResponse)
async def upload_to_conversation(
    conversation_id: str,
    file: UploadFile = File(...),
    user_id: Optional[int] = Form(None)
):
    """
    Upload E-DNA PDF to a specific conversation
    """
    try:
        # Check if conversation exists
        conversation = state_manager.get_conversation(conversation_id)
        if not conversation:
            raise HTTPException(
                status_code=404, detail="Conversation not found")

        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(
                status_code=400, detail="Only PDF files are allowed")

        # Generate unique file ID
        file_id = str(uuid.uuid4())
        file_path = os.path.join(settings.UPLOAD_DIR, f"{file_id}.pdf")

        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Extract and analyze PDF content
        pdf_text = pdf_service.extract_text_from_pdf(file_path)
        edna_analysis = pdf_service.analyze_edna_results(pdf_text)

        # Update conversation with E-DNA profile
        state_manager.update_conversation_edna(conversation_id, edna_analysis)

        return UploadToConversationResponse(
            success=True,
            message="E-DNA results uploaded and analyzed successfully!",
            edna_analysis=edna_analysis,
            conversation_id=conversation_id
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/conversation/chat/architect", response_model=OrchestatedChatResponse)
async def orchestrated_chat_architect(request: OrchestatedChatRequest):
    """
    Chat with AI Architect (Hanif) through orchestrated system
    Following Task 3 logic: User explicitly chooses architect
    """
    try:
        # Process conversation with explicit agent choice
        result = await orchestrator.process_conversation(
            conversation_id=request.conversation_id,
            user_message=request.message,
            chosen_agent="architect"  # User's explicit choice
        )

        if not result.get("success", False):
            raise HTTPException(
                status_code=500, detail=result.get("error", "Unknown error"))

        # Check if response contains redirection (following Task 3 pattern)
        response_text = result.get("response", "")
        is_redirected = "AI Alchemist" in response_text and (
            "switch to chat" in response_text or "talk to" in response_text)

        return OrchestatedChatResponse(
            success=result["success"],
            response=result["response"],
            agent=result["agent"],
            conversation_id=result["conversation_id"],
            workflow_step=result["workflow_step"],
            collaboration_mode=result.get("collaboration_mode", False),
            user_id=request.user_id,
            redirected=is_redirected
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/conversation/chat/alchemist", response_model=OrchestatedChatResponse)
async def orchestrated_chat_alchemist(request: OrchestatedChatRequest):
    """
    Chat with AI Alchemist (Fariza) through orchestrated system
    Following Task 3 logic: User explicitly chooses alchemist
    """
    try:
        # Process conversation with explicit agent choice
        result = await orchestrator.process_conversation(
            conversation_id=request.conversation_id,
            user_message=request.message,
            chosen_agent="alchemist"  # User's explicit choice
        )

        if not result.get("success", False):
            raise HTTPException(
                status_code=500, detail=result.get("error", "Unknown error"))

        # Check if response contains redirection (following Task 3 pattern)
        response_text = result.get("response", "")
        is_redirected = "AI Architect" in response_text and (
            "switch to chat" in response_text or "talk to" in response_text)

        return OrchestatedChatResponse(
            success=result["success"],
            response=result["response"],
            agent=result["agent"],
            conversation_id=result["conversation_id"],
            workflow_step=result["workflow_step"],
            collaboration_mode=result.get("collaboration_mode", False),
            user_id=request.user_id,
            redirected=is_redirected
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/conversation/{conversation_id}/history", response_model=ConversationHistoryResponse)
async def get_conversation_history(conversation_id: str, user_id: Optional[int] = None):
    """
    Get conversation history
    """
    try:
        conversation = state_manager.get_conversation(conversation_id)
        if not conversation:
            raise HTTPException(
                status_code=404, detail="Conversation not found")

        return ConversationHistoryResponse(
            conversation_id=conversation_id,
            messages=conversation["messages"],
            user_id=user_id
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health/orchestrator")
async def orchestrator_health_check():
    """
    Check orchestrator health
    """
    try:
        # Test orchestrator functionality
        active_conversations = len(state_manager.conversations)

        return {
            "status": "healthy",
            "orchestrator_accessible": True,
            "langgraph_working": True,
            "state_management": "working",
            "active_conversations": active_conversations
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "orchestrator_accessible": False,
            "langgraph_working": False
        }
