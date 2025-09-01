// User's Exact Entrepreneurial DNA Quiz Data

export interface QuizQuestion {
  id: number;
  text: string;
  category: 'default_dna' | 'awareness' | 'subtype' | 'validation';
  answers: {
    A: { text: string; type: 'architect' | 'alchemist' | 'blurred' | 'neutral' | 'master-strategist' | 'systemised-builder' | 'internal-analyzer' | 'ultimate-strategist' | 'visionary-oracle' | 'magnetic-perfectionist' | 'energetic-empath' | 'ultimate-alchemist' | 'overthinker' | 'performer' | 'self-forsaker' | 'self-betrayer'; weight: number };
    B: { text: string; type: 'architect' | 'alchemist' | 'blurred' | 'neutral' | 'master-strategist' | 'systemised-builder' | 'internal-analyzer' | 'ultimate-strategist' | 'visionary-oracle' | 'magnetic-perfectionist' | 'energetic-empath' | 'ultimate-alchemist' | 'overthinker' | 'performer' | 'self-forsaker' | 'self-betrayer'; weight: number };
    C: { text: string; type: 'architect' | 'alchemist' | 'blurred' | 'neutral' | 'master-strategist' | 'systemised-builder' | 'internal-analyzer' | 'ultimate-strategist' | 'visionary-oracle' | 'magnetic-perfectionist' | 'energetic-empath' | 'ultimate-alchemist' | 'overthinker' | 'performer' | 'self-forsaker' | 'self-betrayer'; weight: number };
    D: { text: string; type: 'architect' | 'alchemist' | 'blurred' | 'neutral' | 'master-strategist' | 'systemised-builder' | 'internal-analyzer' | 'ultimate-strategist' | 'visionary-oracle' | 'magnetic-perfectionist' | 'energetic-empath' | 'ultimate-alchemist' | 'overthinker' | 'performer' | 'self-forsaker' | 'self-betrayer'; weight: number };
  };
}

export interface DNASubtype {
  id: string;
  name: string;
  emoji: string;
  category: 'alchemist' | 'architect' | 'blurred';
  operatingLoop: string;
  coreIdentity: string;
  oppositeAwareness: string;
  edge: string;
  risks: string;
  nextSteps: string;
  complement?: {
    type: string;
    name: string;
    description: string;
  };
}

