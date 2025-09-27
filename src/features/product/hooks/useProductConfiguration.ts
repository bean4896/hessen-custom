import { useState, useMemo } from 'react';
import { ProductConfiguration } from '../../../shared/types/ecommerce';
import { productTabs } from '../data/productOptions';

export const useProductConfiguration = () => {
  const [selectedOptions, setSelectedOptions] = useState<ProductConfiguration>({
    material: 'rubberwood',
    size: 'queen',
    headboard: 'panel',
    bedframeBody: 'platform',
    finishColour: 'natural',
    optional: [],
  });

  // Calculate total price based on selected options
  const totalPrice = useMemo(() => {
    let total = 1299; // Base price

    productTabs.forEach(tab => {
      const selectedValue = selectedOptions[tab.category as keyof ProductConfiguration];
      
      if (selectedValue) {
        if (Array.isArray(selectedValue)) {
          // Handle optional items (array)
          selectedValue.forEach(optionId => {
            const option = tab.options.find(o => o.id === optionId);
            if (option) {
              total += option.price;
            }
          });
        } else {
          // Handle single selections
          const option = tab.options.find(o => o.id === selectedValue);
          if (option) {
            total += option.price;
          }
        }
      }
    });

    return total;
  }, [selectedOptions]);

  // Get configuration summary
  const configurationSummary = useMemo(() => {
    const { material, size, headboard, bedframeBody, finishColour } = selectedOptions;
    
    const formatName = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    
    return {
      title: `${formatName(material)} ${formatName(size)} Bed`,
      subtitle: `${formatName(finishColour)} Finish - ${formatName(headboard)} Headboard - ${formatName(bedframeBody)} Base`,
      details: {
        material: formatName(material),
        size: formatName(size),
        finish: formatName(finishColour),
        headboard: formatName(headboard),
        base: formatName(bedframeBody),
      }
    };
  }, [selectedOptions]);

  // Update a specific option
  const updateOption = (category: string, value: string | string[]) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  // Reset to default configuration
  const resetConfiguration = () => {
    setSelectedOptions({
      material: 'rubberwood',
      size: 'queen',
      headboard: 'panel',
      bedframeBody: 'platform',
      finishColour: 'natural',
      optional: [],
    });
  };

  // Get price breakdown
  const priceBreakdown = useMemo(() => {
    const breakdown = [
      { label: 'Base Price', price: 1299 }
    ];

    productTabs.forEach(tab => {
      const selectedValue = selectedOptions[tab.category as keyof ProductConfiguration];
      
      if (selectedValue) {
        if (Array.isArray(selectedValue)) {
          // Handle optional items
          selectedValue.forEach(optionId => {
            const option = tab.options.find(o => o.id === optionId);
            if (option && option.price > 0) {
              breakdown.push({
                label: option.title,
                price: option.price
              });
            }
          });
        } else {
          // Handle single selections
          const option = tab.options.find(o => o.id === selectedValue);
          if (option && option.price > 0) {
            breakdown.push({
              label: option.title,
              price: option.price
            });
          }
        }
      }
    });

    return breakdown;
  }, [selectedOptions]);

  return {
    selectedOptions,
    totalPrice,
    configurationSummary,
    priceBreakdown,
    updateOption,
    resetConfiguration,
  };
};
