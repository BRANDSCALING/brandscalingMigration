import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import BrandPhilosophy from "@/components/BrandPhilosophy";
import Avatars from "@/components/Avatars";
import QuizCTA from "@/components/QuizCTA";
import CoursesPreview from "@/components/CoursesPreview";
import AIAgents from "@/components/AIAgents";
import BrandPillars from "@/components/BrandPillars";
import ReflectionQuotes from "@/components/ReflectionQuotes";
import FinalCTA from "@/components/FinalCTA";
import BrandscalingAgents from "@/components/BrandscalingAgents";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      
      <main className="font-poppins text-brand-gray">
        <Hero 
          title="Welcome to The Brandscaling Platform"
          subtitle="Scale smarter. Align deeper. Build what your strategy and energy agree on."
          cta1="Reveal Your Entrepreneurial DNA"
          cta2="Explore Our Courses"
          backgroundStyle="split-architect-alchemist"
        />

        <BrandPhilosophy
          heading="Why Scaling Should Start With Understanding Your DNA, Not Process."
          paragraph="You've followed frameworks, joined programs, hired experts. But they weren't built for how you actually think. Brandscaling flips the model. We teach through your DNA - your operating system - Architect or Alchemist - then map systems, automation, and team structures around it."
          visualType="clarity-to-scale-diagram"
        />

        <Avatars 
          title="If You've Felt This, You're Home."
          avatars={[
            {
              icon: "💡",
              title: "Idea-Stuck Dreamer",
              headline: "It's all in your head - but nowhere in motion.",
              description: "You've stayed up at night with ideas that feel world-changing but never been able to execute them."
            },
            {
              icon: "🔧",
              title: "Framework-Frustrated",
              headline: "You followed the blueprints. It didn't match your DNA.",
              description: "You've tried the proven methods. Burnout followed. Maybe the frameworks weren't built for your type."
            },
            {
              icon: "🔁",
              title: "Mastermind Graduate",
              headline: "The rooms that once grew you now shrink you.",
              description: "You're thinking bigger than your peers now. You've outgrown the space - but don't want to stagnate."
            },
            {
              icon: "⚖️",
              title: "Successful-but-Stuck",
              headline: "The wins are real. The next move isn't.",
              description: "You're profitable. But the system you built wasn't designed to scale like this. Now what?"
            }
          ]}
          cta="Explore the Right Track for You"
        />

        <QuizCTA 
          heading="Architect or Alchemist?"
          paragraph="You'll learn faster and scale smoother once you know how you're wired. Take the free quiz to unlock your type - and build from your strengths."
          cta1="Take the 3-Minute Quiz"
          cta2="Learn What It Means"
          background="split-circle-icon"
        />

        <CoursesPreview 
          title="Start With Strategy. Scale With System."
          subtitle="Every course has two tracks - one for structure, one for presence. Learn in your natural style, or build your opposite muscle."
          courses={[
            {
              icon: "🧱",
              title: "Infinite Scaling Method",
              description: "Your business new spine - layered to unlock long-term growth and strength.",
              link: "/courses/infinite-scaling"
            },
            {
              icon: "🪞",
              title: "Confidence Architecture",
              description: "Rebuild your internal self-command and external clarity.",
              link: "/courses/confidence-architecture"
            },
            {
              icon: "🧠",
              title: "Limiting Beliefs Reframe",
              description: "Identify the mental weights hidden inside your systems.",
              link: "/courses/limiting-beliefs"
            }
          ]}
          viewAllLink="/courses"
        />

        <AIAgents 
          title="Ask an AI That Actually Gets Your Business."
          subtext="Try our trained advisors - Strategy, Startup, Social Media, and more."
          tags={["Startup", "Scaleup", "Architect", "Alchemist"]}
        />

        <BrandPillars 
          title="The Brandscaling Compound Formula"
          subtitle="Course • Collaborate • Community"
          pillars={[
            {
              name: "Course",
              description: "LMS with Architect/Alchemist split",
              link: "/courses"
            },
            {
              name: "Collaborate",
              description: "AI agents, workflow tools",
              link: "/collaborate"
            },
            {
              name: "Community",
              description: "Real convos, no fluff",
              link: "/community"
            }
          ]}
        />

        <ReflectionQuotes 
          quotes={[
            {
              text: "Clarity is the real catalyst - internally and operationally.",
              author: "The Architect",
              color: "indigo"
            },
            {
              text: "The next level of your business lives in a deeper level of yourself.",
              author: "The Alchemist",
              color: "orange"
            }
          ]}
        />

        <FinalCTA 
          heading="Ready to Scale Without Losing Yourself in the Process?"
          cta1="Take the Quiz"
          cta2="Join the Newsletter"
        />

        <BrandscalingAgents />
      </main>
      
      <Footer />
    </div>
  );
}