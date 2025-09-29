'use client';
import { JSX, useState } from 'react';
import ProductGallery from '../features/product/components/ProductGallery';
import ProductConfigurator from '../features/product/components/ProductConfigurator';
import PriceSummary from '../features/product/components/PriceSummary';
import Navbar from '../components/layout/Navbar';
import { ProductConfiguration } from '../shared/types/ecommerce';

export default function Home(): JSX.Element {
  const [selectedOptions, setSelectedOptions] = useState<ProductConfiguration>({
    material: 'rubberwood',
    size: 'queen',
    headboard: 'panel',
    bedframeBody: 'platform',
    finishColour: 'natural',
    optional: [] // Initialize optional as an empty array
  });

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
          <ProductGallery selectedOptions={selectedOptions} />
        </div>

        {/* Right Side - Configuration Panel */}
        <div className="w-full lg:w-[500px] lg:border-l border-border bg-card flex flex-col lg:max-h-[calc(100vh-4rem)]">
          <ProductConfigurator
            selectedOptions={selectedOptions}
            onOptionChange={handleOptionChange}
          />
          
          {/* Fixed Price Summary at Bottom */}
          <div className="mt-auto p-4 lg:p-8 border-t border-border bg-card">
            <PriceSummary selectedOptions={selectedOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
