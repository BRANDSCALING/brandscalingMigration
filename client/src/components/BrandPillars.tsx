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
  const gradients = [
    'bg-gradient-to-br from-purple-600 to-blue-600',
    'bg-alchemist-gradient',
    'bg-gradient-to-br from-pink-500 to-rose-500'
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-purple mb-4">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-slate-600">
            {subtitle}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <Link key={index} href={pillar.link}>
              <Card className={`text-center hover:shadow-xl transition-all hover:transform hover:scale-105 cursor-pointer border-0 text-white ${gradients[index]} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <CardHeader className="relative">
                  <CardTitle className="text-2xl text-white drop-shadow-lg">{pillar.name}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-white/90 drop-shadow">{pillar.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}