import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface Avatar {
  icon: string;
  title: string;
  headline: string;
  description: string;
}

interface AvatarsProps {
  title: string;
  avatars: Avatar[];
  cta: string;
}

export default function Avatars({ title, avatars, cta }: AvatarsProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brandscaling-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16 drop-shadow-lg">
          {title}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {avatars.map((avatar, index) => (
            <Card key={index} className="text-center hover:shadow-xl transition-all hover:transform hover:scale-105 bg-white/90 backdrop-blur-sm border-0">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">{avatar.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{avatar.title}</h3>
                <h4 className="text-lg font-semibold text-brand-purple mb-4">{avatar.headline}</h4>
                <p className="text-slate-600">{avatar.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Link href="/courses">
            <Button size="lg" className="bg-white text-brand-purple hover:bg-gray-50 shadow-xl">
              {cta}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}