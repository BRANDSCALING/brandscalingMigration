// Entrepreneurial DNA Quiz Data - Enhanced System
// Based on comprehensive subtype analysis

export interface QuizQuestion {
  id: number;
  text: string;
  category: 'default_dna' | 'awareness' | 'validation';
  answers: {
    A: { text: string; type: 'architect' | 'alchemist' | 'blurred' | 'undeclared'; weight: number };
    B: { text: string; type: 'architect' | 'alchemist' | 'blurred' | 'undeclared'; weight: number };
    C: { text: string; type: 'architect' | 'alchemist' | 'blurred' | 'undeclared'; weight: number };
    D: { text: string; type: 'architect' | 'alchemist' | 'blurred' | 'undeclared'; weight: number };
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

// Enhanced 20-Question Assessment
export const ENTREPRENEURIAL_DNA_QUESTIONS: QuizQuestion[] = [
  // Q1-10: Default DNA Assessment
  {
    id: 1,
    text: "You're going away for the weekend. How do you prepare the night before?",
    category: 'default_dna',
    answers: {
      A: { text: "I mentally run through what I need and pack once — essentials are covered.", type: 'architect', weight: 1 },
      B: { text: "I write a full list, check everything off, repack a few times, still feel uneasy.", type: 'alchemist', weight: 1 },
      C: { text: "I throw things in last minute and trust it'll be fine.", type: 'blurred', weight: 1 },
      D: { text: "I pack, unpack, and get overwhelmed deciding what I even need.", type: 'undeclared', weight: 1 }
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
      D: { text: "I feel stuck about whether I should say something or not.", type: 'undeclared', weight: 1 }
    }
  },
  {
    id: 3,
    text: "You receive conflicting advice from two experts. What happens next?",
    category: 'default_dna',
    answers: {
      A: { text: "I break it down logically, cross-check, and choose based on data.", type: 'architect', weight: 1 },
      B: { text: "I filter through what aligns with my internal sense of truth and trust that.", type: 'alchemist', weight: 1 },
      C: { text: "I spiral and delay the decision trying to weigh everything.", type: 'blurred', weight: 1 },
      D: { text: "I follow the advice I emotionally prefer, even if it lacks clarity.", type: 'undeclared', weight: 1 }
    }
  },
  {
    id: 4,
    text: "You're asked to present to a room of strangers. Your immediate response?",
    category: 'default_dna',
    answers: {
      A: { text: "I prepare thoroughly, organize my thoughts, and deliver with confidence.", type: 'architect', weight: 1 },
      B: { text: "I feel the energy of the room and speak from what emerges.", type: 'alchemist', weight: 1 },
      C: { text: "I over-prepare but still feel uncertain about how it will go.", type: 'blurred', weight: 1 },
      D: { text: "I avoid it or procrastinate until the last possible moment.", type: 'undeclared', weight: 1 }
    }
  },
  {
    id: 5,
    text: "Your business partner wants to pivot strategy mid-project. How do you respond?",
    category: 'default_dna',
    answers: {
      A: { text: "I need to see the logic and data before making any changes.", type: 'architect', weight: 1 },
      B: { text: "If it feels right and aligns with our vision, I'm open to it.", type: 'alchemist', weight: 1 },
      C: { text: "I feel torn between sticking to the plan and embracing change.", type: 'blurred', weight: 1 },
      D: { text: "I defer to whatever they think is best.", type: 'undeclared', weight: 1 }
    }
  },
  {
    id: 6,
    text: "When building your team, what matters most to you?",
    category: 'default_dna',
    answers: {
      A: { text: "Skills, track record, and ability to execute systematically.", type: 'architect', weight: 1 },
      B: { text: "Energy, alignment with values, and cultural fit.", type: 'alchemist', weight: 1 },
      C: { text: "A mix of both, but I struggle to prioritize which matters more.", type: 'blurred', weight: 1 },
      D: { text: "Whoever is available and willing to help.", type: 'undeclared', weight: 1 }
    }
  },
  {
    id: 7,
    text: "You notice your productivity has dropped significantly. What's your response?",
    category: 'default_dna',
    answers: {
      A: { text: "I analyze what's changed and systematically address the root cause.", type: 'architect', weight: 1 },
      B: { text: "I check in with my energy and emotional state first.", type: 'alchemist', weight: 1 },
      C: { text: "I overthink all the possible reasons and feel stuck.", type: 'blurred', weight: 1 },
      D: { text: "I hope it passes and try to push through.", type: 'undeclared', weight: 1 }
    }
  },
  {
    id: 8,
    text: "Your ideal planning approach for a major launch is:",
    category: 'default_dna',
    answers: {
      A: { text: "Detailed timeline, clear milestones, contingency plans.", type: 'architect', weight: 1 },
      B: { text: "Vision-driven with space for creative flow and intuitive timing.", type: 'alchemist', weight: 1 },
      C: { text: "I want structure but also flexibility, which often conflicts.", type: 'blurred', weight: 1 },
      D: { text: "Whatever approach others suggest works fine.", type: 'undeclared', weight: 1 }
    }
  },
  {
    id: 9,
    text: "In high-pressure moments, you typically:",
    category: 'default_dna',
    answers: {
      A: { text: "Stay calm, focus on solutions, execute step by step.", type: 'architect', weight: 1 },
      B: { text: "Trust my instincts and adapt quickly to what feels right.", type: 'alchemist', weight: 1 },
      C: { text: "Feel overwhelmed switching between logic and emotion.", type: 'blurred', weight: 1 },
      D: { text: "Freeze or avoid making decisions until pressure passes.", type: 'undeclared', weight: 1 }
    }
  },
  {
    id: 10,
    text: "Your relationship with perfectionism is:",
    category: 'default_dna',
    answers: {
      A: { text: "I refine until it meets clear standards, then ship.", type: 'architect', weight: 1 },
      B: { text: "I perfect until it feels aligned, even if it takes longer.", type: 'alchemist', weight: 1 },
      C: { text: "I get caught between good enough and perfect.", type: 'blurred', weight: 1 },
      D: { text: "I either never finish or rush to avoid the pressure.", type: 'undeclared', weight: 1 }
    }
  },
  
  // Q11-20: Opposite Mode Awareness
  {
    id: 11,
    text: "When working with someone who operates differently than you:",
    category: 'awareness',
    answers: {
      A: { text: "I adapt my approach to complement their style.", type: 'architect', weight: 1 },
      B: { text: "I stay true to my approach but create space for theirs.", type: 'alchemist', weight: 1 },
      C: { text: "I try to blend both approaches but feel uncertain.", type: 'blurred', weight: 0.5 },
      D: { text: "I default to copying their approach.", type: 'undeclared', weight: 0.5 }
    }
  },
  {
    id: 12,
    text: "Your response to 'gut feelings' in business decisions:",
    category: 'awareness',
    answers: {
      A: { text: "I validate them with data before acting.", type: 'architect', weight: 1 },
      B: { text: "I trust them as primary guidance.", type: 'alchemist', weight: 1 },
      C: { text: "I waffle between trusting and questioning them.", type: 'blurred', weight: 0.5 },
      D: { text: "I ignore them and look for external validation.", type: 'undeclared', weight: 0.5 }
    }
  },
  {
    id: 13,
    text: "In team meetings, you typically:",
    category: 'awareness',
    answers: {
      A: { text: "Focus on outcomes and next steps.", type: 'architect', weight: 1 },
      B: { text: "Tune into energy and group dynamics.", type: 'alchemist', weight: 1 },
      C: { text: "Switch between both depending on the moment.", type: 'blurred', weight: 0.5 },
      D: { text: "Stay quiet unless directly asked.", type: 'undeclared', weight: 0.5 }
    }
  },
  {
    id: 14,
    text: "When someone challenges your ideas:",
    category: 'awareness',
    answers: {
      A: { text: "I defend with logic and evidence.", type: 'architect', weight: 1 },
      B: { text: "I check if their challenge resonates with my truth.", type: 'alchemist', weight: 1 },
      C: { text: "I doubt myself and second-guess my original idea.", type: 'blurred', weight: 0.5 },
      D: { text: "I immediately defer to their perspective.", type: 'undeclared', weight: 0.5 }
    }
  },
  {
    id: 15,
    text: "Your preferred learning style:",
    category: 'awareness',
    answers: {
      A: { text: "Structured courses, frameworks, step-by-step systems.", type: 'architect', weight: 1 },
      B: { text: "Experiential learning, mentorship, intuitive exploration.", type: 'alchemist', weight: 1 },
      C: { text: "I want both but often feel torn between approaches.", type: 'blurred', weight: 0.5 },
      D: { text: "Whatever is recommended by others.", type: 'undeclared', weight: 0.5 }
    }
  },
  {
    id: 16,
    text: "When delegating important tasks:",
    category: 'awareness',
    answers: {
      A: { text: "I provide clear instructions and check progress systematically.", type: 'architect', weight: 1 },
      B: { text: "I share the vision and trust them to find their way.", type: 'alchemist', weight: 1 },
      C: { text: "I over-explain then worry I wasn't clear enough.", type: 'blurred', weight: 0.5 },
      D: { text: "I avoid delegating important tasks.", type: 'undeclared', weight: 0.5 }
    }
  },
  {
    id: 17,
    text: "Your relationship with business metrics and data:",
    category: 'awareness',
    answers: {
      A: { text: "Essential for all decisions - I live by the numbers.", type: 'architect', weight: 1 },
      B: { text: "Important context, but feeling and intuition lead.", type: 'alchemist', weight: 1 },
      C: { text: "I want to use data but often feel overwhelmed by it.", type: 'blurred', weight: 0.5 },
      D: { text: "I avoid looking at metrics unless forced to.", type: 'undeclared', weight: 0.5 }
    }
  },
  {
    id: 18,
    text: "When your business isn't growing as expected:",
    category: 'awareness',
    answers: {
      A: { text: "I analyze systems and optimize what's not working.", type: 'architect', weight: 1 },
      B: { text: "I check my energy and alignment with the vision.", type: 'alchemist', weight: 1 },
      C: { text: "I alternate between different strategies without clarity.", type: 'blurred', weight: 0.5 },
      D: { text: "I blame external factors or bad timing.", type: 'undeclared', weight: 0.5 }
    }
  },
  {
    id: 19,
    text: "Your approach to hiring and team building:",
    category: 'awareness',
    answers: {
      A: { text: "Skill-based with clear role definitions and expectations.", type: 'architect', weight: 1 },
      B: { text: "Values-aligned with room for individual expression.", type: 'alchemist', weight: 1 },
      C: { text: "I want both but struggle to prioritize what matters most.", type: 'blurred', weight: 0.5 },
      D: { text: "I hire whoever is available and seems competent.", type: 'undeclared', weight: 0.5 }
    }
  },
  {
    id: 20,
    text: "Your long-term vision creation process:",
    category: 'awareness',
    answers: {
      A: { text: "Strategic planning with clear milestones and measurable outcomes.", type: 'architect', weight: 1 },
      B: { text: "Intuitive visioning based on feeling and possibility.", type: 'alchemist', weight: 1 },
      C: { text: "I try to combine both but often feel conflicted.", type: 'blurred', weight: 0.5 },
      D: { text: "I avoid long-term planning and focus on immediate needs.", type: 'undeclared', weight: 0.5 }
    }
  }
];

// DNA Subtypes with complete profiles
export const DNA_SUBTYPES: Record<string, DNASubtype> = {
  // ALCHEMIST SUBTYPES
  'visionary-oracle': {
    id: 'visionary-oracle',
    name: 'The Visionary Oracle',
    emoji: '🔥',
    category: 'alchemist',
    operatingLoop: 'Emotion → Thought → Emotion',
    coreIdentity: 'You don\'t guess — you know. Trends, shifts, cultural energy — you feel them ahead of the curve. You have a gift for intuiting what\'s about to matter, often before it shows up in the market. You create with emotional boldness and speak with conviction, but struggle with follow-through.',
    oppositeAwareness: 'You admire structure from afar — but up close, it feels suffocating. You crave the clarity and grounded execution of the Architect… yet resist their linear ways. You\'re learning to build rhythm without losing freedom.',
    edge: 'You spot patterns before others do. You have a sixth sense for what\'s next. You attract collaborators, clients, and community. You lead with emotion and cultural instinct.',
    risks: 'You procrastinate — waiting for the "perfect" moment. You get excited… then freeze. You avoid starting until it\'s perfect — which means you don\'t start. You burn bright… then burn out.',
    nextSteps: 'You don\'t need a new idea — you need a clear priority. Prioritize MVPs over masterpieces. Build rituals that help you start early — not rush late. Create containers that feel emotionally congruent — not sterile.',
    complement: {
      type: 'architect',
      name: 'The Systemised Builder',
      description: 'Reliable executor. Systems-first. Finisher energy.'
    }
  },
  
  'magnetic-perfectionist': {
    id: 'magnetic-perfectionist',
    name: 'The Magnetic Perfectionist',
    emoji: '🧠',
    category: 'alchemist',
    operatingLoop: 'Emotion → Thought → Emotion',
    coreIdentity: 'You\'ve evolved past chaos. You\'ve become organised in your own intuitive way — with rhythms, internal rituals, and emotional deadlines. You don\'t move fast — you move precisely. You finish not because someone told you to, but because your energy demands resolution.',
    oppositeAwareness: 'You respect systems — not because they\'re logical, but because you\'ve alchemised them into rhythm. You\'ve found a way to stay creative and consistent — not by copying Architects, but by organising your own energy.',
    edge: 'You always finish what you start — not through pressure, but precision. You protect your energy by completing before burnout. You\'ve turned perfectionism into organised momentum.',
    risks: 'You may over-own delivery and resist delegation. You rarely stop — and only rest when everything\'s perfect. You set the standard so high that you often walk alone.',
    nextSteps: 'You don\'t need to loosen your standards — you need collaborators who match your delivery frequency. Protect your internal momentum with clear recovery rituals. Stop adapting to rigid workflows; your rhythm is the system.',
    complement: {
      type: 'architect',
      name: 'The Internal Analyzer',
      description: 'Strategic refiner. Pattern-mapper. Precision over speed.'
    }
  },
  
  'energetic-empath': {
    id: 'energetic-empath',
    name: 'The Energetic Empath',
    emoji: '🌊',
    category: 'alchemist',
    operatingLoop: 'Emotion → Thought → Emotion',
    coreIdentity: 'You don\'t just read energy — you radiate it. You walk into a room and people feel better. Your aura shifts atmospheres. You\'re emotionally generous, naturally magnetic, and intuitively in tune with what others need. But you also absorb just as much as you emit.',
    oppositeAwareness: 'You feel everything — and you trust your gut above all else. You rarely see the need for logic until emotion fails you. You\'re learning to see through your own biases, to pause before reacting to energy, and to break emotional truth into clear choices.',
    edge: 'Aura. You light up rooms and shift moods. Emotional leadership. You make people feel seen, safe, and sparked. Intuition. You sense motives, friction, truth — before words are said.',
    risks: 'You over-identify with others\' energy. You bias decisions based on how someone feels — not what\'s true. You take on responsibility that isn\'t yours and burn out trying to carry everyone.',
    nextSteps: 'Strategic boundaries that separate your state from theirs. Logic translators who can simplify your world without silencing your instincts. Filters — energetic, emotional, and operational.',
    complement: {
      type: 'architect',
      name: 'The Master Strategist',
      description: 'Clear, calm, and logic-led. Protects your energy by simplifying the world.'
    }
  },
  
  'ultimate-alchemist': {
    id: 'ultimate-alchemist',
    name: 'The Ultimate Alchemist',
    emoji: '🌪️',
    category: 'alchemist',
    operatingLoop: 'Emotion → Thought → Emotion',
    coreIdentity: 'You are the fully expressed Alchemist. You carry the energy of the Visionary, the emotional insight of the Energetic Empath, the refinement of the Magnetic Perfectionist — and the clarity to wield it all with intent. You didn\'t stumble into your power. You earned it.',
    oppositeAwareness: 'You don\'t just understand the Architect — you could teach them how their own system works. You see the loops. You speak both languages. You know how they execute. And still — you don\'t try to become them.',
    edge: 'You feel what others can\'t see. You channel what others can\'t say. You move when the energy is unmistakable — not just when the calendar says go. You can command a room, heal a team, launch with fire, refine with excellence.',
    risks: 'You may over-function emotionally — carrying burdens that aren\'t yours. Your energetic extremes can tip you into overexertion or quiet shutdown if not sustained with care.',
    nextSteps: 'Let go of the pressure to build alone. Let your systems be built for you — not by you. Let your execution be supported — so your energy stays ignited. You need more space, more energetic insulation, more self-trust.',
    complement: {
      type: 'architect',
      name: 'The Ultimate Strategist',
      description: 'Silent precision, simplified clarity, master of delegation.'
    }
  },
  
  // ARCHITECT SUBTYPES
  'master-strategist': {
    id: 'master-strategist',
    name: 'The Master Strategist',
    emoji: '📊',
    category: 'architect',
    operatingLoop: 'Thought → Emotion → Thought',
    coreIdentity: 'You\'re the master planner. You don\'t just solve problems — you build scalable solutions before problems even happen. You break down the big picture into clear, tangible moves. You forecast risks. You map contingencies. Your mind works like a blueprint engine.',
    oppositeAwareness: 'You\'ve grown to respect the Alchemist — especially their ability to feel what\'s needed before logic confirms it. You no longer dismiss "vibe-based" decisions — you now filter them. You let intuitive input guide direction before applying your strategic model.',
    edge: 'You simplify the complex. You bring order to chaos, clarity to ambition, and plans to vision. You don\'t just finish things — you finish the right things. You help others feel safe — not through emotion, but through certainty.',
    risks: 'You may resist emotional input that doesn\'t have "evidence." You may delay action waiting for the path to be 100% defined. You may find it difficult to connect with people who speak in energy, not outcomes.',
    nextSteps: 'Let emotion inform the vision — even if logic builds the path. Partner with people who ignite momentum — not just measurement. Let go of the idea that you must have every step before the first move.',
    complement: {
      type: 'alchemist',
      name: 'The Energetic Empath',
      description: 'A radiant force. Alchemist absorbs the room before they enter it — and brings emotional power that transforms.'
    }
  },
  
  'systemised-builder': {
    id: 'systemised-builder',
    name: 'The Systemised Builder',
    emoji: '🧱',
    category: 'architect',
    operatingLoop: 'Thought → Emotion → Thought',
    coreIdentity: 'You are the execution layer. The operator. The finisher. Where others ideate, you implement. Where they waffle, you work. You don\'t get distracted by flashy strategies — you want to know what works and repeat it.',
    oppositeAwareness: 'You respect energy — but don\'t run on it. You value intuition — but don\'t trust it until it\'s proven. You know the Alchemist moves in waves — and it used to frustrate you. But you\'ve learned to stop asking them to be you.',
    edge: 'You show up. You get it done. You repeat what works. You fix what breaks. You don\'t quit. You bring consistency to chaos. Simplicity to complexity. Motion to stuckness. Delivery to dreams.',
    risks: 'You may over-index on action — and forget to zoom out. You might resist slowing down — even when speed creates errors. You sometimes value doing over designing — and build the wrong ladder, faster.',
    nextSteps: 'Step back before you sprint. Let someone challenge the structure — before you reinforce it. Refine your "why" — so your "how" doesn\'t become robotic. Trust the right people — and delegate with precision, not paranoia.',
    complement: {
      type: 'alchemist',
      name: 'The Visionary Oracle',
      description: 'Intuitive fire. Cultural instincts. Emotional magnetism. You bring form to their future.'
    }
  },
  
  'internal-analyzer': {
    id: 'internal-analyzer',
    name: 'The Internal Analyzer',
    emoji: '🧩',
    category: 'architect',
    operatingLoop: 'Thought → Emotion → Thought',
    coreIdentity: 'You are the deep thinker, the system optimizer, the pattern master. You crave precision — but not just in action. In logic. In reasoning. In why. You observe everything. You spot gaps others overlook. Your perfectionism is methodical.',
    oppositeAwareness: 'Alchemists confuse you — until they don\'t. You once dismissed their spontaneity as chaos… until you learned it holds truth you can\'t deduce, only feel. You\'re building emotional intelligence like a framework: with names, meanings, predictable reactions.',
    edge: 'You don\'t just build — you optimize. You bring unparalleled depth, logic, foresight, and refinement. You tighten strategies. You catch inconsistencies. When you say it\'s solid, it usually is.',
    risks: 'You may take too long to move — waiting for perfect data. You may default to isolation when overwhelmed by emotional noise. You may over-perfect when something just needs shipping.',
    nextSteps: 'Build emotional fluency — not to become reactive, but to lead teams that don\'t think like you. Learn to ship MVPs before you\'re "ready." Remember: perfection is often built in public, not in isolation.',
    complement: {
      type: 'alchemist',
      name: 'The Magnetic Perfectionist',
      description: 'Emotionally structured. Energetically aligned. Finishes what she starts — with perfection that feels right.'
    }
  },
  
  'ultimate-strategist': {
    id: 'ultimate-strategist',
    name: 'The Ultimate Strategist',
    emoji: '🧊',
    category: 'architect',
    operatingLoop: 'Thought → Emotion → Thought',
    coreIdentity: 'You are the most refined form of the Architect. You operate through crystal logic, silent clarity, and deliberate precision. You don\'t just solve — you solve for scale. You don\'t just build — you build quietly, sustainably, and flawlessly.',
    oppositeAwareness: 'You finally understand that you don\'t really understand the Alchemist — so they no longer frustrate you, but now inspire you. You\'ve learned to translate emotion into enough logic. You can read the energetic tone of a room and hold space when needed.',
    edge: 'You spot what others miss. You stay in control and calculate when others react. You think in frameworks. You move in phases. You win through long games. You are often the quietest in the room — and still the most respected.',
    risks: 'You can isolate. You can over-control. You avoid asking for help — because others rarely meet your standards. You may over-index on logic and still forget that people don\'t move on precision alone.',
    nextSteps: 'Build teams who can match your pace — or at least respect it. Learn to delegate without lowering standards. Let emotion inform your vision — not derail it. Practice finishing faster — not sloppier.',
    complement: {
      type: 'alchemist',
      name: 'The Ultimate Alchemist',
      description: 'Fire, aura, empathy, precision, magnetism — all in one. You build for scale. She ignites the future.'
    }
  },
  
  // BLURRED IDENTITY SUBTYPES
  'overthinker': {
    id: 'overthinker',
    name: 'The Overthinker',
    emoji: '🌀',
    category: 'blurred',
    operatingLoop: 'Disrupted → Thought → Emotion → Thought → Delay → Overthink → Disengage',
    coreIdentity: 'You are thoughtful, intelligent, and observant — but paralysed by indecision. You think of every angle. Every consequence. Every possible failure. You try to solve the whole puzzle before you\'ve placed the first piece.',
    oppositeAwareness: 'You\'re not confused because you lack skill. You\'re confused because you never committed to one way of operating. You absorb the world like an Alchemist — but you try to solve it like an Architect.',
    edge: 'You can see what others miss. You anticipate problems before they occur. You prepare, study, analyse, predict. You bring strategic foresight and emotional sensitivity.',
    risks: 'You freeze before decisions. You second-guess after decisions. You play both mental chess and emotional poker — but never finish the game. You delay action because you haven\'t made peace with imperfection.',
    nextSteps: 'You must choose a dominant operating system — and honour it fully. Are you emotion-first or logic-first? Pick one. Deepen it. Build awareness of the other, after you commit. Start imperfectly. Finish simply.'
  },
  
  'performer': {
    id: 'performer',
    name: 'The Performer',
    emoji: '🎭',
    category: 'blurred',
    operatingLoop: 'Performance → Validation → Emotional Overload → Doubt → Withdrawal → Reinvention',
    coreIdentity: 'You are magnetic, expressive, adaptable. You lead with charisma and read the room better than most. But your inner identity is fragmented — and you\'ve been performing "versions" of success without alignment.',
    oppositeAwareness: 'You fear being irrelevant, misunderstood, or invisible. So you shape-shift. You read the room and become what\'s needed. But when the room empties… you forget who you were before.',
    edge: 'You can sell. You can energize. You can adapt. You\'re a born connector. You understand people instantly. You can speak to any audience — and often lead them, even when you don\'t feel ready.',
    risks: 'You rely on charisma instead of clarity. You copy instead of committing. You burn energy keeping up a front — instead of building a foundation. You are exhausted not from doing too much — but from being too many.',
    nextSteps: 'Choose your true default DNA. Not what looks good. Not what sells well. What feels like home. Are you emotion-first or logic-first? Which lens creates peace — not just performance?'
  },
  
  'self-forsaker': {
    id: 'self-forsaker',
    name: 'The Self-Forsaker',
    emoji: '🕳️',
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
    risks: 'You confuse chaos for creativity. You wait for "alignment" instead of creating it. You may attract Alchemist environments that feel energising — but drain you slowly.',
    nextSteps: 'Start writing again. Mapping again. Simplifying again. Return to frameworks, flows, systems — not to control the world, but to return to you. Let your logic breathe again.'
  }
};