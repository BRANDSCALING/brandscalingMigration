import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="font-poppins">
        {/* Hero Section */}
        <section className="px-6 py-16 max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">Brandscaling</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {/* INSERT REAL HERO CONTENT */}
          </p>
        </section>

        {/* Content sections await real copy */}
        <section className="px-6 py-16 max-w-6xl mx-auto">
          {/* AWAITING REAL CONTENT */}
        </section>
      </main>
      
      <Footer />
    </div>
  );
}