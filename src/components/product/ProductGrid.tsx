import React, { useMemo } from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import type { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { useFilterStore } from '../../store/useFilterStore';
import productsData from '../../data/products.json';

const allProducts = productsData as unknown as Product[];

export interface ProductGridProps {
  products?: Product[];
  searchQuery?: string;
  selectedCategory?: string;
  selectedIntent?: string | null;
  onAddToCart?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products = allProducts,
  searchQuery: propQuery,
  selectedCategory: propCategory,
  selectedIntent: propIntent,
  onAddToCart,
}) => {
  const storeQuery = useFilterStore((state) => state.searchQuery);
  const storeCategory = useFilterStore((state) => state.selectedCategory);
  const storeIntent = useFilterStore((state) => state.selectedIntent);
  const clearFilters = useFilterStore((state) => state.clearFilters);

  const activeQuery = propQuery !== undefined ? propQuery : storeQuery;
  const activeCategory = propCategory !== undefined ? propCategory : storeCategory;
  const activeIntent = propIntent !== undefined ? propIntent : storeIntent;

  // Filter products: match intent filters, search query, and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Intent filter check
      if (activeIntent) {
        if (activeIntent === 'gifts-under-50' && !(product.price < 50)) {
          return false;
        }
        if (
          activeIntent === 'tech-upgrades' &&
          product.category.toLowerCase() !== 'electronics'
        ) {
          return false;
        }
        if (activeIntent === 'highly-rated' && !(product.rating >= 4.5)) {
          return false;
        }
        if (activeIntent === 'big-savings' && !(product.discountPercentage >= 20)) {
          return false;
        }
      }

      // 2. Category check: unless 'All' is selected
      const isAllCategory =
        !activeCategory ||
        activeCategory === 'All' ||
        activeCategory === 'All Departments';

      const matchesCategory =
        isAllCategory ||
        product.category.toLowerCase() === activeCategory.toLowerCase();

      // 3. Search query check: case-insensitive title match
      const queryTrimmed = activeQuery.trim().toLowerCase();
      const matchesQuery =
        !queryTrimmed ||
        product.title.toLowerCase().includes(queryTrimmed);

      return matchesCategory && matchesQuery;
    });
  }, [products, activeQuery, activeCategory, activeIntent]);

  // Clean empty state when filter returns zero items
  if (filteredProducts.length === 0) {
    const trimmedQuery = activeQuery.trim();
    let emptyTitle = `No results found for category "${activeCategory}"`;
    if (trimmedQuery) {
      emptyTitle = `No results found for "${trimmedQuery}"`;
    } else if (activeIntent) {
      const intentNames: Record<string, string> = {
        'gifts-under-50': 'Gifts under $50',
        'tech-upgrades': 'Tech Upgrades',
        'highly-rated': 'Highly Rated',
        'big-savings': 'Big Savings',
      };
      emptyTitle = `No results found for "${intentNames[activeIntent] || activeIntent}"`;
    }

    return (
      <div className="w-full bg-white rounded-lg p-10 md:p-14 text-center border border-gray-200 shadow-sm my-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
          {emptyTitle}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
          Try checking your spelling, using more general search terms, or clearing your filters to see all available products.
        </p>
        <button
          type="button"
          onClick={clearFilters}
          className="inline-flex items-center gap-2 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold px-6 py-2.5 rounded-full text-xs shadow-xs cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear filters and show all products
        </button>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10"
      data-testid="product-grid"
    >
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
