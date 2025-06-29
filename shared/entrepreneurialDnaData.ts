// User's Exact Entrepreneurial DNA Quiz Data

export interface QuizQuestion {
  id: number;
  text: string;
  category: 'default_dna' | 'awareness' | 'subtype' | 'validation';
  answers: {
    A: { text: string; type: 'architect' | 'alchemist' | 'blurred' | 'neutral'; weight: number };
    B: { text: string; type: 'architect' | 'alchemist' | 'blurred' | 'neutral'; weight: number };
    C: { text: string; type: 'architect' | 'alchemist' | 'blurred' | 'neutral'; weight: number };
    D: { text: string; type: 'architect' | 'alchemist' | 'blurred' | 'neutral'; weight: number };
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
  
  // BLOCK 2: Q7-Q12 Awareness Block (Dynamic based on Default DNA)
  {
    id: 7,
    text: "You're about to launch a new offer in 2 weeks. How would your opposite decide what to focus on first?",
    category: 'awareness',
    answers: {
      A: { text: "Identify the core bottlenecks and map out the sequence to remove them", type: 'architect', weight: 1 },
      B: { text: "Get clear on the emotional pull behind the offer so it feels exciting to build", type: 'alchemist', weight: 1 },
      C: { text: "Jump between setup, content, and branding — depending on what feels most urgent", type: 'blurred', weight: 1 },
      D: { text: "Ask others what they think should happen first and go with consensus", type: 'neutral', weight: 1 }
    }
  },
  {
    id: 8,
    text: "A peer gives you tough feedback on your recent launch. How would your opposite respond?",
    category: 'awareness',
    answers: {
      A: { text: "Break down the feedback, sort it into categories, and adjust where it makes sense", type: 'architect', weight: 1 },
      B: { text: "Reflect on whether there's emotional truth in the feedback, not just facts", type: 'alchemist', weight: 1 },
      C: { text: "Get defensive or withdraw from sharing in future launches", type: 'blurred', weight: 1 },
      D: { text: "Say thank you, then try to adjust only the parts you agree with emotionally", type: 'neutral', weight: 1 }
    }
  },
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

  // BLOCK 3: Q7-Q12 Subtype Detection - Your Authentic Questions
  {
    id: 7,
    text: "Looking at your business experience, what has been your strongest pattern?",
    category: 'subtype',
    answers: {
      A: { text: "Building and refining systems that deliver consistent results", type: 'architect', weight: 1 },
      B: { text: "Creating breakthrough innovations and inspiring teams", type: 'alchemist', weight: 1 },
      C: { text: "Making strategic decisions that positioned us ahead of competition", type: 'architect', weight: 1 },
      D: { text: "Understanding complex business dynamics and optimizing them", type: 'architect', weight: 1 }
    }
  },
  {
    id: 8,
    text: "You're leading a high-pressure project with tight deadlines. Your natural tendency is to:",
    category: 'subtype',
    answers: {
      A: { text: "Break everything into clear phases and delegate systematically", type: 'architect', weight: 1 },
      B: { text: "Rally the team around a compelling vision and keep energy high", type: 'alchemist', weight: 1 },
      C: { text: "Focus on the critical path and remove bottlenecks efficiently", type: 'architect', weight: 1 },
      D: { text: "Analyze what could go wrong and build contingencies", type: 'architect', weight: 1 }
    }
  },
  {
    id: 9,
    text: "When you think about scaling your business, what excites you most?",
    category: 'subtype',
    answers: {
      A: { text: "Building repeatable systems that work without you", type: 'architect', weight: 1 },
      B: { text: "Amplifying the positive impact on people's lives", type: 'alchemist', weight: 1 },
      C: { text: "Achieving market leadership through strategic positioning", type: 'architect', weight: 1 },
      D: { text: "Optimizing operations to maximum efficiency", type: 'architect', weight: 1 }
    }
  },
  {
    id: 10,
    text: "A major client gives you critical feedback about your service. Your first instinct is to:",
    category: 'subtype',
    answers: {
      A: { text: "Document it systematically and improve the process", type: 'architect', weight: 1 },
      B: { text: "Connect with them personally to understand the deeper need", type: 'alchemist', weight: 1 },
      C: { text: "Assess if this represents a broader strategic issue", type: 'architect', weight: 1 },
      D: { text: "Analyze the root cause and optimize the solution", type: 'architect', weight: 1 }
    }
  },
  {
    id: 11,
    text: "You're designing a new offering for your market. What drives your decisions?",
    category: 'subtype',
    answers: {
      A: { text: "How efficiently it can be delivered at scale", type: 'architect', weight: 1 },
      B: { text: "How meaningfully it serves people's transformation", type: 'alchemist', weight: 1 },
      C: { text: "How strategically it positions us in the market", type: 'architect', weight: 1 },
      D: { text: "How perfectly it solves the core problem", type: 'architect', weight: 1 }
    }
  },
  {
    id: 12,
    text: "When you reflect on your greatest business wins, what stands out?",
    category: 'subtype',
    answers: {
      A: { text: "The systems and processes we built", type: 'architect', weight: 1 },
      B: { text: "The lives and businesses we transformed", type: 'alchemist', weight: 1 },
      C: { text: "The strategic insights that drove success", type: 'architect', weight: 1 },
      D: { text: "The optimized outcomes we achieved", type: 'architect', weight: 1 }
    }
  },

  // BLOCK 4: Q13-Q18 Path Choice Questions - Your Authentic Questions
  {
    id: 13,
    text: "When you envision your ideal business environment, what feels most authentic to you?",
    category: 'pathChoice',
    answers: {
      A: { text: "A structured operation with clear systems and predictable outcomes", type: 'architect', weight: 1 },
      B: { text: "A dynamic environment where innovation and inspiration drive daily decisions", type: 'alchemist', weight: 1 },
      C: { text: "A balanced approach that adapts based on what the situation requires", type: 'neutral', weight: 1 },
      D: { text: "I'm not sure - I see value in different approaches depending on circumstances", type: 'blurred', weight: 1 }
    }
  },
  {
    id: 14,
    text: "How do you naturally approach making important business decisions?",
    category: 'pathChoice',
    answers: {
      A: { text: "I analyze data, create frameworks, and follow proven methodologies", type: 'architect', weight: 1 },
      B: { text: "I trust my intuition and consider the human impact of each choice", type: 'alchemist', weight: 1 },
      C: { text: "I combine analytical thinking with creative insights", type: 'neutral', weight: 1 },
      D: { text: "I often second-guess myself and struggle to commit to one approach", type: 'blurred', weight: 1 }
    }
  },
  {
    id: 15,
    text: "What energizes you most about entrepreneurship?",
    category: 'pathChoice',
    answers: {
      A: { text: "Building efficient systems that create consistent, scalable results", type: 'architect', weight: 1 },
      B: { text: "Transforming lives and creating meaningful impact through innovative solutions", type: 'alchemist', weight: 1 },
      C: { text: "The variety of challenges and opportunities to grow in different areas", type: 'neutral', weight: 1 },
      D: { text: "I find different aspects energizing but also overwhelming at times", type: 'blurred', weight: 1 }
    }
  },
  {
    id: 16,
    text: "When planning a new project, what's your natural starting point?",
    category: 'pathChoice',
    answers: {
      A: { text: "Define clear objectives, create detailed timelines, and establish success metrics", type: 'architect', weight: 1 },
      B: { text: "Envision the transformation it will create and let passion guide the planning", type: 'alchemist', weight: 1 },
      C: { text: "Start with the big picture, then break it down into manageable steps", type: 'neutral', weight: 1 },
      D: { text: "I often feel paralyzed by all the possibilities and struggle to begin", type: 'blurred', weight: 1 }
    }
  },
  {
    id: 17,
    text: "How do you prefer to learn and develop new business skills?",
    category: 'pathChoice',
    answers: {
      A: { text: "Through structured courses, proven frameworks, and systematic practice", type: 'architect', weight: 1 },
      B: { text: "Through experimentation, mentorship, and following my curiosity", type: 'alchemist', weight: 1 },
      C: { text: "Through a mix of formal learning and hands-on experience", type: 'neutral', weight: 1 },
      D: { text: "I start many learning paths but struggle to maintain consistent progress", type: 'blurred', weight: 1 }
    }
  },
  {
    id: 18,
    text: "What's your relationship with business planning and strategy?",
    category: 'pathChoice',
    answers: {
      A: { text: "I thrive on detailed planning and strategic frameworks that guide execution", type: 'architect', weight: 1 },
      B: { text: "I prefer flexible planning that leaves room for inspiration and pivots", type: 'alchemist', weight: 1 },
      C: { text: "I appreciate planning but stay open to adjusting based on new insights", type: 'neutral', weight: 1 },
      D: { text: "I struggle with planning - I either over-plan or wing it completely", type: 'blurred', weight: 1 }
    }
  },

  // BLOCK 5: Q19-Q22 Validation Questions - Your Authentic Questions
  {
    id: 19,
    text: "You're given a blank room and asked to design it however you want — no deadline, no instructions, just freedom. What do you naturally do first?",
    category: 'validation',
    answers: {
      A: { text: "I stand in the space and feel what it needs. Then I begin placing things intuitively.", type: 'energetic-empath', weight: 1 },
      B: { text: "I imagine the finished look instantly, then begin collecting images or pieces to match the vision.", type: 'visionary-oracle', weight: 1 },
      C: { text: "I begin sketching it out in a step-by-step plan so I don't waste energy.", type: 'ultimate-alchemist', weight: 1 },
      D: { text: "I overthink each decision and delay starting until I'm sure it'll look right.", type: 'magnetic-perfectionist', weight: 1 }
    }
  },
  {
    id: 20,
    text: "Think back to your school years. How did you usually approach a long homework assignment?",
    category: 'validation',
    answers: {
      A: { text: "I waited until inspiration hit, then worked in a creative sprint.", type: 'visionary-oracle', weight: 1 },
      B: { text: "I wrote and rewrote sections until it was perfect — even if it was last minute.", type: 'magnetic-perfectionist', weight: 1 },
      C: { text: "I mapped the sections, added energy when I felt aligned, and adjusted as I went.", type: 'ultimate-alchemist', weight: 1 },
      D: { text: "I needed to be alone, clear the space, and feel right before even beginning.", type: 'energetic-empath', weight: 1 }
    }
  },
  {
    id: 21,
    text: "When asked to clean your room or organise your space as a child, what best describes your approach?",
    category: 'validation',
    answers: {
      A: { text: "I did it in one big emotional burst — the chaos would build until I had to act.", type: 'visionary-oracle', weight: 1 },
      B: { text: "I made a plan or system first, then tackled it piece by piece.", type: 'ultimate-alchemist', weight: 1 },
      C: { text: "I felt overwhelmed unless the mood or energy felt right.", type: 'energetic-empath', weight: 1 },
      D: { text: "I cleaned while imagining how I wanted it to look when done — I needed to see it first.", type: 'magnetic-perfectionist', weight: 1 }
    }
  },
  {
    id: 22,
    text: "You're learning a new skill (e.g., cooking, driving, drawing). Which learning pattern is most natural for you?",
    category: 'validation',
    answers: {
      A: { text: "I research first, then repeat steps until it feels mastered.", type: 'magnetic-perfectionist', weight: 1 },
      B: { text: "I learn by doing — I just start and fix mistakes as I go.", type: 'visionary-oracle', weight: 1 },
      C: { text: "I learn when I feel connected to what I'm doing — if the energy's off, I can't focus.", type: 'energetic-empath', weight: 1 },
      D: { text: "I see the end result in my head first, then I try to recreate it immediately.", type: 'ultimate-alchemist', weight: 1 }
    }
  }
];

// DNA Subtypes - Using exact user specifications from attached documents
export const DNA_SUBTYPES: Record<string, DNASubtype> = {
  // ALCHEMIST SUBTYPES (Emotion → Thought → Emotion)
  'visionary-oracle': {
    id: 'visionary-oracle',
    name: 'The Visionary Oracle',
    emoji: '🔥',
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
    emoji: '🧠',
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
    emoji: '🌊',
    category: 'alchemist',
    operatingLoop: 'Emotion → Thought → Emotion',
    coreIdentity: 'Heals with energy, absorbs with intensity. Radiates energy and uplifts others. Absorbs emotional weight, has high recharge needs. Needs clear logic to counter intuitive bias.',
    oppositeAwareness: 'Medium awareness of Architect traits',
    edge: 'Energy healing, emotional uplift',
    risks: 'Emotional absorption, burnout from others\' energy',
    nextSteps: 'Develop logical frameworks to balance intuition'
  },
  'ultimate-alchemist': {
    id: 'ultimate-alchemist',
    name: 'The Ultimate Alchemist',
    emoji: '🌪️', 
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
    emoji: '🧱',
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
    emoji: '🧩',
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
    emoji: '📊',
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
    emoji: '🧊',
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
    emoji: '🌀',
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
    emoji: '🎭',
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
    emoji: '🕳️',
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
    emoji: '🧩',
    category: 'blurred',
    operatingLoop: 'Suppressed Thought → Emotion → Reaction',
    coreIdentity: 'You weren\'t born scattered — you became that way. Your original clarity got clouded. Your logic got overridden. You once trusted systems, structure, and strategy… but somewhere along the way, your need to adapt became louder than your inner compass.',
    oppositeAwareness: 'You once craved certainty. You lived by logic, made structured decisions, and needed clear paths. But somewhere along the line, your structure was questioned, rejected — or made you feel unworthy. So you shifted.',
    edge: 'You\'re emotionally attuned. You\'re present. You care. You adapt fast. You\'ve developed a level of empathy and awareness most Architects never reach.',
    risks: 'You confuse chaos for creativity. You wait for "alignment" instead of create it. You may attract Alchemist environments that feel energising — but drain you slowly.',
    nextSteps: 'Start writing again. Mapping again. Simplifying again. Return to frameworks, flows, systems — not to control the world, but to return to you. Let your logic breathe again.'
  }
};