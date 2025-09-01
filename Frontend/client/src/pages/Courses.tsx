import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import { ArrowRight, Brain, CheckCircle } from 'lucide-react';
import { BrandSection } from '@/components/BrandSystem';

export default function Courses() {
  return (
    <div className="min-h-screen bg-white">
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
                
                <Button 
                  className="w-full bg-gray-400 text-white cursor-not-allowed"
                  disabled
                >
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            {/* Elite Tier */}
            <Card className="border-2 border-scale-orange hover:shadow-xl transition-all duration-300 relative">
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
                  onClick={() => window.open('https://brandscale-mastermind-info7025.replit.app/', '_blank')}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
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
              <Link href="#pricing">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-strategic-black px-8 py-4 text-lg">
                  Choose Your Path
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </BrandSection>
    </div>
  );
}