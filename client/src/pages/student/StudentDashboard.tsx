import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import StudentHeader from "./StudentHeader";

export default function StudentDashboard() {
  const { userProfile } = useFirebaseAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {userProfile?.firstName || 'Student'}
          </h1>
          {/* AWAITING REAL STUDENT DASHBOARD CONTENT */}
        </div>
      </div>
    </div>
  );
}