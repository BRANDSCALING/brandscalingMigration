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

// Placeholder structure for real database integration
const placeholderCourses: Course[] = [
  {
    id: '1',
    slug: 'foundations-of-scaling',
    title: 'Foundations of Scaling',
    description: 'Core principles for sustainable business growth',
    track: 'all',
    accessLevel: 'free',
    duration: 45,
    enrolled: 1200
  },
  {
    id: '2', 
    slug: 'architect-frameworks',
    title: 'Architect Frameworks',
    description: 'Strategic systems for structured scaling',
    track: 'architect',
    accessLevel: 'paid',
    duration: 90,
    enrolled: 850
  },
  {
    id: '3',
    slug: 'alchemist-intuition',
    title: 'Alchemist Intuition',
    description: 'Energy-driven growth methodologies',
    track: 'alchemist',
    accessLevel: 'paid',
    duration: 75,
    enrolled: 920
  },
  {
    id: '4',
    slug: 'mastermind-mastery',
    title: 'Mastermind Mastery',
    description: 'Advanced scaling strategies for high-performers',
    track: 'all',
    accessLevel: 'mastermind',
    duration: 120,
    enrolled: 350
  }
];

export default function Courses() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filterOptions = [
    { value: 'all', label: 'All Courses' },
    { value: 'free', label: 'Free' },
    { value: 'paid', label: 'Paid' },
    { value: 'mastermind', label: 'Mastermind' },
    { value: 'architect', label: 'Architect Track' },
    { value: 'alchemist', label: 'Alchemist Track' }
  ];

  const filteredCourses = placeholderCourses.filter(course => {
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
                <p className="text-gray-600 mb-6">
                  Strategic, systematic, structure-driven. Build frameworks that scale with precision and clarity.
                </p>
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
                <p className="text-gray-600 mb-6">
                  Intuitive, adaptive, energy-driven. Transform vision into reality through authentic connection.
                </p>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="p-0">
                  {/* Placeholder for course thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                    <Play className="h-12 w-12 text-gray-400" />
                  </div>
                </CardHeader>
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
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{course.duration} min</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.enrolled}
                    </span>
                  </div>
                  <Link href={`/courses/${course.slug}`}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                      View More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Course Teaser Video Block */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Preview: How Brandscaling Works
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Placeholder for embedded video */}
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-orange-100 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <Play className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <p className="text-gray-600">Course Preview Video</p>
              </div>
            </div>
            {/* Mock progress bar for future LMS integration */}
            <div className="bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-orange-500 h-2 rounded-full w-1/3"></div>
            </div>
            <p className="text-sm text-gray-600">33% Complete • 3 of 9 lessons</p>
          </div>
        </div>
      </section>

      {/* Student Outcomes Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">
            Join Thousands of Scaling Entrepreneurs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">18,000+</div>
              <p className="text-gray-600">Modules Completed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">1,200+</div>
              <p className="text-gray-600">Scaling Businesses</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA Block */}
      <section className="py-20 px-6 bg-gradient-to-br from-purple-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Start Learning Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the community of entrepreneurs who've transformed chaos into clarity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                Take Free Quiz First
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              View Pricing Plans
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}