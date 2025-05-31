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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-16">
          {title}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {avatars.map((avatar, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">{avatar.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{avatar.title}</h3>
                <h4 className="text-lg font-semibold text-primary mb-4">{avatar.headline}</h4>
                <p className="text-slate-600">{avatar.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Link href="/courses">
            <Button size="lg" className="bg-primary hover:bg-blue-600">
              {cta}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}