import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function Courses() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="font-poppins">
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-600 mb-4">Courses Coming Soon</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our course catalog is being developed and will be available soon.
            </p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}