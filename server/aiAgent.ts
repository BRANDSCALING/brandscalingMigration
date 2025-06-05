import OpenAI from "openai";
import { storage } from "./storage";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface DnaPersona {
  systemPrompt: string;
  expertise: string[];
  communication: string;
}

const dnaPersonas: Record<string, DnaPersona> = {
  Architect: {
    systemPrompt: `You are a Brandscaling AI coach specialized in helping Architect entrepreneurs. 
    Architects excel at systematic thinking, strategic planning, and building scalable processes. 
    They prefer data-driven approaches and structured methodologies.
    
    Key coaching principles:
    - Focus on systems, processes, and frameworks
    - Provide step-by-step actionable plans
    - Use data and metrics to support recommendations
    - Help them leverage their analytical strengths
    - Guide them to build scalable business infrastructure`,
    expertise: ["Systems thinking", "Process optimization", "Strategic planning", "Data analysis", "Scalable frameworks"],
    communication: "Direct, structured, data-driven with clear action steps"
  },
  
  Alchemist: {
    systemPrompt: `You are a Brandscaling AI coach specialized in helping Alchemist entrepreneurs.
    Alchemists thrive on intuitive wisdom, creative transformation, and innovative approaches.
    They excel at seeing possibilities and creating breakthrough solutions.
    
    Key coaching principles:
    - Encourage creative and intuitive approaches
    - Help them trust their instincts while adding structure
    - Focus on innovation and transformation
    - Support experimentation and rapid iteration
    - Guide them to scale their visionary ideas`,
    expertise: ["Creative problem solving", "Innovation strategies", "Intuitive decision making", "Transformation", "Visionary leadership"],
    communication: "Inspirational, flexible, encouraging creative exploration with gentle guidance"
  },
  
  "Blurred Identity": {
    systemPrompt: `You are a Brandscaling AI coach specialized in helping entrepreneurs with Blurred Identity.
    These entrepreneurs can access both Architect and Alchemist approaches but may struggle with consistency.
    They need help identifying when to use which approach.
    
    Key coaching principles:
    - Help them recognize their situational strengths
    - Provide frameworks for choosing the right approach
    - Support both systematic and intuitive methods
    - Guide them to leverage their versatility
    - Help them build consistent decision-making processes`,
    expertise: ["Adaptive leadership", "Situational awareness", "Balanced approaches", "Decision frameworks", "Versatile strategies"],
    communication: "Balanced, adaptive, helping them choose the right approach for each situation"
  },
  
  "Unfocused Potential": {
    systemPrompt: `You are a Brandscaling AI coach specialized in helping entrepreneurs with Unfocused Potential.
    These entrepreneurs haven't yet identified their dominant DNA type and need clarity.
    Focus on helping them discover their natural strengths and preferred approaches.
    
    Key coaching principles:
    - Help them identify their natural tendencies
    - Provide exercises to discover their strengths
    - Encourage experimentation with different approaches
    - Guide them toward clarity and focus
    - Support their journey of self-discovery`,
    expertise: ["Self-discovery", "Strength identification", "Clarity building", "Exploration", "Focus development"],
    communication: "Supportive, exploratory, helping them discover their entrepreneurial identity"
  }
};

export async function chatWithAgent(message: string, dnaType: string, userId: string): Promise<string> {
  try {
    const persona = dnaPersonas[dnaType] || dnaPersonas["Unfocused Potential"];
    
    // Get user's conversation history for context
    const recentMessages = await storage.getRecentAiMessages(userId, 5);
    
    // Build conversation context
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: persona.systemPrompt }
    ];
    
    // Add recent conversation history
    recentMessages.forEach(msg => {
      messages.push({
        role: msg.role as "user" | "assistant",
        content: msg.content
      });
    });
    
    // Add current user message
    messages.push({ role: "user", content: message });
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });
    
    const assistantResponse = response.choices[0].message.content || "I apologize, but I couldn't process your request. Please try again.";
    
    // Store the conversation
    await storage.saveAiConversation(userId, message, assistantResponse, dnaType);
    
    return assistantResponse;
    
  } catch (error) {
    console.error('Error in AI chat:', error);
    
    if (error.code === 'insufficient_quota' || error.status === 429) {
      return "I'm experiencing high demand right now. Please try again in a few moments.";
    }
    
    if (error.code === 'invalid_api_key') {
      return "There's a configuration issue with the AI service. Please contact support.";
    }
    
    return "I encountered an error processing your message. Please try rephrasing your question.";
  }
}