import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import StudentHeader from "./StudentHeader";

export default function StudentWorkbooks() {
  const { userProfile } = useFirebaseAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Digital Workbooks</h1>
          {/* AWAITING REAL WORKBOOK CONTENT */}
        </div>
      </div>
    </div>
  );
}