// Your Authentic Q1-Q22 Entrepreneurial DNA Assessment
export const ENTREPRENEURIAL_DNA_QUESTIONS: QuizQuestion[] = [
  // BLOCK 1: Q1-Q6 Default DNA Detection
  {
    id: 1,
    text: "You're going away for the weekend. How do you prepare the night before?",
    category: 'default_dna',
    answers: {
      A: { text: "I mentally run through what I need and pack once — essentials are covered.", type: 'architect', weight: 1 },
      B: { text: "I write a full list, check everything off, repack a few times, still feel uneasy.", type: 'blurred', weight: 1 },
      C: { text: "I throw things in last minute and trust it'll be fine.", type: 'alchemist', weight: 1 },
      D: { text: "I pack, unpack, and get overwhelmed deciding what I even need.", type: 'blurred', weight: 1 }
    }
  },
  {
    id: 2,
    text: "A close friend unintentionally hurts your feelings. How do you respond?",
    category: 'default_dna',
    answers: {
      A: { text: "I won't say anything — they'll figure it out or I'll quietly move on.", type: 'architect', weight: 1 },
      B: { text: "I'll express it — maybe now, maybe later — but it will come out.", type: 'alchemist', weight: 1 },
      C: { text: "I react suddenly, then second-guess if I was overdramatic.", type: 'blurred', weight: 1 },
      D: { text: "I feel stuck about whether I should say something or not.", type: 'blurred', weight: 1 }
    }
  },
  {
    id: 3,
    text: "You walk into a room full of strangers. What do you do?",
    category: 'default_dna',
    answers: {
      A: { text: "I observe quietly, scan the room, and engage when it makes strategic sense.", type: 'architect', weight: 1 },
      B: { text: "I tune into the energy — I might light up the room or stay quiet, depending how I feel.", type: 'alchemist', weight: 1 },
      C: { text: "I pause and wait for someone to approach — I'm not sure how to show up.", type: 'neutral', weight: 1 },
      D: { text: "I keep switching between acting confident and feeling unsure — I want to be seen but don't know how.", type: 'blurred', weight: 1 }
    }
  },
  {
    id: 4,
    text: "You've committed to waking up at 6am for a week. Day 3, you're exhausted. What happens?",
    category: 'default_dna',
    answers: {
      A: { text: "I stick to it. Fatigue doesn't override commitment unless it's serious.", type: 'architect', weight: 1 },
      B: { text: "I ask myself if the reason still matters — if not, I adjust without guilt.", type: 'alchemist', weight: 1 },
      C: { text: "I sleep in, feel bad, and try again tomorrow.", type: 'neutral', weight: 1 },
      D: { text: "I feel torn — I want to keep going but can't force myself either.", type: 'blurred', weight: 1 }
    }
  },
  {
    id: 5,
    text: "You've completed a project and it performs well. How do you feel about it?",
    category: 'default_dna',
    answers: {
      A: { text: "If the result is strong, I'm satisfied — no need to change anything.", type: 'architect', weight: 1 },
      B: { text: "I immediately wonder how it could have been even better.", type: 'alchemist', weight: 1 },
      C: { text: "I feel good but uneasy — maybe I missed something important.", type: 'blurred', weight: 1 },
      D: { text: "I can't tell if I'm happy or not — depends what others say.", type: 'blurred', weight: 1 }
    }
  },
  {
    id: 6,
    text: "You're pursuing a goal no one else has achieved. How do you think about it?",
    category: 'default_dna',
    answers: {
      A: { text: "I need to see a path or example — otherwise I'm not sure it's achievable.", type: 'architect', weight: 1 },
      B: { text: "Even if no one's done it, I know it's possible — I just need the steps.", type: 'alchemist', weight: 1 },
      C: { text: "I doubt myself, but I still try in case it works out.", type: 'blurred', weight: 1 },
      D: { text: "I switch between confidence and confusion depending on the day.", type: 'blurred', weight: 1 }
    }
  },
  
  // BLOCK 2: Q7-Q14 Dynamic Subtype Detection (8 questions based on Default DNA type)
  // These questions dynamically show different answer options based on user's DEFAULT DNA type
  {
    id: 7,
    text: "When planning a major project, what's your natural first step?",
    category: 'subtype',
    answers: {
      // For ARCHITECT DNA: Master Strategist, Systemised Builder, Internal Analyzer, Ultimate Strategist
      A: { text: "Create a comprehensive master plan with all components mapped out", type: 'master-strategist', weight: 1 },
      B: { text: "Build systematic processes and workflows that can be repeated", type: 'systemised-builder', weight: 1 },
      C: { text: "Analyze all potential risks and failure points internally first", type: 'internal-analyzer', weight: 1 },
      D: { text: "Develop the ultimate strategic framework that others can follow", type: 'ultimate-strategist', weight: 1 }
    }
  },
  {
    id: 8,
    text: "When facing a complex problem, how do you naturally approach it?",
    category: 'subtype',
    answers: {
      // For ARCHITECT DNA: Master Strategist, Systemised Builder, Internal Analyzer, Ultimate Strategist
      A: { text: "Design an overarching strategy that addresses all interconnected elements", type: 'master-strategist', weight: 1 },
      B: { text: "Break it into repeatable steps and create systems to handle each part", type: 'systemised-builder', weight: 1 },
      C: { text: "Study it deeply and internally before taking any external action", type: 'internal-analyzer', weight: 1 },
      D: { text: "Develop the most sophisticated solution that becomes the gold standard", type: 'ultimate-strategist', weight: 1 }
    }
  },
  {
    id: 9,
    text: "Your business needs to scale quickly. What's your instinctive focus?",
    category: 'subtype',
    answers: {
      A: { text: "Create strategic partnerships and leverage existing market positions", type: 'master-strategist', weight: 1 },
      B: { text: "Systematize operations so growth doesn't break existing processes", type: 'systemised-builder', weight: 1 },
      C: { text: "Analyze capacity constraints and optimize before expanding", type: 'internal-analyzer', weight: 1 },
      D: { text: "Build the ultimate scalable framework others will want to replicate", type: 'ultimate-strategist', weight: 1 }
    }
  },
  {
    id: 10,
    text: "When teaching others your methods, you naturally tend to:",
    category: 'subtype',
    answers: {
      A: { text: "Share the strategic thinking behind why decisions were made", type: 'master-strategist', weight: 1 },
      B: { text: "Create step-by-step systems they can follow independently", type: 'systemised-builder', weight: 1 },
      C: { text: "Help them develop their own analytical thinking skills", type: 'internal-analyzer', weight: 1 },
      D: { text: "Provide the ultimate comprehensive framework for mastery", type: 'ultimate-strategist', weight: 1 }
    }
  },
  {
    id: 11,
    text: "During a high-pressure deadline, your strength shows up as:",
    category: 'subtype',
    answers: {
      A: { text: "Coordinating multiple moving parts with strategic oversight", type: 'master-strategist', weight: 1 },
      B: { text: "Following proven systems that maintain quality under pressure", type: 'systemised-builder', weight: 1 },
      C: { text: "Thoroughly analyzing what truly needs to be done versus busy work", type: 'internal-analyzer', weight: 1 },
      D: { text: "Delivering exceptional results that exceed expectations", type: 'ultimate-strategist', weight: 1 }
    }
  },
  {
    id: 12,
    text: "Your ideal team role naturally gravitates toward:",
    category: 'subtype',
    answers: {
      A: { text: "Strategic leadership that guides overall direction and decisions", type: 'master-strategist', weight: 1 },
      B: { text: "Operations management that ensures smooth, systematic execution", type: 'systemised-builder', weight: 1 },
      C: { text: "Research and analysis that informs better decision-making", type: 'internal-analyzer', weight: 1 },
      D: { text: "Excellence driving that sets new standards for performance", type: 'ultimate-strategist', weight: 1 }
    }
  },
  {
    id: 13,
    text: "When evaluating a business opportunity, you first:",
    category: 'subtype',
    answers: {
      A: { text: "Assess the strategic positioning and competitive landscape", type: 'master-strategist', weight: 1 },
      B: { text: "Determine if it fits into your existing systems and processes", type: 'systemised-builder', weight: 1 },
      C: { text: "Analyze the underlying fundamentals and potential risks", type: 'internal-analyzer', weight: 1 },
      D: { text: "Evaluate if it can become best-in-class within its category", type: 'ultimate-strategist', weight: 1 }
    }
  },
  {
    id: 14,
    text: "Your natural communication style in business tends to be:",
    category: 'subtype',
    answers: {
      A: { text: "Strategic and big-picture focused with clear directional guidance", type: 'master-strategist', weight: 1 },
      B: { text: "Systematic and process-oriented with actionable steps", type: 'systemised-builder', weight: 1 },
      C: { text: "Thoughtful and analytical with well-researched insights", type: 'internal-analyzer', weight: 1 },
      D: { text: "Comprehensive and excellence-driven with detailed frameworks", type: 'ultimate-strategist', weight: 1 }
    }
  },
  
  // BLOCK 3: Q15-Q18 Awareness Block (Dynamic based on Default DNA)
  {
    id: 9,
    text: "You've brought on a new team member who isn't delivering as expected. How would your opposite handle it?",
    category: 'awareness',
    answers: {
      A: { text: "Review expectations, pinpoint where the breakdown occurred, and restructure their workflow", type: 'architect', weight: 1 },
      B: { text: "Talk openly about how the dynamic feels and whether something is misaligned", type: 'alchemist', weight: 1 },
      C: { text: "Overcompensate by taking on their tasks and quietly hoping they improve", type: 'blurred', weight: 1 },
      D: { text: "Give vague feedback while focusing on keeping morale high", type: 'neutral', weight: 1 }
    }
  },
  {
    id: 10,
    text: "A long-term partnership feels exciting but unclear. How would your opposite approach the next step?",
    category: 'awareness',
    answers: {
      A: { text: "Clarify objectives, roles, and measurable outcomes before committing", type: 'architect', weight: 1 },
      B: { text: "Explore how aligned it feels and notice what isn't being said", type: 'alchemist', weight: 1 },
      C: { text: "Say yes quickly, then figure it out as they go", type: 'blurred', weight: 1 },
      D: { text: "Wait to see how things evolve and trust it will clarify naturally", type: 'neutral', weight: 1 }
    }
  },
  {
    id: 11,
    text: "A team member keeps missing deadlines. How would your opposite handle this?",
    category: 'awareness',
    answers: {
      A: { text: "Set up a review system to track accountability and outline next steps", type: 'architect', weight: 1 },
      B: { text: "Check in to understand what's going on behind the scenes", type: 'alchemist', weight: 1 },
      C: { text: "Avoid confrontation and work around them instead", type: 'blurred', weight: 1 },
      D: { text: "Assume they need more motivation and give them a pep talk", type: 'neutral', weight: 1 }
    }
  },
  {
    id: 12,
    text: "You just wrapped a high-revenue campaign. What would your opposite focus on next?",
    category: 'awareness',
    answers: {
      A: { text: "Break down what worked and rebuild the system for repeatability", type: 'architect', weight: 1 },
      B: { text: "Pause to reflect on alignment before starting anything else", type: 'alchemist', weight: 1 },
      C: { text: "Start planning a new direction without reviewing results", type: 'blurred', weight: 1 },
      D: { text: "Celebrate with the team and move on instinctively", type: 'neutral', weight: 1 }
    }
  },

  // BLOCK 3: Q13-Q18 Path Choice Questions - Your Authentic Questions
  {
    id: 13,
    text: "You've just had an idea you're excited about, but you're not sure how to begin. What's your first move?",
    category: 'subtype',
    answers: {
      A: { text: "I outline the steps from A to Z and start mapping the tools or systems I'd need to deliver it properly.", type: 'architect', weight: 1 },
      B: { text: "I journal or voice-note to capture everything while the emotion is fresh.", type: 'alchemist', weight: 1 },
      C: { text: "I've mapped a dozen possible routes and can't tell which is best.", type: 'blurred', weight: 1 },
      D: { text: "I find practical ways to test the core concept quickly.", type: 'neutral', weight: 1 }
    }
  },
  {
    id: 14,
    text: "You've written a rough outline for a course or product. What do you naturally do next?",
    category: 'subtype',
    answers: {
      A: { text: "I check if each part connects logically and improve the structure before building anything.", type: 'architect', weight: 1 },
      B: { text: "I open up a tool and start creating the first few sections to see how it feels in action.", type: 'alchemist', weight: 1 },
      C: { text: "I obsessively replay what I could've done better, even if the launch succeeded.", type: 'blurred', weight: 1 },
      D: { text: "I make a checklist of every component and start working through it step-by-step.", type: 'neutral', weight: 1 }
    }
  },
  {
    id: 15,
    text: "You've sketched out a new service or program. A friend asks you, 'How will it work?' What do you instinctively describe first?",
    category: 'subtype',
    answers: {
      A: { text: "The logic behind the framework — why each part exists and how it links to the bigger picture.", type: 'architect', weight: 1 },
      B: { text: "The reason I'm offering it and what kind of transformation it's built to deliver.", type: 'alchemist', weight: 1 },
      C: { text: "I worry I won't see it through once the emotional high fades.", type: 'blurred', weight: 1 },
      D: { text: "I say, 'Let me show you'—then pull up a mock-up or system to demonstrate.", type: 'neutral', weight: 1 }
    }
  },
  {
    id: 16,
    text: "You've joined a mastermind group, and they're brainstorming ways to improve their businesses. What's your natural way of contributing?",
    category: 'subtype',
    answers: {
      A: { text: "I ask focused questions to help them think better, and naturally start outlining the structure for them.", type: 'architect', weight: 1 },
      B: { text: "I stay quiet until I've listened deeply, then share a clear plan or observation that changes the direction.", type: 'alchemist', weight: 1 },
      C: { text: "I feel like I have to get every detail just right before it goes out.", type: 'blurred', weight: 1 },
      D: { text: "I start drawing on the whiteboard — mapping steps, bottlenecks, or a better way to do things.", type: 'neutral', weight: 1 }
    }
  },
  {
    id: 17,
    text: "You've got a notebook full of business ideas. What's your natural approach to choosing which one to act on?",
    category: 'subtype',
    answers: {
      A: { text: "I ask myself which idea is easiest to explain to others — if I can map it cleanly, I know I'll build it well.", type: 'architect', weight: 1 },
      B: { text: "I compare them logically — which one solves the biggest problem, and which has the most potential to scale?", type: 'alchemist', weight: 1 },
      C: { text: "I keep spotting emotional gaps between what I feel and what I've built.", type: 'blurred', weight: 1 },
      D: { text: "I test parts of a few ideas to see which one feels smooth to build and execute.", type: 'neutral', weight: 1 }
    }
  },
  {
    id: 18,
    text: "A friend asks for help turning their business idea into something real. You agree. What's your instinctive first step?",
    category: 'subtype',
    answers: {
      A: { text: "I start mapping the entire process into systems — I want everything running smoothly early on.", type: 'architect', weight: 1 },
      B: { text: "I ask them to describe their end goal in one sentence, then figure out how to reverse-engineer it from there.", type: 'alchemist', weight: 1 },
      C: { text: "I take a methodical approach and break it down into research, design, and execution phases.", type: 'blurred', weight: 1 },
      D: { text: "I offer to help set up the first few tools or tech pieces to get things moving.", type: 'neutral', weight: 1 }
    }
  },

  // BLOCK 4: Q19-Q22 Validation Questions - Your Authentic Questions
  {
    id: 19,
    text: "You're given a blank room and asked to design it however you want — no deadline, no instructions, just freedom. What do you naturally do first?",
    category: 'validation',
    answers: {
      A: { text: "I stand in the space and feel what it needs. Then I begin placing things intuitively.", type: 'alchemist', weight: 1 },
      B: { text: "I imagine the finished look instantly, then begin collecting images or pieces to match the vision.", type: 'alchemist', weight: 1 },
      C: { text: "I begin sketching it out in a step-by-step plan so I don't waste energy.", type: 'architect', weight: 1 },
      D: { text: "I overthink each decision and delay starting until I'm sure it'll look right.", type: 'blurred', weight: 1 }
    }
  },
  {
    id: 20,
    text: "Think back to your school years. How did you usually approach a long homework assignment?",
    category: 'validation',
    answers: {
      A: { text: "I waited until inspiration hit, then worked in a creative sprint.", type: 'alchemist', weight: 1 },
      B: { text: "I wrote and rewrote sections until it was perfect — even if it was last minute.", type: 'blurred', weight: 1 },
      C: { text: "I mapped the sections, added energy when I felt aligned, and adjusted as I went.", type: 'architect', weight: 1 },
      D: { text: "I needed to be alone, clear the space, and feel right before even beginning.", type: 'alchemist', weight: 1 }
    }
  },
  {
    id: 21,
    text: "When asked to clean your room or organise your space as a child, what best describes your approach?",
    category: 'validation',
    answers: {
      A: { text: "I did it in one big emotional burst — the chaos would build until I had to act.", type: 'alchemist', weight: 1 },
      B: { text: "I made a plan or system first, then tackled it piece by piece.", type: 'architect', weight: 1 },
      C: { text: "I felt overwhelmed unless the mood or energy felt right.", type: 'alchemist', weight: 1 },
      D: { text: "I cleaned while imagining how I wanted it to look when done — I needed to see it first.", type: 'blurred', weight: 1 }
    }
  },
  {
    id: 22,
    text: "You're learning a new skill (e.g., cooking, driving, drawing). Which learning pattern is most natural for you?",
    category: 'validation',
    answers: {
      A: { text: "I research first, then repeat steps until it feels mastered.", type: 'architect', weight: 1 },
      B: { text: "I learn by doing — I just start and fix mistakes as I go.", type: 'alchemist', weight: 1 },
      C: { text: "I learn when I feel connected to what I'm doing — if the energy's off, I can't focus.", type: 'alchemist', weight: 1 },
      D: { text: "I see the end result in my head first, then I try to recreate it immediately.", type: 'blurred', weight: 1 }
    }
  }
];

