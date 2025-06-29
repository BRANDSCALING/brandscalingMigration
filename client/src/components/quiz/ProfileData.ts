export const PROFILE_DESCRIPTIONS = {
  // Architect Subtypes
  'Master Strategist': {
    description: "You don't follow structure — you design it.",
    longDescription: "As a Master Strategist, you see five moves ahead — but you don't show your hand. You design from a distance, often holding space between yourself and the chaos below. Your strength is in non-reactivity. You pause, recalibrate, and act when the system is ready.",
    edge: ["Strategic foresight", "Calm decision-making under pressure", "Systemic clarity and scalable frameworks", "Pattern recognition that simplifies chaos"],
    risks: ["Avoidance of emotional confrontation", "Delayed action due to overplanning", "Isolation from team or creative partners"],
    complement: "Visionary Oracle",
    icon: ""
  },
  'Systemised Builder': {
    description: "You don't chase momentum — you build it, brick by brick.",
    longDescription: "You are the builder behind many visible wins — but you don't seek the spotlight. You execute with intention, break goals into parts, and deliver again and again. Your rhythm is not glamorous — it's sustainable.",
    edge: ["Consistent follow-through", "Execution without burnout", "Clarity in chaos", "High-quality delivery"],
    risks: ["Over-control of process", "Bottlenecking due to solo task-loading", "Resistance to flow-based collaboration"],
    complement: "Magnetic Perfectionist",
    icon: ""
  },
  'Internal Analyzer': {
    description: "You don't just want to get it right — you need to know why it's right.",
    longDescription: "You are the deep thinker, the system optimizer, the pattern master. You crave precision — but not just in action. In logic. In reasoning. In why. You observe everything. You spot gaps others overlook.",
    edge: ["Unparalleled depth, logic, foresight", "Operational excellence", "Design precision", "Intellectual rigour"],
    risks: ["Taking too long to move", "Over-perfecting when something needs shipping", "Isolation when overwhelmed"],
    complement: "Magnetic Perfectionist",
    icon: ""
  },
  'Ultimate Architect': {
    description: "You don't move often — but when you do, everything moves with you.",
    longDescription: "You are the master of operational patterning. Your mind doesn't generate images — it composes frameworks. You delegate with ease, make fast pivots without losing your frame, and optimize in silence.",
    edge: ["High-speed pattern recognition", "Strategic MVP execution", "Frameworks that scale under pressure", "Calm clarity in complex spaces"],
    risks: ["May overcalculate and miss fast windows", "May under-communicate due to assumed clarity", "May resist collaborative chaos"],
    complement: "Ultimate Alchemist",
    icon: ""
  },

  // Alchemist Subtypes
  'Visionary Oracle': {
    description: "Generates visions, leads through creative breakthroughs.",
    longDescription: "Generates visions, leads through creative breakthroughs. Channels fresh perspectives, acts through inspiration. Works in energy surges, needs buffer zones for idea protection.",
    edge: ["Creative breakthrough generation", "Fresh perspective channeling", "Energy-based innovation", "Inspirational leadership"],
    risks: ["Energy surge burnout", "Idea protection challenges", "Overwhelm from building alone", "Vision-execution gap stress"],
    complement: "Systemised Builder",
    icon: "",
    milestoneTracker: {
      "Finishing without burnout": "complete",
      "Energy-first project planning": "complete", 
      "Aligned systems that mirror your rhythm": "complete",
      "Delegation without disruption": "in-progress",
      "Rhythmic recovery integration": "in-progress",
      "Protecting vision through collaboration": "in-progress"
    },
    growthMission: {
      title: "Scale Through Vision and Structure",
      text: "Your creative breakthroughs are your competitive advantage. Build sustainable systems that support your energy surges rather than drain them. Focus on creating frameworks that amplify your vision while protecting your innovative capacity."
    },
    complementaryOpposite: {
      name: "The Systemised Builder",
      whereYouStruggle: {
        "Emotional burnout": "Steady, predictable execution",
        "Over-ideation": "MVP delivery and sequencing", 
        "Missed timing": "Operational discipline",
        "Perfection paralysis": "Ship-before-perfect logic"
      },
      whereTheyStruggle: {
        "Over-structuring": "Energetic innovation and iteration",
        "Emotional disconnect": "Resonance and creative magnetism", 
        "Routine burnout": "Passion, empathy, and vision"
      }
    },
    whatYouNeedNext: [
      "Develop sustainable systems for creative breakthroughs",
      "Build energy-supporting operational frameworks", 
      "Create buffer zones to protect innovative capacity",
      "Partner with execution-focused collaborators",
      "Establish rhythm-based planning processes"
    ]
  },
  'Magnetic Perfectionist': {
    description: "You don't polish to impress — you refine until it feels right.",
    longDescription: "You see what others don't — the microscopic details that make an experience feel perfect. You don't create for applause — you create for resonance. What you ship must feel beautiful.",
    edge: ["Emotional refinement", "Polished delivery that feels felt", "Natural taste for alignment", "Creative authority"],
    risks: ["Stalling when something isn't aligned", "Over-tweaking past usefulness", "Hiding behind the work"],
    complement: "Internal Analyzer",
    icon: ""
  },
  'Energetic Empath': {
    description: "You don't push to progress — you feel your way forward.",
    longDescription: "You don't just feel energy — you absorb it. You can sense what others miss. You create from vibration, not plans. When you learn to filter — not absorb — your power becomes magnetic.",
    edge: ["Deep intuitive intelligence", "Natural energetic alignment", "Sensitive creation that resonates", "Vision that speaks to undercurrent"],
    risks: ["Taking on others' emotional weight", "Stopping when overwhelmed", "Avoiding structure", "Losing clarity in noisy environments"],
    complement: "Systemised Builder",
    icon: ""
  },
  'Ultimate Alchemist': {
    description: "You don't just follow energy — you master it, systemise it, and scale it.",
    longDescription: "You are the embodiment of mastery-in-motion. You've experienced every Alchemist subtype. You flow, but with protection. You create, but with constraint. You rest, but with structure.",
    edge: ["Energy + logic harmony", "Emotional attunement and structural control", "Ability to lead intuitive teams", "Deep internal rhythm with flexible structure"],
    risks: ["Returning to burnout loops when pressured", "Defaulting into helper mode", "Holding emotional weight for others"],
    complement: "Ultimate Architect",
    icon: ""
  },

  // Blurred Identity Subtypes
  'Overthinker': {
    description: "You don't feel clear — because you've been trained to override your truth.",
    longDescription: "You override instinct with logic — and then distrust your logic. You're afraid of choosing wrong, so you choose nothing. You mimic other people's energy — but can't sustain it.",
    edge: ["High analytical capacity", "Pattern recognition", "Adaptability"],
    risks: ["Loop switching leads to burnout", "Identity erosion", "Delayed action causes misalignment"],
    complement: "Reset Journey",
    icon: ""
  },
  'Performer': {
    description: "You don't feel clear — because you've been too busy playing a role to hear yourself.",
    longDescription: "You mirror other people's confidence — even when you feel unsure. You choose what's expected — not what's aligned. You crave applause — but can't sit with silence.",
    edge: ["Adaptability", "Social intelligence", "Performance capability"],
    risks: ["Validation addiction", "Emotional manipulation patterns", "Burnout from inauthentic energy"],
    complement: "Reset Journey",
    icon: ""
  },
  'Self-Forsaker': {
    description: "You don't feel clear — because you've been trained to override your truth.",
    longDescription: "You were likely an origin Alchemist. But somewhere along the way, you shut off that energetic truth. You now operate through strategy, logic, and control — but it feels draining.",
    edge: ["Mastered logical thinking", "Structure and systems", "High achievement capability"],
    risks: ["Emotional numbness", "Identity disconnection", "Loss of trust in emotional compass"],
    complement: "Reset Journey",
    icon: ""
  },
  'Self-Betrayer': {
    description: "You don't feel clear — because you've been trained to distrust your clarity.",
    longDescription: "You were likely an origin Architect. But over time, you lost trust in your structured thinking. Now, you chase emotional safety, even when it contradicts logic.",
    edge: ["Emotional attunement", "Expressive capability", "Reactive intelligence"],
    risks: ["Emotional over-attachment", "Avoidance of structure", "Identity instability", "Constant need for validation"],
    complement: "Reset Journey",
    icon: ""
  }
};

export const DNA_LOOP_DESCRIPTIONS = {
  'Architect': {
    format: "Thought → Emotion → Thought",
    description: "You think first. Then you check how it feels logically. Then you re-validate before acting. Your actions are measured. You don't feel your way into clarity — you construct it."
  },
  'Alchemist': {
    format: "Emotion → Thought → Emotion", 
    description: "You feel first. Then you reflect on that feeling. Then you act — only if the energy is still intact. You're not indecisive — you're energetically attuned."
  },
  'Blurred': {
    format: "Disconnected",
    description: "You jump between thoughts and feelings without a stable rhythm. Some days you plan like an Architect, other days you move like an Alchemist — but neither feels fully safe or sustainable."
  }
};