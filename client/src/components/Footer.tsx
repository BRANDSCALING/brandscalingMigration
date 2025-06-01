import { Button } from "@/components/ui/button";
import { Rocket } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Rocket className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold">Brandscaling</span>
            </div>
            <p className="text-slate-400">
              Empowering entrepreneurs to build scalable brands through strategic learning and community.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Learn</h4>
            <div className="space-y-2">
              <Link href="/courses" className="block text-slate-400 hover:text-white">Courses</Link>
              <Link href="/quiz" className="block text-slate-400 hover:text-white">Assessment</Link>
              <Link href="/community" className="block text-slate-400 hover:text-white">Community</Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-slate-400 hover:text-white">About</Link>
              <Link href="/blog" className="block text-slate-400 hover:text-white">Blog</Link>
              <Link href="/contact" className="block text-slate-400 hover:text-white">Contact</Link>
              <Link href="/affiliates" className="block text-slate-400 hover:text-white">Affiliates</Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Get Started</h4>
            <Link href="/signup">
              <Button className="w-full bg-primary hover:bg-blue-600">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2024 Brandscaling Platform. Built for entrepreneurs.</p>
        </div>
      </div>
    </footer>
  );
}