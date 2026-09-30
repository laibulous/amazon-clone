import React, { useState } from 'react';
import {
  MapPin,
  Search,
  ShoppingCart,
  Menu,
  ChevronDown,
  User,
  X,
} from 'lucide-react';

export interface HeaderProps {
  cartCount?: number;
  deliveryLocation?: string;
  categories?: string[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount = 0,
  deliveryLocation = 'New York 10001',
  categories = ['All Departments', 'Electronics', 'Books', 'Home', 'Fashion'],
  selectedCategory = 'All Departments',
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
  onSearchSubmit,
}) => {
  const [internalQuery, setInternalQuery] = useState(searchQuery);
  const [internalCategory, setInternalCategory] = useState(selectedCategory);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalQuery(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setInternalCategory(e.target.value);
    if (onSelectCategory) {
      onSelectCategory(e.target.value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(e);
    }
  };

  return (
    <header className="w-full text-white select-none sticky top-0 z-50">
      {/* Primary Top Bar */}
      <div className="bg-gray-900 px-3 md:px-4 py-2.5 flex flex-wrap md:flex-nowrap items-center justify-between gap-2 md:gap-4">
        
        {/* Left Section: Mobile Menu + Logo + Delivery Location */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded hover:border hover:border-white border border-transparent focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* 1. Placeholder Logo */}
          <a
            href="/"
            className="flex items-center gap-1 px-2 py-1 rounded border border-transparent hover:border-white transition-colors cursor-pointer group"
          >
            <div className="flex flex-col items-start leading-none">
              <div className="flex items-baseline">
                <span className="text-xl md:text-2xl font-black tracking-tight text-white">
                  amazon
                </span>
                <span className="text-xs font-semibold text-amber-400 ml-0.5">
                  .clone
                </span>
              </div>
              {/* Signature smile curve indicator */}
              <div className="w-14 h-1.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 rounded-full mt-0.5 -rotate-2" />
            </div>
          </a>

          {/* 2. Delivery Location Section */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded border border-transparent hover:border-white transition-colors cursor-pointer">
            <MapPin className="w-4 h-4 text-gray-300 shrink-0 self-end mb-0.5" />
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] text-gray-300 font-normal">
                Deliver to
              </span>
              <span className="text-xs md:text-sm font-bold text-white whitespace-nowrap">
                {deliveryLocation}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Central Search Bar (Expands on desktop, full width on mobile) */}
        <form
          onSubmit={handleSubmit}
          className="order-3 md:order-none w-full md:w-auto md:flex-1 flex items-center h-10 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-amber-500 focus-within:ring-offset-1 focus-within:ring-offset-gray-900 transition-shadow shadow-sm"
        >
          {/* Category Dropdown */}
          <div className="relative h-full bg-gray-100 hover:bg-gray-200 border-r border-gray-300 shrink-0 transition-colors flex items-center">
            <select
              value={internalCategory}
              onChange={handleCategoryChange}
              className="h-full pl-2.5 pr-7 text-xs text-gray-800 bg-transparent cursor-pointer outline-none appearance-none font-medium"
              aria-label="Select Search Category"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="text-gray-900 bg-white">
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-600 absolute right-2 pointer-events-none" />
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={internalQuery}
            onChange={handleQueryChange}
            placeholder="Search Amazon"
            className="flex-1 w-full h-full px-3 text-sm text-gray-900 bg-white placeholder-gray-500 outline-none"
            aria-label="Search keywords"
          />

          {/* Search Icon Button */}
          <button
            type="submit"
            className="h-full px-4 bg-amber-400 hover:bg-amber-500 text-gray-900 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            aria-label="Submit Search"
          >
            <Search className="w-5 h-5 text-gray-900 stroke-[2.5]" />
          </button>
        </form>

        {/* Right Section: Sign In + Returns & Orders + Cart */}
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          {/* Account & Lists Block */}
          <div className="hidden lg:flex flex-col justify-center px-2 py-1 rounded border border-transparent hover:border-white transition-colors cursor-pointer leading-tight">
            <span className="text-[11px] text-gray-300">Hello, sign in</span>
            <span className="text-xs md:text-sm font-bold text-white flex items-center gap-0.5">
              Account & Lists
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </span>
          </div>

          {/* 4. Returns & Orders Text Block */}
          <div className="flex flex-col justify-center px-2 py-1 rounded border border-transparent hover:border-white transition-colors cursor-pointer leading-tight">
            <span className="text-[11px] text-gray-300">Returns</span>
            <span className="text-xs md:text-sm font-bold text-white whitespace-nowrap">
              & Orders
            </span>
          </div>

          {/* 5. Cart Icon with Dynamic Item Count */}
          <a
            href="#cart"
            className="flex items-end gap-1 px-2.5 py-1 rounded border border-transparent hover:border-white transition-colors cursor-pointer relative"
            aria-label={`Shopping Cart with ${cartCount} items`}
          >
            <div className="relative flex items-center">
              <ShoppingCart className="w-7 h-7 text-white" />
              {/* Dynamic item count badge positioned atop cart icon */}
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs font-black text-amber-400 bg-transparent min-w-4 text-center leading-none">
                {cartCount}
              </span>
            </div>
            <span className="hidden sm:inline-block text-xs md:text-sm font-bold text-white mb-0.5">
              Cart
            </span>
          </a>
        </div>
      </div>

      {/* Secondary Navigation Subheader */}
      <div className="bg-[#232f3e] px-3 md:px-4 py-1.5 flex items-center justify-between text-xs font-medium text-white overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <button
            type="button"
            className="flex items-center gap-1.5 py-1 px-2 rounded border border-transparent hover:border-white transition-colors cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span className="font-bold">All</span>
          </button>
          <a
            href="#deals"
            className="py-1 px-2 rounded border border-transparent hover:border-white transition-colors whitespace-nowrap"
          >
            Today's Deals
          </a>
          <a
            href="#customer-service"
            className="py-1 px-2 rounded border border-transparent hover:border-white transition-colors whitespace-nowrap"
          >
            Customer Service
          </a>
          <a
            href="#registry"
            className="py-1 px-2 rounded border border-transparent hover:border-white transition-colors whitespace-nowrap"
          >
            Registry
          </a>
          <a
            href="#gift-cards"
            className="py-1 px-2 rounded border border-transparent hover:border-white transition-colors whitespace-nowrap"
          >
            Gift Cards
          </a>
          <a
            href="#sell"
            className="py-1 px-2 rounded border border-transparent hover:border-white transition-colors whitespace-nowrap"
          >
            Sell
          </a>
        </div>

        {/* Small location indicator for mobile screens where it is hidden from top bar */}
        <div className="sm:hidden flex items-center gap-1 py-1 text-gray-300 text-[11px] shrink-0">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>Deliver to {deliveryLocation}</span>
        </div>
      </div>

      {/* Mobile Drawer Navigation (When hamburger menu is active) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#131921] border-t border-gray-800 px-4 py-3 space-y-3 animate-in fade-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-800 text-sm">
            <User className="w-5 h-5 text-amber-400" />
            <span>Hello, Sign In</span>
          </div>
          <div className="flex flex-col space-y-2 text-sm text-gray-300">
            <a href="#electronics" className="py-1 hover:text-white">Electronics</a>
            <a href="#books" className="py-1 hover:text-white">Books</a>
            <a href="#home" className="py-1 hover:text-white">Home & Kitchen</a>
            <a href="#fashion" className="py-1 hover:text-white">Fashion & Apparel</a>
            <a href="#orders" className="py-1 hover:text-white">Your Orders</a>
            <a href="#account" className="py-1 hover:text-white">Your Account</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
