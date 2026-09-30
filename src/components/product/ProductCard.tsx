import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Truck } from 'lucide-react';
import type { Product } from '../../types/product';
import { splitPrice, formatReviewCount, getDeliveryDatePlusTwo } from '../../utils/formatters';
import { useCartStore } from '../../store/useCartStore';

export interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const { dollars, cents } = splitPrice(product.price);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log(product.id);
    addToCart(product);
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  // Render 5-star rating representation
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => {
          const isFilled = i < fullStars || (i === fullStars && hasHalfStar);
          return (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-gray-100 text-gray-200'
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-transparent hover:border-gray-200/80 hover:shadow-lg transition-all duration-300 p-5 flex flex-col justify-between h-full group relative">
      {/* Top Section */}
      <div>
        {/* Subtle Badge Tag if available */}
        <div className="h-5 mb-2 flex items-center">
          {product.isBestSeller && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 uppercase tracking-wider">
              Best Seller
            </span>
          )}
          {!product.isBestSeller && product.isAmazonChoice && (
            <span className="text-[10px] font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
              Popular Choice
            </span>
          )}
        </div>

        {/* 1. Product Image with hover scale */}
        <Link
          to={`/product/${product.id}`}
          className="block w-full h-56 p-3 mb-4 bg-gray-50/70 rounded-xl overflow-hidden focus:outline-none cursor-pointer"
          aria-label={`View details for ${product.title}`}
        >
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        </Link>

        {/* Secondary Info: Brand & Subcategory */}
        <div className="text-xs text-gray-500 font-medium mb-1 tracking-wide">
          {product.brand} · {product.subcategory}
        </div>

        {/* Crisp Title with text-gray-900 */}
        <Link to={`/product/${product.id}`} className="block focus:outline-none">
          <h3
            title={product.title}
            className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug mb-2 min-h-[2.5rem]"
          >
            {product.title}
          </h3>
        </Link>

        {/* Rating and Review Count */}
        <div className="flex items-center gap-1.5 mb-2.5">
          {renderStars(product.rating)}
          <span className="text-xs font-semibold text-gray-900 ml-0.5">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500">
            ({formatReviewCount(product.reviewCount)})
          </span>
        </div>

        {/* Crisp Price Typography */}
        <div className="flex items-baseline gap-2 mb-2">
          <div className="flex items-start text-gray-900">
            <span className="text-xs font-semibold pt-0.5 mr-0.5">$</span>
            <span className="text-xl sm:text-2xl font-bold leading-none">{dollars}</span>
            <sup className="text-xs font-semibold -top-0.5 ml-0.5">{cents}</sup>
          </div>

          {/* Secondary Info: Original strike-through price */}
          {product.originalPrice > product.price && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span className="line-through">${product.originalPrice.toFixed(2)}</span>
              <span className="text-emerald-700 font-medium">
                Save {product.discountPercentage}%
              </span>
            </div>
          )}
        </div>

        {/* Sleek SVG / Minimalist Pill Tag for Prime */}
        {product.isPrime ? (
          <div className="min-h-5 mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-100/90 tracking-wide">
              {/* Sleek Prime SVG Checkmark */}
              <svg
                className="w-2.5 h-2.5 text-sky-600 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>prime</span>
            </span>
            <span className="text-xs text-gray-500">Free Two-Day</span>
          </div>
        ) : (
          <div className="min-h-5 mb-2 flex items-center">
            <span className="text-xs text-gray-500">Standard Delivery</span>
          </div>
        )}

        {/* Dynamic Delivery Estimator (Delivery Certainty) */}
        <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
          <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">
            Order now, arrives by <strong className="text-gray-900">{getDeliveryDatePlusTwo()}</strong>
          </span>
        </div>
      </div>

      {/* Modern Add to Cart Button */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-gray-950 text-xs font-semibold py-2.5 px-4 rounded-full transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          aria-label={`Add ${product.title} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
