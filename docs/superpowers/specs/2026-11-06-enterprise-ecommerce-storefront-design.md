# Khandua Looms – Enterprise E-Commerce Storefront Architecture & Design Specification

**Document ID:** `2026-11-06-enterprise-ecommerce-storefront-design`  
**Date:** November 6, 2026  
**Status:** DRAFT (Under Review)  
**Author:** Principal Frontend Architect & Microservices Integration Specialist  
**Target Platform:** Khandua Looms (Luxury Odisha Handloom E-Commerce Marketplace)  

---

## 1. Intent & The Why

Khandua Looms is a distributed, luxury e-commerce platform dedicated to rare, GI-tagged, authentic Odisha handloom textiles (Khandua Pata, Sambalpuri Bandha, Bomkai, Berhampuri Pata, Pasapalli, Kotpad, Dongria, and Habaspuri).

Traditional handloom e-commerce differs fundamentally from fast-fashion retail:
1. **Single-Piece & Low-Stock Realities**: High-end handwoven sarees often exist as unique or extremely limited physical units (frequently 1 or 2 units per design). Inventory reservations must be strictly authoritative and time-bounded; the frontend must never make assumptions or allow phantom checkouts.
2. **Cultural Heritage Storytelling & Trust**: Buyers require proof of authenticity (Silk Mark, GI tags, artisan lineage, weaving duration, pure mulberry/tussar yarn verification, and weaver welfare initiatives).
3. **Consumer Expectation of Modern E-Commerce**: The browsing, discovery, and checkout journeys must rival enterprise Indian fashion platforms (Myntra, Flipkart, Tata CLiQ Luxury) with seamless faceted filters, debounced autocomplete, interactive zoom, coupon incentives, and frictionless checkout.

The objective of this specification is to design and implement the **complete, production-grade Enterprise Storefront** integrated with the live Spring Boot 3.3.x microservices ecosystem via the Spring Cloud API Gateway.

---

## 2. Goals, Non-Goals & Anti-Goals

### 2.1 Goals
- **Full Route-Driven Storefront**: Replace internal state switching (`currentView`) with React Router v6 Data Routing supporting deep links (`/`, `/catalog`, `/collections/:category`, `/products/:slug`, `/cart`, `/checkout`, `/account/*`, `/seller/*`).
- **Exact Visual Fidelity to Myntra Benchmarks**:
  - **Screen 1 (Homepage)**: Sticky header with brand wordmark, category navigation, debounced search, campaign hero banner with dual CTAs, side sticky discount tab, trust & bank discount strip, and interactive Coupons Corner.
  - **Screen 2 (Catalog & Product Listing)**: 4-column responsive desktop grid, left faceted sidebar (Weave, Fabric, Price Slider, GI Certification, Occasion, Artisan), sorting dropdown, active filter chips, and real-time urgency stock badges (`"Only 1 Left"`).
  - **Screen 3 (Product Details Page - PDP)**: Multi-angle high-res image gallery, interactive fabric zoom, toggleable Cinematic 3D Silk Sheen Canvas (R3F), real-time delivery ETA pincode checker, Silk Mark certification badge, and authoritative stock countdown.
  - **Screen 4 (Shopping Bag / Cart)**: Authoritative pricing breakdown (MRP, Discounts, Coupons, Weaver Welfare contribution, Free shipping threshold), bulk select/remove, live stock revalidation before order placement.
  - **Screen 5 (Multi-Step Checkout)**: 3-step linear flow (`BAG` -> `DELIVERY` -> `PAYMENT`), address book CRUD with pincode autofill, Razorpay modal / UPI / Cards / COD integration, and backend Order Saga idempotency.
- **Microservices Integration via Gateway**: All HTTP communication flows through `api-gateway:8080` (or reverse proxy `/api/`) with JWT refresh interceptors, correlation IDs (`X-Correlation-ID`), and cryptographic identity assertions.
- **Performance & Resilience**: LCP < 2.5s, CLS < 0.1, responsive layout across mobile/tablet/desktop, and graceful 2D fallbacks when WebGL is unsupported or disabled.

