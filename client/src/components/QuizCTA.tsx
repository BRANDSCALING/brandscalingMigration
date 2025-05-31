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
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
          {heading}
        </h2>
        <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
          {paragraph}
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/quiz">
            <Button size="lg" className="bg-primary hover:bg-blue-600 text-lg px-8 py-4">
              {cta1}
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white text-lg px-8 py-4">
              {cta2}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}