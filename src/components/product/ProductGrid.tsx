import React from 'react';
import type { Product } from '../../types/product';
import { ProductCard } from './ProductCard';

export interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
}) => {
  if (products.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg p-10 text-center border border-gray-200 shadow-sm my-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          No matching products found
        </h3>
        <p className="text-sm text-gray-500">
          Try adjusting your search criteria or browsing all categories.
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      data-testid="product-grid"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