### 2.2 Non-Goals
- Building the dynamic website builder / CMS admin panel in this phase (this will immediately follow in the subsequent phase per user direction).
- Inventing unsupported backend microservice APIs or maintaining shadow mock databases in production.
- Client-side payment authorization or ledger modifications.

### 2.3 Anti-Goals
- **No Mock-Only Facade**: Do not create non-functional buttons or fake static views. All state and actions must link to real endpoints or gracefully documented contracts.
- **No Frontend-Invented Stock or Pricing**: Never calculate final payable amounts or assume reservation success on the client without backend confirmation.
- **No Unconstrained Three.js Rerenders**: 3D canvas must pause when off-screen, clamp device pixel ratio to $\le 1.75$, and respect `prefers-reduced-motion`.

---

## 3. Constraints

- **Backend Gateway**: Must route strictly through Spring Cloud API Gateway (`:8080`), never querying individual microservice ports (`:8081`-`:8089`) directly.
- **Authentication**: JWT access tokens stored in-memory (Redux auth slice); refresh tokens coordinated via secure HttpOnly cookies or refresh endpoints.
- **Single-Unit Stock Contention**: Handloom sarees often have `quantity = 1`. Checkout must respect HTTP 429 (`SkuContentionException`) and retry-after policies.
- **Zero Secrets on Client**: Razorpay Key ID is public, but Webhook secrets and assertion tokens remain strictly backend-side.

---

## 4. Architectural Approaches & Selection

### 4.1 Approaches Evaluated
1. **Approach 1: React Router v6 Data Routing with Feature-Based Modules (SELECTED)**
   - *Architecture*: Structured route tree (`/`, `/catalog`, `/collections/:category`, `/products/:slug`, `/cart`, `/checkout`, `/account/*`, `/seller/*`).
   - *State Management*: RTK Query for server cache, Redux slices for client state (cart, wishlist, auth, filters, i18n).
   - *Pros*: Native browser back/forward history, shareable deep links, URL-synchronized query params for filters (`?weave=sambalpuri&price=10000-25000`), route-based code splitting, SEO readiness.
   - *Cons*: Requires migrating legacy view-state switcher in `App.tsx`.
2. **Approach 2: Progressive Expansion of Single-Page State Machine (REJECTED)**
   - *Architecture*: Retain `currentView` state machine inside `App.tsx` and toggle modals/drawers.
   - *Cons*: Cannot share product URLs, breaks browser navigation, impossible to bookmark filtered catalog states, violates modern luxury e-commerce expectations.

### 4.2 Decision
**Approach 1** was approved by the user to establish a true enterprise e-commerce foundation.

---

## 5. Screen-by-Screen Implementation Specifications

### 5.1 Screen 1: Homepage, Navigation & Promotional Ecosystem
- **Header & Navbar**:
  - Left: Khandua Looms emblem & luxury serif wordmark linking to `/`.
  - Center: Category navigation items (`Khandua Pata`, `Sambalpuri`, `Bomkai`, `Berhampuri`, `Fabrics & Dupattas`, `Artisan Atelier`). Hovering opens an editorial mega-menu.
  - Search: Full-width responsive search bar with debounced autocomplete (300ms), popular search tags, and search history stored in `localStorage`.
  - Right: Quick-access icons with live Redux count badges for `Profile`, `Wishlist` (heart), and `Bag` (shopping bag).
- **Hero & Promotional Banner**:
  - High-impact visual banner with heritage photography and dual CTAs (*"Explore Bridal Weaves"* & *"Daily Handlooms"*).
  - Sticky right-side discount tab (*"FLAT ₹500 OFF"*), clicking opens the coupon drawer.
- **Trust & Payment Strip**:
  - Four pillars: *100% Genuine Handloom*, *GI Tag Authenticated*, *Easy 7-Day Returns*, *Secure Payments*.
  - Bank partner ticker: 10% Instant Discount on HDFC, ICICI, SBI Cards & UPI.
