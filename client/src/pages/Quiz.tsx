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
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(null));
  const [, setLocation] = useLocation();

  const handleAnswer = (type: string) => {
    const updated = [...answers];
    updated[step] = type;
    setAnswers(updated);
    
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate results, ignoring skipped questions (null values)
      const validAnswers = updated.filter(answer => answer !== null);
      const architectCount = validAnswers.filter((a) => a === 'Architect').length;
      const alchemistCount = validAnswers.filter((a) => a === 'Alchemist').length;
      
      let result: string;
      if (architectCount > alchemistCount) {
        result = 'Architect';
      } else if (alchemistCount > architectCount) {
        result = 'Alchemist';
      } else {
        result = 'Blend';
      }
      
      // Store detailed results for better analysis
      const quizData = {
        result,
        architectCount,
        alchemistCount,
        totalAnswered: validAnswers.length,
        totalQuestions: questions.length,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('quizResult', JSON.stringify(quizData));
      setLocation('/quiz-result');
    }
  };

  const handleSkip = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Same calculation logic for final question skip
      const validAnswers = answers.filter(answer => answer !== null);
      const architectCount = validAnswers.filter((a) => a === 'Architect').length;
      const alchemistCount = validAnswers.filter((a) => a === 'Alchemist').length;
      
      let result: string;
      if (architectCount > alchemistCount) {
        result = 'Architect';
      } else if (alchemistCount > architectCount) {
        result = 'Alchemist';
      } else {
        result = 'Blend';
      }
      
      const quizData = {
        result,
        architectCount,
        alchemistCount,
        totalAnswered: validAnswers.length,
        totalQuestions: questions.length,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('quizResult', JSON.stringify(quizData));
      setLocation('/quiz-result');
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
        <div className="space-y-4 mb-8">
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

        {/* Skip Button */}
        <div className="text-center">
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 underline text-sm transition-colors duration-200"
          >
            Skip this question
          </button>
        </div>
      </div>
    </div>
  );
}

export function QuizResult() {
  const [, setLocation] = useLocation();
  
  // Parse the detailed quiz result data
  let quizData;
  try {
    const storedResult = localStorage.getItem('quizResult');
    if (storedResult && storedResult.startsWith('{')) {
      quizData = JSON.parse(storedResult);
    } else {
      // Fallback for old format
      quizData = {
        result: storedResult || 'Architect',
        architectCount: 0,
        alchemistCount: 0,
        totalAnswered: 0,
        totalQuestions: 10
      };
    }
  } catch (error) {
    // Fallback if parsing fails
    quizData = {
      result: 'Architect',
      architectCount: 0,
      alchemistCount: 0,
      totalAnswered: 0,
      totalQuestions: 10
    };
  }

  const { result, architectCount, alchemistCount, totalAnswered, totalQuestions } = quizData;
  
  // Define content for each result type
  const getResultContent = () => {
    switch (result) {
      case 'Architect':
        return {
          background: '#42047D',
          title: 'You\'re the Architect',
          summary: 'You lead with structure, systems, and clarity. Your superpower is strategic vision and building scalable frameworks that create predictable growth.',
          traits: [
            'Strategic thinker who loves frameworks',
            'Natural systems builder and optimizer',
            'Thrives on logic and measurable outcomes',
            'Creates scalable, repeatable processes'
          ]
        };
      case 'Alchemist':
        return {
          background: '#F6782F',
          title: 'You\'re the Alchemist',
          summary: 'You lead with energy, intuition, and connection. Your superpower is magnetic creativity and transforming businesses through emotional resonance.',
          traits: [
            'Intuitive leader who follows energy',
            'Master of transformation and connection',
            'Builds through relationships and stories',
            'Creates breakthrough moments and experiences'
          ]
        };
      case 'Blend':
        return {
          background: 'linear-gradient(135deg, #42047D 0%, #F6782F 100%)',
          title: 'You\'re a Perfect Blend',
          summary: 'You beautifully balance both the Architect and Alchemist energies. You can strategically plan while staying connected to intuition, making you a versatile and powerful leader.',
          traits: [
            'Balances strategic thinking with intuitive wisdom',
            'Builds systems while nurturing relationships',
            'Creates structure with flexibility and creativity',
            'Leads with both logic and emotional intelligence'
          ]
        };
      default:
        return {
          background: '#42047D',
          title: 'You\'re the Architect',
          summary: 'You lead with structure, systems, and clarity. Your superpower is strategic vision and building scalable frameworks that create predictable growth.',
          traits: [
            'Strategic thinker who loves frameworks',
            'Natural systems builder and optimizer',
            'Thrives on logic and measurable outcomes',
            'Creates scalable, repeatable processes'
          ]
        };
    }
  };

  const content = getResultContent();

  const handleRestart = () => {
    localStorage.removeItem('quizResult');
    setLocation('/quiz');
  };

  const handleShare = () => {
    const shareText = `I just discovered I'm ${result === 'Blend' ? 'a Perfect Blend of both' : `the ${result}`} in the Brandscaling E-DNA Test! Take the quiz to discover your scaling style.`;
    if (navigator.share) {
      navigator.share({
        title: 'My Brandscaling E-DNA Result',
        text: shareText,
        url: window.location.origin + '/quiz'
      });
    } else {
      navigator.clipboard.writeText(shareText + ' ' + window.location.origin + '/quiz');
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center text-center p-6 text-white"
      style={{ background: content.background }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {content.title}
        </h1>
        
        {/* Score Breakdown */}
        <div className="mb-6 bg-white bg-opacity-20 rounded-lg p-4 max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-2">Your Result Breakdown</h3>
          <div className="text-sm space-y-1">
            <p>Architect: {architectCount} answers</p>
            <p>Alchemist: {alchemistCount} answers</p>
            <p>Questions answered: {totalAnswered} of {totalQuestions}</p>
          </div>
        </div>
        
        <p className="mb-8 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
          {content.summary}
        </p>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Your Key Traits:</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {content.traits.map((trait, idx) => (
              <div key={idx} className="bg-white bg-opacity-20 rounded-lg p-4">
                <p className="text-lg">{trait}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setLocation('/courses')}
            className="bg-white text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Explore Learning Paths
          </button>
          
          <button
            onClick={handleShare}
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300"
          >
            Share Your Result
          </button>
          
          <button
            onClick={handleRestart}
            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
}