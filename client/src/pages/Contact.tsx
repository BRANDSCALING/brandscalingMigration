
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      
      <main className="font-poppins">
        <div className="px-6 py-12 max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-brand-purple mb-2">
            📬 Contact Brandscaling
          </h1>
          <p className="text-lg text-gray-700 mb-10">
            Let's build something extraordinary—together.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-purple mb-2">🤝 General Enquiries</h2>
            <p className="mb-2 text-gray-700">
              Have a question, idea, or proposal? We'd love to hear from you.
            </p>
            <p className="text-gray-700">📧 <strong>Email:</strong> team@brandscaling.com</p>
            <p className="text-sm text-gray-500">🕒 Response Time: Within 48 hours (weekdays)</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-purple mb-2">🚀 Work With Us</h2>
            <p className="text-gray-700 mb-4">
              Ready to explore our mastermind, private consulting, or embedded partnership?
              Fill in the form and we'll personally review your application.
            </p>

            <form className="grid grid-cols-1 gap-6 max-w-xl">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="border border-gray-300 px-4 py-3 rounded-lg"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="border border-gray-300 px-4 py-3 rounded-lg"
                required
              />
              <textarea
                name="message"
                placeholder="Tell us about your goals or enquiry..."
                className="border border-gray-300 px-4 py-3 rounded-lg"
                rows={5}
                required
              ></textarea>
              <button
                type="submit"
                className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                Submit Application
              </button>
            </form>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-purple mb-2">📍 Brandscaling HQ</h2>
            <p className="text-gray-700">
              We operate globally. Our founders are currently based between the UK and UAE.
            </p>
            <p className="text-gray-700">
              Want to bring Brandscaling to your city or event? Mention it in your message above.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-brand-purple mb-4">🧬 Stay Connected</h2>
            <p className="text-gray-600">Social media links will be added once channels are active.</p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}