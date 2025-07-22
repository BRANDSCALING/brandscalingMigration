import { apiRequest } from "./queryClient";

export interface AIResponse {
  response: string;
}

export class AIService {
  static async generateResponse(prompt: string): Promise<string> {
    try {
      const res = await apiRequest('POST', '/api/workbook/ai-prompt', { prompt });
      const response: AIResponse = await res.json();
      return response.response || "No response received";
    } catch (error) {
      console.error("AI Service Error:", error);
      throw new Error("Failed to generate AI response");
    }
  }
}