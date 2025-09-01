from typing import Dict, List, Optional, Any, TypedDict
from datetime import datetime
import uuid


class ConversationState(TypedDict):
    """State structure for LangGraph conversations - Following Task 3 Logic"""
    conversation_id: str
    user_id: Optional[int]
    messages: List[Dict[str, Any]]
    edna_profile: Optional[Dict[str, Any]]
    needs_pdf_upload: bool
    chosen_agent: str  # User's explicit choice: "architect" or "alchemist"
    current_agent: str  # Currently active agent
    workflow_step: str
    collaboration_mode: bool  # Always False in Task 3 logic
    conversation_summary: Optional[str]
    created_at: datetime
    updated_at: datetime


class AgentResponse(TypedDict):
    """Response from an individual agent"""
    content: str
    agent: str
    timestamp: datetime
    redirected: bool


class WorkflowDecision(TypedDict):
    """Decision made by workflow engine"""
    agent_to_use: str
    requires_collaboration: bool
    next_step: str
    confidence: float


class ConversationStateManager:
    """Manages conversation state - Following Task 3 Logic"""

    def __init__(self):
        self.conversations: Dict[str, ConversationState] = {}

    def create_conversation(self, user_id: Optional[int] = None) -> str:
        """Create a new conversation"""
        conversation_id = str(uuid.uuid4())

        self.conversations[conversation_id] = ConversationState(
            conversation_id=conversation_id,
            user_id=user_id,
            messages=[],
            edna_profile=None,
            needs_pdf_upload=True,
            chosen_agent="architect",  # Default, but will be overridden by user choice
            current_agent="architect",
            workflow_step="initial",
            collaboration_mode=False,  # Following Task 3 - no forced collaboration
            conversation_summary=None,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

        return conversation_id

    def get_conversation(self, conversation_id: str) -> Optional[ConversationState]:
        """Get conversation by ID"""
        return self.conversations.get(conversation_id)

    def update_conversation_edna(self, conversation_id: str, edna_profile: Dict[str, Any]) -> bool:
        """Update conversation with E-DNA profile"""
        if conversation_id in self.conversations:
            self.conversations[conversation_id]["edna_profile"] = edna_profile
            self.conversations[conversation_id]["needs_pdf_upload"] = False
            self.conversations[conversation_id]["updated_at"] = datetime.now()
            return True
        return False

    def add_message(self, conversation_id: str, role: str, content: str, agent: Optional[str] = None) -> bool:
        """Add message to conversation"""
        if conversation_id in self.conversations:
            message = {
                "role": role,
                "content": content,
                "timestamp": datetime.now().isoformat(),
                "agent": agent
            }

            self.conversations[conversation_id]["messages"].append(message)
            self.conversations[conversation_id]["updated_at"] = datetime.now()
            return True
        return False

    def set_chosen_agent(self, conversation_id: str, chosen_agent: str) -> bool:
        """Set the user's chosen agent - Following Task 3 Logic"""
        if conversation_id in self.conversations and chosen_agent in ["architect", "alchemist"]:
            self.conversations[conversation_id]["chosen_agent"] = chosen_agent
            self.conversations[conversation_id]["current_agent"] = chosen_agent
            self.conversations[conversation_id]["updated_at"] = datetime.now()
            return True
        return False

    def get_conversation_summary(self, conversation_id: str) -> Optional[str]:
        """Get conversation summary"""
        conversation = self.get_conversation(conversation_id)
        if not conversation:
            return None

        # Simple summary generation
        messages = conversation["messages"]
        if len(messages) < 3:
            return None

        user_messages = [msg["content"]
                         for msg in messages if msg["role"] == "user"]
        if user_messages:
            return f"User has asked about: {', '.join(user_messages[:3])}"

        return None

    def delete_conversation(self, conversation_id: str) -> bool:
        """Delete conversation"""
        if conversation_id in self.conversations:
            del self.conversations[conversation_id]
            return True
        return False

    def get_user_conversations(self, user_id: int) -> List[ConversationState]:
        """Get all conversations for a user"""
        return [
            conv for conv in self.conversations.values()
            if conv["user_id"] == user_id
        ]

    def cleanup_old_conversations(self, hours: int = 24) -> int:
        """Clean up conversations older than specified hours"""
        cutoff_time = datetime.now().timestamp() - (hours * 3600)
        to_delete = []

        for conv_id, conv in self.conversations.items():
            if conv["updated_at"].timestamp() < cutoff_time:
                to_delete.append(conv_id)

        for conv_id in to_delete:
            del self.conversations[conv_id]

        return len(to_delete)


# Global state manager instance
state_manager = ConversationStateManager()
