import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User as UserIcon } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useFilterStore } from '../../store/useFilterStore';
import { useUserStore } from '../../store/useUserStore';

export interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
  // Optional for backward compatibility:
  deliveryLocation?: string;
  categories?: string[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onCartClick,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Cart store
  const storeTotalCount = useCartStore((state) => state.getTotalCount());
  const openCart = useCartStore((state) => state.openCart);
  const displayCartCount = cartCount !== undefined ? cartCount : storeTotalCount;

  // Filter store
  const storeQuery = useFilterStore((state) => state.searchQuery);
  const storeSetSearchQuery = useFilterStore((state) => state.setSearchQuery);
  const activeQuery = searchQuery !== undefined ? searchQuery : storeQuery;

  // User auth store
  const user = useUserStore((state) => state.user);
  const login = useUserStore((state) => state.login);
  const logout = useUserStore((state) => state.logout);

  // Focus search input when user presses ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onCartClick) {
      onCartClick();
    } else {
      openCart();
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    storeSetSearchQuery(e.target.value);
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(e);
    }
  };

  const handleSignInClick = () => {
    login({ name: 'Laiba', isPrimeMember: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/80 transition-all duration-200 shadow-2xs">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Clean Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-1 group shrink-0 focus:outline-none"
          aria-label="Amazon Clone Home"
        >
          <div className="flex flex-col items-start leading-none">
            <div className="flex items-baseline">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 group-hover:text-amber-600 transition-colors">
                amazon
              </span>
              <span className="text-xs font-bold text-amber-500 ml-0.5">
                .clone
              </span>
            </div>
            {/* Minimal signature smile accent curve */}
            <div className="w-12 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 rounded-full mt-0.5 -rotate-1" />
          </div>
        </Link>

        {/* Center: Sleek, Pill-Shaped Search Input with ⌘K Hint */}
        <div className="flex-1 max-w-md mx-2 sm:mx-6">
          <form onSubmit={handleSubmit} className="relative flex items-center w-full">
            <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={activeQuery}
              onChange={handleQueryChange}
              placeholder="Search products..."
              className="w-full pl-9 pr-14 py-2 text-sm text-gray-900 bg-gray-100/80 hover:bg-gray-100 focus:bg-white border border-transparent focus:border-gray-300 rounded-full outline-none transition-all placeholder:text-gray-400 shadow-2xs focus:ring-2 focus:ring-gray-900/5"
              aria-label="Search products"
            />
            {/* Keyboard shortcut hint ⌘K */}
            <div className="absolute right-2.5 flex items-center pointer-events-none">
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded shadow-2xs tracking-tighter">
                ⌘K
              </kbd>
            </div>
          </form>
        </div>

        {/* Right: Cart Icon with Notification Dot + Simple Sign In Button */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          
          {/* Simple Sign In / User Button (no massive dropdowns) */}
          {!user ? (
            <button
              type="button"
              onClick={handleSignInClick}
              className="text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 px-3.5 py-1.5 rounded-full hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="font-semibold text-gray-900 flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5 text-gray-400" />
                <span className="hidden sm:inline">Hello,</span> {user.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="text-xs text-gray-500 hover:text-red-600 hover:underline cursor-pointer"
                title="Sign out of your account"
              >
                Sign Out
              </button>
            </div>
          )}

          {/* Clean Cart Icon with Minimalist Notification Dot */}
          <button
            type="button"
            onClick={handleCartClick}
            className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer focus:outline-none"
            aria-label={`Shopping cart with ${displayCartCount} items`}
          >
            <ShoppingCart className="w-5 h-5 text-gray-800 stroke-[1.8]" />
            {/* Minimalist notification dot for item count */}
            {displayCartCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-amber-500 rounded-full ring-2 ring-white">
                {displayCartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
