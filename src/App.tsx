import { useState, useMemo } from 'react';
import { Header } from './components/layout';
import { ProductGrid } from './components/product';
import { CartDrawer } from './components/cart';
import productsData from './data/products.json';
import type { Product } from './types/product';
import { Sparkles, Tag, ShieldCheck } from 'lucide-react';

const typedProducts = productsData as unknown as Product[];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Departments');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    return ['All Departments', ...Array.from(new Set(typedProducts.map((p) => p.category)))];
  }, []);

  // Filter products based on search query and category
  const filteredProducts = useMemo(() => {
    return typedProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All Departments' ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        product.title.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.subcategory.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#eaeded] text-[#0f1111] flex flex-col font-sans">
      {/* 
        Amazon-style Header:
        1. Placeholder logo on far left
        2. Delivery location section
        3. Central search bar with category dropdown + search button
        4. Returns & Orders block
        5. Cart icon with dynamic count reading from Zustand store
      */}
      <Header
        deliveryLocation="New York 10001"
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Sliding Shopping Cart Drawer */}
      <CartDrawer />

      {/* Main Content Feed */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 py-4 md:py-6">
        {/* Amazon Hero Banner & Category Pills */}
        <div className="relative mb-6 rounded-md overflow-hidden bg-gradient-to-r from-[#232f3e] via-[#1a2430] to-[#131921] text-white p-6 md:p-8 shadow-sm">
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
                    selectedCategory === cat
                      ? 'bg-amber-400 text-gray-900 font-bold border-amber-400'
                      : 'bg-white/10 hover:bg-white/20 text-gray-200 border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-gray-300">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              {selectedCategory === 'All Departments'
                ? 'Featured Products & Deals'
                : `${selectedCategory} Collection`}
            </h2>
            <p className="text-xs text-gray-500">
              Showing {filteredProducts.length} of {typedProducts.length} items
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span className="hidden sm:flex items-center gap-1 text-[#007185] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#00a8e1]" />
              Amazon A-to-z Guarantee
            </span>
          </div>
        </div>

        {/* 
          Homepage Product Feed:
          - Responsive Tailwind CSS Grid: 1 col on mobile, 2 on tablet, 3 or 4 on desktop
          - Reusable ProductCard with image, 2-line title, stars & reviews, superscript price, prime badge, add-to-cart
        */}
        <ProductGrid products={filteredProducts} />
      </main>

      {/* Basic Footer */}
      <footer className="mt-12 bg-[#232f3e] text-white">
        <div className="text-center py-4 bg-[#37475a] hover:bg-[#485769] transition-colors cursor-pointer">
          <a href="#" className="text-xs font-semibold block w-full">
            Back to top
          </a>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-xs text-gray-400">
          <p className="mb-2 font-medium text-gray-300">
            Amazon Clone Evaluation Project — Built with React 19, Vite & Tailwind CSS
          </p>
          <p>© 2026 Amazon Clone, Inc. or its affiliates. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
