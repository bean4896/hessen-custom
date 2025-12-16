import { Button } from '@/components/ui/button';

interface Tab {
  id: string;
  label: string;
  category: string;
  options: any[];
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="w-full">
      {/* Desktop: 3 tabs per row */}
      <div className="hidden lg:grid grid-cols-3 gap-2 w-full">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            variant={activeTab === tab.id ? "default" : "outline"}
            className={`text-sm font-medium py-3 px-4 transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600'
                : 'bg-secondary hover:bg-secondary/80 text-foreground border-border hover:border-border/80'
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Mobile: Horizontal scrollable tabs */}
      <div className="lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={`text-sm font-medium py-3 px-4 transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600'
                  : 'bg-secondary hover:bg-secondary/80 text-foreground border-border hover:border-border/80'
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabNavigation;
