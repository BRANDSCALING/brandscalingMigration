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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {courses.map((course, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-3xl mb-4">{course.icon}</div>
                <CardTitle className="text-xl">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6">{course.description}</p>
                <Link href={course.link}>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link href={viewAllLink}>
            <Button size="lg" className="bg-primary hover:bg-blue-600">
              View All Courses <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}