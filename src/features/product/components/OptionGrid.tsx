import OptionCard from './OptionCard';

interface OptionItem {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
}

interface OptionGridProps {
  options: OptionItem[];
  selectedValue: string | string[];
  onOptionSelect: (value: string) => void;
  isMultiSelect?: boolean;
}

const OptionGrid: React.FC<OptionGridProps> = ({ options, selectedValue, onOptionSelect }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 lg:gap-3 overflow-x-hidden">
      {options.map((option) => (
        <OptionCard
          key={option.id}
          option={option}
          isSelected={selectedValue === option.id}
          onSelect={onOptionSelect}
        />
      ))}
    </div>
  );
};

export default OptionGrid;
