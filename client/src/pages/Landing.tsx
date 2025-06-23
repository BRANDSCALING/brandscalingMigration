import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';

export default function Landing() {
  const [email, setEmail] = useState('');

  const handleQuizSubmit = () => {
    console.log('Submit email to Supabase and trigger GHL:', email);
  };

  return (
    <div className="min-h-screen bg-white font-poppins text-brand-gray">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur bg-white/70 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <a className="text-xl font-bold">Brandscaling</a>
          </Link>
          <div className="flex gap-4 items-center">
            <button>🔍</button>
            <button>📸</button>
            <button>👤</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 text-center bg-gradient-to-br from-gray-50 to-white">
        <h1 className="text-5xl font-bold mb-6">The World's 1st AI-Powered Business Operating System</h1>
        <p className="text-xl text-gray-600 mb-8">Discover your Entrepreneurial DNA and scale from idea to 9-figures using AI</p>
        <div className="flex justify-center gap-4 mb-6">
          <Button className="bg-brand-indigo text-white px-6 py-3">Discover Your DNA</Button>
          <Button variant="outline" className="border-brand-indigo text-brand-indigo px-6 py-3">Explore Courses</Button>
        </div>
        <div className="animate-bounce text-gray-500">⬇</div>
      </section>

      {/* AI Mentors Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <Card className="bg-gradient-to-br from-indigo-100 to-purple-100">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-indigo-600 mb-2">The AI Architect</h3>
              <p className="text-gray-600">Precise • Calm • Strategic</p>
              <ul className="mt-4 list-disc list-inside text-gray-700">
                <li>Performance protocols & structured routines</li>
                <li>Cognitive optimization frameworks</li>
                <li>Purpose alignment structures</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-100 to-pink-100">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-orange-500 mb-2">The AI Alchemist</h3>
              <p className="text-gray-600">Warm • Magnetic • Empowering</p>
              <ul className="mt-4 list-disc list-inside text-gray-700">
                <li>Embodied wisdom practices</li>
                <li>Emotional alchemy techniques</li>
                <li>Intuitive alignment methods</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Course Tiers */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Entry', price: '£99', features: ['Idea-to-Launch Kit™', 'Smart Business Builder™', 'AI Mentor Access', '30-Day Launch Plan'], btn: 'Get Started', color: 'border-gray-300'
            },
            {
              name: 'Expert', price: '£249', features: ['Everything in Entry', 'Magnetic Offer Builder™', 'The Energetic Edge™', 'Conversion Confidence Kit™'], btn: 'Get Started', color: 'border-indigo-500'
            },
            {
              name: 'Elite', price: '£20k', features: ['Full Course Vault Access', 'Private Mastermind', '1:1 Strategy Sessions', 'Direct Mentor Access'], btn: 'Apply Now', color: 'border-orange-500'
            }
          ].map((tier, idx) => (
            <Card key={idx} className={`p-6 ${tier.color} border-2`}>
              <CardContent>
                <h4 className="text-2xl font-bold mb-2">{tier.name}</h4>
                <div className="text-3xl text-brand-black font-bold mb-4">{tier.price}</div>
                <ul className="mb-4 list-disc list-inside text-gray-700">
                  {tier.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
                <Button className="w-full">{tier.btn}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Avatar Quiz Section */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">If You've Felt This, You're Home.</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-8">
          {[
            {title: 'Idea-Stuck Dreamer', desc: 'Ideas in your head, but nowhere in motion.'},
            {title: 'Framework-Frustrated', desc: 'Proven methods didn\'t match your DNA.'},
            {title: 'Mastermind Graduate', desc: 'Outgrew peers and rooms.'},
            {title: 'Successful-but-Stuck', desc: 'Profitable but unsure of next move.'},
          ].map((card, i) => (
            <Card key={i} className="p-6 hover:shadow-md transition-shadow">
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-600">{card.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter your email" 
            className="border px-4 py-2 rounded mr-2" 
          />
          <Button onClick={handleQuizSubmit}>Unlock My DNA</Button>
        </div>
      </section>

      {/* Quiz Teaser Banner */}
      <section className="py-16 text-center bg-black text-white">
        <h2 className="text-4xl font-bold mb-4">What's Your Entrepreneurial DNA?</h2>
        <Button className="bg-white text-black px-6 py-3">Take the Quiz</Button>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center bg-gradient-to-br from-indigo-700 to-purple-700 text-white">
        <h2 className="text-3xl font-bold mb-6">Begin your journey to 9-figure scale. Discover your DNA today.</h2>
        <div className="flex gap-4 justify-center">
          <Button className="bg-orange-500 px-6 py-3">Take the Quiz</Button>
          <Button variant="outline" className="border-white text-white px-6 py-3">Join the Newsletter</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-6">
          <div>
            <h4 className="font-bold text-lg mb-4">Brandscaling</h4>
            <p>Scale based on your entrepreneurial DNA, not someone else's template.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/quiz"><a>DNA Quiz</a></Link></li>
              <li><Link href="/courses"><a>Courses</a></Link></li>
              <li><Link href="/about"><a>About</a></Link></li>
              <li><Link href="/blog"><a>Blog</a></Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Frameworks</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Infinite Scaling Methodology™</li>
              <li>F.U.S.E. Framework™</li>
              <li>Customer Creation Factory™</li>
              <li>Doctor-Patient Sales Model</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Help Center</li>
              <li>Community</li>
              <li>Contact Us</li>
              <li>Terms & Privacy</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-400 mt-12">&copy; 2024 Brandscaling. All rights reserved.</div>
      </footer>
    </div>
  );

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
    </div>
  );
}