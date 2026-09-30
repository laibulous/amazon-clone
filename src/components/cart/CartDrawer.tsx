import React, { useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Check,
  ShieldCheck,
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

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
      }`}
      aria-modal="true"
      role="dialog"
      aria-label="Shopping Cart Drawer"
    >
      {/* Dark backdrop overlay */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Sliding Side Panel */}
      <div
        className={`absolute inset-y-0 right-0 max-w-full w-full sm:max-w-md md:max-w-lg bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="bg-[#232f3e] text-white px-5 py-4 flex items-center justify-between border-b border-gray-700 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold tracking-tight">Shopping Cart</h2>
            <span className="text-xs font-semibold bg-white/20 text-white px-2 py-0.5 rounded-full ml-1">
              {summary.itemsCount} {summary.itemsCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Qualification Progress Bar */}
        {summary.itemsCount > 0 && (
          <div className="bg-amber-50/80 px-5 py-3 border-b border-amber-200 shrink-0">
            {amountToFreeShipping === 0 ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Your order qualifies for <strong>FREE Delivery</strong></span>
              </div>
            ) : (
              <div>
                <p className="text-xs text-amber-900 font-medium mb-1.5">
                  Add <strong className="text-amber-950">{formatCurrency(amountToFreeShipping)}</strong> of eligible items to get <strong>FREE Shipping</strong>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Drawer Body: Cart Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Your Amazon Cart is empty
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mb-6">
                Your shopping cart is waiting. Give it purpose — fill it with electronics, books, home goods, and more.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 text-xs font-bold py-2.5 px-6 rounded-full border border-[#fcd200] shadow-xs cursor-pointer transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="py-4 flex gap-3.5 group">
                  {/* Item Thumbnail */}
                  <div className="w-20 h-20 bg-gray-50 rounded-md border border-gray-200 p-1 flex items-center justify-center shrink-0">
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
                          <span className="inline-flex items-center text-[11px] font-black italic text-[#007185]">
                            <Check className="w-3 h-3 text-[#00a8e1] stroke-[3]" />
                            prime
                          </span>
                        )}
                      </div>

                      {product.stock <= 5 && (
                        <p className="text-[11px] text-red-700 font-semibold mt-0.5">
                          Only {product.stock} left in stock
                        </p>
                      )}
                    </div>

                    {/* Quantity Selector (+ / -) & Remove Action */}
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <div className="flex items-center border border-gray-300 rounded-md bg-gray-50 shadow-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1.5 hover:bg-gray-200 text-gray-700 rounded-l-md transition-colors cursor-pointer"
                          aria-label={
                            quantity === 1
                              ? `Remove ${product.title} from cart`
                              : `Decrease quantity of ${product.title}`
                          }
                        >
                          {quantity === 1 ? (
                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                          ) : (
                            <Minus className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <span className="px-2.5 text-xs font-bold text-gray-900 min-w-[28px] text-center select-none">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          disabled={quantity >= product.stock}
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1.5 hover:bg-gray-200 text-gray-700 rounded-r-md transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label={`Increase quantity of ${product.title}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-xs text-blue-700 hover:text-red-700 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer: Dynamic Subtotal Calculator & Checkout */}
        {items.length > 0 && (
          <div className="bg-gray-50 px-5 py-4 border-t border-gray-200 shrink-0 space-y-3">
            {/* Dynamic Subtotal Line */}
            <div className="flex items-baseline justify-between text-gray-900">
              <span className="text-sm font-medium">
                Subtotal ({summary.itemsCount} {summary.itemsCount === 1 ? 'item' : 'items'}):
              </span>
              <span className="text-xl font-extrabold text-gray-950">
                {formatCurrency(summary.subtotal)}
              </span>
            </div>

            {/* Savings Display if available */}
            {summary.savings > 0 && (
              <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded border border-emerald-200">
                <span>Total Instant Savings:</span>
                <span>-{formatCurrency(summary.savings)}</span>
              </div>
            )}

            {/* Checkout Action Button */}
            <button
              type="button"
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-gray-900 font-bold py-3 px-4 rounded-full text-sm border border-[#fcd200] shadow-sm cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <span>Proceed to checkout ({summary.itemsCount} items)</span>
            </button>

            {/* Clear Cart Action */}
            <div className="flex justify-between items-center pt-1 text-[11px] text-gray-500">
              <span>Secure transaction</span>
              <button
                type="button"
                onClick={clearCart}
                className="hover:text-red-600 hover:underline cursor-pointer"
              >
                Clear all items
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
