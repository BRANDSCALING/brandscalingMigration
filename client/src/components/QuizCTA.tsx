import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface QuizCTAProps {
  heading: string;
  paragraph: string;
  cta1: string;
  cta2: string;
  background: string;
}

export default function QuizCTA({ heading, paragraph, cta1, cta2 }: QuizCTAProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-architect-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-lg">
          {heading}
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed drop-shadow">
          {paragraph}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/quiz">
            <Button size="lg" className="bg-white text-brand-purple hover:bg-gray-50 text-lg px-8 py-4 shadow-xl">
              {cta1}
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-purple text-lg px-8 py-4 shadow-xl">
              {cta2}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}