- **Coupons Corner**:
  - Interactive voucher cards with one-click code copy and auto-apply to the cart session (`HERITAGE10`, `KHANDUA500`, `PATA1000`).

### 5.2 Screen 2: Catalog & Faceted Product Listing (`/catalog`, `/collections/:category`)
- **Subheader & Filter Controls**:
  - Breadcrumb trail (*Home / Sarees / Khandua Pata*).
  - Quick dropdown pills (*Weave Type*, *Fabric Purity*, *Occasion*, *Price*).
  - Sorting dropdown (*Recommended*, *Price: Low to High*, *Price: High to Low*, *Newest*, *Customer Rating*).
  - Active filter chips with individual remove buttons and a *"Clear All"* action.
- **Left Filter Sidebar (Collapsible on Mobile)**:
  - Searchable checkboxes with item counts:
    - **Weave Technique**: Khandua Pata, Sambalpuri Ikat, Bomkai, Berhampuri Silk, Pasapalli, Kotpad, Dongria, Habaspuri.
    - **Fabric Composition**: Pure Mulberry Silk (4-ply/2-ply), Tussar Silk, Organic Cotton, Silk-Cotton.
    - **Price Range**: Interactive dual-thumb range slider (₹1,500 – ₹50,000+).
    - **GI Tag & Certifications**: GI Tagged, Silk Mark Certified, Craftmark.
    - **Occasion**: Wedding / Bridal, Religious Ceremonies, Festive, Formal, Casual.
    - **Artisan Society**: Nuapatna, Bargarh, Sonepur, Berhampur, Koraput.
