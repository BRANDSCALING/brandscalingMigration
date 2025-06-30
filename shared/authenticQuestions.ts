// Authentic Entrepreneurial DNA Quiz Questions
// Based on user's exact Q1-Q22 structure

export interface QuizQuestion {
  id: number;
  text: string;
  answers: {
    A: { text: string; type: 'architect' | 'alchemist' | 'blurred' | 'neutral'; subtype?: string };
    B: { text: string; type: 'architect' | 'alchemist' | 'blurred' | 'neutral'; subtype?: string };
    C: { text: string; type: 'architect' | 'alchemist' | 'blurred' | 'neutral'; subtype?: string };
    D: { text: string; type: 'architect' | 'alchemist' | 'blurred' | 'neutral'; subtype?: string };
  };
}

export const AUTHENTIC_DNA_QUESTIONS: QuizQuestion[] = [
  // Q1-Q6: Default DNA Block
  {
    id: 1,
    text: "You're going away for the weekend. How do you prepare the night before?",
    answers: {
      A: { text: "I mentally run through what I need and pack once — essentials are covered.", type: "architect" },
      B: { text: "I write a full list, check everything off, repack a few times, still feel uneasy.", type: "blurred" },
      C: { text: "I throw things in last minute and trust it'll be fine.", type: "alchemist" },
      D: { text: "I pack, unpack, and get overwhelmed deciding what I even need.", type: "blurred" }
    }
  },
  {
    id: 2,
    text: "A close friend unintentionally hurts your feelings. How do you respond?",
    answers: {
      A: { text: "I won't say anything — they'll figure it out or I'll quietly move on.", type: "architect" },
      B: { text: "I'll express it — maybe now, maybe later — but it will come out.", type: "alchemist" },
      C: { text: "I react suddenly, then second-guess if I was overdramatic.", type: "blurred" },
      D: { text: "I feel stuck about whether I should say something or not.", type: "blurred" }
    }
  },
  {
    id: 3,
    text: "You walk into a room full of strangers. What do you do?",
    answers: {
      A: { text: "I observe quietly, scan the room, and engage when it makes strategic sense.", type: "architect" },
      B: { text: "I tune into the energy — I might light up the room or stay quiet, depending how I feel.", type: "alchemist" },
      C: { text: "I pause and wait for someone to approach — I'm not sure how to show up.", type: "neutral" },
      D: { text: "I keep switching between acting confident and feeling unsure — I want to be seen but don't know how.", type: "blurred" }
    }
  },
  {
    id: 4,
    text: "You've committed to waking up at 6am for a week. Day 3, you're exhausted. What happens?",
    answers: {
      A: { text: "I stick to it. Fatigue doesn't override commitment unless it's serious.", type: "architect" },
      B: { text: "I ask myself if the reason still matters — if not, I adjust without guilt.", type: "alchemist" },
      C: { text: "I sleep in, feel bad, and try again tomorrow.", type: "neutral" },
      D: { text: "I feel torn — I want to keep going but can't force myself either.", type: "blurred" }
    }
  },
  {
    id: 5,
    text: "You've completed a project and it performs well. How do you feel about it?",
    answers: {
      A: { text: "If the result is strong, I'm satisfied — no need to change anything.", type: "architect" },
      B: { text: "I immediately wonder how it could have been even better.", type: "alchemist" },
      C: { text: "I feel good but uneasy — maybe I missed something important.", type: "blurred" },
      D: { text: "I can't tell if I'm happy or not — depends what others say.", type: "blurred" }
    }
  },
  {
    id: 6,
    text: "You're pursuing a goal no one else has achieved. How do you think about it?",
    answers: {
      A: { text: "I need to see a path or example — otherwise I'm not sure it's achievable.", type: "architect" },
      B: { text: "Even if no one's done it, I know it's possible — I just need the steps.", type: "alchemist" },
      C: { text: "I doubt myself, but I still try in case it works out.", type: "blurred" },
      D: { text: "I switch between confidence and confusion depending on the day.", type: "blurred" }
    }
  },

  // Q7-Q12: Awareness Block (Static for now - will be made dynamic later)
  {
    id: 7,
    text: "You're about to launch a new offer in 2 weeks. How would your opposite decide what to focus on first?",
    answers: {
      A: { text: "Identify the core bottlenecks and map out the sequence to remove them", type: "architect" },
      B: { text: "Jump between setup, content, and branding — depending on what feels most urgent", type: "blurred" },
      C: { text: "Ask others what they think should happen first and go with consensus", type: "neutral" },
      D: { text: "None of these reflect how my opposite would operate", type: "alchemist" }
    }
  },
  {
    id: 8,
    text: "A peer gives you tough feedback on your recent launch. How would your opposite respond?",
    answers: {
      A: { text: "Shrug it off publicly but internalize it deeply and avoid the peer next time", type: "blurred" },
      B: { text: "Say thank you, then try to adjust only the parts you agree with emotionally", type: "neutral" },
      C: { text: "Break down the feedback, sort it into categories, and adjust where it makes sense", type: "architect" },
      D: { text: "None of these reflect how my opposite would operate", type: "alchemist" }
    }
  },
  {
    id: 9,
    text: "You've brought on a new team member who isn't delivering as expected. How would your opposite handle it?",
    answers: {
      A: { text: "Overcompensate by taking on their tasks and quietly hoping they improve", type: "blurred" },
      B: { text: "Give vague feedback while focusing on keeping morale high", type: "neutral" },
      C: { text: "Review expectations, pinpoint where the breakdown occurred, and restructure their workflow", type: "architect" },
      D: { text: "None of these reflect how my opposite would operate", type: "alchemist" }
    }
  },
  {
    id: 10,
    text: "A long-term partnership feels exciting but unclear. How would your opposite approach the next step?",
    answers: {
      A: { text: "Wait to see how things evolve and trust it will clarify naturally", type: "neutral" },
      B: { text: "Say yes quickly, then figure it out as they go", type: "blurred" },
      C: { text: "Clarify objectives, roles, and measurable outcomes before committing", type: "architect" },
      D: { text: "None of these reflect how my opposite would operate", type: "alchemist" }
    }
  },
  {
    id: 11,
    text: "A team member keeps missing deadlines. How would your opposite handle this?",
    answers: {
      A: { text: "Set up a review system to track accountability and outline next steps", type: "architect" },
      B: { text: "Avoid confrontation and work around them instead", type: "blurred" },
      C: { text: "Assume they need more motivation and give them a pep talk", type: "neutral" },
      D: { text: "None of these reflect how my opposite would operate", type: "alchemist" }
    }
  },
  {
    id: 12,
    text: "You just wrapped a high-revenue campaign. What would your opposite focus on next?",
    answers: {
      A: { text: "Break down what worked and rebuild the system for repeatability", type: "architect" },
      B: { text: "Start planning a new direction without reviewing results", type: "blurred" },
      C: { text: "Celebrate with the team and move on instinctively", type: "neutral" },
      D: { text: "None of these reflect how my opposite would operate", type: "alchemist" }
    }
  },

  // Q13-Q18: Subtype Detection (Architect Early Entrepreneur)
  {
    id: 13,
    text: "You've just had an idea you're excited about, but you're not sure how to begin. What's your first move?",
    answers: {
      A: { text: "I outline the steps from A to Z and start mapping the tools or systems I'd need to deliver it properly.", type: "architect", subtype: "internal-analyzer" },
      B: { text: "I write down everything I'd want it to include — even if I don't know how I'll get there yet.", type: "architect", subtype: "systemised-builder" },
      C: { text: "I sketch out a basic version and start testing how it might work.", type: "architect", subtype: "ultimate-strategist" },
      D: { text: "I pause to define the real problem it solves before I do anything else.", type: "architect", subtype: "master-strategist" }
    }
  },
  {
    id: 14,
    text: "You've written a rough outline for a course or product. What do you naturally do next?",
    answers: {
      A: { text: "I check if each part connects logically and improve the structure before building anything.", type: "architect", subtype: "internal-analyzer" },
      B: { text: "I open up a tool and start creating the first few sections to see how it feels in action.", type: "architect", subtype: "systemised-builder" },
      C: { text: "I make a checklist of every component and start working through it step-by-step.", type: "architect", subtype: "ultimate-strategist" },
      D: { text: "I stop to re-question the core idea: 'Is this still the right thing to build?'", type: "architect", subtype: "master-strategist" }
    }
  },
  {
    id: 15,
    text: "You've sketched out a new service or program. A friend asks you, 'How will it work?' What do you instinctively describe first?",
    answers: {
      A: { text: "The reason I'm offering it and what kind of transformation it's built to deliver.", type: "architect", subtype: "master-strategist" },
      B: { text: "The tools, steps, and delivery flow — I explain exactly how someone would go through it.", type: "architect", subtype: "ultimate-strategist" },
      C: { text: "The logic behind the framework — why each part exists and how it links to the bigger picture.", type: "architect", subtype: "internal-analyzer" },
      D: { text: "I say, 'Let me show you'—then pull up a mock-up or system to demonstrate.", type: "architect", subtype: "systemised-builder" }
    }
  },
  {
    id: 16,
    text: "You've joined a mastermind group, and they're brainstorming ways to improve their businesses. What's your natural way of contributing?",
    answers: {
      A: { text: "I start drawing on the whiteboard — mapping steps, bottlenecks, or a better way to do things.", type: "architect", subtype: "systemised-builder" },
      B: { text: "I stay quiet until I've listened deeply, then share a clear plan or observation that changes the direction.", type: "architect", subtype: "ultimate-strategist" },
      C: { text: "I suggest ways they could simplify and scale — I'm always thinking about leverage and strategy.", type: "architect", subtype: "master-strategist" },
      D: { text: "I ask focused questions to help them think better, and naturally start outlining the structure for them.", type: "architect", subtype: "internal-analyzer" }
    }
  },
  {
    id: 17,
    text: "You've got a notebook full of business ideas. What's your natural approach to choosing which one to act on?",
    answers: {
      A: { text: "I compare them logically — which one solves the biggest problem, and which has the most potential to scale?", type: "architect", subtype: "master-strategist" },
      B: { text: "I test parts of a few ideas to see which one feels smooth to build and execute.", type: "architect", subtype: "systemised-builder" },
      C: { text: "I think about which idea has the clearest delivery process — I like knowing exactly how I'd create and deliver it.", type: "architect", subtype: "internal-analyzer" },
      D: { text: "I ask myself which idea is easiest to explain to others — if I can map it cleanly, I know I'll build it well.", type: "architect", subtype: "ultimate-strategist" }
    }
  },
  {
    id: 18,
    text: "A friend asks for help turning their business idea into something real. You agree. What's your instinctive first step?",
    answers: {
      A: { text: "I draw out a clear plan — what needs to be done, in what order, and by when.", type: "architect", subtype: "master-strategist" },
      B: { text: "I offer to help set up the first few tools or tech pieces to get things moving.", type: "architect", subtype: "systemised-builder" },
      C: { text: "I start mapping the entire process into systems — I want everything running smoothly early on.", type: "architect", subtype: "internal-analyzer" },
      D: { text: "I ask them to describe their end goal in one sentence, then figure out how to reverse-engineer it from there.", type: "architect", subtype: "ultimate-strategist" }
    }
  },

  // Q19-Q22: Validation Questions (Visionary Oracle subtype)
  {
    id: 19,
    text: "You're given a blank room and asked to design it however you like. What happens first?",
    answers: {
      A: { text: "I get excited and start moving things around to see what feels right.", type: "alchemist", subtype: "visionary-oracle" },
      B: { text: "I sketch it out first, then arrange everything to match my vision perfectly.", type: "alchemist", subtype: "magnetic-perfectionist" },
      C: { text: "I tune into the energy of the space and let that guide where things go.", type: "alchemist", subtype: "energetic-empath" },
      D: { text: "I think about the purpose of the room first, then design around that function.", type: "alchemist", subtype: "ultimate-alchemist" }
    }
  },
  {
    id: 20,
    text: "Think back to school homework. How did you usually approach it?",
    answers: {
      A: { text: "I did it in bursts — either all at once or not at all.", type: "alchemist", subtype: "visionary-oracle" },
      B: { text: "I planned it out carefully and worked through it step by step.", type: "alchemist", subtype: "magnetic-perfectionist" },
      C: { text: "I needed the right mood or environment before I could focus.", type: "alchemist", subtype: "energetic-empath" },
      D: { text: "I found ways to make it interesting or connected it to something I cared about.", type: "alchemist", subtype: "ultimate-alchemist" }
    }
  },
  {
    id: 21,
    text: "As a child, how did you organize your room or personal space?",
    answers: {
      A: { text: "I did it in one big emotional burst — the chaos would build until I had to act.", type: "alchemist", subtype: "visionary-oracle" },
      B: { text: "I made a plan or system first, then tackled it piece by piece.", type: "alchemist", subtype: "ultimate-alchemist" },
      C: { text: "I felt overwhelmed unless the mood or energy felt right.", type: "alchemist", subtype: "energetic-empath" },
      D: { text: "I cleaned while imagining how I wanted it to look when done — I needed to see it first.", type: "alchemist", subtype: "magnetic-perfectionist" }
    }
  },
  {
    id: 22,
    text: "You're learning a new skill (e.g., cooking, driving, drawing). Which learning pattern is most natural for you?",
    answers: {
      A: { text: "I research first, then repeat steps until it feels mastered.", type: "alchemist", subtype: "magnetic-perfectionist" },
      B: { text: "I learn by doing — I just start and fix mistakes as I go.", type: "alchemist", subtype: "visionary-oracle" },
      C: { text: "I learn when I feel connected to what I'm doing — if the energy's off, I can't focus.", type: "alchemist", subtype: "energetic-empath" },
      D: { text: "I see the end result in my head first, then I try to recreate it immediately.", type: "alchemist", subtype: "ultimate-alchemist" }
    }
  }
];

