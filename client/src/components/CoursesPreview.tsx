import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

interface Course {
  icon: string;
  title: string;
  description: string;
  link: string;
}

interface CoursesPreviewProps {
  title: string;
  subtitle: string;
  courses: Course[];
  viewAllLink: string;
}

export default function CoursesPreview({ title, subtitle, courses, viewAllLink }: CoursesPreviewProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-architect-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto drop-shadow">
            {subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {courses.map((course, index) => (
            <Card key={index} className="hover:shadow-xl transition-all hover:transform hover:scale-105 bg-white/90 backdrop-blur-sm border-0">
              <CardHeader>
                <div className="text-3xl mb-4">{course.icon}</div>
                <CardTitle className="text-xl text-slate-900">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6">{course.description}</p>
                <Link href={course.link}>
                  <Button variant="outline" className="w-full border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link href={viewAllLink}>
            <Button size="lg" className="bg-white text-brand-purple hover:bg-gray-50 shadow-xl">
              View All Courses <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}