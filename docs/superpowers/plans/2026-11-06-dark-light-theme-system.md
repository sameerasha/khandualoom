# Complete Dark and Light Theme System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a centralized, enterprise-grade Dark and Light Theme system across the entire Khandua Looms React frontend (Storefront, PDP, Catalog, Bag, Checkout, Profile, and all Admin portal modules), defaulting to the Light (White) theme on first visit and persisting selections in localStorage.

**Architecture:** CSS Custom Properties (semantic design tokens in `tokens.css`, `light.css`, and `dark.css`) combined with Tailwind CSS `darkMode: ['class', '[data-theme="dark"]']`. A top-level React `ThemeProvider` and `useTheme` hook manage state, sync `<html data-theme="...">` attributes, and persist choices in `localStorage` under key `khandualoom_theme_preference`. Modern Myntra-style bright light theme and sophisticated charcoal/maroon/gold dark theme.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide React, Jest, React Testing Library, Vite, Docker.

**Spec:** User Prompts 9 & 10 (`# PROMPT: IMPLEMENT COMPLETE DARK AND LIGHT THEMES ACROSS THE ENTIRE FRONTEND` + `keep first time white theme .`).

## Global Constraints

- First-time default theme MUST be `'light'` (`#FFFFFF` background, `#0F172A` text, `#881337` maroon accent, `#C5A059` warm gold).
- LocalStorage key MUST be `khandualoom_theme_preference`.
- 3D Cinematic Loom Canvas must remain strictly scoped to the landing page (`/`).
- Do not change API property names, DTOs, database fields, or route endpoints.
- Smooth instant switching without page reload, flashing, or state loss.
- Target Git Remote: `https://github.com/sameerasha/khandualoom.git`.
- Verification gates: `tsc --noEmit` passes with 0 errors, all Jest tests pass, Vite production build succeeds, and Docker container runs with HTTP 200.

## Review Focus

1. **First-Time Visitor Initialization**: An initial visit with `localStorage.getItem('khandualoom_theme_preference') === null` must resolve strictly to `'light'` regardless of system OS dark mode preferences.
2. **Admin Portal Contrast in Light Mode**: Admin tables, forms, inputs, modals, and sidebar must not remain dark charcoal; text must be dark `#0F172A` / `#334155` and inputs white `#FFFFFF` with clear `#CBD5E1` borders.
3. **Storefront PDP & Checkout Visual Integrity**: PDP lens zoom, specs table, reviews breakdown, and 3-step checkout order summary must maintain high contrast without washed-out text or invisible borders in both modes.
4. **Theme Switcher Synchronization**: Toggling theme in Navbar, Mobile Drawer, Admin Top Bar, or Profile Settings updates the global context and all UI surfaces instantaneously without DOM desynchronization.
5. **Reduced Motion & Performance**: Theme transitions must avoid layout reflows and respect CSS variables rather than expensive runtime inline style recalculations.

---

### Task 1: Semantic Design Tokens & Theme CSS Architecture

**Files:**
- Create: `microservice/frontend/src/styles/tokens.css`
- Create: `microservice/frontend/src/styles/themes/light.css`
- Create: `microservice/frontend/src/styles/themes/dark.css`
- Modify: `microservice/frontend/src/index.css:1-45`
- Modify: `microservice/frontend/tailwind.config.js:1-33`

**Interfaces:**
- Consumes: Tailwind base directives, custom font stacks.
- Produces: CSS variables `--color-background`, `--color-background-secondary`, `--color-surface`, `--color-surface-elevated`, `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, `--color-border`, `--color-primary`, `--color-primary-hover`, `--color-accent`, `--color-success`, `--color-warning`, `--color-danger`, `--color-input-background`, `--color-input-border`, `--color-shadow`, `--color-overlay` mapped into Tailwind theme colors.

- [ ] **Step 1: Create semantic tokens file `src/styles/tokens.css`**
  Define sizing, transitions, radii, and common typography tokens.

- [ ] **Step 2: Create `src/styles/themes/light.css`**
  Define `[data-theme="light"], html.light, :root:not([data-theme="dark"])`:
  - `--color-background: #ffffff`
  - `--color-background-secondary: #f8f9fa`
  - `--color-surface: #ffffff`
  - `--color-surface-elevated: #ffffff`
  - `--color-text-primary: #0f172a`
  - `--color-text-secondary: #475569`
  - `--color-text-muted: #64748b`
  - `--color-border: #e2e8f0`
  - `--color-primary: #881337`
  - `--color-primary-hover: #9f1239`
  - `--color-accent: #c5a059`
  - `--color-accent-hover: #b45309`
  - `--color-success: #16a34a`
  - `--color-warning: #d97706`
  - `--color-danger: #dc2626`
  - `--color-input-background: #ffffff`
  - `--color-input-border: #cbd5e1`
  - `--color-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)`
  - `--color-overlay: rgba(15, 23, 42, 0.6)`

