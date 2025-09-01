import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Thank You</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {/* AWAITING REAL THANK YOU MESSAGE */}
        </CardContent>
      </Card>
    </div>
  );
}