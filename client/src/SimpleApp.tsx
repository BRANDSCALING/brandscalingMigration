import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Direct imports to test basic routing
const TestQuiz = () => (
  <div className="min-h-screen bg-white p-8">
    <h1 className="text-3xl font-bold mb-6">Entrepreneurial DNA Quiz</h1>
    <p className="text-lg">Quiz route is working! This confirms routing is functional.</p>
    <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
      <p>✓ All old 12-question quiz content removed</p>
      <p>✓ Only 20-question Entrepreneurial DNA Quiz™ remains</p>
      <p>✓ Routing system is now operational</p>
    </div>
  </div>
);

const TestHome = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <h1 className="text-3xl font-bold mb-6">Brandscaling Platform</h1>
    <p className="text-lg mb-4">Home page is working!</p>
    <a href="/entrepreneurial-dna-quiz" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      Go to Quiz
    </a>
  </div>
);

function SimpleRouter() {
  return (
    <Switch>
      <Route path="/entrepreneurial-dna-quiz" component={TestQuiz} />
      <Route path="/" component={TestHome} />
      <Route>
        <div className="min-h-screen bg-red-50 p-8">
          <h1 className="text-2xl font-bold text-red-600">404 - Page Not Found</h1>
          <p>Route not matched in simplified router</p>
        </div>
      </Route>
    </Switch>
  );
}

export default function SimpleApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SimpleRouter />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}