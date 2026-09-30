import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { formatCurrency } from '../../utils/formatters';

export interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const navigate = useNavigate();
  const storeIsOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSummary = useCartStore((state) => state.getSummary);

  const isOpen = propIsOpen !== undefined ? propIsOpen : storeIsOpen;
  const handleClose = propOnClose || closeCart;

  const summary = getSummary();
  const freeShippingThreshold = 35;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - summary.subtotal);
  const freeShippingProgress = Math.min(
    100,
    (summary.subtotal / freeShippingThreshold) * 100
  );

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleProceedToCheckout = () => {
    handleClose();
    navigate('/checkout');
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
      }`}
      aria-modal="true"
      role="dialog"
      aria-label="Shopping Cart Drawer"
    >
      {/* Soft darkened backdrop overlay */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Sliding Side Panel */}
      <div
        className={`absolute inset-y-0 right-0 max-w-full w-full sm:max-w-md md:max-w-lg bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Modern Minimalist Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Your Cart</h2>
            <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full ml-1">
              {summary.itemsCount} {summary.itemsCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Qualification Progress Bar */}
        {summary.itemsCount > 0 && (
          <div className="bg-gray-50/80 px-6 py-3 border-b border-gray-100 shrink-0">
            {amountToFreeShipping === 0 ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your order qualifies for <strong>FREE Delivery</strong></span>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1.5">
                  Add <strong className="text-gray-900">{formatCurrency(amountToFreeShipping)}</strong> more to get <strong>FREE Shipping</strong>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Drawer Body: Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Your cart is empty
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mb-6">
                Explore our featured products and add items to your cart without leaving the page.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="bg-gray-900 hover:bg-black text-white text-xs font-bold py-2.5 px-6 rounded-full shadow-xs cursor-pointer transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="py-4 flex gap-4 group">
                  {/* Item Thumbnail */}
                  <div className="w-18 h-18 bg-gray-50/80 rounded-xl border border-gray-100 p-2 flex items-center justify-center shrink-0">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4
                        title={product.title}
                        className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 leading-snug hover:text-amber-700 transition-colors"
                      >
                        {product.title}
                      </h4>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                        {product.isPrime && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-sky-50 text-sky-800 border border-sky-100">
                            prime
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Instant Quantity Stepper (+ / -) & Remove Action */}
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <div className="flex items-center border border-gray-200 rounded-full bg-gray-50/80 p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-full text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                          aria-label={
                            quantity === 1
                              ? `Remove ${product.title} from cart`
                              : `Decrease quantity of ${product.title}`
                          }
                        >
                          {quantity === 1 ? (
                            <Trash2 className="w-3 h-3 text-red-500" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                        </button>

                        <span className="px-2 text-xs font-bold text-gray-900 min-w-[24px] text-center select-none">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          disabled={quantity >= product.stock}
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-full text-gray-600 hover:text-gray-900 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label={`Increase quantity of ${product.title}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-xs text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer: Dynamic Instant Subtotal Calculator */}
        {items.length > 0 && (
          <div className="bg-gray-50/60 px-6 py-4 border-t border-gray-100 shrink-0 space-y-3">
            {/* Instant Dynamic Subtotal Line */}
            <div className="flex items-baseline justify-between text-gray-900">
              <span className="text-sm font-medium text-gray-600">
                Subtotal ({summary.itemsCount} {summary.itemsCount === 1 ? 'item' : 'items'}):
              </span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(summary.subtotal)}
              </span>
            </div>

            {/* Savings Display if available */}
            {summary.savings > 0 && (
              <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                <span>Total Savings:</span>
                <span>-{formatCurrency(summary.savings)}</span>
              </div>
            )}

            {/* Checkout Action Button */}
            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-gray-950 font-bold py-3 px-4 rounded-full text-sm shadow-2xs hover:shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <Lock className="w-3.5 h-3.5 text-gray-800" />
              <span>Proceed to Checkout · {formatCurrency(summary.subtotal)}</span>
            </button>

            {/* Clear Cart Action */}
            <div className="flex justify-between items-center pt-1 text-[11px] text-gray-400">
              <span>Instant drawer checkout</span>
              <button
                type="button"
                onClick={clearCart}
                className="hover:text-red-600 hover:underline cursor-pointer"
              >
                Clear cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
