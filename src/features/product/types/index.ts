// Re-export the main types from shared
export * from '../../../shared/types/ecommerce';

// Product-specific types
export interface ProductConfiguratorProps {
  selectedOptions: ProductConfiguration;
  onOptionChange: (category: string, value: string | string[]) => void;
}

export interface ProductGalleryProps {
  selectedOptions: ProductConfiguration;
}

export interface OptionItem {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
}

export interface TabConfig {
  id: string;
  label: string;
  category: keyof ProductConfiguration | 'optional';
  options: OptionItem[];
}

export interface OptionCardProps {
  option: OptionItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export interface TabNavigationProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export interface OptionGridProps {
  options: OptionItem[];
  selectedValue: string | string[];
  onOptionSelect: (value: string) => void;
  isMultiSelect?: boolean;
}

export interface PriceSummaryProps {
  selectedOptions: ProductConfiguration;
}

export interface ConfigurationItem {
  category: string;
  label: string;
  price: number;
  selected: string;
  isSelected: boolean;
}

export interface PriceBreakdownItem {
  label: string;
  price: number;
}

export type ProductCategory = 'material' | 'size' | 'headboard' | 'bedframeBody' | 'finishColour' | 'optional';
