'use client';

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface StripeProviderProps {
  clientSecret: string;
  children: React.ReactNode;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ clientSecret, children }) => {
  console.log('🔑 Stripe public key:', process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ? 'Loaded' : 'Missing');
  console.log('🔐 Client secret:', clientSecret ? 'Present' : 'Missing');
  
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe', // Can be 'stripe', 'flat', or 'none'
      variables: {
        colorPrimary: '#ea580c', // Orange-600
        colorBackground: '#0a0a0a', // Black-ish background
        colorText: '#e5e7eb', // Foreground text
        colorDanger: '#ef4444', // Red-500
        fontFamily: 'Geist Sans, sans-serif',
        spacingUnit: '4px',
        borderRadius: '0.5rem',
      },
      rules: {
        '.Input': {
          backgroundColor: '#171717', // Secondary background
          borderColor: '#262626', // Border color
          color: '#e5e7eb', // Text color
        },
        '.Input--invalid': {
          borderColor: '#ef4444',
        },
        '.Label': {
          color: '#a1a1aa', // Muted foreground
        },
        '.Error': {
          color: '#ef4444',
        },
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
