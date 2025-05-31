import { Card, CardContent } from "@/components/ui/card";

interface Quote {
  text: string;
  author: string;
  color: string;
}

interface ReflectionQuotesProps {
  quotes: Quote[];
}

export default function ReflectionQuotes({ quotes }: ReflectionQuotesProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {quotes.map((quote, index) => (
            <Card key={index} className={`border-l-4 ${quote.color === 'indigo' ? 'border-l-indigo-500 bg-indigo-50' : 'border-l-orange-500 bg-orange-50'}`}>
              <CardContent className="p-8">
                <blockquote className="text-xl md:text-2xl font-medium text-slate-900 mb-4">
                  "{quote.text}"
                </blockquote>
                <cite className={`text-lg font-semibold ${quote.color === 'indigo' ? 'text-indigo-600' : 'text-orange-600'}`}>
                  — {quote.author}
                </cite>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}