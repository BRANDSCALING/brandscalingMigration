import Header from "@/components/Header";
import Footer from "@/components/Footer";

function FoundersSection() {
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto text-slate-700">
      <h2 className="text-4xl font-bold text-center mb-2 text-brand-purple">Meet the Duo Behind the Brandscaling™</h2>
      <p className="text-xl text-center mb-12 font-bold text-brand-orange">Alchemist Meets Architect. Emotion Meets Execution.</p>

      <p className="mb-8 text-center max-w-3xl mx-auto text-lg">
        Together, Fariza Javed and Hanif Khan built Brandscaling to further expand their own portfolio of investments and help entrepreneurs scale without distortion—by aligning structure with energy, profit with purpose, and frameworks with frequency.
      </p>

      <hr className="my-12 border-t border-brand-purple" />

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-2 text-brand-purple">Fariza Javed — The Alchemist</h3>
        <p className="font-bold mb-4 text-brand-orange">Warm. Magnetic. Empowering.</p>
        <p className="mb-4">
          Fariza brings ignition to everything she touches. With an instinctive gift for emotional clarity and high-frequency leadership, she helps clients unlock momentum by leaning into their inner brilliance.
        </p>
        <p className="mb-4">
          But Fariza's power doesn't come from theory—it's lived.
        </p>
        <p className="mb-4">
          At just 23, she launched her first business: Property People, a letting agency to then venturing out building and investing in various fields. Her most recent before retiring was a global beauty distribution business supplying hundreds of SKUs from multiple brands, that scaled across the UK, Europe, South Korea & the United States, combining logistics, branding, and ecommerce and supplying every major retailer from Harrods, Sephora, Selfridges, Boots, Next, Beauty Bay, Look Fantastic, Cult Beauty, Feel Unique, and Urban Outfitters—all while raising four children.
        </p>
        <p className="mb-4">
          As a mentor and strategist, Fariza has helped multiple founders unlock growth by removing internal resistance, simplifying brand messaging, and reconnecting to the parts of their business that still feel magnetic. She helps founders scale without silencing themselves—and lead without leaking energy and find their business's true voice and vision.
        </p>
      </div>

      <hr className="my-12 border-t border-brand-purple" />

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-2 text-brand-purple">Hanif Khan — The Architect</h3>
        <p className="font-bold mb-4 text-brand-orange">Strategic. Analytical. Systems-Driven.</p>
        <p className="mb-4">
          Hanif brings order to chaos. A former software architect at BAE Systems (British Aerospace), he transitioned from coding critical systems to designing business infrastructures that scale.
        </p>
        <p className="mb-4">
          After entering property, Hanif co-founded Albright Estates, building a portfolio with automation at its core. He then launched the TYCOON mastermind alliance helping property entrepreneurs grow and scale. His obsession: turning bottlenecks into flow states—and transforming expertise into scalable, sellable IP.
        </p>
        <p className="mb-4">
          Angel Investor, working closely with a number of V.Cs. Patented the Loft Storage Stilt, built a huge distribution business turning over millions per month supplying every major UK DIY, home & hardware retailer with multiple products, including B&Q, Screwfix, Travis Perkins to name a few.
        </p>
        <p className="mb-4">
          What sets Hanif apart is his ability to map the logic behind growth—across sales, teams, delivery, and offers. His frameworks have helped founders move from scattered to being strategically empowered. One of the greatest strategists you'll ever meet. His ability to instantly see what's broken in a business before the founder can name it—explain the problem and teach the solution in the simplest of manners—and then build what's needed to fix it.
        </p>
      </div>

      <hr className="my-12 border-t border-brand-purple" />

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-2 text-brand-purple">Together at Brandscaling</h3>
        <p className="mb-4">
          After semi-retiring during the COVID lockdown to focus on their newborn and travel the world, Fariza and Hanif shifted focus from their own ventures to mentoring others. What began as something to increase their bandwidth evolved into a movement—helping founders and entrepreneurs at every level move from stuck to scaling through their unique dual-mode method: The Architect & The Alchemist.
        </p>
        <p className="mb-4">
          Whilst focusing on acquisitions and growing their own portfolio, they also lead Brandscaling's high-ticket mastermind, live events, and embedded consulting—partnering with founders to scale without burnout, build ecosystems, and embed their genius into something that lasts.
        </p>
        <p className="mb-6">
          This is more than business strategy, more than an energetic infrastructure of scaling.
        </p>
        <p className="font-bold text-center text-xl text-brand-purple">
          This Is Infinite Scaling
        </p>
      </div>
    </section>
  );
}

function HeroSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-slate-50 to-purple-50">
      <div className="absolute inset-0 bg-brandscaling-gradient opacity-5"></div>
      <div className="relative max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-brand-purple mb-6">
          About Brandscaling
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
          Where strategy meets soul. Where systems meet spirit. Where scaling becomes infinite.
        </p>
      </div>
    </section>
  );
}

function MissionSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brandscaling-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-black/15"></div>
      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 drop-shadow-lg">
          Our Mission
        </h2>
        <p className="text-lg md:text-xl text-white/90 mb-6 drop-shadow">
          We believe every entrepreneur has a unique operating system—Architect or Alchemist—and when you understand yours, scaling becomes effortless.
        </p>
        <p className="text-lg md:text-xl text-white/90 drop-shadow">
          We help founders build businesses that grow without burning out, systems that scale without losing soul, and strategies that work with—not against—their natural energy.
        </p>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="font-poppins">
        <HeroSection />
        <MissionSection />
        <FoundersSection />
      </main>
      
      <Footer />
    </div>
  );
}