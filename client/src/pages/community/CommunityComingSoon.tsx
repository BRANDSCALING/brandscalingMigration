import { Bell } from "lucide-react";

export default function CommunityComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {/* AWAITING REAL CONTENT */}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {/* AWAITING REAL CONTENT */}
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-medium">
            <Bell className="h-4 w-4 mr-2" />
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}