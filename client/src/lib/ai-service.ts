import { apiRequest } from "./queryClient";

export interface AIResponse {
  response: string;
}

export class AIService {
  static async generateResponse(prompt: string, dnaMode: string = 'architect'): Promise<string> {
    try {
      console.log("AI Service - Making request with prompt:", prompt.substring(0, 50) + "...");
      console.log("AI Service - DNA mode:", dnaMode);
      
      const res = await apiRequest('POST', '/api/workbook/ai-prompt', { prompt, dnaMode });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("AI Service - API Error:", errorText);
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }
      
      const response: AIResponse = await res.json();
      console.log("AI Service - Response received:", response.response?.substring(0, 100) + "...");
      
      return response.response || "No response received";
    } catch (error) {
      console.error("AI Service Error:", error);
      throw new Error("Failed to generate AI response");
    }
  }
}