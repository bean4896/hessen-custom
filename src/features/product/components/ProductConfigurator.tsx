'use client';
import { useState, useMemo } from 'react';
import TabNavigation from './TabNavigation';
import OptionGrid from './OptionGrid';
import { getProductTabs } from '../../../shared/utils/productManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FlexibleProductConfiguratorProps {
  // Accept any configuration shape and cast internally for flexibility
  selectedOptions: unknown;
  onOptionChange: (category: string, value: string | string[]) => void;
  productId: string;
}

const ProductConfigurator: React.FC<FlexibleProductConfiguratorProps> = ({
  selectedOptions,
  onOptionChange,
  productId
}) => {
  const optionRecord = selectedOptions as Record<string, string | string[]>;
  const [activeTab, setActiveTab] = useState<string>('material');
  
  const productTabs = useMemo(() => {
    return getProductTabs(productId);
  }, [productId]);

  const activeTabConfig = useMemo(() => {
    return productTabs.find(tab => tab.id === activeTab);
  }, [activeTab, productTabs]);

  const handleOptionSelect = (value: string): void => {
    if (activeTabConfig) {
      onOptionChange(activeTabConfig.category as string, value);
    }
  };

  const getCurrentSelectedValue = (): string => {
    if (!activeTabConfig) return '';
    if (activeTab === 'optional') return '';
    const selectedValue = optionRecord[activeTabConfig.category];
    return Array.isArray(selectedValue) ? selectedValue[0] || '' : selectedValue || '';
  };

  return (
    <div className="flex flex-col h-full lg:min-h-0 overflow-x-hidden">
      {/* Tab Navigation */}
      <div className="p-3 lg:p-8 border-b border-border">
        <TabNavigation
          tabs={productTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Options Grid */}
      <div className="flex-1 p-3 lg:p-8 overflow-y-auto overflow-x-hidden">
        {activeTabConfig && (
          <div>
            <h3 className="text-base lg:text-lg font-semibold text-foreground mb-3 lg:mb-4">
              {activeTabConfig.label}
            </h3>
            <OptionGrid
              options={activeTabConfig.options}
              selectedValue={getCurrentSelectedValue()}
              onOptionSelect={handleOptionSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductConfigurator;