// DNA Loop Descriptions for Results Page
export const DNA_LOOP_DESCRIPTIONS = {
  'Architect': "Your DNA loop operates through systematic analysis → strategic planning → structured execution → measurable results. You thrive on creating frameworks that others can follow and building sustainable systems.",
  'Alchemist': "Your DNA loop flows through intuitive sensing → creative visioning → adaptive action → meaningful transformation. You excel at reading energy, following instincts, and creating authentic change.",
  'Blurred': "Your DNA loop shifts between analytical and intuitive approaches without clear consistency. This creates internal conflict but also potential for balanced perspective once you choose your primary operating system.",
  'Neutral': "Your DNA loop adapts fluidly between systematic and intuitive approaches based on context. You have the potential to integrate both analytical and creative strengths once you develop awareness of when to use each approach."
};

// Helper function to get profile data for a given subtype
// Function to generate dynamic subtype questions based on DEFAULT DNA type
export function getDynamicSubtypeQuestions(defaultDnaType: 'architect' | 'alchemist' | 'blurred'): QuizQuestion[] {
  const baseQuestions = ENTREPRENEURIAL_DNA_QUESTIONS.filter(q => q.category === 'subtype');
  
  return baseQuestions.map(question => {
    if (defaultDnaType === 'architect') {
      // Return as-is - already configured for Architect subtypes
      return question;
    } else if (defaultDnaType === 'alchemist') {
      // Replace with Alchemist subtype options
      return {
        ...question,
        answers: {
          A: { text: getAlchemistAnswerText(question.id, 'A'), type: 'visionary-oracle', weight: 1 },
          B: { text: getAlchemistAnswerText(question.id, 'B'), type: 'magnetic-perfectionist', weight: 1 },
          C: { text: getAlchemistAnswerText(question.id, 'C'), type: 'energetic-empath', weight: 1 },
          D: { text: getAlchemistAnswerText(question.id, 'D'), type: 'ultimate-alchemist', weight: 1 }
        }
      };
    } else if (defaultDnaType === 'blurred') {
      // Replace with Blurred subtype options
      return {
        ...question,
        answers: {
          A: { text: getBlurredAnswerText(question.id, 'A'), type: 'overthinker', weight: 1 },
          B: { text: getBlurredAnswerText(question.id, 'B'), type: 'performer', weight: 1 },
          C: { text: getBlurredAnswerText(question.id, 'C'), type: 'self-forsaker', weight: 1 },
          D: { text: getBlurredAnswerText(question.id, 'D'), type: 'self-betrayer', weight: 1 }
        }
      };
    }
    return question;
  });
}

