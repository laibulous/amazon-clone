# Amazon Clone (Evaluation Project)

An Amazon Clone built with React 19, Vite, Tailwind CSS, Lucide React icons, and Zustand for state management.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) with custom Amazon brand theme tokens
- **Icons**: Lucide React
- **State Management**: Zustand with persistent storage (`useCartStore`, `useUserStore`)
- **Data & Mock Backend**: Asynchronous mock API (`src/api/productsApi.ts`) with realistic Amazon product schema

## Directory Structure

```
amazon-clone/
├── src/
│   ├── api/                 # Mock backend API client with search, filters, pagination
│   │   └── productsApi.ts
│   ├── assets/              # Static assets and icons
│   ├── components/          # Reusable UI component modules (Phase 2)
│   │   ├── common/          # Rating, Badges, Buttons, Modal (.gitkeep)
│   │   ├── layout/          # Navbar, Subheader, Footer, CartDrawer (.gitkeep)
│   │   └── product/         # ProductCard, ProductGrid, PriceTag (.gitkeep)
│   ├── context/             # React Context alternatives / adapters (.gitkeep)
│   ├── data/                # Mock datasets
│   │   └── products.json    # 16 realistic Amazon products across 4 categories
│   ├── hooks/               # Custom React hooks
│   │   └── useProducts.ts   # Product fetching, query parameters & state
│   ├── store/               # Zustand state stores
│   │   ├── useCartStore.ts  # Cart items, qty, totals, taxes, free shipping
│   │   └── useUserStore.ts  # Mock user auth, Prime membership, delivery addresses
│   ├── types/               # TypeScript interfaces & types
│   │   ├── product.ts       # Product, Category, FilterParams, Specifications
│   │   ├── cart.ts          # CartItem, CartSummary
│   │   └── user.ts          # User, DeliveryAddress
│   ├── utils/               # Formatting utilities
│   │   └── formatters.ts    # Currency, price split ($XX.XX), dates, review counts
│   ├── App.tsx              # Scaffolding verification dashboard
│   ├── index.css            # Tailwind CSS import and theme tokens
│   └── main.tsx             # Application bootstrap
├── public/                  # Static public assets
├── package.json
├── tsconfig.json
├── vite.config.ts           # Vite configured with React & Tailwind CSS
└── README.md
```

## Mock Product Schema

Each product in `src/data/products.json` contains:
- `id` & `asin`
- `title` & `brand`
- `category` (`Electronics`, `Books`, `Home`, `Fashion`) & `subcategory`
- `price`, `originalPrice`, `discountPercentage`
- `rating` (e.g. 4.8) & `reviewCount` (e.g. 132,400)
- `isPrime` (Prime badge eligibility)
- `isBestSeller` & `isAmazonChoice` badges
- `stock` & `inStock` availability
- `images` (array of high-resolution URLs) & `thumbnail`
- `description` & `features` (bullet points)
- `specifications` (detailed key-value pairs)
- `badgeText` (e.g., "#1 Best Seller in Hard Science Fiction")

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
