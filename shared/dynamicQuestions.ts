// Dynamic Q7-Q12 questions that change based on user's default DNA type
export const DYNAMIC_AWARENESS_QUESTIONS = {
  // For Alchemist users measuring Architect awareness
  alchemist_measuring_architect: [
    {
      id: 7,
      text: "You're preparing for something two weeks away. What do you think is the best way to plan?",
      answers: {
        A: "I map out each phase and allocate time per task.",
        B: "I build in buffers and list dependencies before I start.",
        C: "I reverse-engineer the deadline to set milestones.",
        D: "None of these reflect how I would think or act."
      }
    },
    {
      id: 8,
      text: "Someone challenges your perspective in a group conversation. What's the best way to respond?",
      answers: {
        A: "I ask questions to understand their viewpoint calmly.",
        B: "I pause and walk them through my structured reasoning.",
        C: "I respond logically, not emotionally, even if I disagree.",
        D: "None of these reflect how I would think or act."
      }
    },
    {
      id: 9,
      text: "You're working with someone who's doing things \"wrong.\" What's the best way to respond?",
      answers: {
        A: "I show them the correct system and explain why.",
        B: "I assess whether it's a training or logic gap.",
        C: "I offer structured feedback with reasoning.",
        D: "None of these reflect how I would think or act."
      }
    },
    {
      id: 10,
      text: "When pursuing a long-term goal (6–12 months), what's the best way to stay on track?",
      answers: {
        A: "Set structured checkpoints and measurable metrics.",
        B: "Track time spent vs. outcome weekly.",
        C: "Use data to adjust pace and process.",
        D: "None of these reflect how I would think or act."
      }
    },
    {
      id: 11,
      text: "You're training someone new. What's the best way to teach them?",
      answers: {
        A: "Provide written SOPs and visual aids.",
        B: "Give structured tasks with feedback loops.",
        C: "Break the learning into logical stages.",
        D: "None of these reflect how I would think or act."
      }
    },
    {
      id: 12,
      text: "When something doesn't feel right but makes sense logically — what's the best next step?",
      answers: {
        A: "Recheck data or assumptions to eliminate bias.",
        B: "Delay action until logic is fully sound.",
        C: "Trust the structure over feelings in this case.",
        D: "None of these reflect how I would think or act."
      }
    }
  ],

  // For Architect users measuring Alchemist awareness
  architect_measuring_alchemist: [
    {
      id: 7,
      text: "You're preparing for something two weeks away. What do you think is the best way to plan?",
      answers: {
        A: "I feel into what needs to happen and adjust flow daily.",
        B: "I follow inspiration but stay close to the end goal.",
        C: "I refine the plan repeatedly based on how it feels.",
        D: "None of these reflect how I would think or act."
      }
    },
    {
      id: 8,
      text: "Someone challenges your perspective in a group conversation. What's the best way to respond?",
      answers: {
        A: "I speak with passion about why it matters to me.",
        B: "I trust my intuition and share what I feel is true.",
        C: "I own my stance but allow room for emotional nuance.",
        D: "None of these reflect how I would think or act."
      }
    },
    {
      id: 9,
      text: "You're working with someone who's doing things \"wrong.\" What's the best way to respond?",
      answers: {
        A: "I consider their approach before jumping in.",
        B: "I tune into the dynamic and adapt emotionally.",
        C: "If I care, I may just do it myself — out of frustration or love.",
        D: "None of these reflect how I would think or act."
      }
    },
    {
      id: 10,
      text: "When pursuing a long-term goal (6–12 months), what's the best way to stay on track?",
      answers: {
        A: "Tap into emotional momentum to keep going.",
        B: "Build inspiration and energy into the journey.",
        C: "Use vision boards, journaling, or feeling-based check-ins.",
        D: "None of these reflect how I would think or act."
      }
    },
    {
      id: 11,
      text: "You're training someone new. What's the best way to teach them?",
      answers: {
        A: "Guide them through the why behind the work.",
        B: "Adjust based on their energy and confidence.",
        C: "Let them learn by feeling through it, not just logic.",
        D: "None of these reflect how I would think or act."
      }
    },
    {
      id: 12,
      text: "When something doesn't feel right but makes sense logically — what's the best next step?",
      answers: {
        A: "Pause and reflect on what the resistance means.",
        B: "Trust that discomfort may signal misalignment.",
        C: "Explore intuition to uncover what's missing.",
        D: "None of these reflect how I would think or act."
      }
    }
  ],

  // For Blurred users: Q7-9 measure Architect awareness, Q10-12 measure Alchemist awareness
  blurred_mixed: [
    {
      id: 7,
      text: "You're preparing for something two weeks away. What do you think is the best way to plan?",
      answers: {
        A: "I map out each phase and allocate time per task.",
        B: "I build in buffers and list dependencies before I start.",
        C: "I reverse-engineer the deadline to set milestones.",
        D: "None of these reflect how I would think or act."
      }
    },
    {
      id: 8,
      text: "Someone challenges your perspective in a group conversation. What's the best way to respond?",
      answers: {
        A: "I ask questions to understand their viewpoint calmly.",
        B: "I pause and walk them through my structured reasoning.",
        C: "I respond logically, not emotionally, even if I disagree.",
        D: "None of these reflect how I would think or act."
      }
    },
    {
      id: 9,
      text: "You're working with someone who's doing things \"wrong.\" What's the best way to respond?",
      answers: {
        A: "I show them the correct system and explain why.",
        B: "I assess whether it's a training or logic gap.",
        C: "I offer structured feedback with reasoning.",
        D: "None of these reflect how I would think or act."
      }
    },
    {
      id: 10,
      text: "When pursuing a long-term goal (6–12 months), what's the best way to stay on track?",
      answers: {
        A: "Tap into emotional momentum to keep going.",
        B: "Build inspiration and energy into the journey.",
        C: "Use vision boards, journaling, or feeling-based check-ins.",
        D: "None of these reflect how I would think or act."
      }
    },
    {
      id: 11,
      text: "You're training someone new. What's the best way to teach them?",
      answers: {
        A: "Guide them through the why behind the work.",
        B: "Adjust based on their energy and confidence.",
        C: "Let them learn by feeling through it, not just logic.",
        D: "None of these reflect how I would think or act."
      }
    },
    {
      id: 12,
      text: "When something doesn't feel right but makes sense logically — what's the best next step?",
      answers: {
        A: "Pause and reflect on what the resistance means.",
        B: "Trust that discomfort may signal misalignment.",
        C: "Explore intuition to uncover what's missing.",
        D: "None of these reflect how I would think or act."
      }
    }
  ]
};