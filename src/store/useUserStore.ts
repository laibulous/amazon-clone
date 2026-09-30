import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/user';

export interface UserState {
  user: User | null;
  login: (userData?: Partial<User>) => void;
  logout: () => void;
  togglePrimeStatus: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,

      login: (userData) => {
        set({
          user: {
            name: 'Laiba',
            isPrimeMember: true,
            email: 'laiba@example.com',
            id: 'usr-laiba-101',
            ...userData,
          },
        });
      },

      logout: () => {
        set({ user: null });
      },

      togglePrimeStatus: () => {
        set((state) => ({
          user: state.user
            ? { ...state.user, isPrimeMember: !state.user.isPrimeMember }
            : null,
        }));
      },
    }),
    {
      name: 'amazon-clone-auth-user',
    }
  )
);
