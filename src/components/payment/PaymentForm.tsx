'use client';

import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';

interface PaymentFormProps {
  paymentIntentId: string | null;
  items: any[];
  shippingInfo: any;
  total: number;
  onSuccess: (order: any) => void;
  onValidationError?: (errors: Record<string, string>) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ paymentIntentId, items, shippingInfo, total, onSuccess, onValidationError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateShippingForm = () => {
    const errors: Record<string, string> = {};
    
    if (!shippingInfo.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!shippingInfo.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!shippingInfo.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!shippingInfo.phone?.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!shippingInfo.address?.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!shippingInfo.city?.trim()) {
      errors.city = 'City is required';
    }
    
    if (!shippingInfo.postalCode?.trim()) {
      errors.postalCode = 'Postal code is required';
    }
    
    if (!shippingInfo.country?.trim()) {
      errors.country = 'Country is required';
    }
    
    if (Object.keys(errors).length > 0) {
      // Notify parent component of validation errors for field highlighting
      if (onValidationError) {
        onValidationError(errors);
      }
      
      // Find the first missing field and scroll to it
      const firstErrorField = Object.keys(errors)[0];
      const fieldElement = document.getElementById(firstErrorField);
      if (fieldElement) {
        fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        fieldElement.focus();
      }
      
      setMessage(`Please complete all required fields: ${Object.keys(errors).join(', ')}`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Validate shipping form before processing payment
    if (!validateShippingForm()) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success`, // Fallback URL
      },
      redirect: 'if_required', // Prevent redirect for embedded flow
    });

    if (error) {
      setMessage(error.message || 'An error occurred');
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Create order in database after successful payment
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingInfo,
          total: total / 1.09, // Remove GST for subtotal
          isGuest: true, // Will be determined on server
          stripePaymentIntentId: paymentIntent.id,
        }),
      });

      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        setMessage('Payment succeeded!');
        // Pass the order with the stripe payment intent ID for the success page
        onSuccess({ ...orderData.order, stripePaymentIntentId: paymentIntent.id });
      } else {
        const errorData = await orderResponse.json();
        console.error('Order creation failed:', errorData);
        setMessage(`Payment succeeded, but failed to create order: ${errorData.details || errorData.error}`);
      }
      setIsLoading(false);
    } else {
      setMessage('An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
      <Button 
        disabled={isLoading || !stripe || !elements} 
        type="submit" 
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Confirm Checkout - ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </>
        )}
      </Button>
      {message && <div id="payment-message" className="text-red-500 text-sm mt-4">{message}</div>}
    </form>
  );
};

export default PaymentForm;
