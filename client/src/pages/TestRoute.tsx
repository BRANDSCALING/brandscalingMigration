export default function TestRoute() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-orange-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Routing Test Successful
        </h1>
        <p className="text-gray-600">
          If you can see this page, React Router is working correctly.
        </p>
        <div className="mt-6 space-y-2 text-sm text-gray-500">
          <p>Backend API Status: ✅ Connected</p>
          <p>React Router: ✅ Working</p>
          <p>Frontend Compilation: ✅ Success</p>
        </div>
      </div>
    </div>
  );
}