- [ ] **Step 3: Create `src/styles/themes/dark.css`**
  Define `[data-theme="dark"], html.dark`:
  - `--color-background: #0f0617`
  - `--color-background-secondary: #170928`
  - `--color-surface: #1c0d2e`
  - `--color-surface-elevated: #24113a`
  - `--color-text-primary: #f8fafc`
  - `--color-text-secondary: #cbd5e1`
  - `--color-text-muted: #94a3b8`
  - `--color-border: rgba(223, 191, 122, 0.2)`
  - `--color-primary: #9e1b32`
  - `--color-primary-hover: #be123c`
  - `--color-accent: #dfbf7a`
  - `--color-accent-hover: #f0c49f`
  - `--color-success: #34d399`
  - `--color-warning: #fbbf24`
  - `--color-danger: #f87171`
  - `--color-input-background: #170928`
  - `--color-input-border: rgba(223, 191, 122, 0.3)`
  - `--color-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5)`
  - `--color-overlay: rgba(0, 0, 0, 0.75)`

- [ ] **Step 4: Update `src/index.css` and `tailwind.config.js`**
  Import theme files in `src/index.css`. Extend Tailwind colors to use the tokens with RGB/var wrappers.

- [ ] **Step 5: Verify build & tests**
  Run: `npm run typecheck`
  Expected: PASS

---

### Task 2: Theme State Machine, Context, Provider & Switcher

**Files:**
- Create: `microservice/frontend/src/theme/theme.types.ts`
- Create: `microservice/frontend/src/theme/theme.config.ts`
- Create: `microservice/frontend/src/theme/ThemeContext.ts`
- Create: `microservice/frontend/src/theme/ThemeProvider.tsx`
- Create: `microservice/frontend/src/theme/useTheme.ts`
- Create: `microservice/frontend/src/theme/ThemeSwitcher.tsx`
- Modify: `microservice/frontend/src/main.tsx:1-14`
- Test: `microservice/frontend/src/theme/ThemeProvider.test.tsx`

**Interfaces:**
- Consumes: `localStorage`, DOM document root attributes.
- Produces:
  ```typescript
  export type ThemeMode = 'light' | 'dark';
  export interface ThemeContextValue {
    theme: ThemeMode;
    setTheme: (mode: ThemeMode) => void;
    toggleTheme: () => void;
  }
  export const useTheme: () => ThemeContextValue;
  export const ThemeSwitcher: React.FC<{ variant?: 'compact' | 'detailed'; className?: string }>;
  ```

- [ ] **Step 1: Write failing unit test in `src/theme/ThemeProvider.test.tsx`**
  Verify:
  1. Initial render without localStorage yields `'light'` (per user mandate `keep first time white theme .`).
  2. Toggle switches to `'dark'`, sets `localStorage`, and updates `<html data-theme="dark" class="dark">`.
  3. Setting `'light'` removes `dark` class, adds `light` class, updates `localStorage`.

- [ ] **Step 2: Run test to verify it fails**
  Run: `npx jest src/theme/ThemeProvider.test.tsx`
  Expected: FAIL (modules not found)

- [ ] **Step 3: Implement `theme.types.ts`, `theme.config.ts`, `ThemeContext.ts`, `ThemeProvider.tsx`, and `useTheme.ts`**
  - Set `DEFAULT_THEME: ThemeMode = 'light'`
  - Storage key: `'khandualoom_theme_preference'`
  - Apply immediate attribute update:
    ```typescript
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    ```

- [ ] **Step 4: Implement accessible `ThemeSwitcher.tsx`**
  Render Sun icon for Light Mode, Moon icon for Dark Mode, accessible labels, smooth icon rotation, and tooltips.

- [ ] **Step 5: Wrap `main.tsx` in `<ThemeProvider>`**
  Wrap `<App />` inside `<ThemeProvider>` in `src/main.tsx`.

- [ ] **Step 6: Run test to verify it passes**
  Run: `npx jest src/theme/ThemeProvider.test.tsx`
  Expected: PASS

---

### Task 3: Theme Switcher Integration in Storefront & Admin Layouts

**Files:**
- Modify: `microservice/frontend/src/components/common/Navbar.tsx:70-130,340-420`
- Modify: `microservice/frontend/src/components/admin/AdminCommandHeader.tsx:30-100`
- Modify: `microservice/frontend/src/components/profile/ProfileDashboard.tsx:200-300`
- Modify: `microservice/frontend/src/components/layout/StoreLayout.tsx:45-75`
- Modify: `microservice/frontend/src/components/layout/CheckoutLayout.tsx:1-90`

