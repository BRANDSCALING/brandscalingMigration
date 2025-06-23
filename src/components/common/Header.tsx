import { Link } from 'wouter';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-xl font-bold text-gray-900">
                Brandscaling
              </a>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/about">
              <a className="text-gray-600 hover:text-gray-900">About</a>
            </Link>
            <Link href="/courses">
              <a className="text-gray-600 hover:text-gray-900">Courses</a>
            </Link>
            <Link href="/community">
              <a className="text-gray-600 hover:text-gray-900">Community</a>
            </Link>
            <Link href="/contact">
              <a className="text-gray-600 hover:text-gray-900">Contact</a>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  {user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}