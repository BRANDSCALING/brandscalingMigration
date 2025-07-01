import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, useLocation } from 'wouter';
import { ArrowRight, Brain, Building2, Users, TrendingUp, CheckCircle, Target, Zap } from 'lucide-react';
import { BrandSection, PersonalityMode, BrandQuote } from '@/components/BrandSystem';
import { useAuth } from '@/hooks/useAuth';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const handleQuizSubmit = () => {
    console.log('Submit email to Supabase and trigger GHL:', email);
  };

  const handleDnaQuizClick = () => {
    setLocation('/entrepreneurial-dna-quiz');
  };

  return (
    <div className="min-h-screen bg-white">{/* Removed old duplicate header */}

      {/* Hero Section */}
      <BrandSection className="spacing-section relative overflow-hidden bg-white">
        {/* Background Video - Mobile and Desktop */}
        <div className="absolute inset-0 z-0 bg-white">
          {/* White background fallback */}
          <div className="absolute inset-0 bg-white z-0"></div>
          
          {/* Desktop Video - Full coverage */}
          <video
            autoPlay
            loop
            muted
            playsInline
            key="hero-video-desktop"
            className="absolute top-1/2 left-1/2 w-full h-full transform -translate-x-1/2 -translate-y-1/2 object-cover opacity-100 z-10 hidden md:block"
            src="/hero-video-1751363433.mov"
            onLoadedData={() => console.log('Desktop video loaded')}
            onError={(e) => {
              console.error('Desktop video failed to load:', e);
            }}
          />
          
          {/* Mobile Video - Centered and contained */}
          <video
            autoPlay
            loop
            muted
            playsInline
            key="hero-video-mobile"
            className="absolute top-1/2 left-1/2 w-auto h-auto max-w-full max-h-full transform -translate-x-1/2 -translate-y-1/2 object-contain opacity-100 z-10 block md:hidden"
            src="/hero-video-1751363433.mov"
            onLoadedData={() => console.log('Mobile video loaded')}
            onError={(e) => {
              console.error('Mobile video failed to load:', e);
            }}
          />
        </div>
        
        <div className="container-brandscaling text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-h1 text-strategic-black mb-6 leading-tight font-bold drop-shadow-sm">
              The World's 1st AI-Powered Business 
              <span className="gradient-brandscaling bg-clip-text text-transparent block">
                Operating System
              </span>
            </h1>
            <p className="text-body-large text-strategic-black mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
              Discover your <span className="text-architect font-bold">Entrepreneurial DNA</span> and scale from idea to 9-figures 
              using proven <span className="text-alchemist font-bold">methodologies</span> and AI-powered guidance
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/entrepreneurial-dna-quiz">
                <Button size="lg" className="btn-cta-gradient text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all">
                  Discover Your E-DNA
                  <Brain className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button variant="outline" size="lg" className="border-2 border-scale-orange text-scale-orange hover:bg-scale-orange hover:text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all bg-white/95 backdrop-blur-sm">
                  Explore Learning Paths
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <BrandQuote attribution="both">
              "Purpose → Profit → Purpose. Every entrepreneur is either an Architect or an Alchemist. Which are you?"
            </BrandQuote>
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

            <Button 
              size="lg" 
              className="gradient-brandscaling text-white font-medium px-12 py-6 text-xl"
              onClick={handleDnaQuizClick}
            >
              Take Your DNA Quiz Now
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>
        </div>
      </BrandSection>

      {/* Choose Your Growth Path Section */}
      <BrandSection id="pricing" className="spacing-section bg-white">
        <div className="container-brandscaling">
          <div className="text-center mb-12">
            <h2 className="text-h2 text-strategic-black mb-6">Choose Your Growth Path</h2>
            <p className="text-body text-gray-600 max-w-2xl mx-auto">
              From first idea to 8-figure scaling. All DNA-personalized. All step-by-step.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Entry Tier */}
            <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 relative">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-strategic-black mb-2">Entry</h3>
                  <div className="text-4xl font-bold text-strategic-black mb-2">£499</div>
                  <p className="text-gray-600 text-sm">Perfect for idea-stage entrepreneurs</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    Idea-to-Launch Kit™
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    Smart Business Builder™
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    AI Mentor Access
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    30-Day Launch Plan
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-strategic-black text-white hover:bg-gray-800"
                  onClick={() => window.open('https://launch-kit-uk-blueprint-sh.lovable.app', '_blank')}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Expert Tier - Coming Soon */}
            <Card className="border-2 border-architect-indigo hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-architect-indigo text-white px-4 py-1 rounded-full text-sm font-medium">
                  Coming Soon
                </span>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-strategic-black mb-2">Expert</h3>
                  <div className="text-4xl font-bold text-strategic-black mb-2">£999</div>
                  <p className="text-gray-600 text-sm">For growing businesses ready to scale</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    Everything in Entry
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    Magnetic Offer Builder™
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    The Energetic Edge™
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    Conversion Confidence Kit™
                  </li>
                </ul>
                
                <Button className="w-full bg-gray-400 text-white cursor-not-allowed" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            {/* Elite Tier */}
            <Card className="border-2 border-scale-orange hover:shadow-lg transition-all duration-300 relative">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-strategic-black mb-2">Elite</h3>
                  <div className="text-4xl font-bold text-strategic-black mb-2">£20k</div>
                  <p className="text-gray-600 text-sm">Complete scaling ecosystem + mastermind</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    Full Course Vault Access
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    Private Mastermind
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    1:1 Strategy Sessions
                  </li>
                  <li className="flex items-center text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    Direct Mentor Access
                  </li>
                </ul>
                
                <Button 
                  className="w-full bg-scale-orange text-white hover:bg-orange-600"
                  onClick={() => window.open('https://brandscalingschoolforentrepreneurs.com/mastermind-landing-page-page541638', '_blank')}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
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
              <BrandQuote attribution="both">
                "Every entrepreneur is either an Architect or an Alchemist. The key is knowing which you are and scaling accordingly."
              </BrandQuote>
            </div>
          </div>
        </div>
      </BrandSection>
      {/* Footer is now handled by Layout component */}
    </div>
  );
}