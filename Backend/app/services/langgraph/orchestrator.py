from typing import Dict, List, Optional, Any, Annotated
from langgraph.graph import StateGraph, END
import asyncio
import json

from .state import ConversationState, AgentResponse, WorkflowDecision, state_manager
from ..ai_service import ai_service


class BrandscalingOrchestrator:
    """Main orchestrator for Brandscaling AI agents using LangGraph - Following Task 3 Logic"""

    def __init__(self):
        self.graph = self._build_workflow_graph()

    def _build_workflow_graph(self) -> StateGraph:
        """Build the LangGraph workflow"""

        # Create the state graph
        workflow = StateGraph(ConversationState)

        # Add nodes (workflow steps)
        workflow.add_node("check_pdf_upload", self._check_pdf_upload)
        workflow.add_node("route_to_chosen_agent", self._route_to_chosen_agent)
        workflow.add_node("architect_response", self._architect_response)
        workflow.add_node("alchemist_response", self._alchemist_response)
        workflow.add_node("finalize_response", self._finalize_response)

        # Set entry point
        workflow.set_entry_point("check_pdf_upload")

        # Add conditional edges
        workflow.add_conditional_edges(
            "check_pdf_upload",
            self._pdf_upload_condition,
            {
                "needs_pdf": END,
                "has_pdf": "route_to_chosen_agent"
            }
        )

        workflow.add_conditional_edges(
            "route_to_chosen_agent",
            self._agent_routing_condition,
            {
                "architect": "architect_response",
                "alchemist": "alchemist_response"
            }
        )

        # Add edges to finalization
        workflow.add_edge("architect_response", "finalize_response")
        workflow.add_edge("alchemist_response", "finalize_response")
        workflow.add_edge("finalize_response", END)

        return workflow.compile()

    async def _check_pdf_upload(self, state: ConversationState) -> ConversationState:
        """Check if PDF upload is required"""
        if not state["needs_pdf_upload"]:
            state["workflow_step"] = "route_to_chosen_agent"
        else:
            # Get PDF request from the chosen agent (following Task 3 logic)
            chosen_agent = state.get("chosen_agent", "architect")

            pdf_request = await ai_service.chat_with_claude(
                message="A user wants to start a conversation but hasn't uploaded their E-DNA quiz results yet. Ask them to upload their PDF so you can provide personalized guidance.",
                personality=chosen_agent,
                user_edna_profile=None,
                has_uploaded_pdf=False
            )

            # Add chosen agent's PDF request message
            upload_message = {
                "role": "assistant",
                "content": pdf_request,
                "agent": chosen_agent
            }
            state["messages"].append(upload_message)
            state["workflow_step"] = "pdf_upload"

        return state

    async def _route_to_chosen_agent(self, state: ConversationState) -> ConversationState:
        """Route to the agent chosen by user (following Task 3 logic)"""
        chosen_agent = state.get("chosen_agent", "architect")
        print(f"🎯 Routing to user's chosen agent: {chosen_agent}")

        state["current_agent"] = chosen_agent
        state["workflow_step"] = f"{chosen_agent}_response"
        return state

    async def _architect_response(self, state: ConversationState) -> ConversationState:
        """Get response from Architect (Hanif) - Following Task 3 logic"""
        print(
            f"🏗️ Getting Architect response for conversation {state['conversation_id']}")

        # Get latest user message
        latest_message = self._get_latest_user_message(state)
        if not latest_message:
            return state

        try:
            # Call existing AI service - it will handle redirection using Task 3 logic
            response = await ai_service.chat_with_claude(
                message=latest_message,
                personality="architect",
                user_edna_profile=state["edna_profile"],
                has_uploaded_pdf=not state["needs_pdf_upload"]
            )

            # Add response to conversation
            state_manager.add_message(
                state["conversation_id"],
                "assistant",
                response,
                "architect"
            )

            state["architect_input"] = response

        except Exception as e:
            print(f"❌ Error getting architect response: {e}")
            error_response = "I apologize, but I'm experiencing technical difficulties. Please try again."
            state_manager.add_message(
                state["conversation_id"],
                "assistant",
                error_response,
                "architect"
            )
            state["architect_input"] = error_response

        state["workflow_step"] = "finalize"
        return state

    async def _alchemist_response(self, state: ConversationState) -> ConversationState:
        """Get response from Alchemist (Fariza) - Following Task 3 logic"""
        print(
            f"✨ Getting Alchemist response for conversation {state['conversation_id']}")

        # Get latest user message
        latest_message = self._get_latest_user_message(state)
        if not latest_message:
            return state

        try:
            # Call existing AI service - it will handle redirection using Task 3 logic
            response = await ai_service.chat_with_claude(
                message=latest_message,
                personality="alchemist",
                user_edna_profile=state["edna_profile"],
                has_uploaded_pdf=not state["needs_pdf_upload"]
            )

            # Add response to conversation
            state_manager.add_message(
                state["conversation_id"],
                "assistant",
                response,
                "alchemist"
            )

            state["alchemist_input"] = response

        except Exception as e:
            print(f"❌ Error getting alchemist response: {e}")
            error_response = "I apologize, but I'm experiencing technical difficulties. Please try again."
            state_manager.add_message(
                state["conversation_id"],
                "assistant",
                error_response,
                "alchemist"
            )
            state["alchemist_input"] = error_response

        state["workflow_step"] = "finalize"
        return state

    async def _finalize_response(self, state: ConversationState) -> ConversationState:
        """Finalize the response and update state"""
        print(
            f"✅ Finalizing response for conversation {state['conversation_id']}")

        # Update conversation summary if needed
        if len(state["messages"]) > 5:
            state["conversation_summary"] = state_manager.get_conversation_summary(
                state["conversation_id"])

        state["workflow_step"] = "completed"
        state["updated_at"] = state_manager.conversations[state["conversation_id"]]["updated_at"]

        return state

    def _get_latest_user_message(self, state: ConversationState) -> Optional[str]:
        """Get the latest user message from conversation"""
        for msg in reversed(state["messages"]):
            if msg["role"] == "user":
                return msg["content"]
        return None

    # Condition functions for workflow routing
    def _pdf_upload_condition(self, state: ConversationState) -> str:
        """Determine if PDF upload is needed"""
        if state["needs_pdf_upload"] or not state["edna_profile"]:
            return "needs_pdf"
        return "has_pdf"

    def _agent_routing_condition(self, state: ConversationState) -> str:
        """Route to the agent chosen by user (following Task 3 logic)"""
        return state.get("chosen_agent", "architect")

    async def process_conversation(self, conversation_id: str, user_message: str, chosen_agent: str) -> Dict[str, Any]:
        """
        Main entry point for processing conversations - Following Task 3 Logic

        Args:
            conversation_id: The conversation ID
            user_message: The user's message
            chosen_agent: The agent explicitly chosen by user ("architect" or "alchemist")
        """
        print(
            f"🚀 Processing conversation {conversation_id} with chosen agent: {chosen_agent}")

        # Get or create conversation state
        state = state_manager.get_conversation(conversation_id)
        if not state:
            print(f"❌ Conversation {conversation_id} not found")
            return {"error": "Conversation not found"}

        # Set the user's chosen agent (following Task 3 logic)
        state["chosen_agent"] = chosen_agent
        state["current_agent"] = chosen_agent

        # Add user message to conversation
        state_manager.add_message(conversation_id, "user", user_message)

        # Refresh state after adding message
        state = state_manager.get_conversation(conversation_id)
        state["chosen_agent"] = chosen_agent  # Ensure it's set

        try:
            # Run the workflow
            result = await self.graph.ainvoke(state)

            # Get the latest assistant message
            latest_response = None
            for msg in reversed(result["messages"]):
                if msg["role"] == "assistant":
                    latest_response = msg
                    break

            return {
                "success": True,
                "response": latest_response["content"] if latest_response else "No response generated",
                "agent": latest_response.get("agent", chosen_agent) if latest_response else chosen_agent,
                "workflow_step": result["workflow_step"],
                "collaboration_mode": False,  # Following Task 3 - no forced collaboration
                "conversation_id": conversation_id
            }

        except Exception as e:
            print(f"❌ Error processing conversation: {e}")
            return {
                "success": False,
                "error": str(e),
                "conversation_id": conversation_id
            }


# Global orchestrator instance
orchestrator = BrandscalingOrchestrator()
