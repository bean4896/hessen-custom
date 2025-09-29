import { OptionGridProps } from '../types';
import OptionCard from './OptionCard';

const OptionGrid: React.FC<OptionGridProps> = ({ options, selectedValue, onOptionSelect }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 overflow-x-hidden">
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
