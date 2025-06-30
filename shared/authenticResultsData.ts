// Authentic DNA Results Data from User Documents

export interface DNAProfileData {
  defaultDNADescription: string;
  defaultMastery: number;
  loopFormat: string;
  loopDescription: string;
  snapshotLine: string;
  subtypeMastery: number;
  subtypeSnapshot: string[];
  coreIdentity: string;
  oppositeAwareness: number;
  oppositeDescription: string;
  edges: string[];
  risks: string[];
  whatYouNeed: string[];
  conclusionLine: string;
  ctaTitle: string;
  ctaText: string;
  complementarySubtype: string;
  complementaryTable: {
    whereYouStruggle: Array<{ challenge: string; theirStrength: string }>;
    whereTheyStruggle: Array<{ challenge: string; yourStrength: string }>;
  };
  finalRemark: string;
  milestones: Array<{ name: string; status: 'completed' | 'locked' }>;
}

export const AUTHENTIC_DNA_PROFILES: Record<string, DNAProfileData> = {
  // ARCHITECT SUBTYPES
  'Ultimate Architect': {
    defaultDNADescription: 'You are logic-first, clarity-led, and precision-driven. You don\'t guess — you reverse engineer. You operate through mental blueprints, not imagination. You don\'t see images you track structure. You don\'t get lost in chaos — you create containers. Your calm is structured. Your decisions are pre-modeled. When others react, you architect.',
    defaultMastery: 70,
    loopFormat: 'Thought → Emotion → Thought',
    loopDescription: 'You think first. Then you check how it *feels logically*. Then you re-validate before acting. Your actions are measured. You don\'t feel your way into clarity — you construct it. Your rhythm is intentional, economical, deliberate. You don\'t chase chaos — you engineer clean momentum.',
    snapshotLine: 'You don\'t react. You calculate. And then you build what no one else saw.',
    subtypeMastery: 50,
    subtypeSnapshot: [
      'You operate through abstract patterns, not pictures',
      'You lead with refined logic and directional command',
      'You complete through minimal friction and total clarity',
      'You move when vision aligns with systemic reality'
    ],
    coreIdentity: 'You are the master of operational patterning. Your mind doesn\'t generate images — it composes frameworks. You delegate with ease, make fast pivots without losing your frame, and optimize in silence. You don\'t need to see it — you already know how to build it. You are the system. You are the blueprint others are still trying to sketch.',
    oppositeAwareness: 60,
    oppositeDescription: 'You\'ve stopped resisting the rhythm of the Alchemist. You don\'t mirror their chaos — you containerize it. You control their emotion into your system design without losing your core. You understand that intuition can be data — and that energy can be managed through structured flow.',
    edges: [
      'High-speed pattern recognition without visualisation',
      'You bring calm clarity to complex spaces',
      'Strategic MVP execution without delays',
      'You build frameworks that scale under pressure',
      'You maintain perspective when others spiral',
      'You manage time, attention, and people with precision'
    ],
    risks: [
      'May overcalculate and miss fast windows',
      'May under-communicate due to assumed clarity',
      'May resist collaborative chaos needed in early-stage ideation',
      'You can dismiss creative chaos too early'
    ],
    whatYouNeed: [
      'Build layered systems that adapt in real-time',
      'Allow controlled chaos to shape better efficiency',
      'More trust in energetic initiators',
      'Selective collaboration with aligned Alchemists',
      'Architect from vision, not just instruction'
    ],
    conclusionLine: 'You don\'t need to move faster. You need to build stronger through strategic partnerships.',
    ctaTitle: 'Construct Without Compromise',
    ctaText: 'You\'re not here to brainstorm. You\'re here to blueprint. You don\'t need bigger ideas — you need better models. You need excellence, ownership, and aligned counterparts. Delegate decisively. Now build what others only talk about.',
    complementarySubtype: 'The Ultimate Alchemist',
    complementaryTable: {
      whereYouStruggle: [
        { challenge: 'Energetic dullness', theirStrength: 'Magnetic spark + passion' },
        { challenge: 'Under-expression', theirStrength: 'Cultural resonance + human nuance' },
        { challenge: 'Dismissed timing shifts', theirStrength: 'Rhythmic gut-checks' },
        { challenge: 'Over-stabilisation', theirStrength: 'Creative motion + emotional charge' }
      ],
      whereTheyStruggle: [
        { challenge: 'Chaotic energy', yourStrength: 'Strategic containers' },
        { challenge: 'Emotional overwhelm', yourStrength: 'Decisive simplification' },
        { challenge: 'Vision overload', yourStrength: 'Systemic distillation' },
        { challenge: 'Delayed follow-through', yourStrength: 'Phase-based execution' }
      ]
    },
    finalRemark: 'You don\'t need to adjust who you are. You need a room that aligns with your rhythm. You are The Ultimate Architect. You don\'t follow paths — you draw them. And everyone else builds inside what you once designed.',
    milestones: [
      { name: 'Pattern-based MVP execution', status: 'completed' },
      { name: 'Delegation across systems', status: 'completed' },
      { name: 'Rapid recalibration under ambiguity', status: 'completed' },
      { name: 'Emotional signal interpretation', status: 'locked' },
      { name: 'Creative collaboration integration', status: 'locked' },
      { name: 'Vision containerization mastery', status: 'locked' }
    ]
  },

  'Master Strategist': {
    defaultDNADescription: 'You lead with logic. Your mind maps possibility, calibrates outcomes, and builds scalable strategy. Your actions are structured, paced, and intentionally sequenced. You don\'t move fast — you move correctly. You prioritize clarity, frameworks, and long-range planning over emotional flux.',
    defaultMastery: 60,
    loopFormat: 'Thought → Emotion → Thought',
    loopDescription: 'You think first. Then you assess how you feel about that logic. If the logic stands — and the emotion doesn\'t destabilize it — you proceed. You seek structured growth, predictable results, and calm authority.',
    snapshotLine: 'You don\'t follow structure — you design it.',
    subtypeMastery: 30,
    subtypeSnapshot: [
      'You operate through long-range rhythm and multi-step calibration',
      'You lead with mental clarity and reverse-engineered precision',
      'You move when you\'ve mapped contingencies and validated outcomes',
      'You complete through strategy-led execution, often through others'
    ],
    coreIdentity: 'As a Master Strategist, you see five moves ahead — but you don\'t show your hand. You design from a distance, often holding space between yourself and the chaos below. Your strength is in non-reactivity. You pause, recalibrate, and act when the system is ready.',
    oppositeAwareness: 50,
    oppositeDescription: 'You\'ve begun to understand the Alchemist\'s world — the flowing, feeling, resonance-led model. You admire their creativity but can resist their lack of structure. Still, you\'ve started integrating flow within your frameworks.',
    edges: [
      'Strategic foresight',
      'Calm decision-making under pressure',
      'Systemic clarity and scalable frameworks',
      'Pattern recognition that simplifies chaos',
      'Deep respect for timing and calibration'
    ],
    risks: [
      'Avoidance of emotional confrontation',
      'Delayed action due to overplanning',
      'Isolation from team or creative partners',
      'Resistance to spontaneity'
    ],
    whatYouNeed: [
      'Begin before it\'s perfect',
      'Test ideas in smaller loops',
      'Share vision before it\'s complete',
      'Allow emotional input without restructuring the plan',
      'Build systems that grow with you, not trap you'
    ],
    conclusionLine: 'You don\'t need more steps — you need more spaciousness. Let your logic breathe.',
    ctaTitle: 'Scale with Precision',
    ctaText: 'You\'re not just here to grow — you\'re here to scale. But scale doesn\'t mean chaos. It means systems that reflect your logic and values. Start building the machine — and let it run without burning you out.',
    complementarySubtype: 'The Visionary Oracle',
    complementaryTable: {
      whereYouStruggle: [
        { challenge: 'Over-structuring', theirStrength: 'Energetic innovation & iteration' },
        { challenge: 'Emotional disconnect', theirStrength: 'Resonance and creative magnetism' },
        { challenge: 'Routine burnout', theirStrength: 'Passion, empathy, culture' },
        { challenge: 'Delayed execution', theirStrength: 'Urgency and intuitive bursts' }
      ],
      whereTheyStruggle: [
        { challenge: 'Chaos and burnout', yourStrength: 'Predictable momentum' },
        { challenge: 'Over-ideation', yourStrength: 'Strategic sequencing' },
        { challenge: 'Missed timing', yourStrength: 'Systemic planning' },
        { challenge: 'Vision overwhelm', yourStrength: 'Simplified execution' }
      ]
    },
    finalRemark: 'You don\'t need to feel everything to lead with power. You need to build your rhythm into something repeatable, teachable, and respected. You are The Master Strategist. Now go build the system only you could see.',
    milestones: [
      { name: 'Vision-to-plan translation', status: 'completed' },
      { name: 'Team-ready frameworks', status: 'completed' },
      { name: 'Operational delegation', status: 'completed' },
      { name: 'Emotionally aware leadership', status: 'locked' },
      { name: 'Scalable SOPs with soul', status: 'locked' },
      { name: 'Sustained execution without burnout', status: 'locked' }
    ]
  },

  'Systemised Builder': {
    defaultDNADescription: 'You lead with logic. Everything you do must make sense, hold weight, and feel structurally sound. You thrive in frameworks, roadmaps, and step-by-step clarity. Your productivity emerges from clear direction and a stable environment — not creative pressure.',
    defaultMastery: 60,
    loopFormat: 'Thought → Emotion → Thought',
    loopDescription: 'You move only when the path is clear — not when emotion surges. You think first. You act when the logic holds. You feel the result — only if it interrupts progress. Your loop is grounded in repeatability.',
    snapshotLine: 'You don\'t chase momentum — you build it, brick by brick.',
    subtypeMastery: 30,
    subtypeSnapshot: [
      'You operate through linear, grounded pace',
      'You lead with step-based logic and task clarity',
      'You move when the next action is known and doable',
      'You complete through consistent effort, even without motivation'
    ],
    coreIdentity: 'You are the builder behind many visible wins — but you don\'t seek the spotlight. You execute with intention, break goals into parts, and deliver again and again. Your rhythm is not glamorous — it\'s sustainable.',
    oppositeAwareness: 50,
    oppositeDescription: 'You\'re beginning to understand the Alchemist\'s emotional pacing, nonlinear ideation, and alignment-based movement. You may resist it, but also envy their flow. You integrate best when you don\'t force fluidity, but allow some in.',
    edges: [
      'Consistent follow-through',
      'Execution without burnout',
      'Clarity in chaos',
      'High-quality delivery',
      'Task breakdown and simplification',
      'Systemic support leadership'
    ],
    risks: [
      'Over-control of process',
      'Bottlenecking due to solo task-loading',
      'Resistance to flow-based collaboration',
      'Energy depletion through rigidity'
    ],
    whatYouNeed: [
      'Delegate parts of the system, not the whole',
      'Let emotion enter feedback without destabilising the task',
      'Work in rhythms, not only fixed routines',
      'Test quicker MVP loops',
      'Create permission to pause without guilt'
    ],
    conclusionLine: 'You don\'t need more tasks — you need a team that respects your pace and precision.',
    ctaTitle: 'Build Without Burnout',
    ctaText: 'Your strength is in the foundation. But growth requires room to expand. You\'re here to build something that outlives you — not exhaust you. It\'s time to release the need to hold it all alone.',
    complementarySubtype: 'The Magnetic Perfectionist',
    complementaryTable: {
      whereYouStruggle: [
        { challenge: 'Over-control of details', theirStrength: 'Energetic perfection and alignment' },
        { challenge: 'Task tunnel vision', theirStrength: 'Aesthetic and emotional elevation' },
        { challenge: 'Resistance to feedback', theirStrength: 'Intuitive refinement' },
        { challenge: 'Rigidity in collaboration', theirStrength: 'Creative flexibility' }
      ],
      whereTheyStruggle: [
        { challenge: 'Inconsistent execution', yourStrength: 'Repeatable systems' },
        { challenge: 'Emotional burnout', yourStrength: 'Grounded pace' },
        { challenge: 'Delayed action', yourStrength: 'Structural momentum' },
        { challenge: 'Unclear processes', yourStrength: 'Task breakdown and SOPs' }
      ]
    },
    finalRemark: 'You don\'t need to move faster. You need to build stronger — and let others rise with you. You are The Systemised Builder. Now go turn stability into scale.',
    milestones: [
      { name: 'Repeatable systems foundation', status: 'completed' },
      { name: 'Solo execution at scale', status: 'completed' },
      { name: 'Task delegation testing', status: 'completed' },
      { name: 'Emotional-resonance integration', status: 'locked' },
      { name: 'Team-led momentum loop', status: 'locked' },
      { name: 'Collaborative rhythm structures', status: 'locked' }
    ]
  },

  'Internal Analyzer': {
    defaultDNADescription: 'You are logic-first, clarity-led, and precision-driven. You make decisions by understanding — not guessing. If the steps don\'t make sense, you don\'t move. You don\'t "hope it works." You reverse engineer why it should.',
    defaultMastery: 80,
    loopFormat: 'Thought → Emotion → Thought',
    loopDescription: 'You think first. Then you observe how you feel. Then you run it through logic again before taking action. You aren\'t emotionally cut off — you\'re emotionally informed after clarity.',
    snapshotLine: 'You don\'t just want to get it right — you need to know why it\'s right.',
    subtypeMastery: 25,
    subtypeSnapshot: [
      'You are the deep thinker, the system optimizer, the pattern master',
      'You crave precision — but not just in action. In logic. In reasoning. In why',
      'You observe everything. You spot gaps others overlook',
      'You run simulations in your mind before the world ever sees your first move'
    ],
    coreIdentity: 'You are quiet but powerful. Reflective but exact. You bring unparalleled depth, logic, foresight, and refinement. You tighten strategies. You catch inconsistencies. People trust you not for charisma — but for clarity.',
    oppositeAwareness: 40,
    oppositeDescription: 'Alchemists confuse you — until they don\'t. You once dismissed their spontaneity as chaos… until you learned it holds truth you can\'t deduce, only feel. You now understand their energetic rhythm, even if you still question it.',
    edges: [
      'You don\'t just build — you optimize',
      'You bring unparalleled depth, logic, foresight, and refinement',
      'You tighten strategies. You catch inconsistencies',
      'You bring operational excellence, design precision, and intellectual rigour',
      'People trust you not for charisma — but for clarity',
      'When you say it\'s solid, it usually is'
    ],
    risks: [
      'You may take too long to move — waiting for perfect data',
      'You may default to isolation when overwhelmed by emotional noise',
      'You may over-perfect when something just needs shipping',
      'You may question your own voice, not because it\'s wrong — but because it hasn\'t passed every test'
    ],
    whatYouNeed: [
      'Build emotional fluency — not to become reactive, but to lead teams that don\'t think like you',
      'Partner with people who ignite clarity through feeling — not just fact',
      'Learn to ship MVPs before you\'re "ready"',
      'Remember: perfection is often built in public, not in isolation'
    ],
    conclusionLine: 'You don\'t need to become faster. You need to become more trusting — of momentum, of feedback, of others.',
    ctaTitle: 'Refine. Release. Recalibrate.',
    ctaText: 'You don\'t have to delay perfection — you can build it through rhythm.',
    complementarySubtype: 'The Magnetic Perfectionist',
    complementaryTable: {
      whereYouStruggle: [
        { challenge: 'Delayed launches', theirStrength: 'Energetic urgency and timely action' },
        { challenge: 'Over-analysis', theirStrength: 'Emotional alignment and intuitive prioritizing' },
        { challenge: 'Isolation in perfectionism', theirStrength: 'Organised rhythm and momentum' },
        { challenge: 'Cold systems', theirStrength: 'Resonant energy and emotionally-tuned goals' }
      ],
      whereTheyStruggle: [
        { challenge: 'Energetic overwhelm', yourStrength: 'Clear plans and project containers' },
        { challenge: 'Too many open loops', yourStrength: 'Completion logic and sequencing' },
        { challenge: 'Emotional bias', yourStrength: 'Thought-based decision structures' },
        { challenge: 'Chasing perfection without clarity', yourStrength: 'Strategic step-mapping and data validation' }
      ]
    },
    finalRemark: 'Your edge is your depth. Your gift is your clarity. Your power is your standard. But your next evolution isn\'t more control — it\'s more calibration. Done isn\'t failure. It\'s iteration.',
    milestones: [
      { name: 'Deep analysis mastery', status: 'completed' },
      { name: 'Pattern recognition excellence', status: 'completed' },
      { name: 'System optimization skills', status: 'completed' },
      { name: 'Emotional fluency development', status: 'locked' },
      { name: 'MVP shipping confidence', status: 'locked' },
      { name: 'Collaborative refinement', status: 'locked' }
    ]
  },

  // ALCHEMIST SUBTYPES
  'Ultimate Alchemist': {
    defaultDNADescription: 'You lead with emotion. Your first signal is feeling — not fact. Your energy guides your movement, and your rhythm defines your output. You are not slow or inconsistent — you are resonance-driven. When you\'re aligned, you move with power. When misaligned, you pause, reflect, and wait.',
    defaultMastery: 60,
    loopFormat: 'Emotion → Thought → Emotion',
    loopDescription: 'You feel, then reflect. You act only when that reflection confirms the energy is right. You don\'t rush — you calibrate. You don\'t chase — you tune.',
    snapshotLine: 'You don\'t just follow energy — you master it, systemise it, and scale it.',
    subtypeMastery: 40,
    subtypeSnapshot: [
      'You operate with rhythm and refinement',
      'You lead with both emotional depth and structural awareness',
      'You move when energy and timing align — not one without the other',
      'You complete by iterating, not burning out'
    ],
    coreIdentity: 'You are the embodiment of mastery-in-motion. You\'ve experienced every Alchemist subtype. You flow, but with protection. You create, but with constraint. You rest, but with structure. You\'ve discovered that your energy doesn\'t need to be tamed — it needs to be honored, tracked, and supported.',
    oppositeAwareness: 70,
    oppositeDescription: 'You no longer resist structure — you *build it* around your spark. Architects once felt cold — now you appreciate their container-building power. You know not to become one — but to collaborate, integrate, and design systems that hold your magic.',
    edges: [
      'Energy + logic harmony',
      'Emotional attunement *and* structural control',
      'Ability to lead intuitive teams without chaos',
      'Builds containers that scale creative genius',
      'Deep internal rhythm with flexible structure'
    ],
    risks: [
      'Returning to burnout loops when pressured',
      'Defaulting into helper mode instead of leadership',
      'Holding emotional weight for others\' chaos',
      'Forgetting your own rhythm in the name of results',
      'Trying to fix what\'s working when bored'
    ],
    whatYouNeed: [
      'Codify your rhythm — then teach it',
      'Protect your time from emotional urgency',
      'Scale only what energises you',
      'Lead with rhythm, not rescue',
      'Co-create, but don\'t carry'
    ],
    conclusionLine: 'Your brilliance is no longer fragile. Now it\'s ready to scale.',
    ctaTitle: 'Systemise Your Spark',
    ctaText: 'You\'ve built from energy. Now, build from energetic wisdom. You don\'t need someone else\'s operating manual — you *are* the manual. Create containers that move with you. Build a business that feels like breathing — not breaking.',
    complementarySubtype: 'The Ultimate Strategist',
    complementaryTable: {
      whereYouStruggle: [
        { challenge: 'Emotional burnout', theirStrength: 'Logic-based prioritisation' },
        { challenge: 'Creative overbuilding', theirStrength: 'MVP-first thinking' },
        { challenge: 'Energetic leakage', theirStrength: 'Operational clarity' },
        { challenge: 'Scaling chaos', theirStrength: 'Measurable systems' }
      ],
      whereTheyStruggle: [
        { challenge: 'Over-structuring', yourStrength: 'Energetic calibration' },
        { challenge: 'Loss of empathy', yourStrength: 'Emotional resonance' },
        { challenge: 'Stuck in mental models', yourStrength: 'Flow-based iteration' }
      ]
    },
    finalRemark: 'You don\'t need to be both. You already are the highest version of your type. But even masters need reminders. You are The Ultimate Alchemist. Now build with legacy-level flow — and teach what you once had to figure out alone.',
    milestones: [
      { name: 'Energy-led execution without burnout', status: 'completed' },
      { name: 'Flow-based systems that repeat', status: 'completed' },
      { name: 'Team rhythm calibration', status: 'completed' },
      { name: 'Boundaried co-creation', status: 'locked' },
      { name: 'Emotional recharge structures', status: 'locked' },
      { name: 'Scaling with rhythm and peace', status: 'locked' }
    ]
  },

  'Visionary Oracle': {
    defaultDNADescription: 'You lead with emotional clarity. You feel first, then think. Your actions are driven by energetic resonance, not by deadlines or pressure. Your rhythm is non-linear — you move in bursts of inspiration, not mechanical steps. Your greatest strength is your creative intuition.',
    defaultMastery: 60,
    loopFormat: 'Emotion → Thought → Emotion',
    loopDescription: 'You feel first. Then you think about that feeling. Then you act — but only if it still feels right. Your rhythm is emotional, not scheduled. You move in waves, not timelines. You are not chaotic — you are attuned.',
    snapshotLine: 'You don\'t build what exists — you channel what\'s never been seen.',
    subtypeMastery: 30,
    subtypeSnapshot: [
      'You operate in surges of insight and inspiration',
      'You lead with felt-vision and non-verbal clarity',
      'You move when energy strikes — not when the calendar says to',
      'You complete only if the final version *feels* like the vision'
    ],
    coreIdentity: 'The Visionary Oracle doesn\'t follow trends — they download them from the future. Your ideas come fast, fully formed, and breathtaking — but building them often feels like working backwards. You operate in powerful energetic bursts, sometimes creating an entire system in a day, other times stalling for weeks.',
    oppositeAwareness: 50,
    oppositeDescription: 'You\'re starting to appreciate the power of structured execution — even if you resist it. You admire clarity, consistency, and follow-through in others, but you\'re learning that imitation drains you. Integration doesn\'t mean copying — it means building containers that protect your vision.',
    edges: [
      'Wildly original visions no one else can see',
      'Rapid-fire downloads that spark entirely new systems',
      'Intuitive understanding of future customer needs',
      'Emotional resonance that makes ideas feel alive',
      'Creative magnetism that attracts collaborators'
    ],
    risks: [
      'Stalling after the idea surge fades',
      'Overwhelm from trying to build alone',
      'Emotional burnout from systems that feel restrictive',
      'Perfection paralysis if the execution doesn\'t match the vision',
      'Withdrawing when misunderstood or rushed'
    ],
    whatYouNeed: [
      'Build scaffolding for your vision, not walls',
      'Create MVPs that reflect essence, not polish',
      'Protect idea surges with buffer zones and rest',
      'Co-create with those who can simplify your sparks',
      'Build backward from resonance, not just roadmap'
    ],
    conclusionLine: 'You don\'t need more pressure — you need permission to create in your natural wave.',
    ctaTitle: 'Build the Future Without Burning Out',
    ctaText: 'Your ideas don\'t need containment — they need intelligent containers. Build systems that hold your frequency without dimming it. You\'re not meant to scale by grinding — you\'re meant to expand through alignment.',
    complementarySubtype: 'The Systemised Builder',
    complementaryTable: {
      whereYouStruggle: [
        { challenge: 'Emotional burnout', theirStrength: 'Steady, predictable execution' },
        { challenge: 'Over-ideation', theirStrength: 'MVP delivery and sequencing' },
        { challenge: 'Missed timing', theirStrength: 'Operational discipline' },
        { challenge: 'Perfection paralysis', theirStrength: 'Ship-before-perfect logic' }
      ],
      whereTheyStruggle: [
        { challenge: 'Over-structuring', yourStrength: 'Energetic innovation and iteration' },
        { challenge: 'Emotional disconnect', yourStrength: 'Resonance and creative magnetism' },
        { challenge: 'Routine burnout', yourStrength: 'Passion, empathy, and vision' }
      ]
    },
    finalRemark: 'You don\'t need to be both. You need to become the ultimate version of your DNA type — and that\'s exactly what you\'re doing. You are The Visionary Oracle. Now go finish building what only you could begin.',
    milestones: [
      { name: 'Finishing without burnout', status: 'completed' },
      { name: 'Energy-first project planning', status: 'completed' },
      { name: 'Aligned systems that mirror your rhythm', status: 'completed' },
      { name: 'Delegation without disruption', status: 'locked' },
      { name: 'Rhythmic recovery integration', status: 'locked' },
      { name: 'Protecting vision through collaboration', status: 'locked' }
    ]
  },

  'Magnetic Perfectionist': {
    defaultDNADescription: 'You lead with emotion first. Your decisions come from a felt sense of alignment — not efficiency, pressure, or logic. You don\'t rush. You don\'t cut corners. When your energy is clear, your productivity is unmatched — but if something feels off, everything stalls.',
    defaultMastery: 60,
    loopFormat: 'Emotion → Thought → Emotion',
    loopDescription: 'You feel something. Then you analyze the feeling. Then you act — only if the emotional tone still matches. Your momentum is energetic. You don\'t follow plans for the sake of completion — you follow frequency.',
    snapshotLine: 'You don\'t polish to impress — you refine until it feels right.',
    subtypeMastery: 30,
    subtypeSnapshot: [
      'You work in elegant sequences — no movement feels random',
      'You lead with emotional precision, not speed',
      'You move when the energy aligns — not just when the clock strikes',
      'You complete once something feels complete inside — not when it\'s "done" externally'
    ],
    coreIdentity: 'You see what others don\'t — the microscopic details that make an experience feel perfect. To outsiders, it looks like you\'re obsessing. But to you, every small refinement matters. You don\'t create for applause — you create for resonance.',
    oppositeAwareness: 50,
    oppositeDescription: 'You\'re learning to appreciate clean logic and fast decision-making. You admire the directness and order of the Architect style — but you resist its lack of depth. Imitating their speed doesn\'t work — it disconnects you.',
    edges: [
      'Emotional refinement that elevates everything',
      'Polished delivery that feels *felt* — not just branded',
      'Natural taste for alignment, resonance, and quality',
      'Deep awareness of energy, timing, and audience',
      'Creative authority — you don\'t copy, you calibrate'
    ],
    risks: [
      'Stalling for weeks when something isn\'t aligned',
      'Over-tweaking past the point of usefulness',
      'Hiding behind the work — afraid to show "too soon"',
      'Emotional depletion from being misunderstood',
      'Frustration when systems don\'t meet your standard'
    ],
    whatYouNeed: [
      'Build systems that respond to your energy, not suppress it',
      'Design \'done\' criteria that respect emotional clarity',
      'Learn to ship before every detail is "perfect"',
      'Set creative constraints that protect your rhythm',
      'Partner with those who thrive in fast execution'
    ],
    conclusionLine: 'You don\'t need to lower your standard — you need to ship without draining your spark.',
    ctaTitle: 'Refine Without Burnout',
    ctaText: 'You bring resonance to everything you touch — but only when you\'re not over-polishing in private. Build creative momentum without compromising beauty. Let your perfectionism serve progress — not stop it.',
    complementarySubtype: 'The Internal Analyzer',
    complementaryTable: {
      whereYouStruggle: [
        { challenge: 'Stalled delivery', theirStrength: 'Logic-based progress tracking' },
        { challenge: 'Emotional fatigue', theirStrength: 'Objective clarity and structure' },
        { challenge: 'Vision erosion', theirStrength: 'Step-by-step breakdowns' },
        { challenge: 'Decision stress', theirStrength: 'Clear frameworks and boundaries' }
      ],
      whereTheyStruggle: [
        { challenge: 'Over-logic', yourStrength: 'Emotional nuance and timing' },
        { challenge: 'Perfection detachment', yourStrength: 'Creative resonance' },
        { challenge: 'Blind to energy', yourStrength: 'Subtlety and emotional tone' }
      ]
    },
    finalRemark: 'You don\'t need to be both. You need to become the ultimate version of your DNA type — and that\'s exactly what you\'re doing. You are The Magnetic Perfectionist. Now go finish building what only you could refine.',
    milestones: [
      { name: 'Finishing without burnout', status: 'completed' },
      { name: 'Energy-first project planning', status: 'completed' },
      { name: 'Aligned systems that mirror your rhythm', status: 'completed' },
      { name: 'Delegation without disruption', status: 'locked' },
      { name: 'Rhythmic recovery integration', status: 'locked' },
      { name: 'Protecting vision through collaboration', status: 'locked' }
    ]
  },

  'Energetic Empath': {
    defaultDNADescription: 'You operate through emotion-first navigation. You feel everything — people, spaces, ideas — and that sensation is what gives you direction. Logic helps later, but it cannot lead. If the energy doesn\'t feel right, you can\'t move. You don\'t follow deadlines — you follow frequency.',
    defaultMastery: 50,
    loopFormat: 'Emotion → Thought → Emotion',
    loopDescription: 'You feel first. Then you pause to process that feeling through reflection. Then you act — but only if the energy is still intact. You\'re not indecisive — you\'re energetically attuned. Your timeline is rhythmic, not reactive.',
    snapshotLine: 'You don\'t push to progress — you feel your way forward.',
    subtypeMastery: 25,
    subtypeSnapshot: [
      'You move in energetic waves — action follows feeling',
      'You lead with resonance — not rules',
      'You move when you feel seen, heard, and safe',
      'You complete projects by pouring your frequency into them'
    ],
    coreIdentity: 'You don\'t just feel energy — you *absorb* it. You can sense what others miss. You create from vibration, not plans. But your gift comes with a cost: when the room shifts, so do you. When others project chaos, you carry it in your nervous system.',
    oppositeAwareness: 50,
    oppositeDescription: 'You\'re learning how to stand still in structure — not just move with emotion. You admire the consistency of Architects, but their pace feels cold. Still, you see how logic can help you protect your energy. You\'re not meant to become robotic — you\'re meant to *combine* resonance with containers.',
    edges: [
      'Deep intuitive intelligence',
      'Natural energetic alignment with ideas, people, timing',
      'Sensitive creation that resonates powerfully',
      'Vision that speaks to the undercurrent, not just the obvious',
      'Ability to build in harmony with invisible truths'
    ],
    risks: [
      'Taking on others\' emotional weight',
      'Stopping when overwhelmed without explanation',
      'Avoiding structure even when it could protect you',
      'Rebuilding projects based on others\' feelings',
      'Losing clarity in noisy or ungrounded environments'
    ],
    whatYouNeed: [
      'Design energy filters — not walls',
      'Build containers that move with your emotional rhythm',
      'Separate your instincts from others\' projections',
      'Name your pace — so others stop rushing you',
      'Protect your creative signal from emotional noise'
    ],
    conclusionLine: 'You don\'t need to move faster — you need to move free from interference.',
    ctaTitle: 'Protect Your Rhythm',
    ctaText: 'You weren\'t built to follow someone else\'s plan. You were designed to create in a way that mirrors your internal world. This isn\'t about softening your edge — it\'s about structuring your energy.',
    complementarySubtype: 'The Systemised Builder',
    complementaryTable: {
      whereYouStruggle: [
        { challenge: 'Energetic depletion', theirStrength: 'Consistent, grounded routines' },
        { challenge: 'Emotional chaos', theirStrength: 'Clear, predictable workflows' },
        { challenge: 'Flow paralysis', theirStrength: 'Task-based motion and delivery' },
        { challenge: 'Overwhelm in groups', theirStrength: 'Tactical order and sequence' }
      ],
      whereTheyStruggle: [
        { challenge: 'Emotional detachment', yourStrength: 'Sensory depth and connection' },
        { challenge: 'Over-mechanising work', yourStrength: 'Heartfelt creation' },
        { challenge: 'Creative coldness', yourStrength: 'Energetic presence and pulse' }
      ]
    },
    finalRemark: 'You don\'t need to be both. You need to become the ultimate version of your DNA type — and that\'s exactly what you\'re doing. You are The Energetic Empath. Now go finish building what only you could feel into form.',
    milestones: [
      { name: 'Finishing without burnout', status: 'completed' },
      { name: 'Energy-first project planning', status: 'completed' },
      { name: 'Aligned systems that mirror your rhythm', status: 'completed' },
      { name: 'Delegation without disruption', status: 'locked' },
      { name: 'Rhythmic recovery integration', status: 'locked' },
      { name: 'Protecting vision through collaboration', status: 'locked' }
    ]
  },

  // BLURRED SUBTYPES
  'Overthinker': {
    defaultDNADescription: 'Your Entrepreneurial DNA is currently blurred. You jump between thoughts and feelings without a stable rhythm. Some days you plan like an Architect, other days you move like an Alchemist — but neither feels fully safe or sustainable.',
    defaultMastery: 0,
    loopFormat: 'Disconnected',
    loopDescription: 'You override instinct with logic — and then distrust your logic. You\'re afraid of choosing wrong, so you choose nothing. You mimic other people\'s energy — but can\'t sustain it. You\'ve mastered survival. Now it\'s time to master identity.',
    snapshotLine: 'You don\'t feel clear — because you\'ve been trained to override your truth.',
    subtypeMastery: 0,
    subtypeSnapshot: [
      'You override instinct with logic — and then distrust your logic',
      'You\'re afraid of choosing wrong, so you choose nothing',
      'You mimic other people\'s energy — but can\'t sustain it',
      'You\'ve mastered survival. Now it\'s time to master identity'
    ],
    coreIdentity: 'You currently operate in Architect-like patterns — overplanning, overthinking, resisting risk. But you also show signs of buried emotional energy, reactive exhaustion, and creative surges that don\'t sustain — all Alchemist clues.',
    oppositeAwareness: 0,
    oppositeDescription: 'You\'re entering the 7-Day Identity Reset — a structured path to help you find your default DNA. This isn\'t about guessing your type. It\'s about experiencing both Architect and Alchemist rhythms — and seeing what finally feels like home.',
    edges: [
      'High adaptability',
      'Survival instincts',
      'Pattern recognition',
      'Emotional awareness'
    ],
    risks: [
      'Loop switching leads to burnout',
      'Mimicking leads to identity erosion',
      'Over-adaptation creates emotional detachment',
      'Delayed action causes missed growth and misalignment'
    ],
    whatYouNeed: [
      'Structure that clarifies, not restricts',
      'Energy that affirms, not overwhelms',
      'A safe space to try on both identities',
      'Feedback from behavior, not just feelings'
    ],
    conclusionLine: 'You don\'t need motivation. You need alignment.',
    ctaTitle: '7 Days to Default Clarity',
    ctaText: 'You\'ll receive one daily prompt and training exercise to help calibrate your identity. Track how you move, how you decide, and how you feel in both systems. You don\'t need to balance both — you need to find your true default and deepen it.',
    complementarySubtype: 'Identity Reset Required',
    complementaryTable: {
      whereYouStruggle: [
        { challenge: 'Identity confusion', theirStrength: 'Clear default patterns' },
        { challenge: 'Loop switching', theirStrength: 'Consistent rhythm' },
        { challenge: 'Adaptation fatigue', theirStrength: 'Authentic expression' }
      ],
      whereTheyStruggle: [
        { challenge: 'Fixed patterns', yourStrength: 'Adaptability' },
        { challenge: 'Resistance to change', yourStrength: 'Flexibility' }
      ]
    },
    finalRemark: 'You\'re not broken. You\'ve just been blurred. The 7-Day Identity Reset will help you find your true default DNA.',
    milestones: [
      { name: 'Identity confusion acknowledged', status: 'completed' },
      { name: 'Survival patterns recognized', status: 'completed' },
      { name: 'Reset journey initiated', status: 'completed' },
      { name: 'Architect exploration', status: 'locked' },
      { name: 'Alchemist exploration', status: 'locked' },
      { name: 'Default DNA declaration', status: 'locked' }
    ]
  },

  'Self-Forsaker': {
    defaultDNADescription: 'You\'ve likely adapted patterns that don\'t belong to you. Your core identity is still there — but it\'s fogged by overthinking, over-adapting, or emotional burnout. You were likely an origin Alchemist but somewhere along the way, you shut off that energetic truth.',
    defaultMastery: 0,
    loopFormat: 'Disconnected',
    loopDescription: 'You jump between thoughts and feelings without a stable rhythm. You now operate through strategy, logic, and control — but it feels draining. You\'ve been praised for your precision, but it\'s come at the cost of resonance.',
    snapshotLine: 'You don\'t feel clear — because you\'ve been trained to override your truth.',
    subtypeMastery: 0,
    subtypeSnapshot: [
      'You were likely an origin Alchemist',
      'But somewhere along the way, you shut off that energetic truth',
      'You now operate through strategy, logic, and control — but it feels draining',
      'You\'ve forsaken the emotional compass that once guided you'
    ],
    coreIdentity: 'You\'ve mastered logical thinking, structure, and systems — but this is an adaptation, not your energetic root. You resist intuition, messiness, and non-linear flow. You\'ve likely suppressed these traits due to fear of failure or shame.',
    oppositeAwareness: 20,
    oppositeDescription: 'This isn\'t about rejecting structure. It\'s about remembering the part of you that once moved with energy, not control. The 7-Day Identity Reset will help you reconnect with the energy you were taught to hide.',
    edges: [
      'Adapted logical systems',
      'Structural mastery',
      'Precision in execution',
      'Survival adaptation'
    ],
    risks: [
      'Emotional numbness masked as "focus"',
      'Loop suppression causing burnout or misalignment',
      'Identity disconnection despite high achievement',
      'Mimicking logic patterns without spark or soul',
      'Loss of trust in your own emotional compass'
    ],
    whatYouNeed: [
      'Permission to feel again — without guilt',
      'Safe energetic space to explore non-linear ideas',
      'Temporary release from rigid planning',
      'Calibration time in both systems',
      'Feedback not just from results, but from resonance'
    ],
    conclusionLine: 'You don\'t need more structure. You need to reconnect with the energy you were taught to hide.',
    ctaTitle: '7 Days to Default Clarity',
    ctaText: 'You\'ll receive one daily prompt and training exercise to help calibrate your identity. Track how you move, how you decide, and how you feel in both systems.',
    complementarySubtype: 'Identity Reset Required',
    complementaryTable: {
      whereYouStruggle: [
        { challenge: 'Emotional suppression', theirStrength: 'Authentic expression' },
        { challenge: 'Energy disconnection', theirStrength: 'Resonant flow' },
        { challenge: 'Forced adaptation', theirStrength: 'Natural rhythm' }
      ],
      whereTheyStruggle: [
        { challenge: 'Structural chaos', yourStrength: 'Adapted systems' },
        { challenge: 'Emotional overwhelm', yourStrength: 'Logical frameworks' }
      ]
    },
    finalRemark: 'You\'re not broken. You\'ve just been blurred. It\'s time to come home to who you\'ve always been.',
    milestones: [
      { name: 'Identity suppression acknowledged', status: 'completed' },
      { name: 'Adaptation patterns recognized', status: 'completed' },
      { name: 'Reset journey initiated', status: 'completed' },
      { name: 'Emotional reconnection', status: 'locked' },
      { name: 'Energy exploration', status: 'locked' },
      { name: 'True default discovery', status: 'locked' }
    ]
  },

  'Performer': {
    defaultDNADescription: 'You\'ve likely learned to perform instead of process, to please instead of pause. The result? You\'ve disconnected from your real rhythm to keep others engaged. You swing between external validation and internal confusion.',
    defaultMastery: 0,
    loopFormat: 'Disconnected',
    loopDescription: 'You mirror other people\'s confidence — even when you feel unsure. You choose what\'s expected — not what\'s aligned. You crave applause — but can\'t sit with silence. You move fast in public — and freeze when alone.',
    snapshotLine: 'You don\'t feel clear — because you\'ve been too busy playing a role to hear yourself.',
    subtypeMastery: 0,
    subtypeSnapshot: [
      'You mirror other people\'s confidence — even when you feel unsure',
      'You choose what\'s expected — not what\'s aligned',
      'You crave applause — but can\'t sit with silence',
      'You\'ve crafted presence — but lost permission'
    ],
    coreIdentity: 'You display Alchemist patterns — intuition, emotional pull, and creative rhythm. But they\'re often hidden beneath performance, people-pleasing, and emotional suppression. Your identity has become performative, not embodied.',
    oppositeAwareness: 30,
    oppositeDescription: 'You\'ve been praised for playing the part. But no one asked if it felt true. The 7-Day Identity Reset will help you unmask and reconnect with your true default underneath the performance.',
    edges: [
      'Performance mastery',
      'Adaptability',
      'Social awareness',
      'Creative expression'
    ],
    risks: [
      'Validation addiction replaces vision',
      'External performance drowns internal voice',
      'Emotional manipulation patterns surface under stress',
      'Burnout from sustaining inauthentic energy'
    ],
    whatYouNeed: [
      'A safe place to unmask',
      'Reconnection to your internal compass',
      'Feedback based on patterns — not people\'s praise',
      'Time alone to feel your true rhythm without performance'
    ],
    conclusionLine: 'You don\'t need to be liked. You need to feel aligned.',
    ctaTitle: '7 Days to Default Clarity',
    ctaText: 'Each day, you\'ll receive a small mission to help unlearn the performance patterns and reconnect with your internal default. Track which mode feels freeing — and which one feels like acting.',
    complementarySubtype: 'Identity Reset Required',
    complementaryTable: {
      whereYouStruggle: [
        { challenge: 'Performance addiction', theirStrength: 'Authentic expression' },
        { challenge: 'External validation', theirStrength: 'Internal compass' },
        { challenge: 'Role playing', theirStrength: 'True identity' }
      ],
      whereTheyStruggle: [
        { challenge: 'Social disconnection', yourStrength: 'Performance skills' },
        { challenge: 'Expression barriers', yourStrength: 'Creative adaptation' }
      ]
    },
    finalRemark: 'You\'re not lost. You\'ve just never had full permission to be yourself. You don\'t need to perform clarity — you need to live it.',
    milestones: [
      { name: 'Performance patterns acknowledged', status: 'completed' },
      { name: 'Validation addiction recognized', status: 'completed' },
      { name: 'Reset journey initiated', status: 'completed' },
      { name: 'Authentic expression exploration', status: 'locked' },
      { name: 'Internal compass reconnection', status: 'locked' },
      { name: 'True default embodiment', status: 'locked' }
    ]
  },

  'Self-Betrayer': {
    defaultDNADescription: 'You\'ve likely adapted patterns that don\'t belong to you. You were likely an origin Architect but over time, you lost trust in your structured thinking. Now, you chase emotional safety, even when it contradicts logic.',
    defaultMastery: 0,
    loopFormat: 'Disconnected',
    loopDescription: 'You jump between thoughts and feelings without a stable rhythm. Some days you act with logic, other days you lead with emotion — but both feel shaky. You over-justify decisions, but don\'t feel grounded in them.',
    snapshotLine: 'You don\'t feel clear — because you\'ve been trained to distrust your clarity.',
    subtypeMastery: 0,
    subtypeSnapshot: [
      'You were likely an origin Architect',
      'But over time, you lost trust in your structured thinking',
      'Now, you chase emotional safety, even when it contradicts logic',
      'You\'ve betrayed the structure that once anchored you'
    ],
    coreIdentity: 'You\'ve become emotionally attuned, expressive, and reactive — but it often lacks structure, leaving you energetically drained. You\'ve learned to suppress your logic, order, and precision. You once trusted structure — now you question even your best ideas.',
    oppositeAwareness: 20,
    oppositeDescription: 'You are not too emotional. You\'re just disconnected from the structure that once gave you strength. The 7-Day Identity Reset will help you gently re-enter into structure and rebuild your mental clarity.',
    edges: [
      'Emotional attunement',
      'Adaptive flexibility',
      'Expressive capability',
      'Sensitivity to others'
    ],
    risks: [
      'Emotional over-attachment to ideas and people',
      'Avoidance of structure due to past overwhelm',
      'Identity instability despite strong instincts',
      'Over-talking instead of structured execution',
      'Constant need for validation instead of strategic self-trust'
    ],
    whatYouNeed: [
      'Gentle re-entry into structure',
      'Clear thinking environments — not emotional noise',
      'Validation through completion, not just feelings',
      'Safe space to rebuild your mental clarity',
      'Relearning how to trust your internal blueprint'
    ],
    conclusionLine: 'You don\'t need more reassurance. You need the return of your original clarity.',
    ctaTitle: '7 Days to Default Clarity',
    ctaText: 'You\'ll receive one daily prompt and training exercise to help calibrate your identity. Track how you move, how you decide, and how you feel in both systems.',
    complementarySubtype: 'Identity Reset Required',
    complementaryTable: {
      whereYouStruggle: [
        { challenge: 'Structural avoidance', theirStrength: 'Clear frameworks' },
        { challenge: 'Emotional reactivity', theirStrength: 'Logical stability' },
        { challenge: 'Decision uncertainty', theirStrength: 'Strategic thinking' }
      ],
      whereTheyStruggle: [
        { challenge: 'Emotional disconnection', yourStrength: 'Emotional awareness' },
        { challenge: 'Rigid thinking', yourStrength: 'Adaptive flexibility' }
      ]
    },
    finalRemark: 'You\'re not broken. You\'ve just been blurred. The 7-Day Identity Reset will help you return to your original clarity.',
    milestones: [
      { name: 'Structural betrayal acknowledged', status: 'completed' },
      { name: 'Emotional overcompensation recognized', status: 'completed' },
      { name: 'Reset journey initiated', status: 'completed' },
      { name: 'Structured thinking restoration', status: 'locked' },
      { name: 'Logical clarity rebuilding', status: 'locked' },
      { name: 'Original blueprint recovery', status: 'locked' }
    ]
  }
};

// DNA Loop Descriptions
export const AUTHENTIC_DNA_LOOPS: Record<string, string> = {
  'Architect': 'You think first. Then you check how it feels logically. Then you re-validate before acting. Your actions are measured. You don\'t feel your way into clarity — you construct it. Your rhythm is intentional, economical, deliberate.',
  'Alchemist': 'You feel first. Then you think about that feeling. Then you act — but only if it still feels right. Your rhythm is emotional, not scheduled. You move in waves, not timelines. You are not chaotic — you are attuned.',
  'Blurred': 'You jump between thoughts and feelings without a stable rhythm. Some days you plan like an Architect, other days you move like an Alchemist — but neither feels fully safe or sustainable.'
};

export function getAuthenticProfileData(subtype: string): DNAProfileData | null {
  return AUTHENTIC_DNA_PROFILES[subtype] || null;
}