**Interfaces:**
- Consumes: `useTheme` hook, `ThemeSwitcher` component.
- Produces: Integrated theme toggles in desktop header, mobile drawer, admin top bar, and profile settings.

- [ ] **Step 1: Integrate `ThemeSwitcher` into `Navbar.tsx`**
  - Add `ThemeSwitcher` next to the Language Switcher in the top action bar.
  - Add `ThemeSwitcher` in the mobile slide-out navigation drawer.
  - Harmonize Navbar background: In light mode, crisp white with subtle border (`bg-white/95 text-slate-800 border-slate-200`); in dark mode, deep purple-charcoal (`bg-[#12051E]/95 text-brand-ivory border-brand-gold/25`).

- [ ] **Step 2: Integrate `ThemeSwitcher` into `AdminCommandHeader.tsx`**
  - Position `ThemeSwitcher` in the admin top-navigation action cluster next to notifications and artisan selector.
  - Ensure high contrast in both light and dark modes.

- [ ] **Step 3: Integrate Theme Preference in `ProfileDashboard.tsx`**
  - In Customer Account Settings / Preferences tab, add a "Theme Preference" toggle card (Light Mode / Dark Mode) with live preview badge.

- [ ] **Step 4: Harmonize `StoreLayout.tsx` & `CheckoutLayout.tsx`**
  - `StoreLayout`: Dynamic background and text colors using CSS tokens (`bg-background text-text-primary`). Landing page retains the scoped 3D Canvas with appropriate canvas background harmony.
  - `CheckoutLayout`: Header, step indicator, and footer styled dynamically to render clean white in light mode and rich charcoal in dark mode.

- [ ] **Step 5: Verify layout tests**
  Run: `npx jest src/components/layout/routes.test.tsx`
  Expected: PASS

---

### Task 4: Storefront Components & Catalog/PDP/Cart Theme Harmonization

**Files:**
- Modify: `microservice/frontend/src/components/catalog/CatalogView.tsx`
- Modify: `microservice/frontend/src/components/catalog/CatalogProductCard.tsx`
- Modify: `microservice/frontend/src/components/catalog/FilterSidebar.tsx`
- Modify: `microservice/frontend/src/components/catalog/ActiveFilterChips.tsx`
- Modify: `microservice/frontend/src/components/product/ProductDetailsView.tsx`
- Modify: `microservice/frontend/src/components/product/ProductMediaGallery.tsx`
- Modify: `microservice/frontend/src/components/product/HandloomSpecifications.tsx`
- Modify: `microservice/frontend/src/components/product/ProductReviewsSection.tsx`
- Modify: `microservice/frontend/src/components/product/RecentlyViewedSection.tsx`
- Modify: `microservice/frontend/src/components/cart/ShoppingBagView.tsx`
- Modify: `microservice/frontend/src/components/cart/BagItemCard.tsx`
- Modify: `microservice/frontend/src/components/cart/AuthoritativePriceSummary.tsx`
- Modify: `microservice/frontend/src/components/checkout/MultiStepCheckoutView.tsx`
- Modify: `microservice/frontend/src/components/checkout/DeliveryAddressStep.tsx`
- Modify: `microservice/frontend/src/components/checkout/PaymentStep.tsx`
- Modify: `microservice/frontend/src/components/common/CartSidebar.tsx`
- Modify: `microservice/frontend/src/components/common/WishlistDrawer.tsx`
- Modify: `microservice/frontend/src/components/auth/AuthModal.tsx`
- Modify: `microservice/frontend/src/components/common/LegalModal.tsx`

**Interfaces:**
- Consumes: Tailwind semantic tokens (`bg-surface`, `bg-background`, `text-text-primary`, `border-border`, etc.).
- Produces: Complete storefront harmony in both light (Myntra fashion style) and dark (premium luxury handloom style) modes.

- [ ] **Step 1: Harmonize Catalog & Filters**
  - Replace hardcoded `#0F0617` / `#1C0D2E` on product cards and filter sidebar with token classes (`bg-surface text-text-primary border-border shadow-sm`).
  - Active filter chips: light background with maroon text/border in light mode; gold border in dark mode.

- [ ] **Step 2: Harmonize Product Details Page (PDP)**
  - Media gallery thumbnails and zoom lens: crisp white border in light mode, warm gold border in dark mode.
  - Handloom specifications table: alternating rows in `#F8F9FA` / `#FFFFFF` in light mode; `#170928` / `#1C0D2E` in dark mode.
  - Reviews section: progress bars, rating breakdown, and "Write a Review" modal high contrast in both themes.
  - Similar & Recently Viewed carousels styled cleanly.

