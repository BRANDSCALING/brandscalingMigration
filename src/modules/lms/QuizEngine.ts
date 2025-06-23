import { supabase } from '../../lib/supabase';

export interface QuizQuestion {
  id: number;
  text: string;
  answers: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export interface QuizResponse {
  questionId: number;
  answer: 'A' | 'B' | 'C' | 'D';
}

export interface QuizResult {
  defaultType: 'Architect' | 'Alchemist' | 'Blurred Identity' | 'Unfocused Potential';
  awarenessPercentage: number;
  canRetake: boolean;
  nextRetakeDate?: string;
}

export class QuizEngine {
  
  static calculateResult(responses: QuizResponse[]): Omit<QuizResult, 'canRetake' | 'nextRetakeDate'> {
    // Questions 1-10: Default Type Determination
    const defaultTypeResponses = responses.slice(0, 10);
    let architectScore = 0;
    let alchemistScore = 0;

    defaultTypeResponses.forEach((response) => {
      if (response.answer === 'A' || response.answer === 'C') {
        architectScore++;
      } else {
        alchemistScore++;
      }
    });

    // Questions 11-20: Awareness Level
    const awarenessResponses = responses.slice(10, 20);
    let awarenessScore = 0;

    awarenessResponses.forEach((response) => {
      if (response.answer === 'A' || response.answer === 'B') {
        awarenessScore++;
      }
    });

    const awarenessPercentage = (awarenessScore / 10) * 100;

    // Determine default type
    let defaultType: 'Architect' | 'Alchemist' | 'Blurred Identity' | 'Unfocused Potential';
    
    if (architectScore > alchemistScore) {
      defaultType = awarenessPercentage >= 70 ? 'Architect' : 'Blurred Identity';
    } else if (alchemistScore > architectScore) {
      defaultType = awarenessPercentage >= 70 ? 'Alchemist' : 'Blurred Identity';
    } else {
      defaultType = 'Unfocused Potential';
    }

    return {
      defaultType,
      awarenessPercentage,
    };
  }

  static async submitQuizResult(
    userId: string, 
    responses: QuizResponse[]
  ): Promise<QuizResult> {
    // Calculate the result
    const calculatedResult = this.calculateResult(responses);

    // Check if user can retake
    const { data: existingResults } = await supabase
      .from('quiz_results')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    let canRetake = true;
    let nextRetakeDate: string | undefined;

    if (existingResults && existingResults.length > 0) {
      const lastTakeDate = new Date(existingResults[0].created_at);
      const thirtyDaysLater = new Date(lastTakeDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      canRetake = new Date() >= thirtyDaysLater;
      
      if (!canRetake) {
        nextRetakeDate = thirtyDaysLater.toISOString();
      }
    }

    if (!canRetake) {
      return {
        ...calculatedResult,
        canRetake,
        nextRetakeDate,
      };
    }

    // Save to database
    const { error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: userId,
        default_type: calculatedResult.defaultType,
        awareness_percentage: calculatedResult.awarenessPercentage,
        responses: responses,
      });

    if (error) {
      throw new Error(`Failed to save quiz result: ${error.message}`);
    }

    return {
      ...calculatedResult,
      canRetake: false,
      nextRetakeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  static async checkEligibility(userId: string): Promise<{ canRetake: boolean; nextRetakeDate?: string }> {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      throw new Error(`Failed to check eligibility: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return { canRetake: true };
    }

    const lastTakeDate = new Date(data[0].created_at);
    const thirtyDaysLater = new Date(lastTakeDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    const canRetake = new Date() >= thirtyDaysLater;

    return {
      canRetake,
      nextRetakeDate: canRetake ? undefined : thirtyDaysLater.toISOString(),
    };
  }
}