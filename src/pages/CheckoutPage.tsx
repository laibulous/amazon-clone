import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  CheckCircle2,
  Lock,
  ArrowLeft,
  Truck,
  CreditCard,
  ShoppingBag,
  ShieldCheck,
  Check,
  Mail,
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

  // Guest Contact Information (no login roadblock)
  const [contactEmail, setContactEmail] = useState<string>('alex.johnson@example.com');

  // Form states for Shipping Details
  const [shipping, setShipping] = useState({
    fullName: 'Alex Johnson',
    phone: '(555) 019-2834',
    street: '742 Evergreen Terrace',
    apt: 'Suite 4B',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
  });

  // Form states for Mock Payment Details
  const [payment, setPayment] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardName: 'Alex Johnson',
    expiry: '12 / 28',
    cvv: '842',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'free' | 'express'>('free');

  // If the cart is empty, immediately redirect back to homepage (unless order just placed)
  if (items.length === 0 && !orderPlaced) {
    return <Navigate to="/" replace />;
  }

  const summary = orderPlaced ? placedSummary : getSummary();

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const randomOrderId = `114-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`;
    setPlacedSummary(getSummary());
    setOrderNumber(randomOrderId);
    clearCart();
    setOrderPlaced(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Order Success Screen (Guest Confirmation)
  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl border border-gray-200/90 p-8 sm:p-10 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-sm text-gray-600 mb-1">
            Thank you, <strong className="text-gray-900">{shipping.fullName}</strong>. A mock order confirmation has been sent to{' '}
            <strong className="text-blue-700 font-semibold">{contactEmail}</strong>.
          </p>
          <p className="text-xs text-gray-500 mb-6">
            Order Number: <span className="font-mono font-bold text-gray-900">{orderNumber}</span>
          </p>

          <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 text-left space-y-3 mb-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 pb-2 border-b border-gray-200/60">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Estimated Delivery: {getEstimatedDelivery(true)}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
              <div>
                <span className="text-gray-400 block mb-0.5">Shipping to:</span>
                <p className="font-medium text-gray-900">{shipping.street}</p>
                <p>{shipping.city}, {shipping.state} {shipping.zipCode}</p>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Payment:</span>
                <p className="font-medium text-gray-900">Visa ending in 4242</p>
                <p className="text-emerald-700 font-medium">Total Paid: {formatCurrency(placedSummary.total)}</p>
              </div>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-semibold px-8 py-3.5 rounded-full text-sm shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Two-Column Consolidated Seamless Guest Checkout Page
  return (
    <div className="max-w-[1300px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      
      {/* Return to shop breadcrumb link */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Return to shopping
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Seamless Guest Checkout · 256-Bit SSL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Unified Single-Scroll Form (Contact Email, Shipping & Payment) */}
        <div className="lg:col-span-7 space-y-6">
          
          <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-6">
            
            {/* 3. Top of Form: Simple 'Contact Email' Input Field for Guest Confirmation */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Contact Information
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  Guest Checkout
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Contact Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="alex.johnson@example.com"
                    className="w-full py-3 pl-4 pr-11 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs placeholder:text-gray-400"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute right-4 top-3.5 pointer-events-none" />
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5">
                  We will send your order confirmation and tracking receipt to this email.
                </p>
              </div>
            </div>

            {/* Step 2: Shipping Details */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
                <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Shipping Address
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    placeholder="Alex Johnson"
                    className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs placeholder:text-gray-400"
                  />
                </div>

                {/* Phone Number */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    placeholder="(555) 019-2834"
                    className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs placeholder:text-gray-400"
                  />
                </div>

                {/* Street Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.street}
                    onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                    placeholder="742 Evergreen Terrace"
                    className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs placeholder:text-gray-400"
                  />
                </div>

                {/* Apt / Suite */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Apartment, suite, unit (optional)
                  </label>
                  <input
                    type="text"
                    value={shipping.apt}
                    onChange={(e) => setShipping({ ...shipping, apt: e.target.value })}
                    placeholder="Suite 4B"
                    className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs placeholder:text-gray-400"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    placeholder="Seattle"
                    className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs placeholder:text-gray-400"
                  />
                </div>

                {/* State & ZIP Code */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      placeholder="WA"
                      className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.zipCode}
                      onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                      placeholder="98101"
                      className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Speed Options */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Delivery Speed
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setDeliveryMethod('free')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      deliveryMethod === 'free'
                        ? 'border-gray-900 bg-gray-50/80 ring-1 ring-gray-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-900">FREE Prime Delivery</p>
                      <p className="text-[11px] text-gray-500">{getEstimatedDelivery(true)}</p>
                    </div>
                    {deliveryMethod === 'free' && (
                      <Check className="w-4 h-4 text-gray-900" />
                    )}
                  </div>

                  <div
                    onClick={() => setDeliveryMethod('express')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      deliveryMethod === 'express'
                        ? 'border-gray-900 bg-gray-50/80 ring-1 ring-gray-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-900">Same-Day Rush</p>
                      <p className="text-[11px] text-gray-500">Today by 9 PM ($9.99)</p>
                    </div>
                    {deliveryMethod === 'express' && (
                      <Check className="w-4 h-4 text-gray-900" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Mock Payment Details */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Payment Details
                  </h2>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Encrypted</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Card Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={payment.cardNumber}
                      onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                      placeholder="4242 •••• •••• 4242"
                      className="w-full py-3 pl-4 pr-12 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs font-mono placeholder:text-gray-400"
                    />
                    <CreditCard className="w-5 h-5 text-gray-400 absolute right-4 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Name on Card */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    required
                    value={payment.cardName}
                    onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                    placeholder="Alex Johnson"
                    className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs placeholder:text-gray-400"
                  />
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      value={payment.expiry}
                      onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                      placeholder="MM / YY"
                      className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs placeholder:text-gray-400 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Security Code (CVV)
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={payment.cvv}
                      onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                      placeholder="123"
                      className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-2xs placeholder:text-gray-400 text-center font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Right Column: Sticky "Order Summary" Card */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Order Summary
              </h2>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                {summary.itemsCount} {summary.itemsCount === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Cart Items Preview List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-3">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="pt-3 first:pt-0 flex items-center gap-3.5">
                  <div className="w-14 h-14 bg-gray-50/80 rounded-xl border border-gray-100 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-gray-900 truncate">
                      {product.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Quantity: <strong className="text-gray-800">{quantity}</strong>
                    </p>
                  </div>
                  <div className="text-xs font-bold text-gray-900 shrink-0">
                    {formatCurrency(product.price * quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="pt-3 border-t border-gray-100 space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="text-gray-900 font-medium">{formatCurrency(summary.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping & Handling:</span>
                <span className="text-emerald-700 font-semibold">
                  {deliveryMethod === 'express' ? '$9.99' : 'FREE'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax:</span>
                <span className="text-gray-900 font-medium">{formatCurrency(summary.estimatedTax)}</span>
              </div>
              {summary.savings > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Savings:</span>
                  <span>-{formatCurrency(summary.savings)}</span>
                </div>
              )}

              {/* Order Total Line */}
              <div className="pt-3 border-t border-gray-200/80 flex items-baseline justify-between">
                <span className="text-sm font-bold text-gray-900">Order Total:</span>
                <span className="text-xl font-extrabold text-gray-950">
                  {formatCurrency(
                    deliveryMethod === 'express' ? summary.total + 9.99 : summary.total
                  )}
                </span>
              </div>
            </div>

            {/* High-Contrast Large Place Order Button */}
            <button
              type="submit"
              form="checkout-form"
              className="w-full bg-gray-900 hover:bg-black active:bg-gray-800 text-white text-base font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>
                Place Order · {formatCurrency(
                  deliveryMethod === 'express' ? summary.total + 9.99 : summary.total
                )}
              </span>
            </button>

            {/* Seamless Guest Guarantee Footer */}
            <p className="text-[11px] text-gray-400 text-center leading-tight">
              By clicking Place Order, your mock order will be processed instantly. Confirmation sent to {contactEmail}. Free 30-day returns.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
