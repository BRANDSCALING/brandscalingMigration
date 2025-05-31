import { useState } from 'react';
import { useLocation } from 'wouter';

const questions = [
  {
    prompt: "When faced with a challenge, you prefer to:",
    options: [
      { text: "Analyze the logic and plan a system", type: "Architect" },
      { text: "Trust your gut and feel your way through", type: "Alchemist" },
    ],
  },
  {
    prompt: "You make decisions by:",
    options: [
      { text: "Mapping pros and cons", type: "Architect" },
      { text: "Following the energy and excitement", type: "Alchemist" },
    ],
  },
  {
    prompt: "Your ideal work environment is:",
    options: [
      { text: "Organized, structured, and predictable", type: "Architect" },
      { text: "Dynamic, flexible, and inspiring", type: "Alchemist" },
    ],
  },
  {
    prompt: "When building your business, you focus on:",
    options: [
      { text: "Systems, processes, and scalable frameworks", type: "Architect" },
      { text: "Relationships, creativity, and emotional connection", type: "Alchemist" },
    ],
  },
  {
    prompt: "Your communication style is:",
    options: [
      { text: "Clear, direct, and fact-based", type: "Architect" },
      { text: "Warm, expressive, and story-driven", type: "Alchemist" },
    ],
  },
  {
    prompt: "You approach problems by:",
    options: [
      { text: "Breaking them down into logical steps", type: "Architect" },
      { text: "Exploring creative solutions and possibilities", type: "Alchemist" },
    ],
  },
  {
    prompt: "Your leadership style is:",
    options: [
      { text: "Strategic and systematic", type: "Architect" },
      { text: "Inspirational and intuitive", type: "Alchemist" },
    ],
  },
  {
    prompt: "When scaling your business, you prioritize:",
    options: [
      { text: "Efficiency and optimization", type: "Architect" },
      { text: "Innovation and transformation", type: "Alchemist" },
    ],
  },
  {
    prompt: "Your ideal client outcome is:",
    options: [
      { text: "Achieving measurable, predictable results", type: "Architect" },
      { text: "Experiencing breakthrough transformations", type: "Alchemist" },
    ],
  },
  {
    prompt: "You measure success by:",
    options: [
      { text: "Concrete metrics and systematic progress", type: "Architect" },
      { text: "Impact, fulfillment, and meaningful change", type: "Alchemist" },
    ],
  },
];

export default function Quiz() {
  const [step, setStep] = useState(-1);
  const [answers, setAnswers] = useState<string[]>([]);
  const [, setLocation] = useLocation();

  const handleAnswer = (type: string) => {
    const updated = [...answers, type];
    setAnswers(updated);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const architectCount = updated.filter((a) => a === 'Architect').length;
      const alchemistCount = updated.filter((a) => a === 'Alchemist').length;
      const result = architectCount > alchemistCount ? 'Architect' : 'Alchemist';
      localStorage.setItem('quizResult', result);
      setLocation('/quiz/result');
    }
  };

  if (step === -1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Are You the Architect or the Alchemist?
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Discover your unique scaling style and how to harness it.
          </p>
          <button 
            onClick={() => setStep(0)} 
            className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  const current = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-orange-50">
      <div className="w-full max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {step + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            {current.prompt}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-4">
          {current.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option.type)}
              className="w-full py-4 px-6 text-left border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-lg bg-white hover:border-purple-300 transition-all duration-300 text-lg"
            >
              <div className="flex items-center">
                <span className="w-6 h-6 rounded-full border-2 border-gray-300 mr-4 flex-shrink-0"></span>
                {option.text}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function QuizResult() {
  const result = localStorage.getItem('quizResult') || 'Architect';
  const [, setLocation] = useLocation();
  
  const isArchitect = result === 'Architect';
  const background = isArchitect ? '#42047D' : '#F6782F';
  
  const summary = isArchitect
    ? 'You lead with structure, systems, and clarity. Your superpower is strategic vision and building scalable frameworks that create predictable growth.'
    : 'You lead with energy, intuition, and connection. Your superpower is magnetic creativity and transforming businesses through emotional resonance.';

  const traits = isArchitect
    ? [
        'Strategic thinker who loves frameworks',
        'Natural systems builder and optimizer',
        'Thrives on logic and measurable outcomes',
        'Creates scalable, repeatable processes'
      ]
    : [
        'Intuitive leader who follows energy',
        'Master of transformation and connection',
        'Builds through relationships and stories',
        'Creates breakthrough moments and experiences'
      ];

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center text-center p-6 text-white"
      style={{ background }}
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          You're the {result}
        </h1>
        
        <p className="mb-8 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto">
          {summary}
        </p>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Your Key Traits:</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {traits.map((trait, idx) => (
              <div key={idx} className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-lg">{trait}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setLocation('/courses')}
            className="bg-white text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 mr-4"
          >
            View {result} Resources
          </button>
          
          <button
            onClick={() => setLocation('/quiz')}
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
}