// Scoring logic based on user's exact rules
export const calculateDNAType = (answers: Record<number, string>): 'architect' | 'alchemist' | 'blurred' => {
  let architectScore = 0;
  let alchemistScore = 0;

  // Only count Q1-Q6 for default DNA calculation
  for (let i = 1; i <= 6; i++) {
    const answer = answers[i];
    const question = AUTHENTIC_DNA_QUESTIONS.find(q => q.id === i);
    if (question && answer) {
      const answerData = question.answers[answer as keyof typeof question.answers];
      if (answerData.type === 'architect') {
        architectScore++;
      } else if (answerData.type === 'alchemist') {
        alchemistScore++;
      }
    }
  }

  // User's exact scoring rule: 4+ = clear type, <4 either = Blurred Identity
  if (architectScore >= 4) return 'architect';
  if (alchemistScore >= 4) return 'alchemist';
  return 'blurred';
};

export const calculateSubtype = (answers: Record<number, string>, dnaType: 'architect' | 'alchemist' | 'blurred'): string => {
  const subtypeCounts: Record<string, number> = {};

  // Count subtype answers from Q13-Q22
  for (let i = 13; i <= 22; i++) {
    const answer = answers[i];
    const question = AUTHENTIC_DNA_QUESTIONS.find(q => q.id === i);
    if (question && answer) {
      const answerData = question.answers[answer as keyof typeof question.answers];
      if (answerData.subtype) {
        subtypeCounts[answerData.subtype] = (subtypeCounts[answerData.subtype] || 0) + 1;
      }
    }
  }

  // Find the most common subtype
  let maxCount = 0;
  let dominantSubtype = '';
  for (const [subtype, count] of Object.entries(subtypeCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantSubtype = subtype;
    }
  }

  // Map DNA types to their default subtypes if no clear subtype winner
  if (!dominantSubtype || maxCount === 0) {
    switch (dnaType) {
      case 'architect':
        return 'master-strategist';
      case 'alchemist':
        return 'visionary-oracle';
      case 'blurred':
        return 'overthinker';
      default:
        return 'overthinker';
    }
  }

  return dominantSubtype;
};