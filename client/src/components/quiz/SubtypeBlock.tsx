import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DNAType, PathType, SubtypeType } from './QuizContainer';

interface Question {
  id: string;
  text: string;
  options: {
    text: string;
    subtype: SubtypeType;
  }[];
}

const getSubtypeQuestions = (defaultDNA: DNAType, pathChoice: PathType): Question[] => {
  if (defaultDNA === 'Architect' && pathChoice === 'Early') {
    return [
      {
        id: 'Q13',
        text: "You've just had an idea you're excited about, but you're not sure how to begin. What's your first move?",
        options: [
          { text: 'I outline the steps from A to Z and start mapping the tools or systems I\'d need to deliver it properly.', subtype: 'Internal Analyzer' },
          { text: 'I write down everything I\'d want it to include — even if I don\'t know how I\'ll get there yet.', subtype: 'Systemised Builder' },
          { text: 'I sketch out a basic version and start testing how it might work.', subtype: 'Ultimate Strategist' },
          { text: 'I pause to define the real problem it solves before I do anything else.', subtype: 'Master Strategist' }
        ]
      },
      {
        id: 'Q14',
        text: "You've written a rough outline for a course or product. What do you naturally do next?",
        options: [
          { text: 'I check if each part connects logically and improve the structure before building anything.', subtype: 'Internal Analyzer' },
          { text: 'I open up a tool and start creating the first few sections to see how it feels in action.', subtype: 'Systemised Builder' },
          { text: 'I make a checklist of every component and start working through it step-by-step.', subtype: 'Ultimate Strategist' },
          { text: 'I stop to re-question the core idea: "Is this still the right thing to build?"', subtype: 'Master Strategist' }
        ]
      },
      {
        id: 'Q15',
        text: "You've sketched out a new service or program. A friend asks you, \"How will it work?\" What do you instinctively describe first?",
        options: [
          { text: 'The reason I\'m offering it and what kind of transformation it\'s built to deliver.', subtype: 'Master Strategist' },
          { text: 'The tools, steps, and delivery flow — I explain exactly how someone would go through it.', subtype: 'Ultimate Strategist' },
          { text: 'The logic behind the framework — why each part exists and how it links to the bigger picture.', subtype: 'Internal Analyzer' },
          { text: 'I say, "Let me show you"—then pull up a mock-up or system to demonstrate.', subtype: 'Systemised Builder' }
        ]
      },
      {
        id: 'Q16',
        text: "You've joined a mastermind group, and they're brainstorming ways to improve their businesses. What's your natural way of contributing?",
        options: [
          { text: 'I start drawing on the whiteboard — mapping steps, bottlenecks, or a better way to do things.', subtype: 'Systemised Builder' },
          { text: 'I stay quiet until I\'ve listened deeply, then share a clear plan or observation that changes the direction.', subtype: 'Ultimate Strategist' },
          { text: 'I suggest ways they could simplify and scale — I\'m always thinking about leverage and strategy.', subtype: 'Master Strategist' },
          { text: 'I ask focused questions to help them think better, and naturally start outlining the structure for them.', subtype: 'Internal Analyzer' }
        ]
      },
      {
        id: 'Q17',
        text: "You've got a notebook full of business ideas. What's your natural approach to choosing which one to act on?",
        options: [
          { text: 'I compare them logically — which one solves the biggest problem, and which has the most potential to scale?', subtype: 'Master Strategist' },
          { text: 'I test parts of a few ideas to see which one feels smooth to build and execute.', subtype: 'Systemised Builder' },
          { text: 'I think about which idea has the clearest delivery process — I like knowing exactly how I\'d create and deliver it.', subtype: 'Internal Analyzer' },
          { text: 'I ask myself which idea is easiest to explain to others — if I can map it cleanly, I know I\'ll build it well.', subtype: 'Ultimate Strategist' }
        ]
      },
      {
        id: 'Q18',
        text: 'A friend asks for help turning their business idea into something real. You agree. What\'s your instinctive first step?',
        options: [
          { text: 'I draw out a clear plan — what needs to be done, in what order, and by when.', subtype: 'Master Strategist' },
          { text: 'I offer to help set up the first few tools or tech pieces to get things moving.', subtype: 'Systemised Builder' },
          { text: 'I start mapping the entire process into systems — I want everything running smoothly early on.', subtype: 'Internal Analyzer' },
          { text: 'I ask them to describe their end goal in one sentence, then figure out how to reverse-engineer it from there.', subtype: 'Ultimate Strategist' }
        ]
      }
    ];
  }

  if (defaultDNA === 'Architect' && pathChoice === 'Developed') {
    return [
      {
        id: 'Q13',
        text: "You've agreed to deliver a client project that feels bigger than expected. What's your instinctive next move?",
        options: [
          { text: 'I strip it back to the core goals and reallocate roles across my team.', subtype: 'Master Strategist' },
          { text: 'I start building the key pieces myself so I can feel it\'s moving forward.', subtype: 'Systemised Builder' },
          { text: 'I pause to break it into phases and re-evaluate each stage\'s accuracy.', subtype: 'Internal Analyzer' },
          { text: 'I quickly test a new structure, monitor reactions, and adjust the model fast.', subtype: 'Ultimate Strategist' }
        ]
      },
      {
        id: 'Q14',
        text: "You're reviewing results from a campaign that underperformed. What's your first instinct?",
        options: [
          { text: 'I look at all the small variables and start mapping out what might\'ve gone wrong.', subtype: 'Internal Analyzer' },
          { text: 'I ask my team what they noticed, assign new ownership, and refine the flow.', subtype: 'Master Strategist' },
          { text: 'I rerun one small piece to test if the structure or messaging was off.', subtype: 'Ultimate Strategist' },
          { text: 'I rebuild a cleaner version of the campaign myself, piece by piece.', subtype: 'Systemised Builder' }
        ]
      },
      {
        id: 'Q15',
        text: 'A team member misses a deadline on a key part of your system. What\'s your most likely response?',
        options: [
          { text: 'I adjust their role and rebuild parts of the system myself to prevent future gaps.', subtype: 'Systemised Builder' },
          { text: 'I pull up the process flow to see where logic or clarity broke down.', subtype: 'Internal Analyzer' },
          { text: 'I calmly walk them through the impact, then reassign responsibilities.', subtype: 'Master Strategist' },
          { text: 'I take it as a signal the structure is too dependent on individuals and begin refining for scale.', subtype: 'Ultimate Strategist' }
        ]
      },
      {
        id: 'Q16',
        text: "You've got a fast-approaching opportunity but incomplete data. What do you do?",
        options: [
          { text: 'I go ahead, test something lean, and monitor the response closely.', subtype: 'Ultimate Strategist' },
          { text: 'I pause — if I don\'t understand the model or margins, I won\'t move.', subtype: 'Internal Analyzer' },
          { text: 'I map out what I do know, fill in assumptions, and delegate execution.', subtype: 'Master Strategist' },
          { text: 'I start building the basics — I\'ll adjust as I go if needed.', subtype: 'Systemised Builder' }
        ]
      },
      {
        id: 'Q17',
        text: 'A high-performing Alchemist on your team wants more creative freedom. How do you handle it?',
        options: [
          { text: 'I listen, then clearly define boundaries — creativity is fine within a solid system.', subtype: 'Ultimate Strategist' },
          { text: 'I give them a sandbox to explore, as long as it doesn\'t break core processes.', subtype: 'Systemised Builder' },
          { text: 'I reframe their vision into milestones and assign support roles to help them execute.', subtype: 'Master Strategist' },
          { text: 'I acknowledge their strengths but bring them back to the agreed roadmap.', subtype: 'Internal Analyzer' }
        ]
      },
      {
        id: 'Q18',
        text: 'When you reflect on your business growth, what do you credit most?',
        options: [
          { text: 'Constant recalibration and simplified thinking — I stay lean and decisive.', subtype: 'Ultimate Strategist' },
          { text: 'Systems that support my pace — once something works, I build it deeper.', subtype: 'Systemised Builder' },
          { text: 'Team clarity and role trust — I scale through direction, not control.', subtype: 'Master Strategist' },
          { text: 'Knowing my numbers and fixing what doesn\'t align — it\'s all in the data.', subtype: 'Internal Analyzer' }
        ]
      }
    ];
  }

  if (defaultDNA === 'Alchemist' && pathChoice === 'Early') {
    return [
      {
        id: 'Q13',
        text: "You've just had a powerful idea for a new offer that feels exciting — but slightly overwhelming. What's the very first thing you'd naturally do?",
        options: [
          { text: 'I journal or voice-note to capture everything while the emotion is fresh.', subtype: 'Ultimate Alchemist' },
          { text: 'I open Canva, Notion, or a doc and start shaping it into something beautiful.', subtype: 'Magnetic Perfectionist' },
          { text: 'I try to explain it to someone I trust to help me see if it resonates.', subtype: 'Energetic Empath' },
          { text: 'I start refining the core problem it solves and strip away the noise.', subtype: 'Visionary Oracle' }
        ]
      },
      {
        id: 'Q14',
        text: "You've been working on your idea for a few days, and now things feel scattered or messy. What do you do next?",
        options: [
          { text: 'I stop and give myself space until I feel clear again.', subtype: 'Ultimate Alchemist' },
          { text: 'I refine the visuals, words, or layout — it needs to look right to move forward.', subtype: 'Magnetic Perfectionist' },
          { text: 'I reach out to someone and talk it through to regain emotional alignment.', subtype: 'Energetic Empath' },
          { text: 'I rebuild the plan from scratch based on what I now know works.', subtype: 'Visionary Oracle' }
        ]
      },
      {
        id: 'Q15',
        text: "You're thinking about launching something new but haven't told anyone yet. What's holding you back the most?",
        options: [
          { text: 'I worry I won\'t see it through once the emotional high fades.', subtype: 'Visionary Oracle' },
          { text: 'I\'m still perfecting the message — it needs to feel exactly right.', subtype: 'Magnetic Perfectionist' },
          { text: 'I can feel how powerful it is, but I\'m not sure others will receive it well.', subtype: 'Energetic Empath' },
          { text: 'I\'m already imagining three versions ahead and need space to ground the idea.', subtype: 'Ultimate Alchemist' }
        ]
      },
      {
        id: 'Q16',
        text: "You're refining your first product or offer. What kind of pressure do you feel most?",
        options: [
          { text: 'I feel like I have to get every detail just right before it goes out.', subtype: 'Magnetic Perfectionist' },
          { text: 'I know it works — but expressing it clearly keeps tripping me up.', subtype: 'Visionary Oracle' },
          { text: 'I keep wondering how people will feel when they see it.', subtype: 'Energetic Empath' },
          { text: 'I get excited about improvements and lose track of the simple version.', subtype: 'Ultimate Alchemist' }
        ]
      },
      {
        id: 'Q17',
        text: "You've created something you're proud of. A friend gives you feedback that surprises you. What's your first reaction?",
        options: [
          { text: 'I feel it in my body first — either expansion or contraction — before I think about it.', subtype: 'Ultimate Alchemist' },
          { text: 'I wonder if they\'re right and start mentally redesigning everything.', subtype: 'Magnetic Perfectionist' },
          { text: 'I ask them to explain more — I want to understand how they experienced it.', subtype: 'Energetic Empath' },
          { text: 'I check if their feedback aligns with the vision I\'m building toward.', subtype: 'Visionary Oracle' }
        ]
      },
      {
        id: 'Q18',
        text: "You've been building your business for a few months. What do you notice about your patterns?",
        options: [
          { text: 'I have bursts of massive momentum, then need space to integrate before the next wave.', subtype: 'Ultimate Alchemist' },
          { text: 'I keep improving things that are already good instead of focusing on what\'s next.', subtype: 'Magnetic Perfectionist' },
          { text: 'I can sense what people need but struggle to package it in a way that feels clean.', subtype: 'Energetic Empath' },
          { text: 'I see the big picture clearly but get stuck on execution details.', subtype: 'Visionary Oracle' }
        ]
      }
    ];
  }

  if (defaultDNA === 'Alchemist' && pathChoice === 'Developed') {
    return [
      {
        id: 'Q13',
        text: "You're scaling a successful program, but the magic feels lost. What's your instinctive response?",
        options: [
          { text: 'I redesign it from scratch — I\'d rather start over than deliver something that feels flat.', subtype: 'Ultimate Alchemist' },
          { text: 'I refine the language and design until it feels aligned again.', subtype: 'Magnetic Perfectionist' },
          { text: 'I personally connect with participants to understand what\'s missing.', subtype: 'Energetic Empath' },
          { text: 'I step back and ask what needs to evolve for the next version.', subtype: 'Visionary Oracle' }
        ]
      },
      {
        id: 'Q14',
        text: "A team member questions one of your creative decisions. How do you typically respond?",
        options: [
          { text: 'I pause and check — is this resistance or is there wisdom I\'m missing?', subtype: 'Ultimate Alchemist' },
          { text: 'I explain my reasoning carefully and offer to adjust if needed.', subtype: 'Magnetic Perfectionist' },
          { text: 'I invite them to share how it feels to them and what might work better.', subtype: 'Energetic Empath' },
          { text: 'I share the bigger picture and trust they\'ll understand once they see the vision.', subtype: 'Visionary Oracle' }
        ]
      },
      {
        id: 'Q15',
        text: "You're planning your next big launch. What do you find yourself focusing on most?",
        options: [
          { text: 'Whether it feels aligned and sustainable for the long term.', subtype: 'Ultimate Alchemist' },
          { text: 'Getting every detail of the experience exactly right.', subtype: 'Magnetic Perfectionist' },
          { text: 'How it will land with people and what they\'ll need from me.', subtype: 'Energetic Empath' },
          { text: 'What this represents for the future direction I\'m building.', subtype: 'Visionary Oracle' }
        ]
      },
      {
        id: 'Q16',
        text: "Your business has grown beyond what you can personally touch. How do you maintain quality?",
        options: [
          { text: 'I build in regular check-ins with myself to ensure it still feels right.', subtype: 'Ultimate Alchemist' },
          { text: 'I create detailed standards and personally train key team members.', subtype: 'Magnetic Perfectionist' },
          { text: 'I stay connected to client feedback and team energy levels.', subtype: 'Energetic Empath' },
          { text: 'I focus on hiring people who understand the vision naturally.', subtype: 'Visionary Oracle' }
        ]
      },
      {
        id: 'Q17',
        text: "Looking back at your business growth, what\'s been most challenging to navigate?",
        options: [
          { text: 'Knowing when to evolve versus when to stay consistent.', subtype: 'Ultimate Alchemist' },
          { text: 'Accepting "good enough" when I can see how to make it better.', subtype: 'Magnetic Perfectionist' },
          { text: 'Managing my energy while being available to my team and clients.', subtype: 'Energetic Empath' },
          { text: 'Communicating the vision clearly enough for others to execute.', subtype: 'Visionary Oracle' }
        ]
      },
      {
        id: 'Q18',
        text: "When you think about your business legacy, what matters most to you?",
        options: [
          { text: 'That it represented authentic evolution and made space for others to do the same.', subtype: 'Ultimate Alchemist' },
          { text: 'That it was beautifully crafted and elevated the standard in my field.', subtype: 'Magnetic Perfectionist' },
          { text: 'That it created genuine transformation and deep connection for people.', subtype: 'Energetic Empath' },
          { text: 'That it pioneered something new and inspired others to think bigger.', subtype: 'Visionary Oracle' }
        ]
      }
    ];
  }

  // Handle Blurred DNA type - these users need different questions to help clarify their type
  if (defaultDNA === 'Blurred' && pathChoice === 'Early') {
    return [
      {
        id: 'Q13',
        text: "When you have a new business idea, what's your first instinct?",
        options: [
          { text: 'I start mapping out the systems and processes needed to make it work', subtype: 'Internal Analyzer' },
          { text: 'I get excited about the vision and start sharing it with others', subtype: 'Visionary Oracle' },
          { text: 'I focus on understanding the problem deeply before building anything', subtype: 'Master Strategist' },
          { text: 'I want to start building something tangible right away', subtype: 'Systemised Builder' }
        ]
      },
      {
        id: 'Q14',
        text: "How do you prefer to make important business decisions?",
        options: [
          { text: 'I trust my gut feelings and intuitive insights', subtype: 'Visionary Oracle' },
          { text: 'I analyze all the data and create systematic frameworks', subtype: 'Internal Analyzer' },
          { text: 'I consider the strategic implications and long-term impact', subtype: 'Master Strategist' },
          { text: 'I test small experiments and build based on what works', subtype: 'Systemised Builder' }
        ]
      },
      {
        id: 'Q15',
        text: "What energizes you most about entrepreneurship?",
        options: [
          { text: 'Creating innovative solutions that didn\'t exist before', subtype: 'Visionary Oracle' },
          { text: 'Building efficient systems that scale', subtype: 'Systemised Builder' },
          { text: 'Solving complex strategic challenges', subtype: 'Master Strategist' },
          { text: 'Understanding and optimizing how everything connects', subtype: 'Internal Analyzer' }
        ]
      },
      {
        id: 'Q16',
        text: "When facing a major business challenge, you typically:",
        options: [
          { text: 'Step back and analyze the root causes systematically', subtype: 'Internal Analyzer' },
          { text: 'Look for creative, unconventional solutions', subtype: 'Visionary Oracle' },
          { text: 'Focus on the strategic repositioning needed', subtype: 'Master Strategist' },
          { text: 'Build practical solutions piece by piece', subtype: 'Systemised Builder' }
        ]
      },
      {
        id: 'Q17',
        text: "Your ideal business outcome would be:",
        options: [
          { text: 'A perfectly optimized system that runs smoothly', subtype: 'Systemised Builder' },
          { text: 'A breakthrough innovation that transforms an industry', subtype: 'Visionary Oracle' },
          { text: 'A strategically positioned company with clear competitive advantage', subtype: 'Master Strategist' },
          { text: 'A business model that makes logical sense in every aspect', subtype: 'Internal Analyzer' }
        ]
      },
      {
        id: 'Q18',
        text: "When working with others, you naturally:",
        options: [
          { text: 'Inspire them with possibilities and bigger vision', subtype: 'Visionary Oracle' },
          { text: 'Help them understand the logical structure of what we\'re building', subtype: 'Internal Analyzer' },
          { text: 'Guide them toward strategic clarity and focus', subtype: 'Master Strategist' },
          { text: 'Show them practical steps and systems to follow', subtype: 'Systemised Builder' }
        ]
      }
    ];
  }

  if (defaultDNA === 'Blurred' && pathChoice === 'Developed') {
    return [
      {
        id: 'Q13',
        text: "Looking at your business experience, what has been your strongest pattern?",
        options: [
          { text: 'Building and refining systems that deliver consistent results', subtype: 'Ultimate Strategist' },
          { text: 'Creating breakthrough innovations and inspiring teams', subtype: 'Visionary Oracle' },
          { text: 'Making strategic decisions that positioned us ahead of competition', subtype: 'Master Strategist' },
          { text: 'Understanding complex business dynamics and optimizing them', subtype: 'Internal Analyzer' }
        ]
      },
      {
        id: 'Q14',
        text: "When scaling your business, what feels most natural to you?",
        options: [
          { text: 'Designing processes and systems that others can follow', subtype: 'Systemised Builder' },
          { text: 'Maintaining the vision while empowering others to execute', subtype: 'Visionary Oracle' },
          { text: 'Strategic planning and positioning for sustainable growth', subtype: 'Master Strategist' },
          { text: 'Analyzing performance data and optimizing every component', subtype: 'Internal Analyzer' }
        ]
      },
      {
        id: 'Q15',
        text: "Your team relies on you most for:",
        options: [
          { text: 'Clear strategic direction and decision-making frameworks', subtype: 'Master Strategist' },
          { text: 'Innovative thinking and breakthrough solutions', subtype: 'Visionary Oracle' },
          { text: 'Systematic approaches and operational excellence', subtype: 'Ultimate Strategist' },
          { text: 'Deep analysis and logical problem-solving', subtype: 'Internal Analyzer' }
        ]
      },
      {
        id: 'Q16',
        text: "When you reflect on your business growth, you're most proud of:",
        options: [
          { text: 'The efficient systems and processes we\'ve built', subtype: 'Systemised Builder' },
          { text: 'The innovative solutions we\'ve created', subtype: 'Visionary Oracle' },
          { text: 'The strategic positioning we\'ve achieved', subtype: 'Master Strategist' },
          { text: 'How well we understand and optimize our business model', subtype: 'Internal Analyzer' }
        ]
      },
      {
        id: 'Q17',
        text: "In crisis situations, your natural response is to:",
        options: [
          { text: 'Analyze the situation thoroughly before taking action', subtype: 'Internal Analyzer' },
          { text: 'Find creative solutions others haven\'t considered', subtype: 'Visionary Oracle' },
          { text: 'Refocus on strategic priorities and adjust course', subtype: 'Master Strategist' },
          { text: 'Implement systematic solutions to stabilize operations', subtype: 'Ultimate Strategist' }
        ]
      },
      {
        id: 'Q18',
        text: "Your long-term vision for your business centers on:",
        options: [
          { text: 'Revolutionary impact and industry transformation', subtype: 'Visionary Oracle' },
          { text: 'Sustainable competitive advantage through strategic positioning', subtype: 'Master Strategist' },
          { text: 'Optimized operations that scale efficiently', subtype: 'Ultimate Strategist' },
          { text: 'Deep understanding and mastery of our market dynamics', subtype: 'Internal Analyzer' }
        ]
      }
    ];
  }

  // Default fallback
  return [];
};

