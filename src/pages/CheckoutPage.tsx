import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Lock,
  ChevronLeft,
  Truck,
  CreditCard,
  MapPin,
  PackageCheck,
  ShoppingBag,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency, getEstimatedDelivery } from '../utils/formatters';

export const CheckoutPage: React.FC = () => {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSummary = useCartStore((state) => state.getSummary);

  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [placedSummary, setPlacedSummary] = useState(getSummary());

  const summary = orderPlaced ? placedSummary : getSummary();

  const handlePlaceOrder = () => {
    // Generate a random Amazon-style order ID
    const randomOrderId = `114-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`;
    setPlacedSummary(getSummary());
    setOrderNumber(randomOrderId);
    clearCart();
    setOrderPlaced(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Success Message View after placing order
  if (orderPlaced) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Order Placed, thank you!
          </h1>
          <p className="text-sm text-gray-600 mb-1">
            Confirmation has been sent to <strong className="text-gray-900">jane.doe@example.com</strong>
          </p>
          <p className="text-xs text-gray-500 mb-6">
            Order #: <span className="font-mono font-semibold text-gray-800">{orderNumber}</span>
          </p>

          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 max-w-md mx-auto mb-8 text-left space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Guaranteed Delivery: {getEstimatedDelivery(true)}</span>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Shipping to: <strong>Jane Doe, 742 Evergreen Terrace, Seattle, WA</strong></p>
              <p>Items Ordered: <strong>{placedSummary.itemsCount}</strong></p>
              <p>Total Charged: <strong>{formatCurrency(placedSummary.total)}</strong></p>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold px-8 py-3 rounded-full text-sm border border-[#fcd200] shadow-sm transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // 2. Empty Cart Check
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Your Cart is currently empty
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            There are no items in your cart to proceed with checkout.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold px-6 py-2.5 rounded-full text-xs shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  // 3. Main Checkout Flow View
  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6">
      {/* Checkout Sub-header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-300 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-xs text-gray-500">
            Review your order details and delivery preferences.
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>SSL 256-Bit Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Sections (Address, Payment, Review Items) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Delivery Address */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                1. Delivery Address
              </h2>
              <span className="text-xs text-blue-700 hover:underline cursor-pointer">
                Change
              </span>
            </div>
            <div className="text-xs text-gray-700 space-y-0.5 pl-6">
              <p className="font-semibold text-gray-900">Jane Doe</p>
              <p>742 Evergreen Terrace, Apt 4B</p>
              <p>Seattle, WA 98101-1234</p>
              <p className="text-gray-500">Phone: (206) 555-0199</p>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-500" />
                2. Payment Method
              </h2>
              <span className="text-xs text-blue-700 hover:underline cursor-pointer">
                Change
              </span>
            </div>
            <div className="text-xs text-gray-700 space-y-1 pl-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-5 bg-[#1434CB] rounded text-[9px] font-black text-white flex items-center justify-center">
                  VISA
                </div>
                <span className="font-medium text-gray-900">Amazon Prime Rewards Visa ending in 4242</span>
              </div>
              <p className="text-gray-500">Billing address: Same as delivery address</p>
            </div>
          </div>

          {/* Section 3: Review Items and Delivery */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-amber-500" />
                3. Review Items and Shipping
              </h2>
              <span className="text-xs font-semibold text-emerald-700">
                Guaranteed: {getEstimatedDelivery(true)}
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="py-3.5 flex gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded border border-gray-200 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Quantity: <strong className="text-gray-800">{quantity}</strong> · {product.brand}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-gray-900">
                        {formatCurrency(product.price * quantity)}
                      </span>
                      {quantity > 1 && (
                        <span className="text-[11px] text-gray-500">
                          ({formatCurrency(product.price)} each)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Box */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg border border-gray-300 p-5 shadow-xs sticky top-20 space-y-4">
            
            {/* Mock Place Your Order Button */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-gray-900 font-bold py-3 px-4 rounded-full text-sm border border-[#fcd200] shadow-sm cursor-pointer transition-colors"
            >
              Place your order
            </button>

            <p className="text-[11px] text-gray-500 text-center leading-tight">
              By placing your order, you agree to Amazon Clone's privacy notice and conditions of use.
            </p>

            <div className="pt-3 border-t border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Order Summary</h3>
              <div className="text-xs text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span>Items ({summary.itemsCount}):</span>
                  <span>{formatCurrency(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & handling:</span>
                  <span>{summary.shipping === 0 ? 'FREE' : formatCurrency(summary.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated tax:</span>
                  <span>{formatCurrency(summary.estimatedTax)}</span>
                </div>
                {summary.savings > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Total Savings:</span>
                    <span>-{formatCurrency(summary.savings)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-extrabold text-red-700">
                  <span>Order Total:</span>
                  <span>{formatCurrency(summary.total)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded p-2.5 text-[11px] text-gray-600 border border-gray-200">
              <span className="font-semibold text-gray-800">Prime Benefits:</span> Free Two-Day or Next-Day Shipping applied to all eligible items.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
