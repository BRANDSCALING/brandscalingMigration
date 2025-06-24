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
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover opacity-10"
          onError={(e) => {
            console.log('Video failed to load:', e);
            // Hide video and show gradient background
            const target = e.target as HTMLVideoElement;
            target.style.display = 'none';
          }}
        >
          <source src="/logo-loop.mp4" type="video/mp4" />
          <source src="/attached_assets/Logo Loop_1750765292518.mov" type="video/mp4" />
        </video>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-purple-50"></div>
        <div className="absolute inset-0 bg-brandscaling-gradient opacity-5"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Logo Video in Center */}
        <div className="flex justify-center mb-8">
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain rounded-full"
              onLoad={() => console.log('Logo video loaded successfully')}
              onError={(e) => {
                console.log('Logo video failed to load:', e);
                // Fallback to brand icon
                const target = e.target as HTMLVideoElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            >
              <source src="/logo-loop.mp4" type="video/mp4" />
              <source src="/attached_assets/Logo Loop_1750765292518.mov" type="video/mp4" />
            </video>
            {/* Fallback brand icon */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-brand-orange rounded-full items-center justify-center text-white font-bold text-4xl hidden">
              BS
            </div>
          </div>
        </div>
        
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