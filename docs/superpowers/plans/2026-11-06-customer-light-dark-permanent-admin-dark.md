# Customer Light/Dark Themes + Permanent Dark Admin Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement an isolated dual-theme system where the customer storefront supports instantaneous toggling between Light (first-time default `#FFFFFF`) and Dark (`#0F0617`) modes with `localStorage` persistence, while the Admin Portal permanently remains in dedicated Admin Dark (`#111827` / `#0B1220`) with no switcher and complete theme isolation.

**Architecture:**
- **Customer Theme Scope**: Governed by `CustomerThemeProvider` (or enhanced `ThemeProvider`), managing `khandualoom_theme_preference` with `'light'` as strict first-time default. Applies tokens from `src/styles/themes/customer-light.css` and `src/styles/themes/customer-dark.css`.
- **Admin Theme Scope**: Completely independent and isolated. Governed by dedicated `--admin-*` tokens in `src/styles/themes/admin-dark.css`. Applied to `.admin-layout` and `data-theme="admin-dark"`. Reverts light mode admin rules, permanently removes `<ThemeSwitcher />` from `AdminCommandHeader.tsx`, and eliminates any inheritance of customer theme state in admin pages.
- **Route Isolation & Zero-Flash**: Early `<head>` initialization script in `index.html` inspects `window.location.pathname`. If path starts with `/admin`, applies `data-theme="admin-dark"` and `dark` class immediately; otherwise applies customer saved preference (defaulting to `'light'`). On SPA navigation, `AdminLayout` ensures admin-dark is active and restores customer theme when navigating back to store.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Vite, Jest, React Testing Library, React Router DOM v6.

---

## Global Constraints
- First-time customer visits MUST strictly default to Light Theme (`#FFFFFF`).
- Customer theme preference MUST persist in `localStorage` under `khandualoom_theme_preference`.
- Admin Portal MUST permanently remain in Dark Theme (`#111827`, `#0B1220`).
- Admin Portal MUST NOT display a Light/Dark theme switcher.
- Customer theme changes MUST NOT affect Admin Portal, and Admin dark MUST NOT leak into customer pages.
- 3D Loom Canvas MUST remain strictly restricted to `/`.
- Natural product photography MUST NOT have dark overlays, filters, or hue shifts.
- Typecheck (`npm run typecheck`), Jest (`npx jest`), and build (`npm run build`) must pass with 0 errors.

---

## Tasks

### Task 1: Semantic Design Tokens & Isolated Theme Files (Customer Light, Customer Dark, Admin Dark)
**Files:**
- Create: `src/styles/themes/customer-light.css`
- Create: `src/styles/themes/customer-dark.css`
- Create: `src/styles/themes/admin-dark.css`
- Modify: `src/styles/themes/light.css`
- Modify: `src/styles/themes/dark.css`
- Modify: `src/index.css`
- Modify: `tailwind.config.js`

- [ ] Step 1: Update customer light tokens with exact hex values from spec:
  - `--color-background: #FFFFFF;`
  - `--color-background-secondary: #F8FAFC;`
  - `--color-surface: #FFFFFF;`
  - `--color-surface-elevated: #FFFFFF;`
  - `--color-surface-sunken: #F1F5F9;`
  - `--color-nav-background: #FFFFFF;`
  - `--color-text-primary: #0F172A;`
  - `--color-text-secondary: #475569;`
  - `--color-text-muted: #64748B;`
  - `--color-text-accent: #881337;`
  - `--color-text-gold: #B45309;`
  - `--color-primary: #881337;`
  - `--color-primary-hover: #9F1239;`
  - `--color-primary-light: #FFF1F2;`
  - `--color-accent: #B45309;`
  - `--color-accent-hover: #92400E;`
  - `--color-border: #E2E8F0;`
  - `--color-border-strong: #CBD5E1;`
  - `--color-border-subtle: #F1F5F9;`
  - `--color-input-background: #FFFFFF;`
  - `--color-input-border: #CBD5E1;`
  - `--color-input-focus: #881337;`
  - `--color-success: #15803D;`
  - `--color-success-bg: #F0FDF4;`
  - `--color-warning: #B45309;`
  - `--color-warning-bg: #FFFBEB;`
  - `--color-danger: #B91C1C;`
  - `--color-danger-bg: #FEF2F2;`

- [ ] Step 2: Update customer dark tokens with exact hex values from spec:
  - `--color-background: #0F0617;`
  - `--color-background-secondary: #170928;`
  - `--color-surface: #1C0D2E;`
  - `--color-surface-elevated: #24113A;`
  - `--color-surface-sunken: #0B0412;`
  - `--color-nav-background: #12051E;`
  - `--color-text-primary: #F8FAFC;`
  - `--color-text-secondary: #CBD5E1;`
  - `--color-text-muted: #94A3B8;`
  - `--color-text-accent: #DFBF7A;`
  - `--color-text-gold: #DFBF7A;`
  - `--color-primary: #9E1B32;`
  - `--color-primary-hover: #BE123C;`
  - `--color-primary-light: rgba(158, 27, 50, 0.20);`
  - `--color-accent: #DFBF7A;`
  - `--color-accent-hover: #F0C49F;`
  - `--color-border: rgba(223, 191, 122, 0.20);`
  - `--color-border-strong: rgba(223, 191, 122, 0.40);`
  - `--color-border-subtle: rgba(255, 255, 255, 0.08);`
  - `--color-input-background: #170928;`
  - `--color-input-border: rgba(223, 191, 122, 0.30);`
  - `--color-input-focus: #DFBF7A;`
  - `--color-success: #34D399;`
  - `--color-success-bg: rgba(52, 211, 153, 0.15);`
  - `--color-warning: #FBBF24;`
  - `--color-danger: #F87171;`
  - `--color-danger-bg: rgba(248, 113, 113, 0.15);`

