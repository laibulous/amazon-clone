import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  ShoppingBag,
  Truck,
  ShieldCheck,
  CreditCard,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency, getEstimatedDelivery } from '../utils/formatters';
import type { CartItem, CartSummary } from '../types/cart';

interface OrderState {
  orderNumber?: string;
  contactEmail?: string;
  items?: CartItem[];
  summary?: CartSummary;
  shipping?: {
    fullName: string;
    phone: string;
    street: string;
    apt?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  deliveryMethod?: 'free' | 'express';
}

export const SuccessPage: React.FC = () => {
  const location = useLocation();
  const state = (location.state as OrderState) || {};
  const clearCart = useCartStore((state) => state.clearCart);

  const [orderNumber] = useState<string>(() => {
    return (
      state.orderNumber ||
      `114-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`
    );
  });
  const contactEmail = state.contactEmail || 'alex.johnson@example.com';
  const fullName = state.shipping?.fullName || 'Alex Johnson';
  const totalAmount = state.summary?.total || 149.98;
  const isExpress = state.deliveryMethod === 'express';

  // 5. Automatically clear the global cart state on mount
  useEffect(() => {
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [clearCart]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-3xl border border-gray-200/90 p-8 sm:p-12 shadow-sm text-center animate-in fade-in duration-300">
        
        {/* Large Green Checkmark */}
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-50/60 shadow-xs">
          <CheckCircle2 className="w-12 h-12 stroke-[2.2]" />
        </div>

        {/* Order Confirmed Headline */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight mb-2">
          Order Confirmed!
        </h1>

        <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto mb-2">
          Thank you, <strong className="text-gray-900">{fullName}</strong>. Your mock purchase has been processed successfully.
        </p>

        <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100/90 px-3.5 py-1.5 rounded-full mb-8 font-medium">
          <Mail className="w-3.5 h-3.5 text-gray-600" />
          <span>Receipt dispatched to:</span>
          <span className="font-semibold text-gray-900">{contactEmail}</span>
        </div>

        {/* Order Details Card */}
        <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-200/70 text-left space-y-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200/80">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Order Reference
              </span>
              <span className="font-mono font-bold text-sm text-gray-900">
                {orderNumber}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Paid via Stripe Elements Mock</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600 pt-1">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-gray-900">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Delivery: {getEstimatedDelivery(true)}</span>
              </div>
              <p className="text-gray-500">
                {isExpress ? 'Same-Day Rush Delivery' : 'FREE Standard Prime Delivery'}
              </p>
              {state.shipping && (
                <div className="pt-2 text-gray-700 leading-snug">
                  <span className="text-gray-400 block text-[11px]">Shipping To:</span>
                  <p className="font-medium text-gray-900">{state.shipping.fullName}</p>
                  <p>{state.shipping.street} {state.shipping.apt}</p>
                  <p>{state.shipping.city}, {state.shipping.state} {state.shipping.zipCode}</p>
                </div>
              )}
            </div>

            <div className="space-y-2 sm:border-l sm:border-gray-200/80 sm:pl-4">
              <div className="flex items-center gap-1.5 font-bold text-gray-900">
                <CreditCard className="w-4 h-4 text-gray-700" />
                <span>Payment Method</span>
              </div>
              <p className="text-gray-600 font-mono text-[11px]">
                Visa ending in 4242 · Encrypted
              </p>
              <div className="pt-2">
                <span className="text-gray-400 block text-[11px]">Total Paid:</span>
                <span className="text-xl font-extrabold text-gray-950 font-sans">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Purchased Items Thumbnail Preview if available */}
          {state.items && state.items.length > 0 && (
            <div className="pt-3 border-t border-gray-200/80">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Items In This Order ({state.items.reduce((s, i) => s + i.quantity, 0)})
              </span>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {state.items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    title={`${product.title} (x${quantity})`}
                    className="w-12 h-12 bg-white rounded-lg border border-gray-200 p-1 flex items-center justify-center shrink-0 relative"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                    {quantity > 1 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {quantity}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Continue Shopping Button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2.5 bg-gray-900 hover:bg-black text-white font-bold px-8 py-4 rounded-xl text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
