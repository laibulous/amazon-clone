export type ProductCategory = 'Electronics' | 'Books' | 'Home' | 'Fashion';

export type ProductSpecification = Record<string, string>;

export interface Product {
  id: string;
  asin: string;
  title: string;
  brand: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  isPrime: boolean;
  isBestSeller?: boolean;
  isAmazonChoice?: boolean;
  stock: number;
  inStock: boolean;
  images: string[];
  thumbnail: string;
  description: string;
  features: string[];
  specifications: ProductSpecification;
  badgeText?: string;
}

export interface ProductFilterParams {
  category?: ProductCategory | 'All';
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  primeOnly?: boolean;
  inStockOnly?: boolean;
  sortBy?: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
}
