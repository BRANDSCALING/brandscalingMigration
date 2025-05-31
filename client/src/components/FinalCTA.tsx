import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

interface FinalCTAProps {
  heading: string;
  cta1: string;
  cta2: string;
}

export default function FinalCTA({ heading, cta1, cta2 }: FinalCTAProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              {heading}
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/quiz">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-4">
                  {cta1}
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4">
                  {cta2}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}