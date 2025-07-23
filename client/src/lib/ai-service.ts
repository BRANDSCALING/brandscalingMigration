import { apiRequest } from "./queryClient";

export interface AIResponse {
  response: string;
}

export class AIService {
  static async generateResponse(prompt: string, dnaMode: string = 'architect'): Promise<string> {
    try {
      console.log("AI Service - Making request with prompt:", prompt.substring(0, 50) + "...");
      console.log("AI Service - DNA mode:", dnaMode);
      
      // apiRequest already handles response parsing and error checking
      const response: AIResponse = await apiRequest('POST', '/api/workbook/ai-prompt', { prompt, dnaMode });
      
      console.log("AI Service - Full JSON response:", response);
      console.log("AI Service - Response.response field:", response.response);
      console.log("AI Service - Response type:", typeof response.response);
      console.log("AI Service - Response length:", response.response?.length || 'undefined');
      
      if (!response.response) {
        console.error("AI Service - No response field in JSON:", response);
        throw new Error("No response field in API response");
      }
      
      return response.response;
    } catch (error) {
      console.error("AI Service Error:", error);
      throw error; // Re-throw the original error instead of wrapping it
    }
  }
}