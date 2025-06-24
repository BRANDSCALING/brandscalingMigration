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
      <BrandSection className="spacing-section relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover opacity-60"
            onLoadedData={() => console.log('Background video loaded')}
            onError={(e) => {
              console.log('Background video failed to load:', e);
              const target = e.target as HTMLVideoElement;
              target.style.display = 'none';
            }}
          >
            <source src="/logo-animation.mp4" type="video/mp4" />
            <source src="/uploads/logo-animation.mp4" type="video/mp4" />
          </video>
          {/* Light overlay for text readability */}
          <div className="absolute inset-0 bg-white/40"></div>
        </div>
        
        <div className="container-brandscaling text-center relative z-10">
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
                  <div className="mt-6">
                    <Link href="/ai-agents">
                      <Button variant="outline" className="w-full border-architect-indigo text-architect-indigo hover:bg-architect-indigo hover:text-white">
                        Meet the Architect
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </PersonalityMode>

            <PersonalityMode type="alchemist">
              <Card className="h-full border-scale-orange/20 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-3 rounded-xl gradient-alchemist mr-4">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-alchemist">The AI Alchemist</h3>
                      <p className="text-gray-600 font-medium">Warm • Magnetic • Empowering</p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-alchemist mt-0.5 mr-3 flex-shrink-0" />
                      Personal brand development strategies
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-alchemist mt-0.5 mr-3 flex-shrink-0" />
                      High-energy motivation systems
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-alchemist mt-0.5 mr-3 flex-shrink-0" />
                      Creative problem-solving approaches
                    </li>
                  </ul>
                  <div className="mt-6">
                    <Link href="/ai-agents">
                      <Button variant="outline" className="w-full border-scale-orange text-scale-orange hover:bg-scale-orange hover:text-white">
                        Meet the Alchemist
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </PersonalityMode>
          </div>
        </div>
      </BrandSection>

      {/* DNA Quiz Section */}
      <BrandSection className="spacing-section">
        <div className="container-brandscaling">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-h2 text-strategic-black mb-6">
              Discover Your Entrepreneurial DNA
            </h2>
            <p className="text-body-large text-gray-600 mb-8 max-w-2xl mx-auto">
              Take our scientifically-designed assessment to unlock personalized business strategies tailored to your unique entrepreneurial blueprint.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="text-left">
                <div className="flex items-center mb-4">
                  <Target className="h-6 w-6 text-architect mr-3" />
                  <h3 className="text-xl font-bold text-strategic-black">The Architect Path</h3>
                </div>
                <p className="text-gray-600">
                  Systematic builders who scale through structured processes, data-driven decisions, and methodical execution.
                </p>
              </div>
              <div className="text-left">
                <div className="flex items-center mb-4">
                  <Zap className="h-6 w-6 text-alchemist mr-3" />
                  <h3 className="text-xl font-bold text-strategic-black">The Alchemist Path</h3>
                </div>
                <p className="text-gray-600">
                  Intuitive innovators who scale through creativity, personal magnetism, and transformational leadership.
                </p>
              </div>
            </div>

            <Link href="/entrepreneurial-dna-quiz">
              <Button size="lg" className="gradient-brandscaling text-white font-medium px-12 py-6 text-xl">
                Take Your DNA Quiz Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </BrandSection>

      {/* Recognition Section */}
      <BrandSection className="spacing-section bg-gray-50">
        <div className="container-brandscaling">
          <div className="text-center mb-12">
            <h2 className="text-h2 text-strategic-black mb-6">If You've Felt This, You're Home</h2>
            <p className="text-body text-gray-600 max-w-2xl mx-auto">
              Entrepreneurs from every stage find their breakthrough moment through Brandscaling's DNA-matched methodology.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {title: 'Idea-Stuck Dreamer', desc: 'Brilliant ideas trapped in your head, but nowhere in motion.'},
              {title: 'Framework-Frustrated', desc: 'Tried proven methods that didn\'t match your DNA.'},
              {title: 'Mastermind Graduate', desc: 'Outgrew your peers and rooms, seeking the next level.'},
              {title: 'Successful-but-Stuck', desc: 'Profitable but unsure of your next strategic move.'},
            ].map((card, i) => (
              <Card key={i} className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-scale-orange/30">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-strategic-black mb-3">{card.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{card.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </BrandSection>

      {/* Final CTA */}
      <BrandSection className="spacing-section gradient-brandscaling text-white">
        <div className="container-brandscaling text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-h2 text-white mb-6">
              Begin Your Journey to 9-Figure Scale
            </h2>
            <p className="text-body-large text-white/90 mb-8 max-w-2xl mx-auto">
              Every billion-dollar business started with one entrepreneur discovering their true DNA and scaling accordingly. Your breakthrough moment starts now.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/entrepreneurial-dna-quiz">
                <Button size="lg" variant="secondary" className="bg-white text-strategic-black hover:bg-white/90 font-medium px-8 py-4 text-lg">
                  Discover Your DNA
                  <Brain className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-strategic-black px-8 py-4 text-lg">
                  Explore Platform
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-white/20">
              <BrandQuote 
                text="Every entrepreneur is either an Architect or an Alchemist. The key is knowing which you are and scaling accordingly."
                author="The Infinite Scaling Methodology"
                className="text-white/90"
              />
            </div>
          </div>
        </div>
      </BrandSection>
      {/* Footer is now handled by Layout component */}
    </div>
  );
}