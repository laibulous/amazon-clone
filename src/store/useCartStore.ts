import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, CartSummary } from '../types/cart';
import type { Product } from '../types/product';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalCount: () => number;
  getSubtotal: () => number;
  getSummary: () => CartSummary;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

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
            return { items: updatedItems, isOpen: true };
          }

          return {
            items: [
              ...state.items,
              {
                product,
                quantity: Math.min(quantity, product.stock),
              },
            ],
            isOpen: true,
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

      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        const sub = get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        return Number(sub.toFixed(2));
      },

      getSummary: (): CartSummary => {
        const { items, getTotalCount, getSubtotal } = get();

        const itemsCount = getTotalCount();
        const subtotal = getSubtotal();

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
          subtotal,
          shipping: Number(shipping.toFixed(2)),
          estimatedTax: Number(estimatedTax.toFixed(2)),
          total: Number(total.toFixed(2)),
          savings: Number(savings.toFixed(2)),
        };
      },
    }),
    {
      name: 'amazon-clone-cart',
      // Persist only cart items so drawer visibility starts closed on refresh
      partialize: (state) => ({ items: state.items }),
    }
  )
);
