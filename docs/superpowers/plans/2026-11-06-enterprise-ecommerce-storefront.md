# Khandua Looms Enterprise E-Commerce Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade, luxury e-commerce storefront for Khandua Looms with exact visual fidelity to Myntra benchmarks across 5 screens (Homepage, 4-Column Catalog, PDP with 3D Silk Sheen Canvas, Shopping Bag, and 3-Step Checkout), integrated with Spring Boot microservices via API Gateway.

**Architecture:** Transition from the single-page state machine to React Router v6 Data Routing with feature-based RTK Query modules. Products are cached in Redux for sub-50ms faceted filtering; single-piece handloom inventory is strictly validated against backend services; and multi-step checkout coordinates with Razorpay and the backend Order Saga using idempotency keys.

**Tech Stack:** React 18.3, TypeScript 5.5, Vite, React Router v6 (`react-router-dom`), Redux Toolkit, RTK Query, Tailwind CSS, Framer Motion, Three.js / React Three Fiber (`@react-three/fiber`, `@react-three/drei`), Lucide React, Zod, React Hook Form, Jest, and React Testing Library.

**Spec:** [`d:/Project/Antigravity/Khandualoom/docs/superpowers/specs/2026-11-06-enterprise-ecommerce-storefront-design.md`](file:///d:/Project/Antigravity/Khandualoom/docs/superpowers/specs/2026-11-06-enterprise-ecommerce-storefront-design.md)

---

## Global Constraints

- All browser requests must route through `api-gateway:8080` (or relative `/api/` reverse proxy); never connect directly to microservice ports `:8081`–`:8089`.
- JWT access tokens remain in-memory within `authSlice`; refresh tokens coordinate via HttpOnly cookies.
- Real-time stock counts from `inventory-service` must govern all bag additions and checkout progressions; single-piece sarees (`quantity = 1`) must show urgent inventory alerts.
- Order creation must provide an `Idempotency-Key: UUIDv4` header to prevent duplicate orders.
- 3D Silk Sheen Canvas must detect WebGL capability, clamp device pixel ratio to $\le 1.75$, and provide graceful high-res 2D fallbacks when WebGL is unavailable or reduced-motion is requested.

---

## Review Focus

1. **Single-Piece Stock Depletion**: If another customer reserves the last unit of a saree while someone is in checkout, `POST /api/inventory/batch-check` must detect zero availability, block payment, and show a clear notice.
2. **Order-Payment Rupee Precision**: Discounted coupon unit prices distributed across `OrderItemRequest.price` must sum to the exact rupee charged via Razorpay without rounding discrepancies.
3. **Pincode Lookup Resilience**: Entering an unrecognized 6-digit postal code must not crash the delivery form; it should default to standard national delivery estimates and prompt the user to confirm city and state.
4. **Idempotent Network Retry**: Double-clicking "Place Order" or network retries during Step 3 must replay the same idempotency key and return the existing order without double-charging.
5. **Deep Link Direct Navigation**: Directly loading deep URLs (`/catalog?weave=khandua`, `/products/1`, `/checkout`) must render correctly from a cold page refresh without infinite redirects or white screens.

---

### Task 1: Core Routing Architecture & Layout Shells (React Router v6)

**Files:**
- Create: `src/app/routes.tsx`
- Create: `src/components/layout/StoreLayout.tsx`
- Create: `src/components/layout/CheckoutLayout.tsx`
- Create: `src/components/layout/routes.test.tsx`
- Modify: `src/App.tsx:1-249`

**Interfaces:**
- Consumes: Existing Navbar, Footer, CartSidebar, WishlistDrawer, AuthModal.
- Produces: `router` instance exported from `src/app/routes.tsx` for `RouterProvider`.

- [ ] **Step 1: Write the failing test for route navigation**

```typescript
// src/components/layout/routes.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { routeDefinitions } from '@/app/routes';

describe('Route Navigation & Layouts', () => {
  it('renders StoreLayout with header and footer on root path /', () => {
    const router = createMemoryRouter(routeDefinitions, { initialEntries: ['/'] });
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders CheckoutLayout with minimal stepper header on /checkout', () => {
    const router = createMemoryRouter(routeDefinitions, { initialEntries: ['/checkout'] });
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );
    expect(screen.getByText(/100% SECURE/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/layout/routes.test.tsx`  
Expected: FAIL with "Cannot find module '@/app/routes'"

- [ ] **Step 3: Implement `StoreLayout`, `CheckoutLayout`, and `routeDefinitions` in `src/app/routes.tsx`**

Create `StoreLayout.tsx` containing top `Navbar`, persistent 3D canvas backdrop, `<Outlet />`, `CartSidebar`, `WishlistDrawer`, and `Footer`.  
Create `CheckoutLayout.tsx` containing minimal header with stepper (`BAG` -> `DELIVERY` -> `PAYMENT`), `100% SECURE` badge, `<Outlet />`, and secure footer.  
Create `src/app/routes.tsx` exporting `routeDefinitions` and `router = createBrowserRouter(routeDefinitions)` with paths `/`, `/catalog`, `/collections/:category`, `/products/:id`, `/cart`, `/checkout`, `/checkout/success/:orderId`, `/account/*`.

- [ ] **Step 4: Run test to verify it passes**

Run: `Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/layout/routes.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/routes.tsx src/components/layout/
git commit -m "feat(storefront): implement React Router v6 Data Routing and Layout shells"
```

---

### Task 2: Screen 1 – Homepage, Mega-Menu & Promotional Ecosystem

**Files:**
- Create: `src/components/home/PromotionalHeroBanner.tsx`
- Create: `src/components/home/TrustAndOfferStrip.tsx`
- Create: `src/components/home/CouponsCorner.tsx`
- Create: `src/components/home/StickyDiscountTab.tsx`
- Create: `src/components/home/HomepageView.tsx`
- Create: `src/components/home/HomepagePromotions.test.tsx`
- Modify: `src/components/common/Navbar.tsx`

**Interfaces:**
- Consumes: `useGetProductsQuery` from `src/features/products/productsApi.ts`, `applyCoupon` from `src/features/cart/cartSlice.ts`.
- Produces: `HomepageView` exported component for route `/`.

- [ ] **Step 1: Write failing test for promotional banners & coupons corner**

```typescript
// src/components/home/HomepagePromotions.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { CouponsCorner } from './CouponsCorner';
import { TrustAndOfferStrip } from './TrustAndOfferStrip';

describe('Homepage Promotions & Coupons', () => {
  it('renders trust pillars and bank instant offers', () => {
    render(<TrustAndOfferStrip />);
    expect(screen.getByText(/100% HANDLOOM CERTIFIED/i)).toBeInTheDocument();
    expect(screen.getByText(/GI TAG AUTHENTICATED/i)).toBeInTheDocument();
    expect(screen.getByText(/10% INSTANT DISCOUNT/i)).toBeInTheDocument();
  });

  it('allows one-click copying and applying coupon code', () => {
    render(
      <Provider store={store}>
        <CouponsCorner />
      </Provider>
    );
    const copyButton = screen.getByRole('button', { name: /KHANDUA500/i });
    expect(copyButton).toBeInTheDocument();
    fireEvent.click(copyButton);
    expect(screen.getByText(/APPLIED/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/home/HomepagePromotions.test.tsx`  
Expected: FAIL with "Cannot find module './CouponsCorner'"

- [ ] **Step 3: Implement components for Screen 1**

- `PromotionalHeroBanner.tsx`: Full-width banner featuring bridal and daily weave CTAs with gold accent styling.
- `StickyDiscountTab.tsx`: Floating right-side tab ("FLAT ₹500 OFF") that opens coupon drawer.
- `TrustAndOfferStrip.tsx`: 4 trust badges + marquee/ticker for HDFC, ICICI, SBI bank discounts.
- `CouponsCorner.tsx`: Coupon voucher cards (`KHANDUA500` - Flat ₹500 off, `HERITAGE10` - 10% off, `PATA1000` - Flat ₹1,000 off bridal sarees) that dispatch `applyCoupon` to `cartSlice`.
- `HomepageView.tsx`: Assembles Hero, Promo Banner, Trust Strip, Collections, New Arrivals, Coupons Corner, Heritage Story, and Testimonials.

- [ ] **Step 4: Run test to verify it passes**

Run: `Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/home/HomepagePromotions.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/home/
git commit -m "feat(storefront): implement Screen 1 Homepage with Myntra-style promotional ecosystem"
```

---

### Task 3: Screen 2 – Myntra-Style 4-Column Catalog & Faceted Filter Engine

**Files:**
- Create: `src/components/catalog/FilterSidebar.tsx`
- Create: `src/components/catalog/SortDropdown.tsx`
- Create: `src/components/catalog/ActiveFilterChips.tsx`
- Create: `src/components/catalog/CatalogProductCard.tsx`
- Create: `src/components/catalog/CatalogView.tsx`
- Create: `src/features/catalog/catalogFilterUtils.ts`
- Create: `src/features/catalog/catalogFilter.test.ts`
- Create: `src/components/catalog/CatalogView.test.tsx`

**Interfaces:**
- Consumes: `Product` contract from `src/types/index.ts`, `useGetProductsQuery` from `src/features/products/productsApi.ts`.
- Produces: `CatalogView` exported component for `/catalog` and `/collections/:category`, `filterProducts()` in `catalogFilterUtils.ts`.

- [ ] **Step 1: Write failing test for catalog filtering and sorting logic**

```typescript
// src/features/catalog/catalogFilter.test.ts
import { filterAndSortProducts, CatalogFilterState } from './catalogFilterUtils';
import { Product } from '@/types';

const sampleProducts: Product[] = [
  { id: 1, name: 'Nuapatna Khandua Pata', price: 18500, originalPrice: 24000, category: 'Khandua Pata', rating: 4.8, reviewsCount: 42, stock: 1, weaveType: 'Khandua', fabric: 'Mulberry Silk', isGiTagged: true, occasion: 'Bridal', artisanSociety: 'Nuapatna' } as any,
  { id: 2, name: 'Sambalpuri Ikat Saree', price: 8200, originalPrice: 10500, category: 'Sambalpuri', rating: 4.5, reviewsCount: 30, stock: 5, weaveType: 'Sambalpuri', fabric: 'Cotton', isGiTagged: true, occasion: 'Festive', artisanSociety: 'Bargarh' } as any,
  { id: 3, name: 'Bomkai Silk Saree', price: 14000, originalPrice: 18000, category: 'Bomkai', rating: 4.2, reviewsCount: 15, stock: 2, weaveType: 'Bomkai', fabric: 'Tussar Silk', isGiTagged: false, occasion: 'Casual', artisanSociety: 'Sonepur' } as any,
];

describe('Catalog Filter Engine', () => {
  it('filters by weave technique and price range', () => {
    const filters: CatalogFilterState = {
      weaves: ['Khandua'],
      fabrics: [],
      priceRange: [15000, 20000],
      giTaggedOnly: false,
      occasions: [],
      artisanSocieties: [],
      sortBy: 'recommended'
    };
    const result = filterAndSortProducts(sampleProducts, filters);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Nuapatna Khandua Pata');
  });

  it('sorts by price low to high', () => {
    const filters: CatalogFilterState = {
      weaves: [],
      fabrics: [],
      priceRange: [0, 50000],
      giTaggedOnly: false,
      occasions: [],
      artisanSocieties: [],
      sortBy: 'price_low_high'
    };
    const result = filterAndSortProducts(sampleProducts, filters);
    expect(result[0].price).toBe(8200);
    expect(result[2].price).toBe(18500);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/features/catalog/catalogFilter.test.ts`  
Expected: FAIL with "Cannot find module './catalogFilterUtils'"

- [ ] **Step 3: Implement `catalogFilterUtils.ts` and Screen 2 components**

- Implement `filterAndSortProducts` in `catalogFilterUtils.ts` supporting all facets and sorting.
- `FilterSidebar.tsx`: Multi-select facet accordions (Weaves, Fabrics, Dual-thumb Price slider, GI Certification toggle, Occasions, Artisan Societies) with item counts and search within facets.
- `CatalogProductCard.tsx`: 4-column card with pallu image hover swap, overlay rating badge (`4.8 ★ | 42`), bold artisan cluster name, title, selling price, strikethrough MRP, discount percentage, `"Only 1 Left in Stock!"` badge, and quick-wishlist heart.
- `ActiveFilterChips.tsx`: Removable chips for active filters with "Clear All".
- `CatalogView.tsx`: Connects URL search params (`?weave=...&price=...`), filters via `catalogFilterUtils`, and renders desktop 4-column grid.

- [ ] **Step 4: Run test to verify it passes**

Run: `Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/features/catalog/catalogFilter.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/catalog/ src/components/catalog/
git commit -m "feat(storefront): implement Screen 2 Myntra-style 4-column catalog and faceted filter engine"
```

---

### Task 4: Screen 3 – Product Details Page (PDP) & 3D Silk Sheen Inspector

**Files:**
- Create: `src/components/product/ProductMediaGallery.tsx`
- Create: `src/components/product/SilkSheenCanvas.tsx`
- Create: `src/components/product/PincodeDeliveryChecker.tsx`
- Create: `src/components/product/HandloomSpecifications.tsx`
- Create: `src/components/product/ProductDetailsView.tsx`
- Create: `src/features/pincode/pincodeService.ts`
- Create: `src/features/pincode/pincodeService.test.ts`
- Create: `src/components/product/ProductDetailsView.test.tsx`

**Interfaces:**
- Consumes: `useGetProductByIdQuery` from `src/features/products/productsApi.ts`, `addToCart` from `src/features/cart/cartSlice.ts`, `useCheckStockQuery` from `src/features/inventory/inventoryApi.ts`.
- Produces: `ProductDetailsView` exported component for route `/products/:id`.

- [ ] **Step 1: Write failing test for Pincode delivery service and PDP details**

```typescript
// src/features/pincode/pincodeService.test.ts
import { checkPincodeServiceability } from './pincodeService';

describe('Pincode Serviceability & Delivery ETA', () => {
  it('identifies Odisha weaving cluster with fast delivery', () => {
    const result = checkPincodeServiceability('754035'); // Nuapatna
    expect(result.serviceable).toBe(true);
    expect(result.city).toBe('Nuapatna / Cuttack');
    expect(result.state).toBe('Odisha');
    expect(result.codAvailable).toBe(true);
    expect(result.estimatedDays).toBe(2);
  });

  it('identifies national metros with standard insured transit', () => {
    const result = checkPincodeServiceability('110001'); // Delhi
    expect(result.serviceable).toBe(true);
    expect(result.city).toBe('New Delhi');
    expect(result.state).toBe('Delhi');
    expect(result.estimatedDays).toBe(4);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/features/pincode/pincodeService.test.ts`  
Expected: FAIL with "Cannot find module './pincodeService'"

- [ ] **Step 3: Implement `pincodeService.ts` and Screen 3 components**

- `pincodeService.ts`: In-memory postal directory mapping Odisha clusters and major Indian metros with ETA and COD rules.
- `ProductMediaGallery.tsx`: 2-column image stack with hover magnifier lens and toggle for 3D inspection.
- `SilkSheenCanvas.tsx`: React Three Fiber canvas rendering a wavy parametric silk plane geometry with custom vertex displacement shader, anisotropic specular lighting, and WebGL error fallback.
- `PincodeDeliveryChecker.tsx`: Pincode input with "Check" button, displaying delivery date, COD availability, and free shipping note.
- `HandloomSpecifications.tsx`: Saree length (5.5m), unstitched blouse piece (0.8m), warp/weft count, loom type, Silk Mark certificate badge.
- `ProductDetailsView.tsx`: Integrated page view with pricing card, single-piece stock alert, Add to Bag, Wishlist, and related sarees carousel.

- [ ] **Step 4: Run test to verify it passes**

Run: `Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/features/pincode/pincodeService.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/pincode/ src/components/product/
git commit -m "feat(storefront): implement Screen 3 PDP with high-res gallery, 3D silk sheen canvas, and pincode checker"
```

---

### Task 5: Screen 4 – Shopping Bag, Coupon Engine & Weaver Welfare Contribution

**Files:**
- Create: `src/components/cart/BagItemCard.tsx`
- Create: `src/components/cart/WeaverDonationTile.tsx`
- Create: `src/components/cart/CouponSelectorModal.tsx`
- Create: `src/components/cart/AuthoritativePriceSummary.tsx`
- Create: `src/components/cart/ShoppingBagView.tsx`
- Create: `src/features/cart/cartCalculations.ts`
- Create: `src/features/cart/cartCalculations.test.ts`
- Create: `src/components/cart/ShoppingBagView.test.tsx`

**Interfaces:**
- Consumes: `cartSlice.ts` state (items, selectedCoupon, donationAmount), `useBatchCheckStockMutation` from `src/features/inventory/inventoryApi.ts`.
- Produces: `calculateCartTotals()` in `cartCalculations.ts`, `ShoppingBagView` component for route `/cart`.

- [ ] **Step 1: Write failing test for cart calculations and discounts**

```typescript
// src/features/cart/cartCalculations.test.ts
import { calculateCartTotals } from './cartCalculations';
import { CartItem } from '@/types';

const items: CartItem[] = [
  { id: 1, name: 'Nuapatna Khandua Saree', price: 18000, originalPrice: 24000, quantity: 1, selected: true } as any,
  { id: 2, name: 'Sambalpuri Cotton Dupatta', price: 2000, originalPrice: 2500, quantity: 1, selected: true } as any
];

describe('Cart Calculations Engine', () => {
  it('computes MRP, product discount, coupon savings, and donation', () => {
    const totals = calculateCartTotals({
      items,
      coupon: { code: 'KHANDUA500', discountType: 'FLAT', value: 500, minOrder: 5000 },
      donationAmount: 50
    });

    expect(totals.totalMrp).toBe(26500); // 24000 + 2500
    expect(totals.subtotal).toBe(20000); // 18000 + 2000
    expect(totals.discountOnMrp).toBe(6500); // 26500 - 20000
    expect(totals.couponDiscount).toBe(500);
    expect(totals.donation).toBe(50);
    expect(totals.deliveryFee).toBe(0); // free > 1999
    expect(totals.totalPayable).toBe(19550); // 20000 - 500 + 50
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/features/cart/cartCalculations.test.ts`  
Expected: FAIL with "Cannot find module './cartCalculations'"

- [ ] **Step 3: Implement `cartCalculations.ts` and Screen 4 components**

- Implement `calculateCartTotals` in `cartCalculations.ts`.
- `BagItemCard.tsx`: Checkbox selection, product image, artisan seller attribution (*"Sold by: Nuapatna Master Weavers Co-op"*), quantity selector, live stock urgency (`"1 left"`), and 7-day return guarantee badge.
- `WeaverDonationTile.tsx`: Optional contribution selector (`₹20`, `₹50`, `₹100`) dedicated to Odisha Handloom Weavers Welfare Fund.
- `CouponSelectorModal.tsx`: Available vouchers with one-click apply and real-time validation against cart subtotal.
- `AuthoritativePriceSummary.tsx`: Line-by-line itemization (Total MRP, Discount on MRP, Coupon Savings, Donation, Delivery Fee, Total Payable) and primary **PLACE ORDER** button navigating to `/checkout`.
- `ShoppingBagView.tsx`: Complete bag layout matching Screenshot 4.

- [ ] **Step 4: Run test to verify it passes**

Run: `Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/features/cart/cartCalculations.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/cart/ src/components/cart/
git commit -m "feat(storefront): implement Screen 4 Shopping Bag with coupon engine and weaver donation"
```

---

### Task 6: Screen 5 – Multi-Step Checkout & Backend Order/Payment Integration

**Files:**
- Create: `src/components/checkout/CheckoutStepper.tsx`
- Create: `src/components/checkout/DeliveryAddressStep.tsx`
- Create: `src/components/checkout/PaymentStep.tsx`
- Create: `src/components/checkout/ReservationCountdown.tsx`
- Create: `src/components/checkout/MultiStepCheckoutView.tsx`
- Create: `src/features/checkout/checkoutSlice.ts`
- Create: `src/features/checkout/checkout.test.ts`
- Create: `src/components/checkout/MultiStepCheckoutView.test.tsx`

**Interfaces:**
- Consumes: `useCreateOrderMutation` from `src/features/orders/ordersApi.ts`, `useCreatePaymentOrderMutation`, `useVerifyPaymentMutation` from `src/services/paymentApi.ts`, `useGetAddressesQuery`, `useAddAddressMutation` from `src/services/userApi.ts`.
- Produces: `MultiStepCheckoutView` component for route `/checkout`.

- [ ] **Step 1: Write failing test for checkout stepper and payment preparation**

```typescript
// src/features/checkout/checkout.test.ts
import checkoutReducer, { setCurrentStep, setDeliveryAddress, setPaymentMethod } from './checkoutSlice';

describe('Checkout State Slice', () => {
  it('advances from bag to delivery and payment steps', () => {
    let state = checkoutReducer(undefined, setCurrentStep('delivery'));
    expect(state.currentStep).toBe('delivery');

    state = checkoutReducer(state, setDeliveryAddress({
      fullName: 'Aarav Mohapatra',
      phone: '9876543210',
      pincode: '751001',
      locality: 'Saheed Nagar',
      address: 'Plot 42, Janpath',
      city: 'Bhubaneswar',
      state: 'Odisha'
    }));
    expect(state.deliveryAddress?.city).toBe('Bhubaneswar');

    state = checkoutReducer(state, setPaymentMethod('RAZORPAY'));
    expect(state.paymentMethod).toBe('RAZORPAY');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/features/checkout/checkout.test.ts`  
Expected: FAIL with "Cannot find module './checkoutSlice'"

- [ ] **Step 3: Implement `checkoutSlice.ts` and Screen 5 components**

- `checkoutSlice.ts`: Manages `currentStep` (`bag` | `delivery` | `payment`), `deliveryAddress`, `paymentMethod`, and 15-minute reservation timer.
- `CheckoutStepper.tsx`: Linear header stepper (`BAG` ── `DELIVERY` ── `PAYMENT`) with active teal indicator and `100% SECURE` lock badge.
- `DeliveryAddressStep.tsx`: Radio cards for saved addresses from `user-service` + "Add New Address" form with automatic city/state lookup from pincode.
- `ReservationCountdown.tsx`: 15-minute urgency timer; prompts batch inventory re-check on expiry.
- `PaymentStep.tsx`: Payment options (UPI/QR, Credit/Debit Cards via Razorpay modal, Netbanking, COD), order summary sidebar, and "PAY NOW" / "CONFIRM COD" button submitting `Idempotency-Key` header to `POST /api/orders`.
- `MultiStepCheckoutView.tsx`: Assembles stepper and steps, redirecting to `/checkout/success/:orderId` on success.

- [ ] **Step 4: Run test to verify it passes**

Run: `Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/features/checkout/checkout.test.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/checkout/ src/components/checkout/
git commit -m "feat(storefront): implement Screen 5 Multi-Step Checkout with address book and Razorpay Saga integration"
```

---

### Task 7: Order Confirmation & Customer Order History Tracking

**Files:**
- Create: `src/components/checkout/OrderSuccessView.tsx`
- Create: `src/components/account/OrderHistoryView.tsx`
- Create: `src/components/account/OrderDetailModal.tsx`
- Create: `src/components/account/OrderHistoryView.test.tsx`

**Interfaces:**
- Consumes: `useGetOrdersQuery`, `useGetOrderByIdQuery` from `src/features/orders/ordersApi.ts`.
- Produces: `OrderSuccessView` for `/checkout/success/:orderId`, `OrderHistoryView` for `/account/orders`.

- [ ] **Step 1: Write failing test for order history and status tracking**

```typescript
// src/components/account/OrderHistoryView.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { OrderHistoryView } from './OrderHistoryView';

describe('Customer Order History View', () => {
  it('renders order timeline with tracking progression', () => {
    render(
      <Provider store={store}>
        <OrderHistoryView />
      </Provider>
    );
    expect(screen.getByRole('heading', { name: /My Handloom Orders/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/account/OrderHistoryView.test.tsx`  
Expected: FAIL with "Cannot find module './OrderHistoryView'"

- [ ] **Step 3: Implement `OrderSuccessView.tsx` and `OrderHistoryView.tsx`**

- `OrderSuccessView.tsx`: Displays celebration checkmark, confirmed Order ID, delivery ETA, download invoice button, and WhatsApp notification toggle.
- `OrderHistoryView.tsx`: Fetches orders via `/api/orders/my-orders`, showing item cards, order date, total paid, and tracking timeline (`ORDERED` -> `WEAVING/VERIFIED` -> `SHIPPED` -> `DELIVERED`).
- `OrderDetailModal.tsx`: Itemized breakdown with artisan details, shipping address, and return/exchange action button.

- [ ] **Step 4: Run test to verify it passes**

Run: `Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npx jest src/components/account/OrderHistoryView.test.tsx`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/account/ src/components/checkout/OrderSuccessView.tsx
git commit -m "feat(storefront): implement Order Confirmation and Customer Order History Tracking"
```

---

### Task 8: End-to-End Build Verification & Storefront Polish

**Files:**
- Modify: `src/main.tsx:1-30`
- Modify: `src/App.tsx:1-50`
- Test: All test suites (`npm test`)

**Interfaces:**
- Consumes: `router` from `src/app/routes.tsx`.
- Produces: Complete working production bundle in `dist/`.

- [ ] **Step 1: Wire `RouterProvider` into `src/main.tsx`**

Update `src/main.tsx` to mount `<RouterProvider router={router} />` inside Redux `<Provider store={store}>` and `SmoothScrollProvider`.

- [ ] **Step 2: Run complete TypeScript typecheck**

Run: `Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npm run typecheck`  
Expected: Exit code 0 with zero type errors.

- [ ] **Step 3: Run complete Jest test suite**

Run: `Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npm test`  
Expected: All suites PASS.

- [ ] **Step 4: Compile production build**

Run: `Set-Location "d:\Project\Antigravity\Khandualoom\microservice\frontend"; npm run build`  
Expected: Exit code 0 and successful Vite bundle output.

- [ ] **Step 5: Commit and tag**

```bash
git add .
git commit -m "chore(release): complete enterprise e-commerce storefront with Myntra-style benchmarks"
```
