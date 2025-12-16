'use client';
import { useMemo, useState } from 'react';
import { ShoppingCart, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductConfiguration } from '../../../shared/types/ecommerce';
import { productTabs } from '../data/productOptions';
import { useCart } from '@/hooks/useCart';
import { useSavedConfigurations } from '@/hooks/useSavedConfigurations';
import ConfigureSummary from './ConfigureSummary';

interface MobileBottomPanelProps {
  selectedOptions: ProductConfiguration;
}

const MobileBottomPanel: React.FC<MobileBottomPanelProps> = ({ selectedOptions }) => {
  const { addItem } = useCart();
  const { addConfiguration } = useSavedConfigurations();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);


  const totalPrice = useMemo(() => {
    let total = 1299; // Base price
    const categoryOrder: (keyof ProductConfiguration)[] = ['material', 'finishColour', 'size', 'headboard', 'bedframeBody', 'optional'];

    categoryOrder.forEach(category => {
      const tab = productTabs.find(t => t.category === category);
      if (tab) {
        const selectedValue = selectedOptions[category];
        if (selectedValue && selectedValue !== '') {
          const valueToCheck = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;
          const option = tab.options.find(o => o.id === valueToCheck);
          if (option && option.price !== 0) {
            total += option.price;
          }
        }
      }
    });

    return total;
  }, [selectedOptions]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const configSummary = `${selectedOptions.material} ${selectedOptions.size} Bed - ${selectedOptions.finishColour} Finish - ${selectedOptions.headboard} Headboard`;

    addItem({
      productId: 'bed-frame-001',
      quantity: 1,
      price: totalPrice,
      totalPrice: totalPrice,
      name: configSummary,
      image: `https://hessen.sg/wp-content/uploads/2024/02/${selectedOptions.material}_${selectedOptions.finishColour}.webp`,
      configuration: {
        material: selectedOptions.material,
        size: selectedOptions.size,
        headboard: selectedOptions.headboard,
        bedframeBody: selectedOptions.bedframeBody,
        finishColour: selectedOptions.finishColour,
        optional: Array.isArray(selectedOptions.optional) ? selectedOptions.optional : [],
      },
    });

    setAdded(true);
    setIsAdding(false);
    
    // Reset the added state after 2 seconds
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSaveConfiguration = async () => {
    setIsSaving(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const configName = `${selectedOptions.material} ${selectedOptions.size} Bed - ${selectedOptions.finishColour} Finish`;

    addConfiguration({
      name: configName,
      productType: 'bedframe',
      configuration: selectedOptions,
    });

    setSaved(true);
    setIsSaving(false);
    
    // Reset the saved state after 2 seconds
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-40">
      <div className="p-4 space-y-4">
        {/* Configuration Summary */}
        <ConfigureSummary selectedOptions={selectedOptions} />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button 
            onClick={handleAddToCart}
            disabled={isAdding || added}
            className={`w-full font-semibold py-3 text-base ${
              added 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Added to Cart
              </>
            ) : isAdding ? (
              <>
                <ShoppingCart className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleSaveConfiguration}
            disabled={isSaving || saved}
            variant="outline" 
            className={`w-full border-border hover:border-border/80 text-foreground hover:text-foreground hover:bg-secondary text-base ${
              saved 
                ? 'border-green-500 bg-green-500/10 text-green-500' 
                : ''
            }`}
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Configuration Saved
              </>
            ) : isSaving ? (
              <>
                <Save className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileBottomPanel;