// Alchemist subtype answer texts
function getAlchemistAnswerText(questionId: number, option: string): string {
  const alchemistAnswers: Record<number, Record<string, string>> = {
    7: {
      A: "Envision the transformational impact and connect with the deeper purpose",
      B: "Perfect every detail to create something truly exceptional",
      C: "Feel into what the audience needs and let that guide the approach",
      D: "Channel pure creative energy to manifest something unprecedented"
    },
    8: {
      A: "See the bigger picture and identify innovative breakthrough solutions",
      B: "Refine and perfect the approach until it meets the highest standards",
      C: "Tune into the emotional energy and respond with empathy and understanding",
      D: "Transform the challenge into an opportunity for creative mastery"
    },
    9: {
      A: "Focus on visionary leadership that inspires others to join the mission",
      B: "Perfect the core offering until it becomes irresistibly attractive",
      C: "Build authentic connections and community around shared values",
      D: "Leverage creative innovation to disrupt and lead the market"
    },
    10: {
      A: "Share inspiring visions and help them see new possibilities",
      B: "Guide them toward excellence through refined, polished methods",
      C: "Connect emotionally and help them find their own authentic path",
      D: "Transmit mastery through immersive, transformational experiences"
    },
    11: {
      A: "Maintain visionary clarity while orchestrating creative solutions",
      B: "Execute with precision and attention to every critical detail",
      C: "Stay emotionally centered while supporting and energizing the team",
      D: "Channel intense focus into breakthrough creative solutions"
    },
    12: {
      A: "Visionary leadership that sets inspiring direction and possibilities",
      B: "Quality assurance that ensures excellence in every deliverable",
      C: "People development that nurtures and empowers team potential",
      D: "Innovation driving that pushes boundaries and creates breakthroughs"
    },
    13: {
      A: "Evaluate the visionary potential and transformational impact",
      B: "Assess whether it can be executed with exceptional quality standards",
      C: "Consider the human element and authentic value it provides",
      D: "Determine if it offers opportunity for creative mastery and innovation"
    },
    14: {
      A: "Visionary and inspirational with transformational possibilities",
      B: "Polished and refined with attention to excellence and quality",
      C: "Authentic and empathetic with genuine care for people's needs",
      D: "Dynamic and innovative with creative mastery and breakthrough thinking"
    }
  };
  
  return alchemistAnswers[questionId]?.[option] || "";
}

