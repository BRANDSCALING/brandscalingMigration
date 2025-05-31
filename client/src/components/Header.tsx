import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import brandscalingLogo from "@assets/FullLogo.png";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img 
                src={brandscalingLogo} 
                alt="Brandscaling" 
                className="h-16 w-auto hover:opacity-80 transition-opacity cursor-pointer"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/about" className="text-slate-600 hover:text-primary">About</Link>
            <Link href="/courses" className="text-slate-600 hover:text-primary">Courses</Link>
            <Link href="/blog" className="text-slate-600 hover:text-primary">Blog</Link>
            <Link href="/community" className="text-slate-600 hover:text-primary">Community</Link>
          </nav>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex space-x-2">
            <Link href="/login">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-blue-600">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/about" className="text-slate-600 hover:text-primary">About</Link>
              <Link href="/courses" className="text-slate-600 hover:text-primary">Courses</Link>
              <Link href="/blog" className="text-slate-600 hover:text-primary">Blog</Link>
              <Link href="/community" className="text-slate-600 hover:text-primary">Community</Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200">
                <Link href="/login">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-primary hover:bg-blue-600">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}