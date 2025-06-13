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
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-slate-50 to-purple-50">
      <div className="absolute inset-0 bg-brandscaling-gradient opacity-5"></div>
      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-brand-purple mb-6">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-10">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/entrepreneurial-dna-quiz">
            <Button size="lg" className="bg-brand-orange hover:bg-brand-coral text-white text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all">
              {cta1}
            </Button>
          </Link>
          <Link href="/courses">
            <Button size="lg" variant="outline" className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all">
              {cta2}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}