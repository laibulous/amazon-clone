import { Header } from './components/layout';
import productsData from './data/products.json';
import { Database, Layers, CheckCircle2 } from 'lucide-react';

export default function App() {
  const categories = ['All Departments', ...Array.from(new Set(productsData.map((p) => p.category)))];

  return (
    <div className="min-h-screen bg-[#eaeded] text-[#0f1111] flex flex-col">
      {/* 
        Amazon-style Header:
        - Placeholder logo on far left
        - Deliver to location
        - Central search bar with category dropdown + search button
        - Returns & Orders block
        - Cart icon with dynamic count hardcoded to '0'
      */}
      <Header
        cartCount={0}
        deliveryLocation="New York 10001"
        categories={categories}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mt-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Navigation & Header Verification
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Amazon-style header layout with Flexbox responsiveness and Lucide React icons.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Header Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
                <Database className="w-4 h-4 text-blue-600" />
                <span>Header Capabilities</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li>• <strong>Brand Logo:</strong> Amazon-style branding with signature smile curve</li>
                <li>• <strong>Delivery Location:</strong> Pin icon + "Deliver to New York 10001" with hover states</li>
                <li>• <strong>Search Bar:</strong> Category selector dropdown + full-width input + search button</li>
                <li>• <strong>Returns & Orders:</strong> Stacked typography matching Amazon specs</li>
                <li>• <strong>Cart Counter:</strong> Dynamic cart icon counter badge (hardcoded to '0')</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-2 font-semibold text-gray-800">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Responsive Behaviors</span>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li>• <strong>Desktop:</strong> Central search bar automatically flexes to consume all remaining width</li>
                <li>• <strong>Mobile:</strong> Search bar gracefully drops into its own full-width row for optimal touch UX</li>
                <li>• <strong>Subnav Bar:</strong> Includes "All" department trigger, deals, and quick-navigation links</li>
                <li>• <strong>Mobile Menu:</strong> Collapsible hamburger navigation drawer for narrow viewports</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
