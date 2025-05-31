import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

interface Pillar {
  name: string;
  description: string;
  link: string;
}

interface BrandPillarsProps {
  title: string;
  subtitle: string;
  pillars: Pillar[];
}

export default function BrandPillars({ title, subtitle, pillars }: BrandPillarsProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-slate-600">
            {subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <Link key={index} href={pillar.link}>
              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">{pillar.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{pillar.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}