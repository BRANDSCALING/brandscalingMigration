from typing import Dict, List, Optional, Any
from .state import ConversationState, AgentResponse, WorkflowDecision, state_manager
import re


class WorkflowEngine:
    """Manages workflow decisions and agent coordination"""

    def __init__(self):
        # Keywords for determining agent specialization
        self.architect_keywords = [
            "scale", "scaling", "systematic", "strategy", "framework", "process",
            "optimization", "efficiency", "metrics", "analytics", "operations",
            "growth", "revenue", "profit", "business model", "systems", "structure",
            "planning", "performance", "data", "roi", "kpi", "funnel", "conversion"
        ]

        self.alchemist_keywords = [
            "brand", "branding", "personal brand", "authentic", "purpose",
            "vision", "creativity", "transformation", "energy", "alignment",
            "intuition", "spiritual", "mindset", "beliefs", "values", "mission",
            "manifestation", "soul", "heart", "passion", "calling", "identity"
        ]

        # Collaboration triggers
        self.collaboration_keywords = [
            "complete strategy", "full business plan", "end-to-end", "holistic approach",
            "both perspective", "comprehensive", "everything", "all aspects"
        ]

    def analyze_user_message(self, message: str, current_agent: Optional[str] = None) -> WorkflowDecision:
        """Analyze user message to determine workflow decision"""
        message_lower = message.lower()

        # Check for collaboration needs
        collaboration_score = sum(
            1 for keyword in self.collaboration_keywords if keyword in message_lower)

        if collaboration_score > 0:
            return WorkflowDecision(
                next_step="collaboration",
                agent_to_use="both",
                reason="User request requires both strategic and transformational perspectives",
                requires_collaboration=True
            )

        # Count keyword matches
        architect_matches = sum(
            1 for keyword in self.architect_keywords if keyword in message_lower)
        alchemist_matches = sum(
            1 for keyword in self.alchemist_keywords if keyword in message_lower)

        # Determine best agent
        if architect_matches > alchemist_matches:
            recommended_agent = "architect"
            reason = f"Message contains {architect_matches} strategic/systematic keywords"
        elif alchemist_matches > architect_matches:
            recommended_agent = "alchemist"
            reason = f"Message contains {alchemist_matches} branding/transformation keywords"
        else:
            # Default based on current agent or user preference
            recommended_agent = current_agent or "architect"
            reason = "No clear specialization detected, using current/default agent"

        # Check if redirect needed
        if current_agent and current_agent != recommended_agent and (architect_matches > 0 or alchemist_matches > 0):
            return WorkflowDecision(
                next_step="agent_switch",
                agent_to_use=recommended_agent,
                reason=f"Current agent ({current_agent}) should redirect to {recommended_agent}: {reason}"
            )

        return WorkflowDecision(
            next_step="conversation",
            agent_to_use=recommended_agent,
            reason=reason
        )

    def should_collaborate(self, conversation_id: str) -> bool:
        """Determine if agents should collaborate based on conversation history"""
        state = state_manager.get_conversation(conversation_id)
        if not state:
            return False

        messages = state["messages"]
        if len(messages) < 4:  # Need some conversation history
            return False

        # Check if user has asked both types of questions
        architect_questions = 0
        alchemist_questions = 0

        for msg in messages:
            if msg["role"] == "user":
                content = msg["content"].lower()
                if any(keyword in content for keyword in self.architect_keywords):
                    architect_questions += 1
                if any(keyword in content for keyword in self.alchemist_keywords):
                    alchemist_questions += 1

        # Collaborate if user has asked both types of questions
        return architect_questions > 0 and alchemist_questions > 0

    def get_collaboration_prompt(self, user_message: str, conversation_summary: str) -> Dict[str, str]:
        """Generate prompts for agent collaboration"""

        architect_prompt = f"""You are Hanif Khan, The Architect, collaborating with Fariza (The Alchemist) to provide comprehensive guidance.

COLLABORATION CONTEXT:
- User Message: {user_message}
- Conversation Summary: {conversation_summary}
- Your Role: Provide the strategic, systematic perspective

COLLABORATION INSTRUCTIONS:
1. Focus on your expertise: strategy, systems, frameworks, optimization
2. Acknowledge that Fariza will handle the transformational/branding aspects
3. Build on each other's insights
4. Provide your systematic perspective first, then indicate where Fariza's expertise complements yours

Respond with your strategic analysis and framework, then mention how this connects to the transformational work Fariza specializes in."""

        alchemist_prompt = f"""You are Fariza Javed, The Alchemist, collaborating with Hanif (The Architect) to provide comprehensive guidance.

COLLABORATION CONTEXT:
- User Message: {user_message}
- Conversation Summary: {conversation_summary}
- Hanif's Strategic Input: [Will be provided]
- Your Role: Provide the transformational, authentic alignment perspective

COLLABORATION INSTRUCTIONS:
1. Focus on your expertise: purpose, branding, transformation, authentic alignment
2. Build upon Hanif's strategic framework
3. Show how authentic alignment enhances systematic approaches
4. Provide the transformational perspective that complements his systematic approach

Respond with your transformational insights, showing how they integrate with the strategic framework for holistic business growth."""

        return {
            "architect": architect_prompt,
            "alchemist": alchemist_prompt
        }


# Global workflow engine instance
workflow_engine = WorkflowEngine()
