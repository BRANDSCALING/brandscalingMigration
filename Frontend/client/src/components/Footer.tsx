import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Infinity, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-strategic-black text-white">
      <div className="container-brandscaling spacing-section">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 rounded-xl gradient-brandscaling">
                <Infinity className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold gradient-brandscaling bg-clip-text text-transparent">
                  Brandscaling
                </span>
                <p className="text-xs text-gray-400 font-medium">
                  Purpose → Profit → Purpose
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Transforming entrepreneurs from idea to 9-figures through the proven Infinite Scaling Methodology.
            </p>
            <div className="space-y-2">
              <p className="text-xs text-gray-400">
                "Every entrepreneur is either an Architect or an Alchemist."
              </p>
              <p className="text-xs text-scale-orange font-medium">
                Discover your Entrepreneurial DNA today.
              </p>
            </div>
          </div>
          
          {/* Platform Section */}
          <div>
            <h4 className="font-bold text-white mb-6">Platform</h4>
            <div className="space-y-3">
              <Link href="/entrepreneurial-dna-quiz" className="block text-gray-300 hover:text-scale-orange transition-colors text-sm">
                Entrepreneurial DNA Quiz
              </Link>
              <Link href="/courses" className="block text-gray-300 hover:text-scale-orange transition-colors text-sm">
                Learning Pathways
              </Link>
              <Link href="/ai-agents" className="block text-gray-300 hover:text-scale-orange transition-colors text-sm">
                AI Business Advisors
              </Link>
              <Link href="/workbooks" className="block text-gray-300 hover:text-scale-orange transition-colors text-sm">
                Interactive Workbooks
              </Link>
            </div>
          </div>
          
          {/* Company Section */}
          <div>
            <h4 className="font-bold text-white mb-6">Company</h4>
            <div className="space-y-3">
              <Link href="/about" className="block text-gray-300 hover:text-scale-orange transition-colors text-sm">
                About the Method
              </Link>
              <Link href="/blog" className="block text-gray-300 hover:text-scale-orange transition-colors text-sm">
                Scaling Insights
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-scale-orange transition-colors text-sm">
                Contact
              </Link>
              <Link href="/community" className="block text-gray-300 hover:text-scale-orange transition-colors text-sm">
                Community Hub
              </Link>
            </div>
          </div>
          
          {/* Start Scaling Section */}
          <div>
            <h4 className="font-bold text-white mb-6">Start Scaling</h4>
            <p className="text-gray-300 text-sm mb-4">
              Ready to discover your Entrepreneurial DNA and begin your infinite scaling journey?
            </p>
            <Link href="/entrepreneurial-dna-quiz">
              <Button className="w-full gradient-brandscaling hover:opacity-90 text-white font-medium">
                Take DNA Quiz
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            &copy; 2025 Brandscaling. Scaling entrepreneurs from purpose to 9-figure profit.
          </p>
          <div className="flex items-center space-x-6 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-scale-orange transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-scale-orange transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}