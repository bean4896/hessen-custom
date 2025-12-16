import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface OptionItem {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
}

interface OptionCardProps {
  option: OptionItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const OptionCard: React.FC<OptionCardProps> = ({ option, isSelected, onSelect }) => {
  return (
    <Button
      onClick={() => onSelect(option.id)}
      variant="ghost"
      className={`w-full p-2 lg:p-3 border transition-all duration-200 hover:bg-secondary/50 h-auto min-h-[60px] lg:min-h-auto ${
        isSelected
          ? 'border-orange-500 bg-orange-500/10'
          : 'border-border/30 hover:border-border'
      }`}
    >
      <div className="flex flex-col gap-2 w-full text-left">
        {/* Color/Material Swatch */}
        <div className="relative w-full aspect-square rounded border border-border/50 overflow-hidden flex-shrink-0">
          <img
            src={option.image}
            alt={option.title}
            className="w-full h-full object-cover"
          />
          {isSelected && (
            <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            </div>
          )}
        </div>

        {/* Option Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h3 className={`font-medium text-xs sm:text-sm ${
              isSelected ? 'text-orange-400' : 'text-foreground'
            }`}>
              {option.title}
            </h3>
            {option.price > 0 && (
              <span className="text-xs text-orange-400 font-medium flex-shrink-0">
                +${option.price.toLocaleString()}
              </span>
            )}
          </div>
          {option.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {option.description}
            </p>
          )}
        </div>
      </div>
    </Button>
  );
};

export default OptionCard;
