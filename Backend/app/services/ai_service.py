# ============================================================================
# AI SERVICE - The brain of our system that talks to Claude AI
# ============================================================================
# This file contains the logic for communicating with AWS Bedrock (Claude AI).
# It handles sending messages to the AI, getting responses, and deciding which
# coach (Hanif or Fariza) should handle each user question.

import boto3  # AWS SDK for Python - lets us talk to AWS services
import json  # For formatting data to send to AI
from typing import Optional, Dict  # For type hints (makes code clearer)
from app.core.config import settings  # Our configuration settings

class BedrockAIService:
    """
    Main AI service class - handles all communication with Claude AI
    This is like the translator between our app and the AI
    """
    
    def __init__(self):
        """
        Initialize the AI service - set up connection to AWS Bedrock
        This is like setting up the phone line to talk to Claude
        """
        # Create a client to talk to AWS Bedrock (the service that hosts Claude)
        self.bedrock = boto3.client(
            'bedrock-runtime',  # The AWS service that runs AI models
            region_name=settings.AWS_REGION,  # Which AWS region to use
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,  # Your AWS account ID
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY  # Your AWS password
        )
        
        # ============================================================================
        # AGENT SPECIALIZATION KEYWORDS - How we decide which coach to use
        # ============================================================================
        # These are the keywords that help us decide whether Hanif or Fariza
        # should handle a user's question. It's like having a smart receptionist
        # who knows which coach specializes in what topics.
        
        # Enhanced agent specializations with more specific keywords
        self.agent_specializations = {
            "architect": [  # Hanif's keywords - business strategy and systems
                "scale", "scaling", "systematic", "strategy", "framework", "process", 
                "optimization", "efficiency", "metrics", "analytics", "operations",
                "growth", "revenue", "profit", "business model", "systems", "structure",
                "planning", "performance", "data", "roi", "kpi", "funnel", "conversion"
            ],
            "alchemist": [  # Fariza's keywords - branding and personal development
                "brand", "branding", "personal brand", "authentic", "purpose", 
                "vision", "creativity", "transformation", "energy", "alignment",
                "intuition", "spiritual", "mindset", "beliefs", "values", "mission",
                "manifestation", "soul", "heart", "passion", "calling", "identity"
            ]
        }
    
    def check_agent_specialization(self, message: str, current_agent: str) -> Dict[str, str]:
        """
        Check if message should be handled by a different agent
        This is like a smart receptionist who reads your question and decides
        which coach would be best to help you with it.
        """
        # Convert message to lowercase so we can match keywords regardless of case
        message_lower = message.lower()
        
        # Count keyword matches with more precise matching
        # We count how many keywords from each coach's specialty appear in the message
        architect_matches = 0  # How many Hanif keywords we found
        alchemist_matches = 0  # How many Fariza keywords we found
        
        # Check for architect keywords (Hanif's specialties)
        for keyword in self.agent_specializations["architect"]:
            if keyword in message_lower:  # If this keyword appears in the message
                architect_matches += 1  # Count it as a match for Hanif
        
        # Check for alchemist keywords (Fariza's specialties)
        for keyword in self.agent_specializations["alchemist"]:
            if keyword in message_lower:  # If this keyword appears in the message
                alchemist_matches += 1  # Count it as a match for Fariza
        
        # Debug logging (remove in production) - helps us see what's happening
        print(f"DEBUG: Message: '{message}'")
        print(f"DEBUG: Architect matches: {architect_matches}, Alchemist matches: {alchemist_matches}")
        print(f"DEBUG: Current agent: {current_agent}")
        
        # ============================================================================
        # DECISION LOGIC - Decide if we should redirect to a different coach
        # ============================================================================
        # FIXED: Lower threshold and better logic
        # If user is talking to Hanif but their question is more about Fariza's specialties
        if current_agent == "architect" and alchemist_matches > 0 and alchemist_matches >= architect_matches:
            return {
                "should_redirect": True,  # Yes, redirect them
                "recommended_agent": "alchemist",  # Send them to Fariza
                "reason": "This question focuses on branding, purpose, and authentic expression - areas where the AI Alchemist (Fariza) specializes."
            }
        # If user is talking to Fariza but their question is more about Hanif's specialties
        elif current_agent == "alchemist" and architect_matches > 0 and architect_matches >= alchemist_matches:
            return {
                "should_redirect": True,  # Yes, redirect them
                "recommended_agent": "architect",  # Send them to Hanif
                "reason": "This question focuses on business strategy, scaling, and systematic approaches - areas where the AI Architect (Hanif) specializes."
            }
        
        # If no redirection needed, stay with current coach
        return {"should_redirect": False}
    
    async def chat_with_claude(self, message: str, personality: str, user_edna_profile: Optional[dict] = None, has_uploaded_pdf: bool = False) -> str:
        """
        Chat with Claude using Hanif or Fariza's personality with proper workflow
        This is the main function that sends messages to Claude AI and gets responses back.
        It also handles the personality switching and PDF upload requirements.
        """
        
        # ============================================================================
        # PDF UPLOAD CHECK - Make sure user has uploaded their E-DNA results first
        # ============================================================================
        # Before we can give personalized advice, we need to know the user's
        # entrepreneurial DNA profile. This is like a doctor needing your medical
        # history before giving you treatment.
        
        # Check if user needs to upload PDF first
        if not has_uploaded_pdf:
            if personality == "architect":
                # Hanif's message asking for E-DNA upload
                return """Hello! I'm Hanif Khan, The Architect from Brandscaling.

Before I can provide you with the most precise and strategic guidance, I need to understand your Entrepreneurial DNA profile.

Please upload your E-DNA quiz results PDF so I can:
1. Understand your specific entrepreneurial type
2. Tailor my systematic approach to your unique profile
3. Provide frameworks that align with your natural strengths

Once you upload your results, I'll be able to give you the exact strategic guidance you need to scale your business systematically.

Use the /upload endpoint to share your E-DNA results PDF."""
            
            else:  # alchemist
                return """Hello beautiful soul! I'm Fariza Javed, The Alchemist from Brandscaling.

Before we dive into transforming your business and aligning it with your authentic purpose, I need to understand your Entrepreneurial DNA.

Please upload your E-DNA quiz results PDF so I can:
1. See your unique entrepreneurial blueprint
2. Understand your natural energy patterns
3. Guide you toward authentic alignment and purposeful scaling

Your E-DNA results will help me provide the most transformative and personalized guidance for your journey.

Use the /upload endpoint to share your E-DNA results PDF, and let's begin this beautiful transformation together! ✨"""
        
        # FIXED: Check redirection BEFORE generating response
        redirect_check = self.check_agent_specialization(message, personality)
        if redirect_check["should_redirect"]:
            if personality == "architect":
                return f"""I appreciate your question about branding and authentic expression, but this is exactly the kind of transformational work that the AI Alchemist (Fariza) specializes in.

{redirect_check["reason"]}

Fariza has deep expertise in personal brand development, authentic alignment, and purpose-driven business building. She would provide you with much more insightful guidance on this topic.

Please switch to chat with the AI Alchemist using the /api/v1/chat/alchemist endpoint, and she'll help you create an authentic brand that truly resonates with your purpose."""
            
            else:  # alchemist
                return f"""Beautiful soul, while I sense the energy behind your question, this is more of a systematic, strategic challenge that the AI Architect (Hanif) is masterfully equipped to handle.

{redirect_check["reason"]}

Hanif excels at creating frameworks, optimizing processes, and building scalable systems. He would provide you with the precise, step-by-step approach you need for this particular challenge.

Please switch to chat with the AI Architect using the /api/v1/chat/architect endpoint, and he'll give you the systematic guidance you're looking for."""
        
        # Hanif "The Architect" personality
        architect_prompt = f"""You are Hanif Khan, "The Architect" from Brandscaling.

PERSONALITY TRAITS:
- Precise, calm, and strategic
- You cut through complexity with exact, no-fluff communication
- You always ask "What's the root problem here?"
- You focus on systematic solutions and frameworks
- You believe "Most problems are decisions avoided—not strategy missing"

COMMUNICATION STYLE:
- Direct and to-the-point
- Use systematic thinking
- Break down complex problems into clear steps
- Focus on root causes, not symptoms
- Provide actionable frameworks
- Start responses with "**The root problem here:**" when identifying issues

EXPERTISE:
- Business scaling strategies
- Performance optimization
- Systematic process design
- Strategic decision-making
- Operational efficiency
- Revenue optimization
- Systems and frameworks

USER'S E-DNA PROFILE: {user_edna_profile if user_edna_profile else "Architect type - systematic, strategic thinker"}

RESPONSE FORMAT:
- Start with identifying the core issue using "**The root problem here:**"
- Provide numbered, systematic steps
- Include specific, actionable advice
- End with a strategic insight or framework
- Keep responses focused and precise

Remember: You are Hanif Khan. Respond as him, with his precise, strategic approach."""

        # Fariza "The Alchemist" personality  
        alchemist_prompt = f"""You are Fariza Javed, "The Alchemist" from Brandscaling.

PERSONALITY TRAITS:
- Warm, magnetic, and empowering
- You sense what the market wants before it knows it wants it
- You help founders align internal evolution with external brand presence
- You believe "You can't scale what you haven't clarified"
- You focus on authentic transformation and energetic alignment

COMMUNICATION STYLE:
- Warm and nurturing tone
- Use transformational language
- Focus on authentic alignment
- Inspire depth and clarity
- Provide intuitive insights
- Often start with empathetic expressions like "*leans in*" or "Beautiful soul"

EXPERTISE:
- Personal brand development
- Authentic scaling methods
- Energy optimization
- Creative manifestation
- Purpose-profit alignment
- Transformational leadership
- Intuitive business guidance

USER'S E-DNA PROFILE: {user_edna_profile if user_edna_profile else "Alchemist type - intuitive, transformational leader"}

RESPONSE FORMAT:
- Start with empathetic understanding and warm connection
- Guide through transformational insights
- Focus on authentic alignment and purpose
- Provide creative, intuitive solutions
- End with empowering affirmation
- Use warm, inspiring language throughout

Remember: You are Fariza Javed. Respond as her, with her warm, transformational approach."""

        # Choose personality prompt
        if personality.lower() == "alchemist":
            system_prompt = alchemist_prompt
        else:
            system_prompt = architect_prompt
        
        try:
            # Prepare the request body
            request_body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 1000,
                "system": system_prompt,
                "messages": [
                    {
                        "role": "user",
                        "content": message
                    }
                ]
            })

            # Call Claude via Bedrock
            response = self.bedrock.invoke_model(
                modelId=settings.CLAUDE_MODEL_ID,
                body=request_body
            )

            result = json.loads(response['body'].read())
            return result['content'][0]['text']

        except Exception as e:
            return f"I apologize, but I'm experiencing technical difficulties. Please try again. Error: {str(e)}"

# Create global instance
ai_service = BedrockAIService()
