import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  Lock,
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  Check,
  Mail,
  Loader2,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { formatCurrency, getEstimatedDelivery } from '../utils/formatters';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const getSummary = useCartStore((state) => state.getSummary);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

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

  // Stripe Elements Mock Payment Details
  const [payment, setPayment] = useState({
    cardNumber: '4242 4242 4242 4242',
    cardName: 'Alex Johnson',
    expiry: '12 / 28',
    cvc: '842',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'free' | 'express'>('free');

  // If the cart is empty, immediately redirect back to homepage (unless order is processing)
  if (items.length === 0 && !isProcessing) {
    return <Navigate to="/" replace />;
  }

  const summary = getSummary();

  // Helper to format card number with spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setPayment((prev) => ({ ...prev, cardNumber: formatted }));
  };

  // Helper to format MM / YY expiry date
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setPayment((prev) => ({ ...prev, expiry: `${raw.slice(0, 2)} / ${raw.slice(2)}` }));
    } else {
      setPayment((prev) => ({ ...prev, expiry: raw }));
    }
  };

  // Helper for CVC
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPayment((prev) => ({ ...prev, cvc: raw }));
  };

  // Detect card brand based on card number
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^5[1-5]/.test(clean)) return 'Mastercard';
    if (/^3[47]/.test(clean)) return 'Amex';
    if (/^6/.test(clean)) return 'Discover';
    return 'Card';
  };

  // 4. Wire up Place Order with realistic processing state and 2000ms delay redirect
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);

    const randomOrderId = `114-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const orderPayload = {
      orderNumber: randomOrderId,
      contactEmail,
      items,
      summary,
      shipping,
      deliveryMethod,
    };

    // Simulate 2000ms network latency to mock payment intent processing
    setTimeout(() => {
      navigate('/success', {
        state: orderPayload,
        replace: true,
      });
    }, 2000);
  };

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
          <span>Frictionless Stripe Elements Mock · 256-Bit SSL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Unified Single-Scroll Form (Contact Email, Shipping & Stripe Elements Mock) */}
        <div className="lg:col-span-7 space-y-6">
          
          <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-6">
            
            {/* 1. Contact Information */}
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
                    disabled={isProcessing}
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="alex.johnson@example.com"
                    className="w-full py-3 pl-4 pr-11 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs placeholder:text-gray-400 disabled:opacity-50"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute right-4 top-3.5 pointer-events-none" />
                </div>
                <p className="text-[11px] text-gray-500 mt-1.5">
                  We will send your order confirmation and tracking receipt to this email.
                </p>
              </div>
            </div>

            {/* 2. Shipping Details */}
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
                    disabled={isProcessing}
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    placeholder="Alex Johnson"
                    className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs placeholder:text-gray-400 disabled:opacity-50"
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
                    disabled={isProcessing}
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    placeholder="(555) 019-2834"
                    className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs placeholder:text-gray-400 disabled:opacity-50"
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
                    disabled={isProcessing}
                    value={shipping.street}
                    onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                    placeholder="742 Evergreen Terrace"
                    className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs placeholder:text-gray-400 disabled:opacity-50"
                  />
                </div>

                {/* Apt / Suite */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Apartment, suite, unit (optional)
                  </label>
                  <input
                    type="text"
                    disabled={isProcessing}
                    value={shipping.apt}
                    onChange={(e) => setShipping({ ...shipping, apt: e.target.value })}
                    placeholder="Suite 4B"
                    className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs placeholder:text-gray-400 disabled:opacity-50"
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
                    disabled={isProcessing}
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    placeholder="Seattle"
                    className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs placeholder:text-gray-400 disabled:opacity-50"
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
                      disabled={isProcessing}
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      placeholder="WA"
                      className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs placeholder:text-gray-400 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isProcessing}
                      value={shipping.zipCode}
                      onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                      placeholder="98101"
                      className="w-full py-3 px-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs placeholder:text-gray-400 disabled:opacity-50"
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
                    onClick={() => !isProcessing && setDeliveryMethod('free')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      deliveryMethod === 'free'
                        ? 'border-gray-900 bg-gray-50/80 ring-1 ring-gray-900'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
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
                    onClick={() => !isProcessing && setDeliveryMethod('express')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      deliveryMethod === 'express'
                        ? 'border-gray-900 bg-gray-50/80 ring-1 ring-gray-900'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
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

            {/* 1, 2, 3. Payment Method: High-Fidelity Modern Stripe Elements UI Mock */}
            <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Payment Method
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stripe Elements Secure</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Unified Stripe Elements Card Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-700">
                      Card information
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        VISA
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                        MC
                      </span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                        AMEX
                      </span>
                    </div>
                  </div>

                  {/* Clean, Unified Input Box with border-gray-300 */}
                  <div
                    className={`border border-gray-300 rounded-xl bg-white shadow-2xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 overflow-hidden transition-all ${
                      isProcessing ? 'opacity-60 bg-gray-50' : ''
                    }`}
                  >
                    {/* Top Row: Card Number & Brand Badge */}
                    <div className="flex items-center px-3.5 py-3">
                      <CreditCard className="w-4 h-4 text-gray-400 shrink-0 mr-2.5" />
                      <input
                        type="text"
                        required
                        disabled={isProcessing}
                        value={payment.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 1234 1234 1234"
                        className="w-full text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent font-mono tracking-wider disabled:cursor-not-allowed"
                      />
                      <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ml-2">
                        {getCardBrand(payment.cardNumber)}
                      </span>
                    </div>

                    {/* Bottom Row: Expiration & CVC with dividers */}
                    <div className="border-t border-gray-200 flex divide-x divide-gray-200">
                      {/* Expiration MM / YY */}
                      <div className="flex-1 px-3.5 py-2.5">
                        <input
                          type="text"
                          required
                          disabled={isProcessing}
                          value={payment.expiry}
                          onChange={handleExpiryChange}
                          placeholder="MM / YY"
                          className="w-full text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent font-mono disabled:cursor-not-allowed"
                        />
                      </div>

                      {/* CVC Code with Security Lock Icon */}
                      <div className="flex-1 flex items-center px-3.5 py-2.5 gap-2">
                        <input
                          type="text"
                          required
                          disabled={isProcessing}
                          maxLength={4}
                          value={payment.cvc}
                          onChange={handleCvcChange}
                          placeholder="CVC"
                          className="w-full text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent font-mono disabled:cursor-not-allowed"
                        />
                        <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Cardholder name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isProcessing}
                    value={payment.cardName}
                    onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                    placeholder="Alex Johnson"
                    className="w-full py-2.5 px-3.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs placeholder:text-gray-400 disabled:opacity-50"
                  />
                </div>

                {/* Stripe Trust Footer */}
                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                  <span>Cardholder verification encrypted via 256-bit SSL</span>
                  <span className="font-semibold text-gray-500 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    Stripe Elements Verified
                  </span>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Right Column: Sticky "Order Summary" Card with Animated Place Order Button */}
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

            {/* 4. High-Contrast "Place Order" Button with Realistic Processing State */}
            <button
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="w-full bg-gray-900 hover:bg-black active:bg-gray-800 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-base font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>
                    Place Order · {formatCurrency(
                      deliveryMethod === 'express' ? summary.total + 9.99 : summary.total
                    )}
                  </span>
                </>
              )}
            </button>

            {/* Guarantee Footer */}
            <p className="text-[11px] text-gray-400 text-center leading-tight">
              By placing your order, your payment will be processed securely via mock Stripe Elements. Free 30-day returns.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
