# Amazon Reimagined - 8x Assignment

A modern, high-performance re-imagining of the Amazon e-commerce experience built with product-led design principles, intentional UX improvements, and modern web technologies.

---

## Live Demo

- **Deployment URL:** [https://amazon-but-better.netlify.app](https://amazon-but-better.netlify.app) 

---

## Product & UX Decisions: Why We Built It This Way

Rather than creating an unopinionated, pixel-for-pixel replica of Amazon's legacy desktop interface, this project approaches the challenge from a **product judgment and UX design lens**. Over the last two decades, Amazon has accumulated immense UI clutter, dense sponsored banners, nested menus, and multi-step roadblocks that induce cognitive fatigue and checkout friction. 

Here is how and why we deliberately re-engineered the core user journey:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                AMAZON REIMAGINED                                            │
│                                                                                             │
│   Discovery (Intent Chips) ──► Evaluation (Certainty) ──► Cart Drawer ──► 1-Page Checkout   │
│   • "Gifts under $50"          • Dynamic Delivery Date    • All-In Price  • No login gate   │
│   • "Tech Upgrades"            • Prime pill tags          • Free shipping • Instant pay     │ 
│   • Zero keyword friction      • High-res zoom            • No surprises  • Sub-2m journey  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1. Frictionless Single-Page Guest Checkout
* **The Legacy Amazon Problem:** Amazon's native checkout funnels users through a rigid multi-page maze (mandatory login/password prompt, shipping address selection, payment method selection, and a separate final review page). For casual or first-time shoppers, this multi-step gauntlet causes high friction and elevated cart abandonment rates.
* **Our Reimagined Solution:** We eliminated the multi-page checkout in favor of a cohesive, single-page **Guest Checkout**. Customer contact details, delivery address, and payment information (with real-time card brand detection) sit side-by-side with a live order summary.
* **Product Rationale & Impact:** 
  - Eliminates sign-in walls and password recovery roadblocks.
  - Keeps order context and cost breakdown visible throughout data entry.
  - Reduces average checkout completion time while significantly lowering drop-off rates.

---

### 2. Persistent Slide-Out Cart Drawer with "All-In Pricing"
* **The Legacy Amazon Problem:** Traditional e-commerce routing redirects the user to a standalone cart page, abruptly kicking them out of their product discovery flow. Furthermore, unexpected taxes and shipping surcharges are often withheld until the final step, triggering "sticker shock."
* **Our Reimagined Solution:** We replaced the standalone cart page with a persistent, non-intrusive **slide-out Cart Drawer** accessible anywhere across the site. Within the drawer:
  - **All-In Pricing (Upfront Clarity):** Subtotal, Free Shipping qualification, and estimated sales tax (8%) are computed and displayed immediately.
  - **Free Shipping Progress Meter:** A visual threshold bar communicates exactly how much more is needed to reach the free shipping tier ($35).
  - **Inline Quantity Controls:** Instant `+` / `-` steppers and removal triggers without page reloads.
* **Product Rationale & Impact:** 
  - **Builds Price Trust:** Shoppers know their exact out-of-pocket commitment before clicking checkout.
  - **Spatial Continuity:** Users never lose their scroll position or place in the product catalog.

---

### 3. Intent-Based Search Chips
* **The Legacy Amazon Problem:** Traditional search requires users to formulate exact product keywords or navigate sprawling 4-level mega-menus. Users with exploratory or budget-constrained intents (e.g., holiday gifting or budget tech upgrades) waste excessive time refining search queries and boolean filters.
* **Our Reimagined Solution:** Positioned curated **Smart Intent Chips** directly beneath the header for one-click discovery:
  - 🎁 **Gifts under $50** (Budget-focused curation)
  - ⚡ **Tech Upgrades** (Electronics and high-utility tech essentials)
  - ✨ **Highly Rated** (Instant filter for 4.5+ star customer ratings)
  - 🏷️ **Big Savings** (Highlighted items with 20%+ discount deals)
* **Product Rationale & Impact:**
  - Matches the mental model of goal-oriented shoppers.
  - Drops time-to-first-relevant-result to a single click.
  - Reduces dependency on text input and spelling accuracy, especially on touch devices.

---

### 4. Dynamic Delivery Estimators on Product Cards
* **The Legacy Amazon Problem:** Estimated arrival dates are frequently hidden inside product detail pages or obscured behind fine print. Buyers must open multiple tabs just to verify which item will arrive on time.
* **Our Reimagined Solution:** Every product card on the catalog grid features an upfront **Dynamic Delivery Estimator** (e.g., *"Order now, arrives by Thursday, Oct 2"*) paired with clear Prime indicator badges.
* **Product Rationale & Impact:**
  - Delivers **Delivery Certainty** at the earliest point of consideration.
  - Reduces "tab-juggling" and back-and-forth navigation.
  - Empowers buyers on time-sensitive missions (birthdays, urgent replacements) to make immediate decisions.

---

### 5. Modernized UI: Visual Calm & Cognitive Clarity
* **The Legacy Amazon Problem:** Decades of incremental feature additions have saddled Amazon with heavy borders, dense banner advertisements, competing color accents, and distracting upsells.
* **Our Reimagined Solution:** Cleaned up the interface with modern visual hierarchy and interaction polish:
  - **Glassmorphic Sticky Header:** A frosted `backdrop-blur-md` navigation bar with a subtle border and ⌘K / Ctrl+K quick-search shortcut.
  - **Breathing Room & Typography:** Generous whitespace, clean neutral palettes, rounded pill containers (`rounded-full`), and soft-shadow hover states (`hover:shadow-lg`, `hover:scale-105` image transitions).
  - **Distraction-Free Experience:** Removed extraneous ad banners, multi-tiered carousels, and cluttered widgets to keep total focus on high-fidelity product imagery, ratings, and pricing.
* **Product Rationale & Impact:**
  - Increases visual scanning speed and reduces mental fatigue.
  - Elevates perceived product quality and brand credibility.

---

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Declarative, component-driven UI architecture with modern hooks |
| **Vite 8** | Next-generation build tool and ultra-fast Hot Module Replacement (HMR) |
| **Tailwind CSS v4** | Modern atomic styling, dynamic theme tokens, and glassmorphic utility classes |
| **Zustand 5** | Lightweight, reactive global store powering cart management, filters, and user state |
| **React Router 7** | Client-side routing for catalog, product detail, checkout, and confirmation views |
| **Lucide React** | Consistent, lightweight SVG iconography |
| **TypeScript** | Strict compile-time type safety across product models, filters, and cart actions |
| **Oxlint** | High-performance JavaScript/TypeScript linter |

---

## Agent Capture Setup

All AI agent interactions during the planning, implementation, and refinement of this project were captured autonomously using the **Antigravity CLI native `Stop` lifecycle hook**.

* **Architecture:** Hook configuration declared in [`.agents/hooks.json`](file:///home/lybace/amazon-clone/.agents/hooks.json) triggers [`.agents/capture-turn.sh`](file:///home/lybace/amazon-clone/.agents/capture-turn.sh) at the conclusion of every agent turn.
* **Execution:** Turn transcripts are parsed from the uncompressed engine session and structured into standardized 8x markdown format with timestamps, prompt IDs, and response payloads.
* **Log Directory:** Captured agent logs reside in the [`.agent-logs/`](file:///home/lybace/amazon-clone/.agent-logs) directory for automated audit and evaluation compliance.

---

## Local Setup & Development

Follow these steps to run the application locally:

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or pnpm / yarn

### Installation & Execution

1. **Clone the repository:**
   ```bash
   git clone https://github.com/laibulous/amazon-clone.git
   cd amazon-clone
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local Vite development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` to explore the application.

4. **Run TypeScript checks and production build:**
   ```bash
   npm run build
   ```

5. **Preview production build locally:**
   ```bash
   npm run preview
   ```

6. **Run linter:**
   ```bash
   npm run lint
   ```

---

## Project Structure Overview

```
amazon-clone/
├── .agent-logs/             # Automatic agent turn logs captured via Antigravity Stop hook
├── .agents/                 # Lifecycle hook definitions and capture scripts
│   ├── hooks.json
│   └── capture-turn.sh
├── public/                  # Public assets
├── src/
│   ├── api/                 # Mock product API layer with simulated async responses
│   │   └── productsApi.ts
│   ├── components/
│   │   ├── cart/            # Persistent CartDrawer with All-In Pricing breakdown
│   │   │   └── CartDrawer.tsx
│   │   ├── layout/          # Glassmorphic Header with quick-search & category navigation
│   │   │   └── Header.tsx
│   │   └── product/         # ProductCard, ProductGrid, and SmartIntentChips
│   │       ├── ProductCard.tsx
│   │       ├── ProductGrid.tsx
│   │       ├── ReviewSummary.tsx
│   │       └── SmartIntentChips.tsx
│   ├── data/                # Seed product catalog dataset across multiple categories
│   │   └── products.json
│   ├── hooks/               # Custom data hooks (useProducts)
│   │   └── useProducts.ts
│   ├── pages/               # Routed views (HomePage, ProductDetailPage, CheckoutPage, SuccessPage)
│   │   ├── CheckoutPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   └── SuccessPage.tsx
│   ├── store/               # Zustand reactive stores
│   │   ├── useCartStore.ts
│   │   ├── useFilterStore.ts
│   │   └── useUserStore.ts
│   ├── types/               # TypeScript interface schemas
│   ├── utils/               # Currency, delivery dates, and string formatters
│   ├── App.tsx              # Router view switcher and application shell
│   ├── index.css            # Tailwind theme tokens and base styles
│   └── main.tsx             # React DOM entry point
├── package.json
└── README.md
```
