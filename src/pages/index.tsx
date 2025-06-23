import { useAuth } from '../context/AuthContext';
import { Landing } from './Landing';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Button } from '../components/ui/button';
import { Link } from 'wouter';

export function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Landing />;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Your Brandscaling Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Your personalized platform for entrepreneurial growth and DNA optimization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">Take DNA Quiz</h3>
            <p className="text-gray-600 mb-4">
              Discover your entrepreneurial DNA type with our 20-question assessment
            </p>
            <Link href="/quiz">
              <Button className="w-full">Start Quiz</Button>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">Explore Courses</h3>
            <p className="text-gray-600 mb-4">
              Access personalized learning content based on your DNA type
            </p>
            <Link href="/courses">
              <Button className="w-full" variant="outline">View Courses</Button>
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3">Smart Business Builder</h3>
            <p className="text-gray-600 mb-4">
              Get AI-powered business insights tailored to your entrepreneurial DNA
            </p>
            <Link href="/smart-business-builder">
              <Button className="w-full" variant="outline">Build Strategy</Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}