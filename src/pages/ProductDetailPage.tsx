import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Check,
  ChevronLeft,
  MapPin,
  Lock,
} from 'lucide-react';
import productsData from '../data/products.json';
import type { Product } from '../types/product';
import { splitPrice, formatReviewCount, getEstimatedDelivery } from '../utils/formatters';
import { useCartStore } from '../store/useCartStore';

const products = productsData as unknown as Product[];

interface ProductViewProps {
  product: Product;
}

const ProductView: React.FC<ProductViewProps> = ({ product }) => {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const [selectedImage, setSelectedImage] = useState<string>(
    product.thumbnail || product.images[0] || ''
  );
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [addedAlert, setAddedAlert] = useState<boolean>(false);

  const { dollars, cents } = splitPrice(product.price);
  const maxStock = Math.min(product.stock, 10);

  const handleAddToCart = () => {
    addToCart(product, selectedQuantity);
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 3000);
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
    <div className="max-w-[1500px] w-full mx-auto px-4 py-4 md:py-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
        <Link to="/" className="hover:text-blue-700 hover:underline flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to results
        </Link>
        <span>›</span>
        <span>{product.category}</span>
        <span>›</span>
        <span className="text-gray-700 font-medium">{product.subcategory}</span>
      </div>

      {/* Main PDP Grid: Image (Left) | Details (Center) | Buy Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 1. Large Main Image & Thumbnails Gallery (Left Column) */}
        <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-4 items-center md:items-start sticky top-20">
          {/* Thumbnails list */}
          {product.images && product.images.length > 1 && (
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 rounded border p-1 bg-white cursor-pointer transition-all ${
                    selectedImage === img
                      ? 'border-amber-600 ring-2 ring-amber-500/50'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Main Hero Image */}
          <div className="flex-1 w-full bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center min-h-[380px] max-h-[480px]">
            <img
              src={selectedImage}
              alt={product.title}
              className="max-h-[400px] w-full object-contain"
            />
          </div>
        </div>

        {/* 2. Detailed Product Info (Center Column) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Brand header */}
          <div>
            <span className="text-xs text-blue-700 hover:underline cursor-pointer font-medium">
              Brand: {product.brand}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug mt-1">
              {product.title}
            </h1>
          </div>

          {/* Badge indicator */}
          {product.badgeText && (
            <div className="inline-block bg-[#e67a00] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-sm">
              {product.badgeText}
            </div>
          )}

          {/* Star Ratings & Reviews count */}
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            {renderStars(product.rating)}
            <span className="text-xs text-blue-700 hover:underline cursor-pointer font-medium">
              {product.rating.toFixed(1)} out of 5
            </span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-blue-700 hover:underline cursor-pointer">
              {formatReviewCount(product.reviewCount)} ratings
            </span>
          </div>

          {/* Price Block */}
          <div className="space-y-1 pb-3 border-b border-gray-200">
            {product.discountPercentage > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-red-700 text-2xl font-light">
                  -{product.discountPercentage}%
                </span>
                <div className="flex items-start text-gray-900">
                  <span className="text-sm font-semibold pt-1 mr-0.5">$</span>
                  <span className="text-3xl font-extrabold leading-none">{dollars}</span>
                  <sup className="text-sm font-semibold -top-1 ml-0.5">{cents}</sup>
                </div>
              </div>
            )}

            {product.discountPercentage === 0 && (
              <div className="flex items-start text-gray-900">
                <span className="text-sm font-semibold pt-1 mr-0.5">$</span>
                <span className="text-3xl font-extrabold leading-none">{dollars}</span>
                <sup className="text-sm font-semibold -top-1 ml-0.5">{cents}</sup>
              </div>
            )}

            {product.originalPrice > product.price && (
              <p className="text-xs text-gray-500">
                Typical price: <span className="line-through">${product.originalPrice.toFixed(2)}</span>
              </p>
            )}

            {/* Prime badge banner */}
            {product.isPrime && (
              <div className="pt-2 flex items-center gap-1.5 text-xs text-gray-700">
                <span className="inline-flex items-center text-xs font-black italic text-[#007185] tracking-tight">
                  <Check className="w-3.5 h-3.5 text-[#00a8e1] stroke-[3]" />
                  prime
                </span>
                <span className="font-semibold text-gray-900">One-Day Delivery</span>
                <span>& FREE Returns</span>
              </div>
            )}
          </div>

          {/* Description summary */}
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            {product.description}
          </p>

          {/* Bullet Points: About this item */}
          <div className="pt-2">
            <h3 className="text-sm font-bold text-gray-900 mb-2">About this item</h3>
            <ul className="text-xs sm:text-sm text-gray-800 space-y-1.5 list-disc pl-5">
              {product.features.map((feature, i) => (
                <li key={i} className="leading-snug">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Specifications Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Product specifications</h3>
              <div className="grid grid-cols-2 gap-y-2 text-xs border border-gray-200 rounded p-3 bg-gray-50">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <React.Fragment key={key}>
                    <span className="font-semibold text-gray-700">{key}</span>
                    <span className="text-gray-900">{val}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Sticky 'Buy Box' (Right Column) */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-xs sticky top-20 space-y-4">
            {/* Price in Buy Box */}
            <div className="flex items-start text-gray-900">
              <span className="text-xs font-semibold pt-1 mr-0.5">$</span>
              <span className="text-2xl font-bold leading-none">{dollars}</span>
              <sup className="text-xs font-semibold -top-1 ml-0.5">{cents}</sup>
            </div>

            {/* Delivery Estimation */}
            <div className="text-xs text-gray-700 space-y-1">
              <p>
                FREE delivery <strong className="text-gray-900">{getEstimatedDelivery(product.isPrime)}</strong>
              </p>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                <span className="truncate">Deliver to New York 10001</span>
              </div>
            </div>

            {/* Stock status */}
            <div>
              {product.inStock && product.stock > 0 ? (
                <div>
                  <span className="text-base font-bold text-emerald-700">In Stock</span>
                  {product.stock <= 15 && (
                    <p className="text-xs text-red-700 font-semibold mt-0.5">
                      Only {product.stock} left in stock - order soon.
                    </p>
                  )}
                </div>
              ) : (
                <span className="text-base font-bold text-red-700">Currently Unavailable</span>
              )}
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="flex items-center gap-2 text-xs">
                <label htmlFor="qty-select" className="font-semibold text-gray-700">
                  Quantity:
                </label>
                <select
                  id="qty-select"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                  className="bg-gray-100 border border-gray-300 rounded px-2.5 py-1 text-xs font-medium text-gray-900 outline-none cursor-pointer hover:bg-gray-200"
                >
                  {[...Array(maxStock)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!product.inStock || product.stock === 0}
                className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f0b800] text-gray-900 text-xs font-semibold py-2.5 px-4 rounded-full border border-[#fcd200] hover:border-[#a88734] shadow-xs cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!product.inStock || product.stock === 0}
                className="w-full bg-[#ffa41c] hover:bg-[#fa8900] active:bg-[#e07b00] text-gray-900 text-xs font-semibold py-2.5 px-4 rounded-full border border-[#ff8f00] shadow-xs cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Success toast */}
            {addedAlert && (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded p-2 text-center font-medium animate-in fade-in duration-200">
                ✓ Added {selectedQuantity} item(s) to Cart!
              </div>
            )}

            {/* Fulfillment and Security Info */}
            <div className="pt-2 border-t border-gray-200 text-[11px] text-gray-600 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Ships from</span>
                <span className="font-medium text-gray-900">Amazon.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sold by</span>
                <span className="font-medium text-gray-900">{product.brand} Store</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Returns</span>
                <span className="font-medium text-gray-900">30-day refund/replacement</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 pt-1">
                <Lock className="w-3 h-3 text-gray-400" />
                <span>Secure transaction</span>
              </div>
            </div>
          </div>
        </div>

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
          className="inline-flex items-center gap-1.5 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold px-6 py-2.5 rounded-full text-sm shadow-xs transition-colors"
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
