import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '@/components/PaymentForm';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutProps {
  courseId?: string;
  isSubscription?: boolean;
}

export default function Checkout() {
  const [location, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Parse URL params
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('courseId');
  const isSubscription = params.get('type') === 'subscription';
  const amount = params.get('amount');
  const title = params.get('title') || 'Course Purchase';

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        if (isSubscription) {
          const response = await apiRequest("POST", "/api/create-subscription");
          const data = await response.json();
          setClientSecret(data.clientSecret);
        } else {
          const response = await apiRequest("POST", "/api/create-payment-intent", {
            amount: parseInt(amount || "0"),
            courseId: courseId,
            currency: "usd"
          });
          const data = await response.json();
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        setError("Failed to initialize payment. Please try again.");
        console.error("Payment initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (amount || isSubscription) {
      createPaymentIntent();
    } else {
      setError("Invalid payment parameters");
      setLoading(false);
    }
  }, [courseId, isSubscription, amount]);

  const handleSuccess = () => {
    setLocation('/courses');
  };

  const handleBack = () => {
    setLocation('/courses');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Setting up your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-orange-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Payment Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">{error}</p>
            <Button onClick={handleBack} variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-orange-50">
        <p>Unable to initialize payment. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Button 
          onClick={handleBack} 
          variant="ghost" 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {isSubscription ? 'Complete Your Subscription' : 'Complete Your Purchase'}
            </CardTitle>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-2xl font-bold text-purple-600 mt-2">
                £{isSubscription ? '97/month' : (amount ? `${amount}` : '497')}
              </p>
            </div>
          </CardHeader>
          
          <CardContent>
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#7c3aed',
                  }
                }
              }}
            >
              <PaymentForm 
                onSuccess={handleSuccess} 
                isSubscription={isSubscription}
              />
            </Elements>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🔒 Your payment information is secure and encrypted</p>
        </div>
      </div>
    </div>
  );
}