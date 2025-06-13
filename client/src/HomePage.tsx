import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const navigateToQuiz = () => {
    window.location.href = '/quiz';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-purple-600">Brandscaling Platform</h1>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Home
              </Button>
              <Button onClick={navigateToQuiz} className="bg-purple-600 hover:bg-purple-700">
                Take Quiz
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Discover Your <span className="text-purple-600">Entrepreneurial DNA</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Master your default entrepreneurial style. You don't need to become a balanced hybrid — 
            you need to become a master of your natural strengths and aware of your growth edges.
          </p>
          <Button 
            onClick={navigateToQuiz}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-4"
          >
            Take the Entrepreneurial DNA Quiz™
          </Button>
        </div>

        {/* DNA Types Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-600">Architect</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Strategic, systematic, and structured. You build with precision and plan for scale.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-red-500">Alchemist</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Creative, intuitive, and adaptable. You transform ideas into magic through innovation.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-purple-600">Blurred Identity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Balanced strengths with room for deeper specialization and focused development.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-gray-600">Unfocused Potential</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Rich potential waiting to be channeled into clear entrepreneurial strengths.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Philosophy */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">The Brandscaling Method</h2>
          <p className="text-lg text-gray-600 mb-6">
            "You don't need to become a balanced hybrid. You need to become a master of your default — and aware of the opposite."
          </p>
          <Button 
            onClick={navigateToQuiz}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Discover Your DNA Now
          </Button>
        </div>
      </div>
    </div>
  );
}