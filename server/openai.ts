import OpenAI from "openai";
import type { AiAgent } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export async function chatWithAgent(
  agent: AiAgent,
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    const systemMessage = {
      role: "system" as const,
      content: agent.systemPrompt
    };

    const userMessages = messages.map(msg => ({
      role: msg.role as "user" | "assistant",
      content: msg.content
    }));

    const response = await openai.chat.completions.create({
      model: agent.model || "gpt-4o",
      messages: [systemMessage, ...userMessages],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Error chatting with OpenAI:", error);
    throw new Error("Failed to get AI response: " + (error as Error).message);
  }
}

export async function analyzeBrandHealth(brandData: {
  description: string;
  targetMarket: string;
  currentChallenges: string;
}): Promise<{
  marketPosition: "weak" | "moderate" | "strong";
  digitalPresence: "weak" | "moderate" | "strong";
  customerEngagement: "weak" | "moderate" | "strong";
  overallScore: number;
  recommendations: string[];
}> {
  try {
    const prompt = `
      Analyze the following brand information and provide a comprehensive brand health assessment.
      
      Brand Description: ${brandData.description}
      Target Market: ${brandData.targetMarket}
      Current Challenges: ${brandData.currentChallenges}
      
      Please respond with JSON in this exact format:
      {
        "marketPosition": "weak|moderate|strong",
        "digitalPresence": "weak|moderate|strong", 
        "customerEngagement": "weak|moderate|strong",
        "overallScore": number between 1-10,
        "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      marketPosition: result.marketPosition || "moderate",
      digitalPresence: result.digitalPresence || "moderate",
      customerEngagement: result.customerEngagement || "moderate",
      overallScore: Math.max(1, Math.min(10, result.overallScore || 5)),
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [
        "Define your unique value proposition",
        "Improve your digital marketing strategy",
        "Focus on customer engagement"
      ]
    };
  } catch (error) {
    console.error("Error analyzing brand health:", error);
    throw new Error("Failed to analyze brand health: " + (error as Error).message);
  }
}

export async function generateQuizResults(
  answers: Record<string, any>,
  questions: Array<{ id: string; category: string; weight?: number }>
): Promise<{
  overallScore: number;
  categoryScores: Record<string, number>;
  personalizedRecommendations: string[];
  nextSteps: string[];
}> {
  try {
    const prompt = `
      Analyze the following quiz responses and provide personalized brand development insights.
      
      Questions and Answers: ${JSON.stringify({ questions, answers })}
      
      Please respond with JSON in this exact format:
      {
        "overallScore": number between 0-100,
        "categoryScores": {"category1": score, "category2": score},
        "personalizedRecommendations": ["recommendation1", "recommendation2", "recommendation3"],
        "nextSteps": ["step1", "step2", "step3"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      overallScore: Math.max(0, Math.min(100, result.overallScore || 50)),
      categoryScores: result.categoryScores || {},
      personalizedRecommendations: Array.isArray(result.personalizedRecommendations) 
        ? result.personalizedRecommendations 
        : ["Focus on brand strategy", "Improve market positioning", "Enhance customer experience"],
      nextSteps: Array.isArray(result.nextSteps)
        ? result.nextSteps
        : ["Complete brand foundation course", "Join community discussions", "Schedule strategy session"]
    };
  } catch (error) {
    console.error("Error generating quiz results:", error);
    throw new Error("Failed to generate quiz results: " + (error as Error).message);
  }
}
