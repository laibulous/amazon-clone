import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './components/layout';
import { CartDrawer } from './components/cart';
import { HomePage, ProductDetailPage, CheckoutPage } from './pages';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleSelectCategory = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#eaeded] text-[#0f1111] flex flex-col font-sans">
      {/* 
        Amazon-style Persistent Header:
        - Logo (links to /)
        - Deliver to location
        - Functional search bar connected to useFilterStore
        - Functional category dropdown connected to useFilterStore
        - Returns & Orders
        - Cart icon with dynamic count from useCartStore (opens CartDrawer)
      */}
      <Header
        deliveryLocation="New York 10001"
        onSelectCategory={handleSelectCategory}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Sliding Shopping Cart Drawer */}
      <CartDrawer />

      {/* Main Content Router */}
      <main className="flex-1">
        <Routes>
          {/* Homepage with dynamic filterable product grid */}
          <Route path="/" element={<HomePage />} />

          {/* Product Detail Page (PDP) */}
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* Checkout Page */}
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-[#232f3e] text-white">
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-center py-4 bg-[#37475a] hover:bg-[#485769] transition-colors cursor-pointer"
        >
          <span className="text-xs font-semibold block w-full">Back to top</span>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-xs text-gray-400">
          <p className="mb-2 font-medium text-gray-300">
            Amazon Clone Evaluation Project — Built with React 19, Vite, Tailwind CSS & Zustand
          </p>
          <p>© 2026 Amazon Clone, Inc. or its affiliates. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
