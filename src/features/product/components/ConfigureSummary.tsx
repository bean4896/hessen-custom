'use client';
import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ProductConfiguration } from '../../../shared/types/ecommerce';
import { productTabs } from '../data/productOptions';

interface ConfigureSummaryProps {
  selectedOptions: ProductConfiguration;
}

const ConfigureSummary: React.FC<ConfigureSummaryProps> = ({ selectedOptions }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getOptionLabel = (category: string, value: string) => {
    const tab = productTabs.find(t => t.category === category);
    if (!tab) return value;
    
    const option = tab.options.find(o => o.id === value);
    return option ? option.title : value;
  };

  const getOptionPrice = (category: string, value: string) => {
    const tab = productTabs.find(t => t.category === category);
    if (!tab) return 0;
    
    const option = tab.options.find(o => o.id === value);
    return option ? option.price : 0;
  };

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

  const getSelectedCount = () => {
    let count = 0;
    Object.entries(selectedOptions).forEach(([key, value]) => {
      if (key !== 'optional' && value) {
        count++;
      }
    });
    if (selectedOptions.optional && selectedOptions.optional.length > 0) {
      count += selectedOptions.optional.length;
    }
    return count;
  };

  const selectedCount = getSelectedCount();

  return (
    <Card className="mb-4">
      <CardContent className="p-0">
        {/* Header - Always Visible */}
        <div 
          className="p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="font-medium text-foreground">Configuration Summary</h3>
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20 w-fit">
                {selectedCount} selected
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-500">
                  ${totalPrice.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <Button variant="ghost" size="sm" className="p-1 h-auto">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-border/50">
            <div className="space-y-3 pt-4">
              {/* Material */}
              {selectedOptions.material && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Material</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {getOptionLabel('material', selectedOptions.material)}
                    </span>
                    {getOptionPrice('material', selectedOptions.material) > 0 && (
                      <span className="text-xs text-orange-500 flex items-center gap-1">
                        <Plus className="w-3 h-3" />
                        ${getOptionPrice('material', selectedOptions.material).toLocaleString()}
                      </span>
                    )}
                    <Check className="w-3 h-3 text-orange-500" />
                  </div>
                </div>
              )}

              {/* Size */}
              {selectedOptions.size && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Size</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {getOptionLabel('size', selectedOptions.size)}
                    </span>
                    {getOptionPrice('size', selectedOptions.size) > 0 && (
                      <span className="text-xs text-orange-500 flex items-center gap-1">
                        <Plus className="w-3 h-3" />
                        ${getOptionPrice('size', selectedOptions.size).toLocaleString()}
                      </span>
                    )}
                    <Check className="w-3 h-3 text-orange-500" />
                  </div>
                </div>
              )}

              {/* Headboard */}
              {selectedOptions.headboard && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Headboard</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {getOptionLabel('headboard', selectedOptions.headboard)}
                    </span>
                    {getOptionPrice('headboard', selectedOptions.headboard) > 0 && (
                      <span className="text-xs text-orange-500 flex items-center gap-1">
                        <Plus className="w-3 h-3" />
                        ${getOptionPrice('headboard', selectedOptions.headboard).toLocaleString()}
                      </span>
                    )}
                    <Check className="w-3 h-3 text-orange-500" />
                  </div>
                </div>
              )}

              {/* Bed Frame Body */}
              {selectedOptions.bedframeBody && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bed Frame</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {getOptionLabel('bedframeBody', selectedOptions.bedframeBody)}
                    </span>
                    {getOptionPrice('bedframeBody', selectedOptions.bedframeBody) > 0 && (
                      <span className="text-xs text-orange-500 flex items-center gap-1">
                        <Plus className="w-3 h-3" />
                        ${getOptionPrice('bedframeBody', selectedOptions.bedframeBody).toLocaleString()}
                      </span>
                    )}
                    <Check className="w-3 h-3 text-orange-500" />
                  </div>
                </div>
              )}

              {/* Finish Colour */}
              {selectedOptions.finishColour && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Finish</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {getOptionLabel('finishColour', selectedOptions.finishColour)}
                    </span>
                    {getOptionPrice('finishColour', selectedOptions.finishColour) > 0 && (
                      <span className="text-xs text-orange-500 flex items-center gap-1">
                        <Plus className="w-3 h-3" />
                        ${getOptionPrice('finishColour', selectedOptions.finishColour).toLocaleString()}
                      </span>
                    )}
                    <Check className="w-3 h-3 text-orange-500" />
                  </div>
                </div>
              )}

              {/* Optional Items */}
              {selectedOptions.optional && selectedOptions.optional.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Optional Items</span>
                    <Check className="w-3 h-3 text-orange-500" />
                  </div>
                  <div className="space-y-1">
                    {selectedOptions.optional.map((item, index) => (
                      <div key={index} className="flex items-center justify-between ml-4">
                        <span className="text-sm font-medium text-foreground">
                          {getOptionLabel('optional', item)}
                        </span>
                        <div className="flex items-center gap-2">
                          {getOptionPrice('optional', item) > 0 && (
                            <span className="text-xs text-orange-500 flex items-center gap-1">
                              <Plus className="w-3 h-3" />
                              ${getOptionPrice('optional', item).toLocaleString()}
                            </span>
                          )}
                          <Check className="w-3 h-3 text-orange-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No selections message */}
              {selectedCount === 0 && (
                <div className="text-center py-4">
                  <span className="text-sm text-muted-foreground">No options selected yet</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConfigureSummary;
