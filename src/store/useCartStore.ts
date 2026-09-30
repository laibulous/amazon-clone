import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CartSummary } from '../types/cart';
import type { Product } from '../types/product';

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getSummary: () => CartSummary;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product: Product, quantity: number = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            const currentQty = updatedItems[existingItemIndex].quantity;
            const newQty = Math.min(currentQty + quantity, product.stock);
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: newQty,
            };
            return { items: updatedItems };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                quantity: Math.min(quantity, product.stock),
              },
            ],
          };
        });
      },

      removeFromCart: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId) {
              const maxStock = item.product.stock;
              return { ...item, quantity: Math.min(quantity, maxStock) };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSummary: (): CartSummary => {
        const { items } = get();

        const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

        const subtotal = items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        const originalTotal = items.reduce(
          (sum, item) => sum + item.product.originalPrice * item.quantity,
          0
        );

        const savings = Math.max(0, originalTotal - subtotal);

        // Free shipping if over $35 or has Prime items
        const isEligibleForFreeShipping =
          subtotal >= 35 || items.some((item) => item.product.isPrime);
        const shipping = itemsCount === 0 ? 0 : isEligibleForFreeShipping ? 0 : 5.99;

        // Estimated 8% sales tax
        const estimatedTax = subtotal * 0.08;

        const total = subtotal + shipping + estimatedTax;

        return {
          itemsCount,
          subtotal: Number(subtotal.toFixed(2)),
          shipping: Number(shipping.toFixed(2)),
          estimatedTax: Number(estimatedTax.toFixed(2)),
          total: Number(total.toFixed(2)),
          savings: Number(savings.toFixed(2)),
        };
      },
    }),
    {
      name: 'amazon-clone-cart',
    }
  )
);
