'use client';
import { useState, useMemo } from 'react';
import { ProductConfiguratorProps } from '../types';
import TabNavigation from './TabNavigation';
import OptionGrid from './OptionGrid';
import { productTabs } from '../data/productOptions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProductConfigurator: React.FC<ProductConfiguratorProps> = ({
  selectedOptions,
  onOptionChange
}) => {
  const [activeTab, setActiveTab] = useState<string>('material');

  const activeTabConfig = useMemo(() => {
    return productTabs.find(tab => tab.id === activeTab);
  }, [activeTab]);

  const handleOptionSelect = (value: string): void => {
    if (activeTabConfig) {
      onOptionChange(activeTabConfig.category as string, value);
    }
  };

  const getCurrentSelectedValue = (): string => {
    if (!activeTabConfig) return '';
    if (activeTab === 'optional') return '';
    const selectedValue = selectedOptions[activeTabConfig.category];
    return Array.isArray(selectedValue) ? selectedValue[0] || '' : selectedValue || '';
  };

  return (
    <div className="flex flex-col h-full lg:min-h-0">
      {/* Tab Navigation */}
      <div className="p-4 lg:p-8 border-b border-border">
        <TabNavigation
          tabs={productTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Options Grid */}
      <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
        {activeTabConfig && (
          <div>
            <h3 className="text-base lg:text-lg font-semibold text-foreground mb-4">
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
