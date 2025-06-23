import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import { ArrowRight, Brain, Building2, Users, TrendingUp, CheckCircle, Target, Zap } from 'lucide-react';
import { BrandSection, PersonalityMode, BrandQuote } from '@/components/BrandSystem';

export default function Landing() {
  const [email, setEmail] = useState('');

  const handleQuizSubmit = () => {
    console.log('Submit email to Supabase and trigger GHL:', email);
  };

  return (
    <div className="min-h-screen bg-white">{/* Removed old duplicate header */}

      {/* Hero Section */}
      <BrandSection className="spacing-section bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="container-brandscaling text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-h1 text-strategic-black mb-6 leading-tight">
              The World's 1st AI-Powered Business 
              <span className="gradient-brandscaling bg-clip-text text-transparent block">
                Operating System
              </span>
            </h1>
            <p className="text-body-large text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover your Entrepreneurial DNA and scale from idea to 9-figures using proven methodologies and AI-powered guidance
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              <Link href="/entrepreneurial-dna-quiz">
                <Button size="lg" className="gradient-brandscaling text-white font-medium px-8 py-4 text-lg">
                  Discover Your E-DNA
                  <Brain className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="lg" className="border-architect-indigo text-architect-indigo hover:bg-architect-indigo hover:text-white px-8 py-4 text-lg">
                  Explore Learning Paths
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <BrandQuote 
              text="Purpose → Profit → Purpose. Every entrepreneur is either an Architect or an Alchemist. Which are you?"
              author="The Brandscaling Method"
            />
          </div>
        </div>
      </BrandSection>

      {/* AI Mentors Section */}
      <BrandSection className="spacing-section bg-gray-50">
        <div className="container-brandscaling">
          <div className="text-center mb-16">
            <h2 className="text-h2 text-strategic-black mb-4">
              Meet Your AI Business Advisors
            </h2>
            <p className="text-body text-gray-600 max-w-2xl mx-auto">
              Two distinct AI personalities, each tailored to your Entrepreneurial DNA type, ready to guide your scaling journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <PersonalityMode type="architect">
              <Card className="h-full border-architect-indigo/20 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-3 rounded-xl gradient-architect mr-4">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-architect">The AI Architect</h3>
                      <p className="text-gray-600 font-medium">Precise • Calm • Strategic</p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-architect mt-0.5 mr-3 flex-shrink-0" />
                      Performance protocols & structured routines
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-architect mt-0.5 mr-3 flex-shrink-0" />
                      Cognitive optimization frameworks
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-architect mt-0.5 mr-3 flex-shrink-0" />
                      Purpose alignment structures
                    </li>
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