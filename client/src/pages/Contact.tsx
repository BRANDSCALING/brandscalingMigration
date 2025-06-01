
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      
      <main className="font-poppins">
        <div className="px-6 py-12 max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-brand-purple mb-2">
            {/* AWAITING REAL CONTENT */}
          </h1>
          <p className="text-lg text-gray-700 mb-10">
            {/* AWAITING REAL CONTENT */}
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-purple mb-2">{/* AWAITING REAL CONTENT */}</h2>
            <p className="mb-2 text-gray-700">
              {/* AWAITING REAL CONTENT */}
            </p>
            <p className="text-gray-700"><strong>Email:</strong> {/* AWAITING REAL CONTENT */}</p>
            <p className="text-sm text-gray-500">{/* AWAITING REAL CONTENT */}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-purple mb-2">{/* AWAITING REAL CONTENT */}</h2>
            <p className="text-gray-700 mb-4">
              {/* AWAITING REAL CONTENT */}
            </p>

            <form className="grid grid-cols-1 gap-6 max-w-xl">
              <input
                type="text"
                name="name"
                placeholder=""
                className="border border-gray-300 px-4 py-3 rounded-lg"
                required
              />
              <input
                type="email"
                name="email"
                placeholder=""
                className="border border-gray-300 px-4 py-3 rounded-lg"
                required
              />
              <textarea
                name="message"
                placeholder=""
                className="border border-gray-300 px-4 py-3 rounded-lg"
                rows={5}
                required
              ></textarea>
              <button
                type="submit"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                {/* AWAITING REAL CONTENT */}
              </button>
            </form>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-purple mb-2">{/* AWAITING REAL CONTENT */}</h2>
            <p className="text-gray-700">
              {/* AWAITING REAL CONTENT */}
            </p>
            <p className="text-gray-700">
              {/* AWAITING REAL CONTENT */}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-brand-purple mb-4">{/* AWAITING REAL CONTENT */}</h2>
            <p className="text-gray-600">{/* AWAITING REAL CONTENT */}</p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}