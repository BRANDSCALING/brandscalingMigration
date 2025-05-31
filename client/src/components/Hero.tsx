import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface HeroProps {
  title: string;
  subtitle: string;
  cta1: string;
  cta2: string;
  backgroundStyle: string;
}

export default function Hero({ title, subtitle, cta1, cta2 }: HeroProps) {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-10">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/quiz">
            <Button size="lg" className="bg-primary hover:bg-blue-600 text-lg px-8 py-4">
              {cta1}
            </Button>
          </Link>
          <Link href="/courses">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white text-lg px-8 py-4">
              {cta2}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}