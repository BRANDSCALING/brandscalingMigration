export type DNAType = 'Architect' | 'Alchemist' | 'Blurred Identity' | 'Unfocused Potential';

export interface DNAInsights {
  type: DNAType;
  description: string;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  learningStyle: string;
  businessApproach: string;
}

export function getDNAInsights(type: DNAType, awarenessPercentage: number): DNAInsights {
  const baseInsights = {
    'Architect': {
      type: 'Architect' as DNAType,
      description: 'You are naturally systematic, analytical, and process-oriented. You excel at creating structured approaches to business growth.',
      strengths: [
        'Strategic planning and execution',
        'Process optimization',
        'Data-driven decision making',
        'Systematic problem solving',
        'Building scalable frameworks'
      ],
      challenges: [
        'May over-analyze instead of taking action',
        'Can struggle with rapid pivots',
        'Might miss emotional/intuitive insights',
        'Risk of analysis paralysis'
      ],
      learningStyle: 'Structured learning with clear frameworks, step-by-step guides, and measurable outcomes',
      businessApproach: 'Build systems first, then scale through optimized processes and data-driven strategies'
    },
    'Alchemist': {
      type: 'Alchemist' as DNAType,
      description: 'You are naturally intuitive, creative, and relationship-focused. You excel at transforming ideas into reality through inspiration and connection.',
      strengths: [
        'Creative problem solving',
        'Strong relationship building',
        'Intuitive market sensing',
        'Adaptability and flexibility',
        'Inspirational leadership'
      ],
      challenges: [
        'May lack systematic approaches',
        'Can struggle with consistent processes',
        'Might overlook important data',
        'Risk of emotional decision making'
      ],
      learningStyle: 'Story-based learning, experiential content, and community-driven insights',
      businessApproach: 'Build relationships first, then scale through networks and creative solutions'
    },
    'Blurred Identity': {
      type: 'Blurred Identity' as DNAType,
      description: 'You have strong tendencies toward either Architect or Alchemist approaches, but lower self-awareness is limiting your potential.',
      strengths: [
        'Natural entrepreneurial instincts',
        'Potential for balanced approach',
        'Room for significant growth',
        'Adaptable skill development'
      ],
      challenges: [
        'Unclear on optimal strategies',
        'May use inconsistent approaches',
        'Potential for conflicting methods',
        'Need for identity clarification'
      ],
      learningStyle: 'Mixed learning approaches with focus on self-discovery and awareness building',
      businessApproach: 'Focus on increasing self-awareness first, then develop your dominant style'
    },
    'Unfocused Potential': {
      type: 'Unfocused Potential' as DNAType,
      description: 'You show equal traits of both Architect and Alchemist, indicating high adaptability but potential confusion in approach.',
      strengths: [
        'High adaptability',
        'Balanced perspective',
        'Versatile skill set',
        'Ability to relate to different types'
      ],
      challenges: [
        'Decision paralysis between approaches',
        'Inconsistent strategy execution',
        'May lack focused direction',
        'Risk of spreading efforts too thin'
      ],
      learningStyle: 'Comprehensive learning that covers both systematic and intuitive approaches',
      businessApproach: 'Develop situational awareness to know when to use Architect vs Alchemist approaches'
    }
  };

  const insights = baseInsights[type];
  
  // Add awareness-specific recommendations
  const awarenessRecommendations = awarenessPercentage >= 70 
    ? [
        'Leverage your high self-awareness to accelerate growth',
        'Focus on advanced strategies that match your style',
        'Consider mentoring others with similar DNA types'
      ]
    : [
        'Prioritize increasing self-awareness through reflection and assessment',
        'Start with foundational learning before advanced strategies',
        'Regular check-ins to track awareness development'
      ];

  return {
    ...insights,
    recommendations: [...insights.recommendations, ...awarenessRecommendations]
  };
}

export function getDNAColor(type: DNAType): string {
  const colors = {
    'Architect': '#3B82F6', // Blue
    'Alchemist': '#F59E0B', // Amber
    'Blurred Identity': '#8B5CF6', // Purple
    'Unfocused Potential': '#6B7280' // Gray
  };
  
  return colors[type];
}

export function getDNAIcon(type: DNAType): string {
  const icons = {
    'Architect': '🏗️',
    'Alchemist': '⚗️',
    'Blurred Identity': '🔍',
    'Unfocused Potential': '🌟'
  };
  
  return icons[type];
}