interface Props {
  defaultDNA: DNAType;
  pathChoice: PathType;
  onComplete: (subtype: SubtypeType, progress: number) => void;
  recordAnswer: (questionId: string, answer: string) => void;
}

const SubtypeBlock: React.FC<Props> = ({ defaultDNA, pathChoice, onComplete, recordAnswer }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, SubtypeType>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const questions = getSubtypeQuestions(defaultDNA, pathChoice);

  // Add error handling for empty questions array
  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Configuration Error
        </h2>
        <p className="text-gray-600 mb-4">
          No questions found for DNA type: {defaultDNA}, Path: {pathChoice}
        </p>
        <Button onClick={() => window.location.reload()}>
          Restart Quiz
        </Button>
      </div>
    );
  }

  const handleAnswer = (option: { text: string; subtype: SubtypeType }) => {
    const questionId = questions[currentQuestion].id;
    const newAnswers = { ...answers, [questionId]: option.subtype };
    setAnswers(newAnswers);
    recordAnswer(questionId, option.text);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        const { subtype, progress } = calculateSubtype(newAnswers);
        onComplete(subtype, progress);
      }, 2000);
    }
  };

  const calculateSubtype = (answers: Record<string, SubtypeType>) => {
    const counts: Record<SubtypeType, number> = {} as Record<SubtypeType, number>;
    
    Object.values(answers).forEach(subtype => {
      counts[subtype] = (counts[subtype] || 0) + 1;
    });

    const topSubtype = Object.entries(counts).reduce((a, b) => 
      counts[a[0] as SubtypeType] > counts[b[0] as SubtypeType] ? a : b
    )[0] as SubtypeType;

    const maxCount = counts[topSubtype];
    const progress = Math.round((maxCount / questions.length) * 100);

    return { subtype: topSubtype, progress };
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isAnalyzing) {
    return (
      <CardContent className="p-12 text-center">
        <div className="mb-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Identifying your subtype…
          </h2>
          <p className="text-gray-600">Analyzing your specific entrepreneurial subtype</p>
        </div>
      </CardContent>
    );
  }

  return (
    <div className="p-8">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
          {defaultDNA} • {pathChoice === 'Early' ? 'Early-stage' : 'Developed'} Entrepreneur
        </CardTitle>
        <div className="mb-4">
          <Progress value={progress} className="w-full h-2" />
          <p className="text-sm text-gray-600 mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
            🎯 {questions[currentQuestion].text}
          </h3>
          
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full p-6 text-left justify-start hover:scale-[1.02] transition-all duration-200 hover:shadow-md"
                onClick={() => handleAnswer(option)}
              >
                <span className="text-base">{option.text}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default SubtypeBlock;