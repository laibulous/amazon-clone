import type { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface CartSummary {
  itemsCount: number;
  subtotal: number;
  shipping: number;
  estimatedTax: number;
  total: number;
  savings: number;
}
