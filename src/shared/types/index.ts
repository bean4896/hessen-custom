export interface ProductOptions {
    material: string;
    size: string;
    headboard: string;
    bedframeBody: string;
    finishColour: string;
    optional: string[]; // Array to support multiple optional items
    [key: string]: string | string[]; // Add index signature
  }
  
  export interface ProductGalleryProps {
    selectedOptions: ProductOptions;
  }
  
  export interface ProductConfiguratorProps {
    selectedOptions: ProductOptions;
    onOptionChange: (category: string, value: string | string[]) => void; // Support both single values and arrays
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
    category: keyof ProductOptions | 'optional'; // Allow 'optional' as a valid category
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
    selectedValue: string | string[]; // Support both single values and arrays for optional items
    onOptionSelect: (value: string) => void;
    isMultiSelect?: boolean; // Flag to indicate if multiple selection is allowed
  }
  
  // Additional types for better type safety
  export type ProductCategory = 'material' | 'size' | 'headboard' | 'bedframeBody' | 'finishColour' | 'optional';
  
  export interface PriceSummaryProps {
    selectedOptions: ProductOptions;
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
  