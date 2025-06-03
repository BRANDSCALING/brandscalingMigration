import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Users, Trophy, Target, Brain, Building, Lock } from 'lucide-react';
import { useAccess } from '@/hooks/useAccess';
import GateComponent from '@/components/GateComponent';
import YouAreHere from '@/components/YouAreHere';
// Types for database integration
interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  track: 'architect' | 'alchemist' | 'all';
  accessLevel: 'free' | 'paid' | 'mastermind';
  thumbnailUrl?: string;
  videoUrl?: string;
  duration?: number;
  enrolled?: number;
}

type FilterType = 'all' | 'free' | 'paid' | 'mastermind' | 'architect' | 'alchemist';

// Real courses loaded from backend API only

export default function Courses() {
  const [filter, setFilter] = useState<FilterType>('all');
  const { userTier, allCourses, isLoading } = useAccess();

  const filterOptions = [
    { value: 'all', label: 'All Courses' },
    { value: 'free', label: 'Free' },
    { value: 'paid', label: 'Paid' },
    { value: 'mastermind', label: 'Mastermind' },
    { value: 'architect', label: 'Architect Track' },
    { value: 'alchemist', label: 'Alchemist Track' }
  ];

  // Only display real course data from backend API
  const coursesToDisplay = isLoading ? [] : allCourses;
  
  const filteredCourses = coursesToDisplay.filter(course => {
    if (filter === 'all') return true;
    if (filter === 'architect' || filter === 'alchemist') {
      return course.track === filter || course.track === 'all';
    }
    return course.accessLevel === filter;
  });

  const getTrackColor = (track: string) => {
    switch (track) {
      case 'architect': return 'bg-purple-100 text-purple-800';
      case 'alchemist': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessColor = (access: string) => {
    switch (access) {
      case 'free': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'mastermind': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-br from-purple-50 to-orange-50 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
            Learn the Brandscaling Way
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Built for Entrepreneurs Scaling from Chaos to Clarity
          </p>
          <Link href="/quiz">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-8 py-3">
              Take the Free Quiz
            </Button>
          </Link>
        </div>
      </section>

      {/* Track Overview */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Choose Your Path
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Architect Track */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-200">
              <CardHeader className="text-center p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Building className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-purple-600 mb-4">
                  The Architect
                </CardTitle>
                <Link href="/quiz">
                  <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                    Discover Your Track
                  </Button>
                </Link>
              </CardHeader>
            </Card>

            {/* Alchemist Track */}
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-200">
              <CardHeader className="text-center p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <Brain className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-orange-600 mb-4">
                  The Alchemist
                </CardTitle>
                <Link href="/quiz">
                  <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
                    Discover Your Track
                  </Button>
                </Link>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-8 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? "default" : "outline"}
                onClick={() => setFilter(option.value as FilterType)}
                className={filter === option.value 
                  ? "bg-gradient-to-r from-purple-600 to-orange-500 text-white" 
                  : "hover:bg-gray-100"
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Available Courses
          </h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" aria-label="Loading courses"/>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course: any) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex gap-2 mb-3">
                      <Badge className={getTrackColor(course.track)}>
                        {course.track === 'all' ? 'All Tracks' : course.track}
                      </Badge>
                      <Badge className={getAccessColor(course.accessLevel)}>
                        {course.accessLevel}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {course.description}
                    </p>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                      Access Course
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No courses available at this time.</p>
            </div>
          )}
        </div>
      </section>




    </div>
  );
}