import { Clock } from "lucide-react";
import Footer from "@/components/Footer";

export default function Community() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-8">
            <Clock className="w-12 h-12 text-slate-500" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Brandscaling Community
          </h1>
          
          <p className="text-xl text-slate-600 mb-8">
            Connect, learn, and grow with fellow entrepreneurs building extraordinary brands
          </p>
          
          <div className="inline-flex items-center justify-center px-6 py-3 bg-slate-100 rounded-full">
            <Clock className="w-5 h-5 text-slate-500 mr-2" />
            <span className="text-slate-600 font-medium">Coming Soon</span>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}