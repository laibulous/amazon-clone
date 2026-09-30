import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Check } from 'lucide-react';
import type { Product } from '../../types/product';
import { splitPrice, formatReviewCount } from '../../utils/formatters';
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
    // Required behavior: log product id to console
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
                  : 'fill-gray-200 text-gray-300'
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-md border border-gray-200 hover:shadow-lg transition-all duration-200 p-4 flex flex-col justify-between h-full group relative">
      {/* Top Section: Badge, Image, Title */}
      <div>
        {/* Amazon Badge (e.g. Best Seller / Amazon's Choice) */}
        <div className="h-6 mb-2 flex items-center">
          {product.isBestSeller && (
            <span className="bg-[#e67a00] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
              #1 Best Seller
            </span>
          )}
          {!product.isBestSeller && product.isAmazonChoice && (
            <span className="bg-[#232f3e] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
              Amazon's <span className="text-[#f08804]">Choice</span>
            </span>
          )}
        </div>

        {/* 1. Product Image (object-contain, fixed height) with PDP Link */}
        <Link
          to={`/product/${product.id}`}
          className="block w-full h-52 p-2 mb-3 bg-gray-50/50 rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          aria-label={`View details for ${product.title}`}
        >
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
          />
        </Link>

        {/* Brand & Subcategory Header */}
        <div className="text-[11px] text-gray-500 font-medium mb-1">
          {product.brand} · {product.subcategory}
        </div>

        {/* 2. Product Title (line-clamped to 2 lines) with PDP Link */}
        <Link to={`/product/${product.id}`} className="block group-hover:text-amber-700 transition-colors">
          <h3
            title={product.title}
            className="text-sm font-semibold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug mb-2 min-h-[2.5rem]"
          >
            {product.title}
          </h3>
        </Link>

        {/* 3. Star Rating and Review Count */}
        <div className="flex items-center gap-1.5 mb-2">
          {renderStars(product.rating)}
          <span className="text-xs text-gray-600 font-medium">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-blue-700 hover:underline cursor-pointer">
            ({formatReviewCount(product.reviewCount)})
          </span>
        </div>

        {/* 4. Price formatted with superscript cents */}
        <div className="flex items-baseline gap-2 mb-2">
          <div className="flex items-start text-gray-900">
            <span className="text-xs font-semibold pt-1 mr-0.5">$</span>
            <span className="text-2xl font-bold leading-none">{dollars}</span>
            <sup className="text-xs font-semibold -top-1 ml-0.5">{cents}</sup>
          </div>

          {/* Original price strike-through & discount if available */}
          {product.originalPrice > product.price && (
            <div className="text-xs text-gray-500">
              <span className="line-through">${product.originalPrice.toFixed(2)}</span>
              <span className="text-red-700 font-medium ml-1">
                -{product.discountPercentage}%
              </span>
            </div>
          )}
        </div>

        {/* 5. 'Prime' Badge if isPrime: true */}
        <div className="min-h-5 mb-3 flex items-center">
          {product.isPrime ? (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center text-xs font-extrabold italic text-[#007185] tracking-tight">
                <Check className="w-3.5 h-3.5 text-[#00a8e1] stroke-[3]" />
                prime
              </span>
              <span className="text-[11px] text-gray-600">
                One-Day Delivery
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-gray-500">
              Standard Shipping Available
            </span>
          )}
        </div>

        {/* Stock urgency indicator if low */}
        {product.stock <= 15 && product.stock > 0 && (
          <p className="text-[11px] text-red-700 font-semibold mb-3">
            Only {product.stock} left in stock - order soon.
          </p>
        )}
      </div>

      {/* Bottom Section: 6. Add to Cart Button */}
      <div className="mt-2 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-gray-900 text-xs font-medium py-2 px-4 rounded-full border border-[#fcd200] hover:border-[#a88734] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
          aria-label={`Add ${product.title} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
