import { ShoppingBag, CheckCircle2, Database, Layers, Sparkles } from 'lucide-react';
import productsData from './data/products.json';
import { useCartStore } from './store/useCartStore';

export default function App() {
  const items = useCartStore((state) => state.items);
  const categories = Array.from(new Set(productsData.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-[#eaeded] text-[#0f1111] p-6 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-10">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-5 mb-6">
          <div className="bg-[#131921] p-2.5 rounded text-white">
            <ShoppingBag className="w-6 h-6 text-[#febd69]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#131921]">
              Amazon Clone Architecture Ready
            </h1>
            <p className="text-sm text-gray-500">
              Vite + React 19 + Tailwind CSS + Zustand + Lucide
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-md p-4">
            <Sparkles className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                Foundation & Data Layer Established
              </p>
              <p className="text-xs text-amber-700 mt-1">
                UI components will be implemented in the next phase. The scaffolding, state stores, and mock API are configured and ready.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
              <div className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
                <Database className="w-4 h-4 text-blue-600" />
                <span>Mock Data Store</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• <strong>{productsData.length}</strong> products in <code className="bg-gray-200 px-1 py-0.5 rounded">products.json</code></li>
                <li>• Categories: {categories.join(', ')}</li>
                <li>• Full Amazon schema (ratings, reviews, prime badges, specs, stock)</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
              <div className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>State & Utilities</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Zustand Cart Store (Current items: {items.length})</li>
                <li>• Zustand User Store (Prime status & addresses)</li>
                <li>• Simulated async Mock API in <code className="bg-gray-200 px-1 py-0.5 rounded">productsApi.ts</code></li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Tailwind CSS & TypeScript verified
            </span>
            <span>Ready for Component Implementation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
