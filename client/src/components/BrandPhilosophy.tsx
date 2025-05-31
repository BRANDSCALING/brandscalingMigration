interface BrandPhilosophyProps {
  heading: string;
  paragraph: string;
  visualType: string;
}

export default function BrandPhilosophy({ heading, paragraph }: BrandPhilosophyProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
          {heading}
        </h2>
        <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
          {paragraph}
        </p>
      </div>
    </section>
  );
}