// Blurred subtype answer texts
function getBlurredAnswerText(questionId: number, option: string): string {
  const blurredAnswers: Record<number, Record<string, string>> = {
    7: {
      A: "Get caught in analysis paralysis trying to consider every possible angle",
      B: "Focus on what will make me look competent and successful to others",
      C: "Put everyone else's needs first and lose sight of my own priorities",
      D: "Go against my natural instincts to prove I can be different"
    },
    8: {
      A: "Overthink every possible solution until I'm paralyzed by options",
      B: "Present a confident front while internally doubting my capabilities",
      C: "Sacrifice my own approach to keep others comfortable and happy",
      D: "Force myself into a style that doesn't feel authentic or natural"
    },
    9: {
      A: "Get overwhelmed by all the moving parts and struggle to prioritize",
      B: "Focus on external metrics that make the business look impressive",
      C: "Prioritize team harmony over necessary business decisions",
      D: "Reject my natural approach and try to scale like someone else would"
    },
    10: {
      A: "Overexplain everything because I'm not sure what's actually important",
      B: "Focus on appearing knowledgeable rather than ensuring they understand",
      C: "Give away all my knowledge freely without considering my own boundaries",
      D: "Teach in a way that contradicts my natural communication style"
    },
    11: {
      A: "Second-guess every decision and get stuck in planning loops",
      B: "Maintain appearances while internally feeling overwhelmed and stressed",
      C: "Exhaust myself taking care of everyone else's pressure and deadlines",
      D: "Force myself to work in ways that drain my energy and effectiveness"
    },
    12: {
      A: "Research and planning that often leads to overthinking without action",
      B: "Public-facing roles that showcase success but may lack substance",
      C: "Support and service that puts team needs above strategic direction",
      D: "Contrarian positions that go against my natural strengths and preferences"
    },
    13: {
      A: "Get lost in researching every possible risk and never make a decision",
      B: "Evaluate how it will make me appear successful and credible to others",
      C: "Consider everyone else's opinions and lose track of my own judgment",
      D: "Automatically resist if it aligns with my natural preferences or strengths"
    },
    14: {
      A: "Hesitant and uncertain with excessive qualifiers and second-guessing",
      B: "Polished and impressive but potentially lacking authentic depth",
      C: "Accommodating and selfless often at the expense of clear direction",
      D: "Contrarian and resistant to approaches that would naturally suit me"
    }
  };
  
  return blurredAnswers[questionId]?.[option] || "";
}