- [ ] Step 3: Create `src/styles/themes/admin-dark.css` with exact admin tokens from spec:
  - `--admin-background: #111827;`
  - `--admin-sidebar: #0B1220;`
  - `--admin-header: #111827;`
  - `--admin-surface: #1F2937;`
  - `--admin-surface-elevated: #273449;`
  - `--admin-input-background: #111827;`
  - `--admin-text-primary: #F9FAFB;`
  - `--admin-text-secondary: #D1D5DB;`
  - `--admin-text-muted: #9CA3AF;`
  - `--admin-primary: #9E1B32;`
  - `--admin-primary-hover: #BE123C;`
  - `--admin-accent: #DFBF7A;`
  - `--admin-border: #374151;`
  - `--admin-success: #34D399;`
  - `--admin-warning: #FBBF24;`
  - `--admin-danger: #F87171;`

- [ ] Step 4: Import all theme stylesheets into `src/index.css` and verify Tailwind config mappings.
- [ ] Step 5: Run typecheck to ensure clean CSS compilation.

---

### Task 2: Permanent Dark Admin Portal (Remove Switcher, Enforce Admin Tokens & Clean Styles)
**Files:**
- Modify: `src/components/admin/AdminCommandHeader.tsx`
- Modify: `src/components/admin/AdminLayout.tsx`
- Modify: `src/components/admin/adminStyles.css`
- Modify: `src/components/admin/AdminSidebar.tsx`

- [ ] Step 1: Remove `<ThemeSwitcher />` import and JSX from `AdminCommandHeader.tsx`.
- [ ] Step 2: Remove ternary `isDark ? ... : ...` in `AdminCommandHeader.tsx` and permanently style the header with `--admin-header` (`#111827`), `--admin-border` (`#374151`), and `--admin-text-primary` (`#F9FAFB`).
- [ ] Step 3: In `AdminLayout.tsx`, enforce permanent dark styling (`bg-[var(--admin-background,#111827)] text-[var(--admin-text-primary,#F9FAFB)] dark`) and set `data-theme="admin-dark"` on layout mount. On unmount/back to store, restore customer theme.
- [ ] Step 4: In `adminStyles.css`, remove all `[data-theme="light"] .admin-layout` override rules so admin can NEVER become light. Wire `.admin-layout`, `.admin-sidebar`, `.admin-stat-card`, `.admin-table`, inputs, and modals to use `--admin-*` tokens.
- [ ] Step 5: In `AdminSidebar.tsx`, ensure clean sans-serif typography (`font-sans`), dark palette (`#0B1220`), and maroon active item highlights (`#9E1B32`).
- [ ] Step 6: Run admin tests (`npx jest src/components/admin`) to verify all 7 suites pass.

---

### Task 3: Zero-Flash Route-Based Theme Resolution & Clean Sans-Serif Font Standards
**Files:**
- Modify: `index.html`
- Modify: `src/styles/tokens.css`
- Modify: `src/theme/ThemeProvider.tsx`

- [ ] Step 1: Update early initialization script in `index.html`:
  - If `window.location.pathname.startsWith('/admin')`, set `data-theme="admin-dark"` and `classList.add('dark')`.
  - Else, read `khandualoom_theme_preference`. If `'dark'`, set `dark`; else set `light`.
- [ ] Step 2: In `tokens.css`, enforce clean sans-serif typography (`Inter`, system-ui) across interface elements.
- [ ] Step 3: In `ThemeProvider.tsx`, ensure that customer theme changes only apply to customer routes and do not overwrite `admin-dark` when on `/admin/*`.
- [ ] Step 4: Run unit tests (`npx jest src/theme/ThemeProvider.test.tsx`).

---

### Task 4: Storefront Route Verification & Simple Wording Audit
**Files:**
- Review: `src/components/common/Navbar.tsx`
- Review: `src/components/layout/StoreLayout.tsx`
- Review: `src/components/layout/CheckoutLayout.tsx`
- Review: `src/components/profile/ProfileDashboard.tsx`
- Review: `src/components/catalog/CatalogProductCard.tsx`
- Review: `src/components/product/ProductDetailsView.tsx`

- [ ] Step 1: Verify ThemeSwitcher is active and fully functional on Customer Navbar (desktop + mobile drawer), Checkout header, and Profile dashboard.
- [ ] Step 2: Verify 3D Loom Canvas is strictly scoped to `/`.
- [ ] Step 3: Verify all product images have natural rendering (no dark overlays, filters, or hue alterations).
- [ ] Step 4: Verify simple wording across storefront and admin (Products, Manage Stock, Customers, Offers, etc.).

---

### Task 5: Full Automated Test Suite, Production Build, Git Push & Docker Deployment
- [ ] Step 1: Run `npm run typecheck` (`tsc --noEmit`) to verify 0 TypeScript errors.
- [ ] Step 2: Run `npx jest` to verify 20/20 test suites pass.
- [ ] Step 3: Run `npm run build` to verify production Vite build builds in `dist/`.
- [ ] Step 4: Commit all changes with semantic git commit messages.
- [ ] Step 5: Push commits to `https://github.com/sameerasha/khandualoom.git` on branch `feat/ui-wording-navigation-improvements`.
- [ ] Step 6: Rebuild docker frontend container `docker compose --env-file .env.dev build frontend` and recreate container.
- [ ] Step 7: Verify live HTTP 200 on `http://localhost:3000` and `http://localhost:5174`.
- [ ] Step 8: Produce final delivery report.
