'use client';
import { useState, useMemo } from 'react';
import { ProductConfiguration } from '../types';
import { productTabs } from '../data/productOptions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronUp, 
  ChevronDown, 
  ShoppingCart, 
  Save, 
  X,
  Receipt
} from 'lucide-react';

interface FloatingOrderSummaryProps {
  selectedOptions: ProductConfiguration;
}

const FloatingOrderSummary: React.FC<FloatingOrderSummaryProps> = ({ selectedOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const { totalPrice, breakdown, orderedBreakdown } = useMemo(() => {
    let total = 1299; // Base price
    const breakdown: Array<{ label: string; price: number }> = [
      { label: 'Base Price', price: 1299 }
    ];

    const categoryOrder: (keyof ProductConfiguration)[] = ['material', 'finishColour', 'size', 'headboard', 'bedframeBody', 'optional'];

    const orderedBreakdown: Array<{
      category: string;
      label: string;
      price: number;
      selected: string;
      isSelected: boolean;
    }> = [];

    categoryOrder.forEach(category => {
      const tab = productTabs.find(t => t.category === category);
      if (tab) {
        const selectedValue = selectedOptions[category];

        if (selectedValue && selectedValue !== '') {
          const valueToCheck = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;
          const option = tab.options.find(o => o.id === valueToCheck);

          if (option) {
            orderedBreakdown.push({
              category: tab.label,
              label: option.title,
              price: option.price,
              selected: valueToCheck,
              isSelected: true
            });

            if (option.price !== 0) {
              total += option.price;
              breakdown.push({
                label: option.title,
                price: option.price
              });
            }
          }
        } else {
          orderedBreakdown.push({
            category: tab.label,
            label: 'Not Selected',
            price: 0,
            selected: '',
            isSelected: false
          });
        }
      }
    });

    return { totalPrice: total, breakdown, orderedBreakdown };
  }, [selectedOptions]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 p-4"
          size="lg"
        >
          <Receipt className="w-6 h-6 mr-2" />
          <div className="text-left">
            <div className="text-sm font-medium">Order Summary</div>
            <div className="text-lg font-bold">${totalPrice.toLocaleString()}</div>
          </div>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Floating Modal */}
      <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] max-h-[calc(100vh-6rem)] animate-slide-up">
        <Card className="border border-border shadow-2xl bg-card">
          <CardHeader className="pb-4 border-b border-border">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-foreground flex items-center">
                <Receipt className="w-5 h-5 mr-2 text-orange-500" />
                Order Summary
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-secondary text-muted-foreground hover:text-foreground"
                  title={isMinimized ? 'Expand Summary' : 'Minimize Summary'}
                >
                  {isMinimized ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-secondary text-muted-foreground hover:text-foreground"
                  title="Close Summary"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className={`transition-all duration-300 ease-in-out ${
            isMinimized ? 'max-h-0 opacity-0 overflow-hidden p-0' : 'max-h-[600px] opacity-100 p-6'
          }`}>
            {/* Configuration Details */}
            <div className="space-y-3 mb-6 max-h-40 overflow-y-auto">
              {orderedBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                  <div className="flex flex-col">
                    <Badge variant="outline" className="text-xs mb-1 w-fit border-border">
                      {item.category}
                    </Badge>
                    <span className={`text-sm font-medium ${
                      item.isSelected ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  {item.price !== 0 && item.isSelected && (
                    <Badge variant={item.price >= 0 ? "default" : "secondary"} className="text-sm font-semibold">
                      {item.price >= 0 ? `+$${item.price.toLocaleString()}` : `-$${Math.abs(item.price).toLocaleString()}`}
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            {breakdown.length > 1 && (
              <>
                <Separator className="bg-border my-4" />
                <div className="space-y-2">
                  {breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className={`font-medium ${item.price >= 0 ? 'text-foreground' : 'text-green-400'}`}>
                        {item.price >= 0 ? `+$${item.price.toLocaleString()}` : `-$${Math.abs(item.price).toLocaleString()}`}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Total Price */}
            <Separator className="bg-border my-4" />
            <div className="flex justify-between items-center mb-6 p-4 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg border border-orange-500/20">
              <span className="text-lg font-bold text-foreground">Total Price</span>
              <span className="text-2xl font-bold text-orange-500">
                ${totalPrice.toLocaleString()}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" className="w-full border-border hover:border-border/80 text-foreground hover:text-foreground hover:bg-secondary py-3 text-base">
                <Save className="w-5 h-5 mr-2" />
                Save Configuration
              </Button>
            </div>
          </CardContent>

          {/* Minimized State - Show only total price */}
          {isMinimized && (
            <CardContent className="py-4">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg border border-orange-500/20">
                <span className="text-sm font-medium text-muted-foreground">Total</span>
                <span className="text-xl font-bold text-orange-500">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default FloatingOrderSummary;
