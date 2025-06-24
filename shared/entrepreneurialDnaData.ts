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

// EXACT 12-Question Assessment - NO placeholders, NO fake content
export const ENTREPRENEURIAL_DNA_QUESTIONS: QuizQuestion[] = [
  // Q1-6: Default DNA Detection Block - EXACT questions as specified
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
      A: { text: "I'll express it — maybe now, maybe later — but it will come out", type: 'alchemist', weight: 1 },
      B: { text: "I won't say anything — they'll figure it out or I'll quietly move on.", type: 'architect', weight: 1 },
      C: { text: "I react suddenly, then second-guess if I was overdramatic.", type: 'blurred', weight: 1 },
      D: { text: "I feel stuck about whether I should say something or not.", type: 'undeclared', weight: 1 }
    }
  },
  {
    id: 3,
    text: "You walk into a room full of strangers. What do you do?",
    category: 'default_dna',
    answers: {
      A: { text: "I linger around and wait for someone to notice or invite me", type: 'blurred', weight: 1 },
      B: { text: "I act on how I feel — I might blend in or suddenly become the centre of attention.", type: 'alchemist', weight: 1 },
      C: { text: "I observe quietly, scan the room, and engage when it makes sense.", type: 'architect', weight: 1 },
      D: { text: "I'm unsure how to show up — I feel pressure to act right.", type: 'undeclared', weight: 1 }
    }
  },
  {
    id: 4,
    text: "You've committed to waking up at 6am for a week. Day 3, you're exhausted. What happens?",
    category: 'default_dna',
    answers: {
      A: { text: "I feel torn — I want to keep going but can't force myself either.", type: 'undeclared', weight: 1 },
      B: { text: "I ask myself if the reason still matters — if not, I adjust without guilt.", type: 'alchemist', weight: 1 },
      C: { text: "I sleep in, feel bad, and try again tomorrow.", type: 'blurred', weight: 1 },
      D: { text: "I stick to it. Fatigue doesn't override commitment unless it's serious.", type: 'architect', weight: 1 }
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
      D: { text: "I can't tell if I'm happy or not — depends what others say.", type: 'undeclared', weight: 1 }
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
      D: { text: "I switch between confidence and confusion depending on the day.", type: 'undeclared', weight: 1 }
    }
  }
  // Q7-12 will be dynamically loaded based on user's default type
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
  'self-betrayer': {
    id: 'self-betrayer',
    name: 'The Self-Betrayer', 
    emoji: '🧩',
    category: 'blurred',
    operatingLoop: 'Abandoned Structure',
    coreIdentity: 'Origin: Architect. Abandoned structure, floats in feelings. Origin Architect who traded logic for emotional acceptance. Feels everything but lacks clarity. Needs restoration of mental frameworks.',
    oppositeAwareness: 'Low awareness - abandoned natural mode',
    edge: 'Emotional sensitivity',
    risks: 'Lack of structure, emotional overwhelm',
    nextSteps: 'Restore logical frameworks and structure'
  }
};
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