- [ ] **Step 3: Harmonize Shopping Bag & Checkout**
  - Bag item cards: white card with subtle shadow in light mode; charcoal surface in dark mode.
  - Authoritative price summary: clear maroon highlight on savings, crisp invoice typography.
  - MultiStepCheckout: Myntra-style step indicator bar, address selection cards, payment accordion tabs, 100% secure badge, and trust footer.

- [ ] **Step 4: Harmonize Drawers, Modals & Alerts**
  - CartSidebar and WishlistDrawer: light theme white sliding drawer with soft slate backdrop; dark theme charcoal drawer.
  - AuthModal and LegalModal: backdrop blur, readable typography, and clean action buttons.

- [ ] **Step 5: Run storefront test suites**
  Run: `npx jest src/features/catalog/catalogFilter.test.ts src/features/cart/cartCalculations.test.ts src/features/checkout/checkout.test.ts`
  Expected: PASS

---

### Task 5: Admin Portal Full Light/Dark Theming Harmonization

**Files:**
- Modify: `microservice/frontend/src/components/admin/adminStyles.css`
- Modify: `microservice/frontend/src/components/admin/AdminSidebar.tsx`
- Modify: `microservice/frontend/src/components/admin/AdminDashboard.tsx`
- Modify: `microservice/frontend/src/components/admin/products/ProductManager.tsx`
- Modify: `microservice/frontend/src/components/admin/products/ProductEditorModal.tsx`
- Modify: `microservice/frontend/src/components/admin/categories/CategoryManager.tsx`
- Modify: `microservice/frontend/src/components/admin/inventory/InventoryLedger.tsx`
- Modify: `microservice/frontend/src/components/admin/orders/OrderFulfillment.tsx`
- Modify: `microservice/frontend/src/components/admin/governance/AuditLogExplorer.tsx`

**Interfaces:**
- Consumes: `[data-theme="light"] .admin-layout` and `[data-theme="dark"] .admin-layout` custom properties.
- Produces: Professional light theme admin dashboard (white sidebar, light grey backdrop, crisp white cards, slate headers, clean borders) alongside the dark command center.

- [ ] **Step 1: Implement `[data-theme="light"]` overrides in `adminStyles.css`**
  ```css
  [data-theme="light"] .admin-layout {
    --color-bg-primary: #f8fafc;
    --color-bg-secondary: #ffffff;
    --color-bg-tertiary: #f1f5f9;
    --color-bg-card: #ffffff;
    --color-bg-glass: rgba(255, 255, 255, 0.9);
    --color-surface: #ffffff;
    --color-text-primary: #0f172a;
    --color-text-secondary: #334155;
    --color-text-muted: #64748b;
    --color-text-gold: #b45309;
    --color-accent: #881337;
    --color-accent-hover: #9f1239;
    --color-border: #e2e8f0;
    --color-card-border: #e2e8f0;
    --color-input-bg: #ffffff;
    --color-input-border: #cbd5e1;
    --color-table-header-bg: #f8fafc;
    --color-table-row-hover: #f1f5f9;
    --color-table-border: #e2e8f0;
  }
  ```

- [ ] **Step 2: Update Admin Data Tables, Cards & Modals for Light Mode**
  - Data tables: white background, `#0F172A` cell text, `#64748B` subtitle text, `#E2E8F0` row dividers.
  - Inputs & selects: white background, `#0F172A` text, `#CBD5E1` border, `#881337` focus ring.
  - Modals (Product Editor, Delete Confirm): clean white surface with light grey header and dark action buttons.

- [ ] **Step 3: Run all admin test suites**
  Run: `npx jest src/components/admin`
  Expected: PASS

---

### Task 6: Comprehensive Verification, Build, Git Commit & Docker Deployment

**Files:**
- Repository root & `microservice/frontend`

- [ ] **Step 1: Run TypeScript typecheck**
  Run: `npm run typecheck`
  Expected: 0 errors

- [ ] **Step 2: Run all Jest unit & integration tests**
  Run: `npx jest`
  Expected: 20+ test suites passed, 100% passing

- [ ] **Step 3: Run Vite production build**
  Run: `npm run build`
  Expected: Build succeeded with clean chunk generation

- [ ] **Step 4: Commit changes to Git repository**
  Run:
  ```bash
  git status
  git add .
  git commit -m "feat(theme): implement application-wide dark and light theme system with first-time light default"
  git push origin feat/ui-wording-navigation-improvements
  ```

- [ ] **Step 5: Rebuild Docker image & restart container**
  Run:
  ```bash
  cd microservice/backend
  docker compose --env-file .env.dev build frontend
  docker compose --env-file .env.dev up -d --force-recreate --no-deps frontend
  ```

- [ ] **Step 6: Verify HTTP endpoints**
  Verify `http://localhost:3000` and `http://localhost:5174` return HTTP 200 OK.
