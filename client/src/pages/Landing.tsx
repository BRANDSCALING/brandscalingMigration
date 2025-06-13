import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <main className="font-poppins">
        {/* Hero Section */}
        <section className="px-6 py-16 max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to The Brandscaling Platform</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Scale smarter. Align deeper. Build what your strategy and spirit agree on.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/entrepreneurial-dna-quiz">
              <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90">
                Take the Personality Quiz
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline">
                Explore the Courses
              </Button>
            </Link>
          </div>
        </section>

        {/* Brand Philosophy Section */}
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Scaling Should Start With Personality, Not Process.</h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto text-center leading-relaxed">
            You've followed frameworks, joined programs, hired experts. But they weren't built for how you actually think. 
            Brandscaling flips the model. We teach through your operating system — Architect or Alchemist — then map systems, 
            automation, and team structures around it.
          </p>
        </section>

        {/* Avatar Identification Section */}
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">If You've Felt This, You're Home.</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">

                <h3 className="text-xl font-semibold mb-2">Idea-Stuck Dreamer</h3>
                <p className="font-medium mb-2">It's all in your head — but nowhere in motion.</p>
                <p className="text-gray-600">You've stayed up at night with ideas that feel world-changing… but execution feels blocked.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">

                <h3 className="text-xl font-semibold mb-2">Framework-Frustrated</h3>
                <p className="font-medium mb-2">You followed the map. It didn't match your terrain.</p>
                <p className="text-gray-600">You've tried the 'proven' methods. Burnout followed. Maybe the frameworks weren't built for your type.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-2xl mb-3">🔁</div>
                <h3 className="text-xl font-semibold mb-2">Mastermind Graduate</h3>
                <p className="font-medium mb-2">The rooms that once grew you now shrink you.</p>
                <p className="text-gray-600">You're thinking bigger than your mentors now. You've outgrown the space — but don't want to stagnate.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-2xl mb-3">⚖️</div>
                <h3 className="text-xl font-semibold mb-2">Successful-but-Stuck</h3>
                <p className="font-medium mb-2">The wins are real. The next move isn't.</p>
                <p className="text-gray-600">You're profitable. But the system you built wasn't designed to scale like this. Now what?</p>
              </CardContent>
            </Card>
          </div>
          <div className="text-center">
            <Link href="/courses">
              <Button size="lg">Explore the Right Track for You</Button>
            </Link>
          </div>
        </section>

        {/* Architect vs Alchemist Quiz Section */}
        <section className="px-6 py-16 max-w-6xl mx-auto bg-gray-50">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Architect or Alchemist?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              You'll learn faster and scale smoother once you know how you're wired. Take the free quiz to unlock your track — and build from your strengths.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/entrepreneurial-dna-quiz">
                <Button size="lg" className="bg-brand-purple hover:bg-brand-purple/90">
                  Take the 3-Minute Quiz
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn What It Means
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Course Preview Section */}
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Start With Strategy. Scale With System.</h2>
            <p className="text-lg text-gray-600">Every course has two tracks — one for structure, one for presence. Learn in your natural style, or build your opposite muscle.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl mb-3">🧱</div>
                <h3 className="text-xl font-semibold mb-2">Infinite Scaling Method</h3>
                <p className="text-gray-600 mb-4">Your business's new spine—layered to unlock long-term growth.</p>
                <Button variant="outline" size="sm">View</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-2xl mb-3">🪞</div>
                <h3 className="text-xl font-semibold mb-2">Confidence Architecture</h3>
                <p className="text-gray-600 mb-4">Rebuild your internal self-command and external clarity.</p>
                <Button variant="outline" size="sm">View</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">

                <h3 className="text-xl font-semibold mb-2">Limiting Beliefs Reframe</h3>
                <p className="text-gray-600 mb-4">Identify the mental weights hidden inside your systems.</p>
                <Button variant="outline" size="sm">View</Button>
              </CardContent>
            </Card>
          </div>
          <div className="text-center">
            <Link href="/courses">
              <Button size="lg">See All Courses</Button>
            </Link>
          </div>
        </section>

        {/* AI Agents Preview Section */}
        <section className="px-6 py-16 max-w-6xl mx-auto bg-gray-50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Ask an AI That Actually Gets Your Business.</h2>
            <p className="text-lg text-gray-600 mb-6">Try our trained advisors — Strategy, Startup, Social Media, and more.</p>
            <div className="flex gap-3 justify-center flex-wrap mb-8">
              <Button variant="outline">Startup</Button>
              <Button variant="outline">Strategy</Button>
              <Button variant="outline">Marketing</Button>
              <Button variant="outline">Social Media</Button>
            </div>
            <div className="bg-white rounded-lg p-6 max-w-md mx-auto border">
              <p className="text-gray-500 italic">"How do I reposition my offer?"</p>
            </div>
          </div>
        </section>

        {/* Brandscaling Pillars Section */}
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">The Brandscaling Compound Formula</h2>
            <p className="text-lg text-gray-600 mb-8">Course • Collaborate • Community</p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">Course</h3>
                  <p className="text-gray-600">LMS with Architect/Alchemist split</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">Collaborate</h3>
                  <p className="text-gray-600">AI agents, workflow tools</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">Community</h3>
                  <p className="text-gray-600">Real convos, no fluff</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Reflection Quote Section */}
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-indigo-50 border-indigo-200">
              <CardContent className="p-8 text-center">
                <p className="text-lg italic mb-4">"Clarity is the real catalyst—internally and operationally."</p>
                <p className="font-semibold text-indigo-700">— The Architect</p>
              </CardContent>
            </Card>
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-8 text-center">
                <p className="text-lg italic mb-4">"Scaling isn't about adding more. It's about becoming more of who you already are."</p>
                <p className="font-semibold text-orange-700">— The Alchemist</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="px-6 py-16 max-w-6xl mx-auto text-center bg-brand-purple text-white">
          <h2 className="text-3xl font-bold mb-6">Ready to Scale Without Losing Yourself in the Process?</h2>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/quiz">
              <Button size="lg" variant="secondary">
                Take the Quiz
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-brand-purple">
              Join the Newsletter
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}