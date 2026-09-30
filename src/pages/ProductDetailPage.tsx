import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Check,
  ChevronLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
  Zap,
} from 'lucide-react';
import productsData from '../data/products.json';
import type { Product } from '../types/product';
import {
  splitPrice,
  formatCurrency,
  formatReviewCount,
  getEstimatedDelivery,
} from '../utils/formatters';
import { useCartStore } from '../store/useCartStore';
import { ReviewSummary } from '../components/product';

const products = productsData as unknown as Product[];

interface ProductViewProps {
  product: Product;
}

const ProductView: React.FC<ProductViewProps> = ({ product }) => {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const [selectedImage, setSelectedImage] = useState<string>(
    product.thumbnail || (product.images && product.images[0]) || ''
  );
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  const { dollars, cents } = splitPrice(product.price);
  const maxStock = Math.min(product.stock, 10);

  const handleAddToCart = () => {
    addToCart(product, selectedQuantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedQuantity);
    navigate('/checkout');
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => {
          const isFilled = i < fullStars || (i === fullStars && hasHalfStar);
          return (
            <Star
              key={i}
              className={`w-4 h-4 ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-gray-200 text-gray-300'
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 pb-32 lg:pb-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 flex-wrap">
        <Link
          to="/"
          className="hover:text-gray-900 transition-colors flex items-center gap-1 font-medium"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          All Products
        </Link>
        <span>/</span>
        <span className="text-gray-600">{product.category}</span>
        <span>/</span>
        <span className="text-gray-900 font-semibold truncate max-w-[280px] sm:max-w-md">
          {product.title}
        </span>
      </div>

      {/* 1. Clean Two-Column Grid: Left (Image) | Right (Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        
        {/* Left Column (lg:col-span-6): Large, clear image with subtle gray background (bg-gray-50) */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">
          <div className="w-full bg-gray-50 rounded-3xl border border-gray-100 p-8 sm:p-12 flex items-center justify-center min-h-[380px] sm:min-h-[460px] max-h-[560px] shadow-xs relative overflow-hidden group">
            {/* Prime badge overlay if applicable */}
            {product.isPrime && (
              <div className="absolute top-5 left-5 z-10">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-900 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-gray-200/80 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  Prime Delivery
                </span>
              </div>
            )}

            {/* Discount pill badge */}
            {product.discountPercentage > 0 && (
              <div className="absolute top-5 right-5 z-10">
                <span className="inline-flex items-center text-[11px] font-extrabold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-200">
                  {product.discountPercentage}% OFF
                </span>
              </div>
            )}

            {/* Main Hero Image */}
            <img
              src={selectedImage}
              alt={product.title}
              className="max-h-[380px] sm:max-h-[440px] w-full object-contain transition-transform duration-300 group-hover:scale-105 select-none"
            />
          </div>

          {/* Multiple Image Gallery Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-2xl bg-gray-50 p-2 border transition-all cursor-pointer shrink-0 ${
                    selectedImage === img
                      ? 'border-gray-900 ring-2 ring-gray-900/10 shadow-xs'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (lg:col-span-6): Clean, focused product details */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-7">
          
          {/* Brand & Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase text-blue-600">
                {product.brand}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500 font-medium">
                {product.subcategory}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
              {product.title}
            </h1>
          </div>

          {/* Star Rating & Reviews Count Header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 flex-wrap">
            {renderStars(product.rating)}
            <span className="text-sm font-bold text-gray-900">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500 font-medium">
              {formatReviewCount(product.reviewCount)} customer ratings
            </span>
          </div>

          {/* Price & Value Block */}
          <div className="space-y-1.5 pb-5 border-b border-gray-100">
            <div className="flex items-baseline gap-3">
              <div className="flex items-start text-gray-950 font-extrabold">
                <span className="text-lg font-bold pt-1 mr-0.5">$</span>
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none">
                  {dollars}
                </span>
                <sup className="text-base font-bold -top-2 ml-0.5">{cents}</sup>
              </div>

              {product.originalPrice > product.price && (
                <div className="text-sm text-gray-400 line-through font-medium">
                  {formatCurrency(product.originalPrice)}
                </div>
              )}
            </div>

            {/* Delivery Estimation */}
            <div className="flex items-center gap-2 text-xs text-gray-600 pt-1">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                FREE delivery <strong className="text-gray-900">{getEstimatedDelivery(product.isPrime)}</strong>
              </span>
            </div>
          </div>

          {/* Stock Availability */}
          <div>
            {product.inStock && product.stock > 0 ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-700">
                  In Stock ({product.stock} units available)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-xs font-bold text-rose-700">
                  Currently Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Desktop Purchase Action Area */}
          <div className="hidden lg:block space-y-4 pt-1">
            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              {product.inStock && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700">Qty:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/80 p-1">
                    <button
                      type="button"
                      onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                      disabled={selectedQuantity <= 1}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600 hover:bg-white transition-colors cursor-pointer disabled:opacity-30"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-gray-900 font-mono">
                      {selectedQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedQuantity((q) => Math.min(maxStock, q + 1))}
                      disabled={selectedQuantity >= maxStock}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600 hover:bg-white transition-colors cursor-pointer disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart button (Desktop) */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock || product.stock === 0}
                className="flex-1 bg-gray-900 hover:bg-black active:bg-gray-800 text-white text-sm font-bold py-3.5 px-6 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              {/* Buy Now button (Desktop) */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!product.inStock || product.stock === 0}
                className="py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Desktop Add Confirmation Toast */}
            {addedToast && (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded-xl p-3 text-center font-medium animate-in fade-in duration-200 flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Added {selectedQuantity} item(s) to Cart!</span>
              </div>
            )}
          </div>

          {/* Product Overview & Features */}
          <div className="space-y-3 pt-2">
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {product.features && product.features.length > 0 && (
              <div className="space-y-2 pt-2">
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Key Highlights
                </h2>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Free 30-day returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Secure transaction</span>
            </div>
          </div>

          {/* 2. Review Summary Component: AI Generated Summary & Star Progress Bars */}
          <div className="pt-2">
            <ReviewSummary
              rating={product.rating}
              reviewCount={product.reviewCount}
              productTitle={product.title}
            />
          </div>

        </div>

      </div>

      {/* 3. Massive and Sticky 'Add to Cart' Bar on Mobile (Thumb-accessible) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 p-3 sm:p-4 shadow-2xl lg:hidden">
        <div className="max-w-md mx-auto flex items-center gap-3">
          
          {/* Price preview */}
          <div className="shrink-0 pr-1">
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Total
            </div>
            <div className="text-lg font-extrabold text-gray-950 leading-none">
              {formatCurrency(product.price * selectedQuantity)}
            </div>
          </div>

          {/* Quantity Selector on Mobile */}
          {product.inStock && (
            <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
                disabled={selectedQuantity <= 1}
                className="w-7 h-7 flex items-center justify-center text-xs font-bold text-gray-600 disabled:opacity-30"
              >
                -
              </button>
              <span className="w-6 text-center text-xs font-bold text-gray-900 font-mono">
                {selectedQuantity}
              </span>
              <button
                type="button"
                onClick={() => setSelectedQuantity((q) => Math.min(maxStock, q + 1))}
                disabled={selectedQuantity >= maxStock}
                className="w-7 h-7 flex items-center justify-center text-xs font-bold text-gray-600 disabled:opacity-30"
              >
                +
              </button>
            </div>
          )}

          {/* Massive Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock || product.stock === 0}
            className="flex-1 py-4 px-5 bg-gray-900 active:bg-black text-white text-base font-extrabold rounded-2xl shadow-lg shadow-gray-900/15 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
            <span>Add to Cart</span>
          </button>
        </div>

        {/* Mobile Toast Feedback */}
        {addedToast && (
          <div className="mt-2 text-center text-xs font-semibold text-emerald-700 animate-in fade-in">
            ✓ Added {selectedQuantity} item(s) to Cart!
          </div>
        )}
      </div>

    </div>
  );
};

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-600 mb-6">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white font-bold px-6 py-2.5 rounded-full text-sm shadow-xs transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Homepage
        </Link>
      </div>
    );
  }

  return <ProductView key={product.id} product={product} />;
};

export default ProductDetailPage;
