import React from 'react';
import { Gift, Cpu, Sparkles, Percent, X } from 'lucide-react';
import { useFilterStore } from '../../store/useFilterStore';

interface IntentChip {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const INTENT_CHIPS: IntentChip[] = [
  {
    id: 'gifts-under-50',
    label: 'Gifts under $50',
    icon: <Gift className="w-3.5 h-3.5" />,
    description: 'Products under $50',
  },
  {
    id: 'tech-upgrades',
    label: 'Tech Upgrades',
    icon: <Cpu className="w-3.5 h-3.5" />,
    description: 'Electronics & Tech',
  },
  {
    id: 'highly-rated',
    label: 'Highly Rated',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    description: '4.5+ Star Rating',
  },
  {
    id: 'big-savings',
    label: 'Big Savings',
    icon: <Percent className="w-3.5 h-3.5" />,
    description: '20%+ Discount Deals',
  },
];

export const SmartIntentChips: React.FC = () => {
  const selectedIntent = useFilterStore((state) => state.selectedIntent);
  const setSelectedIntent = useFilterStore((state) => state.setSelectedIntent);

  return (
    <div className="w-full bg-white/80 py-2.5 mb-5 border-b border-gray-100">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-1">
        <span className="text-xs font-semibold text-gray-400 whitespace-nowrap pl-1 pr-1.5 hidden sm:inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Curated Intents:</span>
        </span>

        {INTENT_CHIPS.map((chip) => {
          const isActive = selectedIntent === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => setSelectedIntent(chip.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                isActive
                  ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                  : 'bg-gray-50/80 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              }`}
              aria-pressed={isActive}
            >
              <span className={isActive ? 'text-amber-400' : 'text-gray-500'}>
                {chip.icon}
              </span>
              <span>{chip.label}</span>
              {isActive && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIntent(null);
                  }}
                  className="w-4 h-4 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center -mr-1 transition-colors cursor-pointer"
                  title="Clear intent filter"
                  aria-label="Clear filter"
                >
                  <X className="w-3 h-3 text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SmartIntentChips;
