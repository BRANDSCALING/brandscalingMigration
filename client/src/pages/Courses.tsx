import Footer from "@/components/Footer";
import { BookOpen } from "lucide-react";

export default function Courses() {
  return (
    <div className="min-h-screen bg-white">
      <main className="font-poppins">
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-600 mb-4">Courses Coming Soon</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {/* AWAITING REAL CONTENT */}
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}