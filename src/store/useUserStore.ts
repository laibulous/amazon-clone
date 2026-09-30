import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DeliveryAddress, User } from '../types/user';

interface UserState {
  user: User;
  isLoggedIn: boolean;
  togglePrimeStatus: () => void;
  selectAddress: (addressId: string) => void;
  addAddress: (address: Omit<DeliveryAddress, 'id'>) => void;
  login: (name: string, email: string) => void;
  logout: () => void;
}

const defaultAddresses: DeliveryAddress[] = [
  {
    id: 'addr-1',
    fullName: 'Jane Doe',
    street: '742 Evergreen Terrace',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    country: 'United States',
    isDefault: true,
  },
  {
    id: 'addr-2',
    fullName: 'Jane Doe (Office)',
    street: '410 Terry Ave N',
    aptSuite: 'Building 4',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98109',
    country: 'United States',
    isDefault: false,
  },
];

const initialUser: User = {
  id: 'usr-98124',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  isLoggedIn: true,
  isPrimeMember: true,
  selectedAddress: defaultAddresses[0],
  savedAddresses: defaultAddresses,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: initialUser,
      isLoggedIn: true,

      togglePrimeStatus: () => {
        set((state) => ({
          user: {
            ...state.user,
            isPrimeMember: !state.user.isPrimeMember,
          },
        }));
      },

      selectAddress: (addressId: string) => {
        set((state) => {
          const selected = state.user.savedAddresses.find((a) => a.id === addressId);
          if (!selected) return state;
          return {
            user: {
              ...state.user,
              selectedAddress: selected,
            },
          };
        });
      },

      addAddress: (newAddrData) => {
        set((state) => {
          const newAddress: DeliveryAddress = {
            ...newAddrData,
            id: `addr-${Date.now()}`,
          };
          const updatedAddresses = [...state.user.savedAddresses, newAddress];
          return {
            user: {
              ...state.user,
              savedAddresses: updatedAddresses,
              selectedAddress: newAddress.isDefault ? newAddress : state.user.selectedAddress,
            },
          };
        });
      },

      login: (name: string, email: string) => {
        set((state) => ({
          isLoggedIn: true,
          user: {
            ...state.user,
            name,
            email,
            isLoggedIn: true,
          },
        }));
      },

      logout: () => {
        set((state) => ({
          isLoggedIn: false,
          user: {
            ...state.user,
            isLoggedIn: false,
          },
        }));
      },
    }),
    {
      name: 'amazon-clone-user',
    }
  )
);
