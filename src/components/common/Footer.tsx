import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Brandscaling</h3>
            <p className="text-gray-300 text-sm">
              Unlock your entrepreneurial DNA and scale your business with AI-powered insights.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/quiz">
                  <a className="text-gray-300 hover:text-white">DNA Quiz</a>
                </Link>
              </li>
              <li>
                <Link href="/courses">
                  <a className="text-gray-300 hover:text-white">Courses</a>
                </Link>
              </li>
              <li>
                <Link href="/smart-business-builder">
                  <a className="text-gray-300 hover:text-white">Business Builder</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about">
                  <a className="text-gray-300 hover:text-white">About</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-300 hover:text-white">Contact</a>
                </Link>
              </li>
              <li>
                <Link href="/community">
                  <a className="text-gray-300 hover:text-white">Community</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@brandscaling.com" className="text-gray-300 hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2025 Brandscaling. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}