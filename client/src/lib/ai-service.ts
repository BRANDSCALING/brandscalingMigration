// AI Service for Module 1 workbook components
interface AIPromptRequest {
  prompt: string;
  dnaMode?: 'architect' | 'alchemist';
  userId?: string;
}

interface AIResponse {
  response: string;
  success: boolean;
  error?: string;
}

export class AIService {
  static async generateResponse(request: AIPromptRequest): Promise<AIResponse> {
    try {
      const response = await fetch('/api/workbook/ai-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-student-id': localStorage.getItem('studentId') || '',
          'x-student-email': localStorage.getItem('studentEmail') || '',
        },
        body: JSON.stringify({
          prompt: request.prompt,
          dnaMode: request.dnaMode || 'architect',
          userId: request.userId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        response: data.response || 'No response generated',
        success: true
      };
    } catch (error) {
      console.error('AI Service error:', error);
      return {
        response: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static async generateClarityResponse(businessData: {
    businessIdea: string;
    audience: string;
    problem: string;
    transformation: string;
    vehicle: string;
    emotion: string;
    blocker: string;
  }, customPrompt?: string): Promise<AIResponse> {
    const prompt = customPrompt || `
Based on this business information:
- Business Idea: ${businessData.businessIdea}
- Target Audience: ${businessData.audience}  
- Problem Solved: ${businessData.problem}
- Transformation Offered: ${businessData.transformation}
- Delivery Vehicle: ${businessData.vehicle}
- Emotional Connection: ${businessData.emotion}
- Current Blocker: ${businessData.blocker}

Please provide clarity insights and recommendations for this business concept.
    `.trim();

    return this.generateResponse({ prompt });
  }

  static async generateBrandingResponse(brandingData: {
    businessDescription: string;
    targetAudience: string;
    brandTone: string;
    keyBenefits: string;
    industry: string;
  }, customPrompt?: string): Promise<AIResponse> {
    const prompt = customPrompt || `
Please suggest 5 business names, taglines, and color palettes for:
- Business: ${brandingData.businessDescription}
- Audience: ${brandingData.targetAudience}
- Tone: ${brandingData.brandTone}
- Benefits: ${brandingData.keyBenefits}
- Industry: ${brandingData.industry}
    `.trim();

    return this.generateResponse({ prompt });
  }
}