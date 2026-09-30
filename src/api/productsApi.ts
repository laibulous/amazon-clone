import productsData from '../data/products.json';
import type { Product, ProductCategory, ProductFilterParams } from '../types/product';

// Strongly typed mock products dataset
const products: Product[] = productsData as unknown as Product[];

// Simulated latency helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const productsApi = {
  /**
   * Fetch all products or filter by category, query, price, rating, prime status, and sort
   */
  async getProducts(
    params: ProductFilterParams = {},
    page: number = 1,
    pageSize: number = 12,
    simulatedDelay: number = 200
  ): Promise<PaginatedResponse<Product>> {
    if (simulatedDelay > 0) {
      await delay(simulatedDelay);
    }

    let filtered = [...products];

    // Category filter
    if (params.category && params.category !== 'All') {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === params.category?.toLowerCase()
      );
    }

    // Search query filter (title, brand, category, description, features)
    if (params.searchQuery && params.searchQuery.trim().length > 0) {
      const q = params.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    // Prime badge filter
    if (params.primeOnly) {
      filtered = filtered.filter((p) => p.isPrime);
    }

    // In-stock only filter
    if (params.inStockOnly) {
      filtered = filtered.filter((p) => p.inStock && p.stock > 0);
    }

    // Price range filters
    if (params.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= (params.minPrice as number));
    }
    if (params.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= (params.maxPrice as number));
    }

    // Rating filter
    if (params.minRating !== undefined) {
      filtered = filtered.filter((p) => p.rating >= (params.minRating as number));
    }

    // Sorting
    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
          break;
        case 'newest':
          // Keep recent order
          break;
        case 'featured':
        default:
          filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
          break;
      }
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIdx = (page - 1) * pageSize;
    const items = filtered.slice(startIdx, startIdx + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  },

  /**
   * Get a single product by ID
   */
  async getProductById(id: string, simulatedDelay: number = 100): Promise<Product | null> {
    if (simulatedDelay > 0) {
      await delay(simulatedDelay);
    }
    const product = products.find((p) => p.id === id);
    return product ? { ...product } : null;
  },

  /**
   * Get a single product by ASIN
   */
  async getProductByAsin(asin: string, simulatedDelay: number = 100): Promise<Product | null> {
    if (simulatedDelay > 0) {
      await delay(simulatedDelay);
    }
    const product = products.find((p) => p.asin.toLowerCase() === asin.toLowerCase());
    return product ? { ...product } : null;
  },

  /**
   * Get list of unique categories
   */
  async getCategories(): Promise<ProductCategory[]> {
    const categoriesSet = new Set<ProductCategory>();
    products.forEach((p) => categoriesSet.add(p.category));
    return Array.from(categoriesSet);
  },

  /**
   * Get related products in the same category
   */
  async getRelatedProducts(productId: string, limit: number = 4): Promise<Product[]> {
    const current = products.find((p) => p.id === productId);
    if (!current) return [];

    return products
      .filter((p) => p.id !== productId && p.category === current.category)
      .slice(0, limit);
  },
};
