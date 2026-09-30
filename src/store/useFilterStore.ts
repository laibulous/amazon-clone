import { create } from 'zustand';

export interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  selectedIntent: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedIntent: (intent: string | null) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: '',
  selectedCategory: 'All',
  selectedIntent: null,
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSelectedCategory: (category: string) => set({ selectedCategory: category }),
  setSelectedIntent: (intent: string | null) =>
    set((state) => ({
      selectedIntent: state.selectedIntent === intent ? null : intent,
    })),
  clearFilters: () => set({ searchQuery: '', selectedCategory: 'All', selectedIntent: null }),
}));
