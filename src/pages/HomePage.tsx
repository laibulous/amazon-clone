import React from 'react';
import { Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { ProductGrid, SmartIntentChips } from '../components/product';
import { useFilterStore } from '../store/useFilterStore';

export interface HomePageProps {
  categories?: string[];
}

const defaultCategories = ['All', 'Electronics', 'Books', 'Home', 'Fashion'];

const intentTitles: Record<string, string> = {
  'gifts-under-50': 'Curated Gifts Under $50',
  'tech-upgrades': 'Top Tech Upgrades & Electronics',
  'highly-rated': 'Customer Favorites: Highly Rated (4.5+ ★)',
  'big-savings': 'Big Savings: 20%+ Off Deals',
};

export const HomePage: React.FC<HomePageProps> = ({
  categories = defaultCategories,
}) => {
  const selectedCategory = useFilterStore((state) => state.selectedCategory);
  const setSelectedCategory = useFilterStore((state) => state.setSelectedCategory);
  const searchQuery = useFilterStore((state) => state.searchQuery);
  const selectedIntent = useFilterStore((state) => state.selectedIntent);

  return (
    <div className="max-w-[1500px] w-full mx-auto px-4 py-2 md:py-4">
      {/* 1. Smart Intent Chips: Right below the Header */}
      <SmartIntentChips />

      {/* Amazon Hero Banner & Category Pills */}
      <div className="relative mb-6 rounded-2xl overflow-hidden bg-gradient-to-r from-[#232f3e] via-[#1a2430] to-[#131921] text-white p-6 md:p-8 shadow-sm">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Prime Big Deals & New Arrivals
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            Explore Top Products Across All Categories
          </h1>
          <p className="text-sm text-gray-300 mb-4">
            Free delivery on millions of items with Prime. Discover great savings on electronics, books, home essentials, and fashion.
          </p>

          {/* Category Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-gray-400 mr-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Filter by:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full transition-colors cursor-pointer border ${
                  selectedCategory === cat || (cat === 'All' && (selectedCategory === 'All' || selectedCategory === 'All Departments'))
                    ? 'bg-amber-400 text-gray-900 font-bold border-amber-400'
                    : 'bg-white/10 hover:bg-white/20 text-gray-200 border-white/20'
                }`}
              >
                {cat === 'All' ? 'All Departments' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-gray-200">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            {selectedIntent
              ? intentTitles[selectedIntent] || 'Curated Intent Selection'
              : searchQuery.trim()
              ? `Results for "${searchQuery.trim()}"`
              : selectedCategory === 'All' || selectedCategory === 'All Departments'
              ? 'Featured Products & Deals'
              : `${selectedCategory} Collection`}
          </h2>
          <p className="text-xs text-gray-500">
            {selectedIntent
              ? 'Filtered by smart shopping intent for faster discovery'
              : 'Browse our catalog with real-time title search and category filtering'}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span className="hidden sm:flex items-center gap-1 text-[#007185] font-medium">
            <ShieldCheck className="w-4 h-4 text-[#00a8e1]" />
            Amazon A-to-z Guarantee
          </span>
        </div>
      </div>

      {/* Product Grid (filters data internally via useFilterStore and renders empty state if zero matches) */}
      <ProductGrid />
    </div>
  );
};

export default HomePage;
