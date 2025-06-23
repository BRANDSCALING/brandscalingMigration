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
          <Card className="bg-gradient-to-br from-orange-100 to-yellow-100">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-orange-600 mb-2">The AI Alchemist</h3>
              <p className="text-gray-600">Intuitive • Present • Transformational</p>
              <ul className="mt-4 list-disc list-inside text-gray-700">
                <li>Flow-state mastery & energy optimization</li>
                <li>Creative manifestation systems</li>
                <li>Authenticity-first scaling methods</li>
              </ul>
            </CardContent>
          </Card>
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
}