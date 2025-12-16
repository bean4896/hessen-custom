'use client';
import { JSX, useState } from 'react';
import ProductGallery from '../../features/product/components/ProductGallery';
import ProductConfigurator from '../../features/product/components/ProductConfigurator';
import PriceSummary from '../../features/product/components/PriceSummary';
import MobileBottomPanel from '../../features/product/components/MobileBottomPanel';
import Navbar from '../../components/layout/Navbar';
import { ProductConfiguration } from '../../shared/types/ecommerce';
import { getDefaultConfiguration } from '../../shared/utils/productManager';

export default function LivingRoomWallPage(): JSX.Element {
  const [selectedOptions, setSelectedOptions] = useState<ProductConfiguration>(
    // `getDefaultConfiguration` returns a generic record, but for
    // the `living-room-wall` product we know the keys map to our configuration shape.
    getDefaultConfiguration('living-room-wall') as unknown as ProductConfiguration
  );

  const handleOptionChange = (category: string, value: string | string[]): void => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Content - Responsive Layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-x-hidden">
        {/* Left Side - Product Display */}
        <div className="flex-1 flex flex-col lg:min-h-0">
          <ProductGallery selectedOptions={selectedOptions} productId="living-room-wall" />
        </div>

        {/* Right Side - Configuration Panel */}
        <div className="w-full lg:w-[500px] lg:border-l border-border bg-card flex flex-col lg:max-h-[calc(100vh-4rem)]">
          {/* Desktop: Normal flow */}
          <div className="hidden lg:flex flex-col h-full">
            <ProductConfigurator
              selectedOptions={selectedOptions}
              onOptionChange={handleOptionChange}
              productId="living-room-wall"
            />
            
            {/* Fixed Price Summary at Bottom */}
            <div className="mt-auto p-4 lg:p-8 border-t border-border bg-card">
              <PriceSummary selectedOptions={selectedOptions} />
            </div>
          </div>

          {/* Mobile: Bottom flow with sticky configurator */}
          <div className="lg:hidden flex flex-col h-full pb-48">
            {/* Spacer to push configurator to bottom */}
            <div className="flex-1 min-h-0"></div>
            
            {/* Mobile Configurator - Sticky at bottom */}
            <div className="bg-card border-t border-border shadow-lg">
              <ProductConfigurator
                selectedOptions={selectedOptions}
                onOptionChange={handleOptionChange}
                productId="living-room-wall"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Panel */}
      <MobileBottomPanel selectedOptions={selectedOptions} />
    </div>
  );
}