export function getProfileData(subtypeId: string) {
  return DNA_SUBTYPES[subtypeId] || null;
}

// DNA Subtypes - Using exact user specifications from attached documents
export const DNA_SUBTYPES: Record<string, DNASubtype> = {
  // ALCHEMIST SUBTYPES (Emotion → Thought → Emotion)
  'visionary-oracle': {
    id: 'visionary-oracle',
    name: 'The Visionary Oracle',
    emoji: '',
    category: 'alchemist',
    operatingLoop: 'Emotion → Thought → Emotion',
    coreIdentity: 'Sees the future, struggles to finish. Hyper-intuitive, sees trends before they emerge. Gets overwhelmed mid-build, rushes at the end, often burns out. Needs containers to complete vision.',
    oppositeAwareness: 'Low awareness of Architect traits',
    edge: 'Intuitive pattern recognition, cultural sensing',
    risks: 'Procrastination, burnout, incomplete projects',
    nextSteps: 'Build containers and systems for completion'
  },
  'magnetic-perfectionist': {
    id: 'magnetic-perfectionist', 
    name: 'The Magnetic Perfectionist',
    emoji: '',
    category: 'alchemist',
    operatingLoop: 'Emotion → Thought → Emotion',
    coreIdentity: 'Organised to deliver aligned perfection. Trained to finish what she starts. Creates emotional structure, not logic. Seeks refined perfection and can\'t deliver anything less.',
    oppositeAwareness: 'Medium awareness of Architect traits',
    edge: 'Emotional structure, consistent delivery',
    risks: 'Over-ownership, impossibly high standards',
    nextSteps: 'Find collaborators who match delivery frequency'
  },
  'energetic-empath': {
    id: 'energetic-empath',
    name: 'The Energetic Empath', 
    emoji: '',
    category: 'alchemist',
    operatingLoop: 'Emotion → Thought → Emotion',
    coreIdentity: 'Heals with energy, absorbs with intensity. Radiates energy and uplifts others. Absorbs emotional weight, has high recharge needs. Needs clear logic to counter intuitive bias.',
    oppositeAwareness: 'Medium awareness of Architect traits',
    edge: 'Energy healing, emotional uplift',
    risks: 'Emotional absorption, burnout from others energy',
    nextSteps: 'Develop logical frameworks to balance intuition'
  },
  'ultimate-alchemist': {
    id: 'ultimate-alchemist',
    name: 'The Ultimate Alchemist',
    emoji: '', 
    category: 'alchemist',
    operatingLoop: 'Emotion → Thought → Emotion',
    coreIdentity: 'Carries every Alchemist gift — and full awareness of structure. Aura, empathy, vision, and organised precision. Has deep awareness of Architect mode, but doesn\'t execute like one. Chooses growth over all.',
    oppositeAwareness: 'High awareness of Architect traits',
    edge: 'Complete Alchemist gifts with structural awareness',
    risks: 'Choosing growth over stability',
    nextSteps: 'Balance growth impulses with sustainable systems'
  },

  // ARCHITECT SUBTYPES (Thought → Emotion → Thought)
  'systemised-builder': {
    id: 'systemised-builder',
    name: 'The Systemised Builder',
    emoji: '',
    category: 'architect', 
    operatingLoop: 'Thought → Emotion → Thought',
    coreIdentity: 'Hands-on executor, builds what others imagine. Needs clear instruction and trust. Doesn\'t over-control — works steadily. Complements Alchemists who need grounding and structure.',
    oppositeAwareness: 'Low awareness of Alchemist traits',
    edge: 'Steady execution, system building',
    risks: 'Needs external direction, limited vision',
    nextSteps: 'Partner with visionaries for direction'
  },
  'internal-analyzer': {
    id: 'internal-analyzer',
    name: 'The Internal Analyzer',
    emoji: '',
    category: 'architect',
    operatingLoop: 'Thought → Emotion → Thought', 
    coreIdentity: 'Seeks perfection through systems. Data-obsessed, detail-led. Gets stuck in analysis loops. Needs Alchemist energy to spark momentum and emotionally calibrate decisions.',
    oppositeAwareness: 'Medium awareness of Alchemist traits',
    edge: 'Deep analysis, systematic perfection',
    risks: 'Analysis paralysis, over-optimization',
    nextSteps: 'Add emotional calibration to decision-making'
  },
  'master-strategist': {
    id: 'master-strategist',
    name: 'The Master Strategist', 
    emoji: '',
    category: 'architect',
    operatingLoop: 'Thought → Emotion → Thought',
    coreIdentity: 'Calm, calculated, high-trust leader. Leads through logic, excels at delegation and direction. Needs emotion to connect and inspire beyond just performance.',
    oppositeAwareness: 'Medium awareness of Alchemist traits',
    edge: 'Strategic leadership, logical delegation',
    risks: 'Emotional disconnection, performance-only focus',
    nextSteps: 'Integrate emotional connection into leadership'
  },
  'ultimate-strategist': {
    id: 'ultimate-strategist',
    name: 'The Ultimate Strategist',
    emoji: '',
    category: 'architect',
    operatingLoop: 'Thought → Emotion → Thought',
    coreIdentity: 'Silent precision, simplified clarity, master of delegation. Constantly recalculates and optimises. Doesn\'t freeze — repositions. Outsources with speed and precision. Doesn\'t lead with emotion, but respects and protects it.',
    oppositeAwareness: 'High awareness of Alchemist traits',
    edge: 'Strategic precision with emotional respect',
    risks: 'Over-optimization, emotional distance',
    nextSteps: 'Balance efficiency with human connection'
  },

  // BLURRED IDENTITY SUBTYPES (Suppressed or Adapted Loops)
  'overthinker': {
    id: 'overthinker',
    name: 'The Overthinker',
    emoji: '',
    category: 'blurred',
    operatingLoop: 'Suppressed or Adapted',
    coreIdentity: 'Trapped between modes, frozen by options. Thinks like an Architect, feels like an Alchemist. Can\'t decide which loop to trust. Needs clarity of core identity and direction.',
    oppositeAwareness: 'Medium awareness of both modes',
    edge: 'Sees multiple perspectives',
    risks: 'Decision paralysis, identity confusion',
    nextSteps: 'Choose one primary operating mode'
  },
  'performer': {
    id: 'performer',
    name: 'The Performer',
    emoji: '',
    category: 'blurred',
    operatingLoop: 'Suppressed or Adapted',
    coreIdentity: 'Acts like they have clarity — but hides confusion. Often excels outwardly while internally drifting. Highly adaptive. Needs to reconnect with authentic operating system.',
    oppositeAwareness: 'High awareness of both modes',
    edge: 'Adaptability, external success',
    risks: 'Internal confusion, inauthentic performance',
    nextSteps: 'Reconnect with authentic identity'
  },
  'self-forsaker': {
    id: 'self-forsaker', 
    name: 'The Self-Forsaker',
    emoji: '',
    category: 'blurred',
    operatingLoop: 'Suppressed Emotion',
    coreIdentity: 'Origin: Alchemist. Suppressed emotion, performs logic. Origin Alchemist who disconnected from emotional DNA due to pressure. Now performs logic — but feels deeply unfulfilled.',
    oppositeAwareness: 'Low awareness - suppressed natural mode',
    edge: 'Can perform logical tasks',
    risks: 'Deep unfulfillment, disconnection from self',
    nextSteps: 'Reconnect with emotional intelligence'
  },
  
  'suppressed-alchemist': {
    id: 'suppressed-alchemist',
    name: 'The Suppressed Alchemist',
    emoji: '🧩',
    category: 'blurred',
    operatingLoop: 'Suppressed Emotion → Thought → Justification',
    coreIdentity: 'You are a high-functioning operator — but something always feels off. You act like an Architect, yet you were never one to begin with. You once led with intuition, emotion, and energetic presence — but somewhere along the way, you shut it down.',
    oppositeAwareness: 'You were once deeply intuitive. You knew things by feeling. You were emotionally alive, creative, magnetic. But at some point — someone taught you it wasn\'t safe. That it wasn\'t valuable. That it was too much.',
    edge: 'You are elite in execution. You can operate with excellence and adapt to any environment. You\'ve developed structure, habits, and a logical operating system others admire.',
    risks: 'You might sabotage emotionally aligned opportunities — because you no longer recognize them. You may chase logic, mentors, or systems — hoping they\'ll give you back a feeling you lost.',
    nextSteps: 'Stop proving you\'re okay. Start grieving what you lost. The suppressed part of you isn\'t gone — she\'s waiting. Let your decisions include your body again — not just your strategy.'
  },
  
  'self-betrayer': {
    id: 'self-betrayer',
    name: 'The Self-Betrayer',
    emoji: '',
    category: 'blurred',
    operatingLoop: 'Suppressed Thought → Emotion → Reaction',
    coreIdentity: 'You weren\'t born scattered — you became that way. Your original clarity got clouded. Your logic got overridden. You once trusted systems, structure, and strategy… but somewhere along the way, your need to adapt became louder than your inner compass.',
    oppositeAwareness: 'You once craved certainty. You lived by logic, made structured decisions, and needed clear paths. But somewhere along the line, your structure was questioned, rejected — or made you feel unworthy. So you shifted.',
    edge: 'You\'re emotionally attuned. You\'re present. You care. You adapt fast. You\'ve developed a level of empathy and awareness most Architects never reach.',
    risks: 'You confuse chaos for creativity. You wait for "alignment" instead of create it. You may attract Alchemist environments that feel energising — but drain you slowly.',
    nextSteps: 'Start writing again. Mapping again. Simplifying again. Return to frameworks, flows, systems — not to control the world, but to return to you. Let your logic breathe again.'
  }
};