'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { CartProvider } from '@/hooks/useCart';
import { SavedConfigurationsProvider } from '@/hooks/useSavedConfigurations';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <NextAuthSessionProvider>
      <CartProvider>
        <SavedConfigurationsProvider>
          {children}
        </SavedConfigurationsProvider>
      </CartProvider>
    </NextAuthSessionProvider>
  );
}
