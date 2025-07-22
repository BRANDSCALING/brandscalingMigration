import { apiRequest } from "./queryClient";

export interface AIResponse {
  response: string;
}

export interface ClarityResponse {
  enhancedConcept: string;
  suggestions: string[];
  risks: string[];
  nextSteps: string[];
}

export interface BrandingResponse {
  businessNames: string[];
  taglines: string[];
  colorPalette: string[];
  brandTone: string;
}

export class AIService {
  static async generateResponse(prompt: string): Promise<string> {
    console.log("AIService: Sending request to /api/workbook/ai-prompt");
    const res = await apiRequest('POST', '/api/workbook/ai-prompt', { prompt });
    const response: AIResponse = await res.json();
    console.log("AIService: Received response:", response);
    console.log("AIService: response.response:", response.response);
    return response.response || "No response received";
  }

  static async enhanceConcept(data: {
    businessIdea: string;
    audience: string;
    problem: string;
    transformation: string;
    vehicle: string;
    emotion?: string;
    blocker?: string;
  }): Promise<ClarityResponse> {
    const res = await apiRequest('POST', '/api/workbook/clarity', data);
    const response: ClarityResponse = await res.json();
    return response;
  }

  static async generateBranding(data: {
    businessDescription: string;
    targetAudience: string;
    brandTone: string;
    keyBenefits: string;
    industry: string;
  }): Promise<BrandingResponse> {
    const res = await apiRequest('POST', '/api/workbook/branding', data);
    const response: BrandingResponse = await res.json();
    return response;
  }
}