- **Product Card Grid**:
  - 4-column responsive grid on desktop (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`).
  - Saree thumbnail with smooth image hover flip (drape view -> intricate pallu detail).
  - Rating badge overlay on image: `4.8 ★ | 42`.
  - Saree title, artisan society attribution, current price, strikethrough MRP, and discount badge.
  - Stock badge: `"Only 1 Left in Stock!"` in terracotta badge for low-inventory items.
  - Quick-action floating Wishlist heart with animated transition.

### 5.3 Screen 3: Product Details Page - PDP (`/products/:slug` or `/products/:id`)
- **Left: Media Showcase & 3D Visualizer**:
  - 2-column staggered image gallery displaying pallu, pleats, zari border, and blouse piece.
  - Image magnifier zoom on hover.
  - **Cinematic 3D Silk Sheen Canvas (R3F)** toggle:
    - Parametric silk drape geometry with custom vertex waves (`sin(time + u_pos)`).
    - Anisotropic silk sheen shader reflecting key/fill ambient light.
    - WebGL capability detection with automatic fallback to high-res still image if GPU memory is constrained or `prefers-reduced-motion` is active.
- **Right: Purchase & Specification Panel**:
  - Artisan atelier attribution, saree title, verified customer score (`4.8 ★ | 84 Verified Buyers`).
  - Pricing card with inclusive tax notice (`₹18,499`, MRP `₹24,999`, `26% OFF`).
  - Handloom specifications table: Saree length (5.5m), Blouse piece (0.8m unstitched), Warp/Weft count, Loom type (Pit loom / Frame loom), Silk Mark certification number.
  - **Add to Bag** (primary CTA) and **Wishlist** buttons.
  - Single-piece inventory countdown banner (*"Unique handwoven piece – reserved for 15 minutes at checkout"*).
  - **Delivery Pincode Checker**: 6-digit pincode input querying delivery ETA and COD availability.
  - Applicable bank offers & coupon accordions.
  - Wash & care instructions (Dry clean only, store in muslin cloth).

### 5.4 Screen 4: Shopping Bag & Authoritative Price Breakdown (`/cart`)
- **Cart Item Management**:
  - Bulk select header (*"X/X ITEMS SELECTED"*, *REMOVE*, *MOVE TO WISHLIST*).
  - Saree items with artisan cooperative details, quantity selector (bounded by backend inventory), and single-piece stock warning.
  - 7-day return guarantee label.
- **Artisan Welfare Donation**:
  - Optional community donation pill selector (`₹20`, `₹50`, `₹100`) dedicated to the Odisha Weavers Welfare Fund.
- **Price Details & Coupon Engine**:
  - Coupon input with available promo list.
  - Authoritative line items: Total MRP, Product Discount, Coupon Savings, Artisan Donation, Shipping Fee (*FREE*), and Total Payable.
  - Prominent **PLACE ORDER** button leading to Checkout.

### 5.5 Screen 5: Multi-Step Checkout (`/checkout`)
- **Linear Stepper**: `BAG` ────── `DELIVERY` ────── `PAYMENT` (current step highlighted).
- **Step 1: Delivery Address**:
  - Saved address radio cards with default address indicator.
  - *"Add New Address"* modal/form with Pincode lookup (auto-populating City and State), Locality, House/Street, Recipient Name, and Mobile Number.
  - Form validation with Zod and React Hook Form.
- **Step 2: Delivery Speed & Summary**:
  - Standard Handloom Insured Delivery (Free).
  - Order summary sidebar with item thumbnail and total payable.
- **Step 3: Payment & Saga Coordination**:
  - Payment method tabs:
    - **UPI / QR Code**: Instant phone payment (Google Pay, PhonePe, Paytm).
    - **Credit / Debit Cards**: Secure Razorpay Checkout modal or direct card form.
    - **Net Banking**: All major Indian banks.
    - **Cash on Delivery (COD)**: Available for orders below ₹10,000.
  - **Backend Inventory Reservation Timer**: Displays live countdown (`14:59`) fetched from `inventory-service`. If timer expires, prompts user to re-reserve stock.
  - **Idempotency**: Submits `Idempotency-Key: UUIDv4` header to `order-service` to prevent duplicate billing on network delays or multiple clicks.
- **Order Confirmation Page (`/checkout/success/:orderId`)**:
  - Confirmed Order ID, estimated dispatch date, invoice PDF download button, tracking timeline, and WhatsApp update opt-in.

---

## 6. Architecture & Implementation Decisions (Builder Review Resolutions)

During the formal architectural review, six critical technical interactions were resolved to ensure seamless integration with the existing microservices:

### 6.1 Order & Payment Sequence (Step 3 Checkout)
- **Flow**:
  1. For online payments (UPI, Cards, Netbanking): Frontend requests Razorpay Order creation via `POST /api/payment/create-order` with the net payable amount.
  2. The Razorpay modal opens.
  3. Upon customer payment authorization, Razorpay returns `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature`.
  4. Frontend immediately submits `POST /api/orders` containing the full `OrderRequest` (address, items, and Razorpay signature details) along with a unique `Idempotency-Key: UUIDv4` header.
  5. Concurrently, frontend calls `POST /api/payment/verify` to confirm with `payment-service`.
  6. For **Cash on Delivery (COD)**: Frontend directly submits `POST /api/orders` with `paymentMethod: COD`.
- **Advantage**: Prevents orphaned pending orders in `order-service` if a user closes the payment modal before entering UPI PIN or card credentials.

### 6.2 Cart Discounts, Coupons & Weaver Donation Flow
- Active coupons (`HERITAGE10`, `KHANDUA500`, `PATA1000`) and weaver welfare donations are calculated in the Redux `cartSlice`.
- When submitting `POST /api/orders`, the coupon savings are proportionately distributed across item unit prices (`itemPrice`), ensuring that `order.totalAmount` calculated by `order-service` matches the Razorpay payment amount to the exact rupee without requiring invasive database alterations.

### 6.3 Inventory Reservation & Urgency Countdown
- Real-time stock counts are verified on the PDP and upon adding to bag via `/api/inventory/{productId}`.
- When opening `/cart` or `/checkout`, a batch stock revalidation is dispatched via `POST /api/inventory/batch-check`.
- The 15-minute checkout countdown is tracked in `checkoutSlice`. Upon expiry, the frontend refreshes stock to ensure single-piece sarees remain available before payment capture.
- Definitive distributed reservation occurs asynchronously through the Kafka `order-created` event consumed by `InventoryService`.

### 6.4 Catalog Multi-Faceted Filtering & Performance Strategy
- The storefront fetches the catalog via `/api/products` into the RTK Query cache and executes the extensive Myntra-style faceted filtering (price slider, weave technique, fabric composition, GI certification, occasion, artisan society) client-side in Redux / `useMemo`.
- **Advantage**: Instant, zero-latency facet filtering with no server roundtrips per checkbox click, maintaining smooth 60fps UI performance while supporting the full breadth of handloom attributes.

### 6.5 Pincode Lookup & Serviceability Engine
- Implemented via a resilient client-side postal service lookup supporting all major Indian postal circles and Odisha weaving clusters (Bhubaneswar 751xxx, Cuttack 753xxx, Puri 752xxx, Nuapatna 754xxx, Bargarh 768xxx, Delhi 110xxx, Mumbai 400xxx, Bangalore 560xxx, etc.).
- Automatically populates City and State, computes delivery ETA (2-3 business days for Odisha, 4-6 business days nationwide), and confirms COD eligibility.

### 6.6 Guest Checkout & Authenticated Profile Support
- `/checkout` supports both authenticated members and guest shoppers.
- Authenticated users automatically see their saved addresses from `/api/users/addresses`.
- Guests can enter a shipping address directly without an upfront password requirement; the order is associated with their guest email.

---

## 7. Frontend Architecture & Directory Structure

```text
microservice/frontend/src/
├── app/
│   ├── store.ts               # Redux Toolkit store config
│   ├── hooks.ts               # Typed useAppDispatch, useAppSelector
│   └── routes.tsx             # React Router v6 createBrowserRouter
│
├── components/
│   ├── layout/
│   │   ├── StoreLayout.tsx    # Header, Navbar, Footer, Drawers
│   │   ├── CheckoutLayout.tsx # Minimal 3-step stepper header & secure footer
│   │   └── AccountLayout.tsx  # Customer profile sidebar & view container
│   ├── common/
│   │   ├── Navbar.tsx         # Myntra-style responsive navigation & mega-menu
│   │   ├── Footer.tsx         # Handloom heritage footer & legal links
│   │   ├── SearchModal.tsx    # Debounced autocomplete search overlay
│   │   └── CartSidebar.tsx    # Slide-over quick bag
│   ├── catalog/
│   │   ├── ProductCard.tsx    # 4-col card with hover image flip & rating
│   │   ├── FilterSidebar.tsx  # Multi-faceted filter accordions
│   │   ├── SortDropdown.tsx   # Sorting selector
│   │   └── ActiveFilters.tsx  # Dismissible filter tag chips
│   ├── product/
│   │   ├── ProductGallery.tsx # Multi-angle gallery with zoom
│   │   ├── ProductSpecs.tsx   # Handloom specifications & GI info
│   │   └── PincodeChecker.tsx # Delivery ETA lookup
│   ├── 3d/
│   │   ├── CinematicLoomCanvas.tsx # Persistent subtle background canvas
│   │   ├── SilkSheenViewer.tsx     # 3D interactive silk fabric inspector
│   │   └── WebGLFallback.tsx       # Graceful CSS/canvas fallback
│   ├── checkout/
│   │   ├── CheckoutStepper.tsx     # Bag -> Delivery -> Payment steps
│   │   ├── AddressSelector.tsx     # Saved addresses & new address form
│   │   ├── PaymentGateway.tsx      # Razorpay & UPI integration
│   │   └── ReservationTimer.tsx    # Backend stock countdown clock
│   └── profile/
│       ├── ProfileDashboard.tsx    # Personal info, addresses, security
│       └── OrderHistory.tsx        # Order tracking timeline & invoices
│
├── features/
│   ├── auth/                  # authSlice, authApi (login, register, token refresh)
│   ├── products/              # productsSlice, productsApi (paged catalog, facets)
│   ├── cart/                  # cartSlice (items, coupons, authoritative totals)
│   ├── wishlist/              # wishlistSlice (synced to local & backend)
│   ├── orders/                # ordersApi (create order, my-orders, track)
│   ├── inventory/             # inventoryApi (stock check, reservation)
│   └── payment/               # paymentApi (create-order, verify, webhook)
│
├── services/
│   ├── baseApi.ts             # RTK Query base with Axios / fetchBaseQuery
│   └── apiClient.ts           # Centralized Axios client with JWT interceptors
│
└── types/
    └── index.ts               # TypeScript contracts matching backend DTOs
```

---

## 8. Backend API Integration Matrix

| Frontend Feature | Backend Service | Actual API Endpoint | Method | Status | Integration Details |
|---|---|---|---|---|---|
| **Paged Catalog** | `product-service` | `/api/products/paged` | `GET` | **VERIFIED** | Supports `page`, `size`, `category`, `badge`, `weave`, `fabric`, `minRating`, `sort`. |
| **Product Details** | `product-service` | `/api/products/{id}` | `GET` | **VERIFIED** | Returns complete product entity, specs, images, price. |
| **Related Sarees** | `product-service` | `/api/products/{id}/related` | `GET` | **VERIFIED** | Returns recommended sarees in same weave/category. |
| **Stock Check** | `inventory-service`| `/api/inventory/{productId}` | `GET` | **VERIFIED** | Real-time stock count and reserved quantities. |
| **Batch Stock** | `inventory-service`| `/api/inventory/batch-check` | `POST` | **VERIFIED** | Validates all cart items before opening checkout. |
| **Create Order** | `order-service` | `/api/orders` | `POST` | **VERIFIED** | Accepts `OrderRequest`, idempotency header, user ID. |
| **My Orders** | `order-service` | `/api/orders/my-orders` | `GET` | **VERIFIED** | Scoped strictly to authenticated customer ID. |
| **Razorpay Order**| `payment-service` | `/api/payment/create-order` | `POST` | **VERIFIED** | Creates Razorpay order ID and transaction record. |
| **Verify Payment**| `payment-service` | `/api/payment/verify` | `POST` | **VERIFIED** | Validates signature and triggers payment capture event. |
| **User Profile** | `user-service` | `/api/users/profile` | `GET`/`PUT`| **VERIFIED** | Retrieves and updates customer contact details. |
| **Address Book** | `user-service` | `/api/users/addresses` | `GET`/`POST`| **VERIFIED** | Multi-address support with default address marker. |
| **User Auth** | `auth-service` | `/api/auth/login` | `POST` | **VERIFIED** | Issues 512-bit JWT and refresh tokens. |

---

## 9. What is Left to the Builder

The builder has full discretion to:
1. Choose optimal animation timings for Framer Motion / GSAP transitions (keeping them between 200ms and 400ms for responsiveness).
2. Configure Tailwind utility classes for responsive breakpoints (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`).
3. Select appropriate fallback placeholder images for handloom weaves when backend image URLs are resolving.
4. Tune the Three.js fabric vertex displacement amplitude and camera FOV for aesthetic balance without occluding PDP text.

---

## 10. Verification & Quality Gates

1. **Compilation**: `npm run build` in `microservice/frontend` must exit with code 0 without TypeScript errors.
2. **Routing**: Direct navigation to `/`, `/catalog`, `/products/1`, `/cart`, `/checkout`, `/account/orders` must render without 404s or white-screen flickers.
3. **Cart & Stock Flow**: Adding an item to bag, entering coupon, checking delivery pincode, and stepping through checkout must accurately query backend APIs.
4. **End-to-End Test**: Place an order as a logged-in user, verify inventory decrement and order creation in `order-service`.
