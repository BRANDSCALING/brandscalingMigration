import { Link } from "wouter";
import { Rocket, Twitter, Linkedin, Youtube, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const platformLinks = [
    { href: "/courses", label: "Courses" },
    { href: "/community", label: "Community" },
    { href: "/quiz", label: "Assessment" },
    { href: "/blog", label: "Resources" },
  ];

  const supportLinks = [
    { href: "/help", label: "Help Center" },
    { href: "/contact", label: "Contact Us" },
    { href: "/api", label: "API Docs" },
    { href: "/status", label: "System Status" },
  ];

  const companyLinks = [
    { href: "/about", label: "About" },
    { href: "/careers", label: "Careers" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ];

  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Rocket className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-slate-900">Brandscaling</span>
            </div>
            <p className="text-slate-600 text-sm mb-4">
              Empowering entrepreneurs to build scalable brands through strategic learning and community collaboration.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="w-8 h-8 bg-slate-100 hover:bg-slate-200">
                <Twitter className="w-4 h-4 text-slate-600" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 bg-slate-100 hover:bg-slate-200">
                <Linkedin className="w-4 h-4 text-slate-600" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 bg-slate-100 hover:bg-slate-200">
                <Youtube className="w-4 h-4 text-slate-600" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <Button variant="link" className="h-auto p-0 text-slate-600 hover:text-slate-900">
                      {link.label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <Button variant="link" className="h-auto p-0 text-slate-600 hover:text-slate-900">
                      {link.label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <Button variant="link" className="h-auto p-0 text-slate-600 hover:text-slate-900">
                      {link.label}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">© 2024 Brandscaling Platform. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="text-xs text-slate-500">Built with</span>
            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3 text-red-500" />
              <span className="text-xs text-slate-500">for entrepreneurs</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
