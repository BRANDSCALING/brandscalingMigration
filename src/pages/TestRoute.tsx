export function TestRoute() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          ✅ Routing Works!
        </h1>
        <p className="text-lg text-gray-700">
          Student routes are properly configured
        </p>
        <a href="/student/courses" className="mt-4 inline-block bg-blue-500 text-white px-6 py-3 rounded">
          Go to Student Courses
        </a>
      </div>
    </div>
  );
}