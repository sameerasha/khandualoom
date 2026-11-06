# Dynamic Admin Panel, Website Customization & E-Commerce Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive, configuration-driven Enterprise Admin Control Panel for Khandua Looms allowing authorized administrators to control website content, product catalog, inventory reconciliation, order fulfillment saga, visual homepage sections, promotional campaigns, and feature toggles with zero code modifications.

**Architecture:** A unified luxury administrative suite (`/admin/*`) nested inside React Router v6. Built on Redux Toolkit and RTK Query with cache invalidation against Spring Cloud API Gateway (`:8080`) microservices (`product-service:8082`, `order-service:8083`, `inventory-service:8087`, `audit-service:8089`). Changes to homepage sections, banners, and feature flags immediately synchronize with the Storefront in real time.

**Tech Stack:** React 18.3, TypeScript 5.5, React Router v6, Redux Toolkit, RTK Query, Tailwind CSS, Lucide React, Framer Motion, Jest, React Testing Library.

**Spec:** [`d:/Project/Antigravity/Khandualoom/docs/superpowers/specs/2026-11-06-dynamic-admin-panel-design.md`](file:///d:/Project/Antigravity/Khandualoom/docs/superpowers/specs/2026-11-06-dynamic-admin-panel-design.md)

---

## Global Constraints

- All administrative mutations must route through `api-gateway:8080` (or relative `/api/` reverse proxy) with `Authorization: Bearer <token>`.
- Feature toggles must gracefully fallback to enabled defaults if network connectivity is offline.
- Every inventory adjustment must mandate a reason string and record an audit log with before/after quantities to `audit-service`.
- Order fulfillment state transitions must enforce valid status progressions (`CONFIRMED` ➔ `QUALITY_CHECK` ➔ `SHIPPED` ➔ `DELIVERED`).
- Live homepage visual editor must support split-screen device previews (Desktop 1440px, Tablet 768px, Mobile 375px) without crashing or reload.

---

## Review Focus

1. **Feature Toggle Real-Time Sync**: Disabling a feature like `feature.threeDSheenCanvas` or `feature.weaverDonation` in Admin must immediately hide the corresponding component on the live storefront without a full application rebuild.
2. **Draft vs Published Homepage Safety**: Editing homepage sections or banner dates in "Draft" mode must never leak onto the active `/` storefront until the admin clicks "Publish Changes".
3. **Audit Log Data Integrity**: Stock adjustments or price changes made by an admin must preserve user ID, timestamp, previous quantity, new quantity, and reason.
4. **Order Saga Transition Protection**: Attempting to move an order from `CONFIRMED` directly to `DELIVERED` must be rejected with an informative error message; transitions must follow required checkpoints.
5. **Role-Based Action Gating**: When logged in as `CATALOG_MANAGER`, financial actions, payment refund buttons, and user permission editors must remain disabled or hidden with explanatory tooltips.

---

### Task 1: Enterprise Admin Shell, Collapsible Navigation & Route Architecture

**Files:**
- Create: `src/components/admin/AdminSidebar.tsx`
- Create: `src/components/admin/AdminCommandHeader.tsx`
- Modify: `src/components/admin/AdminLayout.tsx`
- Create: `src/components/admin/AdminLayout.test.tsx`

**Interfaces:**
- Consumes: Current user state from `authSlice`, current active route.
- Produces: Persistent responsive admin frame with collapsible navigation, quick link to live store, breadcrumbs, and notification indicators.

- [ ] **Step 1: Write failing test for AdminLayout shell navigation**
```typescript
// src/components/admin/AdminLayout.test.tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '@/app/store';
import { AdminLayout } from './AdminLayout';

describe('Admin Layout & Navigation Frame', () => {
  it('renders command header with store link and collapsible sidebar', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/admin']}>
          <AdminLayout onBackToStore={() => {}} />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/KHANDUA LOOMS/i)).toBeInTheDocument();
    expect(screen.getByText(/Atelier Administration/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/admin/AdminLayout.test.tsx`

- [ ] **Step 3: Implement `AdminSidebar.tsx`, `AdminCommandHeader.tsx`, and update `AdminLayout.tsx`**
Implement the command header with quick navigation, live storefront launcher, active user role badge, and structured navigation groups (Overview, Catalog & Inventory, Content & Experience, Store Operations, Governance).

- [ ] **Step 4: Run test to verify it passes**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/admin/AdminLayout.test.tsx`

- [ ] **Step 5: Commit**
`git add src/components/admin/AdminLayout* src/components/admin/AdminSidebar* src/components/admin/AdminCommandHeader*`  
`git commit -m "feat(admin): implement enterprise administrative layout shell and collapsible navigation"`

---

### Task 2: Dynamic Feature Management & Website Configuration Engine

**Files:**
- Create: `src/features/admin/featureSlice.ts`
- Create: `src/components/admin/FeatureManagerView.tsx`
- Create: `src/features/admin/featureSlice.test.ts`

**Interfaces:**
- Produces: `featureSlice` managing `features: Record<string, boolean>` and `FeatureManagerView`.

- [ ] **Step 1: Write failing test for featureSlice toggle actions**
```typescript
// src/features/admin/featureSlice.test.ts
import featureReducer, { toggleFeature, setAllFeatures } from './featureSlice';

describe('Feature Toggle Management Slice', () => {
  it('toggles feature state correctly and updates configuration', () => {
    const initialState = {
      features: {
        wishlist: true,
        coupons: true,
        threeDSheenCanvas: true,
        weaverDonation: true,
      },
      hasUnsavedChanges: false,
    };
    const nextState = featureReducer(initialState, toggleFeature('threeDSheenCanvas'));
    expect(nextState.features.threeDSheenCanvas).toBe(false);
    expect(nextState.hasUnsavedChanges).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/features/admin/featureSlice.test.ts`

- [ ] **Step 3: Implement `featureSlice.ts` and `FeatureManagerView.tsx`**
Provide granular switch toggles for: Wishlist, Promotional Coupons, Weaver Welfare Donations, 3D Silk Sheen Canvas, Pincode ETA Checker, Guest Checkout, Reviews & Ratings, and Store Maintenance Mode.

- [ ] **Step 4: Run test to verify it passes**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/features/admin/featureSlice.test.ts`

- [ ] **Step 5: Commit**
`git add src/features/admin/featureSlice* src/components/admin/FeatureManagerView*`  
`git commit -m "feat(admin): implement dynamic feature toggle engine and configuration management"`

---

### Task 3: Visual Homepage Builder & Live Viewport Preview Studio

**Files:**
- Create: `src/features/admin/homepageConfigSlice.ts`
- Create: `src/components/admin/homepage/HomepageSectionEditor.tsx`
- Create: `src/components/admin/homepage/HomepagePreviewModal.tsx`
- Create: `src/components/admin/homepage/HomepageBuilderView.tsx`
- Create: `src/components/admin/homepage/HomepageBuilder.test.tsx`

**Interfaces:**
- Consumes: Homepage sections array (`hero`, `categories`, `handloomHighlights`, `couponsCorner`, `artisanStories`, `newsletter`).
- Produces: Drag/rank reordering, visibility toggling, section title/subtitle editing, and split-screen responsive preview.

- [ ] **Step 1: Write failing test for homepage section reordering**
```typescript
// src/components/admin/homepage/HomepageBuilder.test.tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { HomepageBuilderView } from './HomepageBuilderView';

describe('Homepage Builder & Section Manager', () => {
  it('renders all configurable sections with reorder controls and preview trigger', () => {
    render(
      <Provider store={store}>
        <HomepageBuilderView />
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /Homepage Visual Builder/i })).toBeInTheDocument();
    expect(screen.getByText(/Hero Promotional Banner/i)).toBeInTheDocument();
    expect(screen.getByText(/Coupons Corner/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/admin/homepage/HomepageBuilder.test.tsx`

- [ ] **Step 3: Implement `HomepageBuilderView`, `HomepageSectionEditor`, and `HomepagePreviewModal`**
Enable admins to reorder sections with Move Up / Move Down controls, toggle section visibility, adjust headlines, and preview on Desktop (1440px), Tablet (768px), and Mobile (375px).

- [ ] **Step 4: Run test to verify it passes**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/admin/homepage/HomepageBuilder.test.tsx`

- [ ] **Step 5: Commit**
`git add src/features/admin/homepageConfigSlice* src/components/admin/homepage/`  
`git commit -m "feat(admin): implement visual Homepage Builder with responsive viewport preview"`

---

### Task 4: Dynamic Banner & Promotional Content Studio

**Files:**
- Create: `src/features/admin/bannerApi.ts`
- Create: `src/components/admin/banners/BannerEditorModal.tsx`
- Create: `src/components/admin/banners/BannerManagerView.tsx`
- Create: `src/components/admin/banners/BannerManager.test.tsx`

**Interfaces:**
- Consumes: Banner entities (`title`, `subtitle`, `ctaText`, `ctaUrl`, `desktopImage`, `mobileImage`, `placement`, `startDate`, `endDate`, `isActive`).
- Produces: CRUD modal and tabular banner manager.

- [ ] **Step 1: Write failing test for banner management**
```typescript
// src/components/admin/banners/BannerManager.test.tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { BannerManagerView } from './BannerManagerView';

describe('Banner & Content Studio', () => {
  it('renders banner placements and add banner button', () => {
    render(
      <Provider store={store}>
        <BannerManagerView />
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /Banner & Promotional Studio/i })).toBeInTheDocument();
    expect(screen.getByText(/\+ Create New Banner/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/admin/banners/BannerManager.test.tsx`

- [ ] **Step 3: Implement `BannerEditorModal` and `BannerManagerView`**
Provide placement filters (Homepage Hero, Category Tops, Sticky Discount Tab), date range pickers, image previewers, and one-click active/inactive toggles.

- [ ] **Step 4: Run test to verify it passes**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/admin/banners/BannerManager.test.tsx`

- [ ] **Step 5: Commit**
`git add src/features/admin/bannerApi* src/components/admin/banners/`  
`git commit -m "feat(admin): implement dynamic Banner Studio with scheduled publication and device targeting"`

---

### Task 5: Category & Mega-Menu Navigation Hierarchy Manager

**Files:**
- Create: `src/features/admin/categoryApi.ts`
- Create: `src/components/admin/categories/CategoryTreeEditor.tsx`
- Create: `src/components/admin/categories/CategoryManagerView.tsx`
- Create: `src/components/admin/categories/CategoryManager.test.tsx`

**Interfaces:**
- Produces: Category tree hierarchy view (`Parent Category` ➔ `Subcategory` ➔ `Weave Type`), drag/rank reordering, and visibility toggle.

- [ ] **Step 1: Write failing test for category tree management**
```typescript
// src/components/admin/categories/CategoryManager.test.tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { CategoryManagerView } from './CategoryManagerView';

describe('Category & Navigation Hierarchy Manager', () => {
  it('renders category taxonomy tree and create root category action', () => {
    render(
      <Provider store={store}>
        <CategoryManagerView />
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /Categories & Navigation/i })).toBeInTheDocument();
    expect(screen.getByText(/\+ Add Category/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/admin/categories/CategoryManager.test.tsx`

- [ ] **Step 3: Implement `CategoryTreeEditor` and `CategoryManagerView`**
Build tree expand/collapse, subcategory insertion, SEO slug editing, banner image assignment, and instant preview.

- [ ] **Step 4: Run test to verify it passes**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/admin/categories/CategoryManager.test.tsx`

- [ ] **Step 5: Commit**
`git add src/features/admin/categoryApi* src/components/admin/categories/`  
`git commit -m "feat(admin): implement Category and Mega-Menu Navigation Hierarchy Manager"`

---

### Task 6: Coupons, Discounts & Bank Partner Campaign Engine

**Files:**
- Create: `src/features/admin/couponApi.ts`
- Create: `src/components/admin/promotions/CouponEditorModal.tsx`
- Create: `src/components/admin/promotions/PromotionsManagerView.tsx`
- Create: `src/features/admin/couponApi.test.ts`

**Interfaces:**
- Produces: Coupon creation (`code`, `discountType`, `value`, `minOrder`, `maxDiscount`, `usageLimit`, `validUntil`), bank partner offer ticker configuration, and sticky discount tab editor.

- [ ] **Step 1: Write failing test for coupon calculations and validation**
```typescript
// src/features/admin/couponApi.test.ts
import { validateCouponCreation } from './couponApi';

describe('Admin Coupon Validation Engine', () => {
  it('enforces uppercase codes, positive discount value, and valid threshold', () => {
    const valid = validateCouponCreation({
      code: 'FESTIVE200',
      discountType: 'FLAT',
      value: 200,
      minOrder: 1500,
    });
    expect(valid.isValid).toBe(true);

    const invalid = validateCouponCreation({
      code: 'bad code',
      discountType: 'FLAT',
      value: -50,
      minOrder: 0,
    });
    expect(invalid.isValid).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/features/admin/couponApi.test.ts`

- [ ] **Step 3: Implement `couponApi.ts`, `CouponEditorModal.tsx`, and `PromotionsManagerView.tsx`**
Full CRUD for coupon codes, bank ticker manager (HDFC, Kotak, ICICI, etc.), and sticky discount tab customizer.

- [ ] **Step 4: Run test to verify it passes**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/features/admin/couponApi.test.ts`

- [ ] **Step 5: Commit**
`git add src/features/admin/couponApi* src/components/admin/promotions/`  
`git commit -m "feat(admin): implement Coupons, Discounts, and Bank Campaign Manager"`

---

### Task 7: Real-Time Inventory Ledger & Stock Reconciliation Atelier

**Files:**
- Create: `src/features/admin/inventoryAdjustmentApi.ts`
- Create: `src/components/admin/inventory/StockAdjustmentModal.tsx`
- Create: `src/components/admin/inventory/InventoryLedgerView.tsx`
- Create: `src/components/admin/inventory/InventoryLedger.test.tsx`

**Interfaces:**
- Produces: SKU-level stock inspection, low-stock filter (`< 3`), single-piece saree locks, and signed stock adjustments.

- [ ] **Step 1: Write failing test for inventory stock reconciliation**
```typescript
// src/components/admin/inventory/InventoryLedger.test.tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { InventoryLedgerView } from './InventoryLedgerView';

describe('Inventory Ledger & Stock Reconciliation', () => {
  it('renders stock ledger table with low stock indicator and adjust button', () => {
    render(
      <Provider store={store}>
        <InventoryLedgerView />
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /Inventory & Stock Ledger/i })).toBeInTheDocument();
    expect(screen.getByText(/Low Stock Alerts/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/admin/inventory/InventoryLedger.test.tsx`

- [ ] **Step 3: Implement `StockAdjustmentModal` and `InventoryLedgerView`**
Table displaying SKU, Saree Name, Weave, Available Stock, Reserved in Carts, and action button triggering `StockAdjustmentModal` with mandatory reason and audit recording.

- [ ] **Step 4: Run test to verify it passes**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/admin/inventory/InventoryLedger.test.tsx`

- [ ] **Step 5: Commit**
`git add src/features/admin/inventoryAdjustmentApi* src/components/admin/inventory/`  
`git commit -m "feat(admin): implement Inventory Ledger with audited stock adjustments and low-stock alerts"`

---

### Task 8: Order Fulfillment Saga, Invoicing & Return Management

**Files:**
- Create: `src/components/admin/orders/OrderFulfillmentDrawer.tsx`
- Create: `src/components/admin/orders/PrintableInvoiceModal.tsx`
- Modify: `src/components/admin/OrderManagerView.tsx`
- Create: `src/components/admin/orders/OrderFulfillment.test.tsx`

**Interfaces:**
- Produces: Order lifecycle progression controls (`CONFIRMED` ➔ `QUALITY_CHECK` ➔ `SHIPPED` ➔ `DELIVERED`), courier tracking input, and printable GI-tagged invoice.

- [ ] **Step 1: Write failing test for order fulfillment transitions**
```typescript
// src/components/admin/orders/OrderFulfillment.test.tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { OrderManagerView } from '../OrderManagerView';

describe('Order Fulfillment Lifecycle', () => {
  it('renders order management table with status filtering and fulfillment action', () => {
    render(
      <Provider store={store}>
        <OrderManagerView onBackToStore={() => {}} />
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /Order Management/i })).toBeInTheDocument();
    expect(screen.getByText(/Fulfillment Lifecycle/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/admin/orders/OrderFulfillment.test.tsx`

- [ ] **Step 3: Implement `OrderFulfillmentDrawer`, `PrintableInvoiceModal`, and enhance `OrderManagerView`**
Add status transition dropdown with validation, courier tracking ID input, customer address details, and printable invoice with Silk Mark seal.

- [ ] **Step 4: Run test to verify it passes**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/admin/orders/OrderFulfillment.test.tsx`

- [ ] **Step 5: Commit**
`git add src/components/admin/orders/ src/components/admin/OrderManagerView.tsx`  
`git commit -m "feat(admin): implement Order Fulfillment Saga, tracking updates, and invoice printing"`

---

### Task 9: Granular RBAC Permissions & Audit Log Explorer

**Files:**
- Create: `src/features/admin/auditApi.ts`
- Create: `src/components/admin/governance/AuditLogExplorer.tsx`
- Create: `src/components/admin/governance/RolePermissionsMatrix.tsx`
- Create: `src/components/admin/governance/AuditLogExplorer.test.tsx`

**Interfaces:**
- Produces: RBAC matrix editor for roles (`SUPER_ADMIN`, `STORE_ADMIN`, `CATALOG_MANAGER`, `ORDER_MANAGER`) and searchable table querying `audit-service:8089`.

- [ ] **Step 1: Write failing test for Audit Log Explorer**
```typescript
// src/components/admin/governance/AuditLogExplorer.test.tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { AuditLogExplorer } from './AuditLogExplorer';

describe('Audit Log Explorer & Governance', () => {
  it('renders audit trail table with filterable columns and activity history', () => {
    render(
      <Provider store={store}>
        <AuditLogExplorer />
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /Administrative Audit Trail/i })).toBeInTheDocument();
    expect(screen.getByText(/Immutable Operational Ledger/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/admin/governance/AuditLogExplorer.test.tsx`

- [ ] **Step 3: Implement `AuditLogExplorer.tsx` and `RolePermissionsMatrix.tsx`**
Display audit events with timestamp, admin username, module, action (`CREATE`, `UPDATE`, `DELETE`, `STOCK_ADJUST`), and JSON diff preview.

- [ ] **Step 4: Run test to verify it passes**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/admin/governance/AuditLogExplorer.test.tsx`

- [ ] **Step 5: Commit**
`git add src/features/admin/auditApi* src/components/admin/governance/`  
`git commit -m "feat(admin): implement granular RBAC permissions matrix and Audit Log Explorer"`

---

### Task 10: End-to-End Build Verification, Live Storefront Wiring & Release

**Files:**
- Modify: `src/app/routes.tsx`
- Modify: `src/components/admin/AdminDashboard.tsx`
- Modify: `src/components/home/HomepageView.tsx` (connect to dynamic homepage config & feature toggles)
- Test: Full Jest test suite (`npm test`)
- Build: Vite production bundle (`npm run build`)

- [ ] **Step 1: Wire feature toggles and dynamic homepage sections into the storefront**
Ensure that when a feature like `threeDSheenCanvas` or `weaverDonation` or `coupons` is disabled in Admin, it dynamically hides or alters the Storefront.

- [ ] **Step 2: Run complete TypeScript typecheck**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npm run typecheck`  
Expected: Exit code 0 with zero errors.

- [ ] **Step 3: Run complete Jest test suite**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npm test`  
Expected: All suites PASS.

- [ ] **Step 4: Compile production build**
`Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npm run build`  
Expected: Exit code 0 with clean Vite bundle output.

- [ ] **Step 5: Commit and push to git remote**
```bash
git add .
git commit -m "chore(release): complete Dynamic Admin Panel, Website Customization & E-Commerce Management system"
git push origin feat/dynamic-admin-panel
```
