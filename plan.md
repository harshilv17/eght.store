# EGHT Studios — Frontend Implementation Plan

## 1. Executive Summary

We are building the customer-facing storefront for EGHT Studios — a premium streetwear brand — as a Next.js 15 App Router application in TypeScript with Tailwind CSS v4. The frontend consumes an existing Express/PostgreSQL API at `http://localhost:4000/api/*`, supports both guest and authenticated shopping (cart merge on login), and completes payments via Razorpay's checkout modal with backend signature verification. The visual language is editorial, monochrome, sharp-cornered, Inter-typeset, with surgical use of a muted orange accent. SEO-critical pages (home, collection, product) are server components; cart, checkout, and auth flows are client components backed by a Zustand store.

---

## 2. Folder / File Structure

```
frontend/
├── public/
│   ├── fonts/                             # (only if self-hosting; otherwise next/font)
│   └── og/                                # OG fallback images
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # Root layout: <html>, <body>, fonts, Providers
│   │   ├── globals.css                    # Tailwind v4 @theme, base resets, marquee keyframes
│   │   ├── page.tsx                       # Homepage (RSC)
│   │   ├── error.tsx                      # Global error boundary (client)
│   │   ├── not-found.tsx                  # 404
│   │   ├── loading.tsx                    # Top-level skeleton
│   │   ├── providers.tsx                  # Client providers wrapper (Auth bootstrap, Cart bootstrap, Toaster)
│   │   ├── (shop)/
│   │   │   ├── layout.tsx                 # Shop layout: Navbar + Marquee + Footer + CartDrawer mount
│   │   │   ├── collections/
│   │   │   │   ├── page.tsx               # All collections index (RSC)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx           # Collection detail (RSC, reads searchParams)
│   │   │   └── products/
│   │   │       └── [slug]/
│   │   │           ├── page.tsx           # Product detail (RSC)
│   │   │           └── ProductDetailClient.tsx
│   │   ├── checkout/
│   │   │   ├── layout.tsx                 # Stripped-down layout (logo + secure badge, no nav/footer)
│   │   │   ├── page.tsx                   # Checkout form (Client) + OrderSummary
│   │   │   └── confirmation/
│   │   │       └── [orderId]/page.tsx     # Post-payment receipt (RSC, reads order)
│   │   ├── account/
│   │   │   ├── layout.tsx                 # Account sidebar wrapper
│   │   │   ├── login/page.tsx             # (Client form)
│   │   │   ├── register/page.tsx          # (Client form)
│   │   │   ├── orders/page.tsx            # Order list (Client; needs auth)
│   │   │   ├── orders/[id]/page.tsx       # Order detail
│   │   │   └── addresses/page.tsx         # CRUD addresses
│   │   ├── api/
│   │   │   └── razorpay-key/route.ts      # (optional) proxy if we ever need server-side key
│   │   └── robots.ts / sitemap.ts         # SEO
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Marquee.tsx
│   │   │   └── CheckoutHeader.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx                 # primary | secondary | accent | ghost
│   │   │   ├── Input.tsx                  # underline + boxed variants
│   │   │   ├── Select.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Radio.tsx
│   │   │   ├── IconButton.tsx
│   │   │   ├── Drawer.tsx                 # Headless drawer primitive (focus-trap + a11y)
│   │   │   ├── Modal.tsx
│   │   │   ├── Accordion.tsx              # used by FABRIC & CARE / SHIPPING
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Badge.tsx                  # JUST ADDED / LIMITED DROP
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductCardLarge.tsx       # Homepage hero card variant
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductGallery.tsx         # Vertical stack (PDP)
│   │   │   ├── ColorSwatches.tsx
│   │   │   ├── SizeSelector.tsx
│   │   │   ├── AddToBagButton.tsx
│   │   │   ├── PriceTag.tsx
│   │   │   ├── CompleteTheLook.tsx
│   │   │   └── FilterSidebar.tsx
│   │   ├── collection/
│   │   │   ├── SortBar.tsx
│   │   │   └── LoadMore.tsx               # client; reads/writes searchParams
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── CartItemRow.tsx
│   │   │   ├── CartFooter.tsx
│   │   │   ├── CartTrigger.tsx            # Navbar bag icon w/ count
│   │   │   └── EmptyCart.tsx
│   │   ├── checkout/
│   │   │   ├── ContactSection.tsx
│   │   │   ├── ShippingAddressForm.tsx
│   │   │   ├── ShippingMethodSelect.tsx
│   │   │   ├── PaymentSection.tsx         # "Pay with Razorpay" trigger
│   │   │   ├── OrderSummary.tsx
│   │   │   ├── DiscountInput.tsx
│   │   │   └── RazorpayLauncher.tsx       # opens Razorpay modal
│   │   ├── account/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── OrdersList.tsx
│   │   │   ├── OrderDetail.tsx
│   │   │   ├── AddressCard.tsx
│   │   │   └── AccountSidebar.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── NewArrivalsAsymmetric.tsx
│   │   │   └── ManifestoSection.tsx
│   │   └── seo/
│   │       └── ProductJsonLd.tsx
│   ├── lib/
│   │   ├── api.ts                         # fetch wrapper, retry-on-401
│   │   ├── auth.ts                        # tokens in memory; refresh handshake
│   │   ├── session.ts                     # x-session-id cookie helper (uuid)
│   │   ├── razorpay.ts                    # script loader + checkout opener
│   │   ├── format.ts                      # currency, dates
│   │   ├── env.ts                         # NEXT_PUBLIC_API_URL, RAZORPAY_KEY_ID
│   │   ├── seo.ts                         # generateMetadata helpers
│   │   └── validators.ts                  # zod schemas mirroring backend
│   ├── store/
│   │   ├── auth.store.ts                  # zustand: user, accessToken (in-memory)
│   │   ├── cart.store.ts                  # zustand: items, isOpen, totals
│   │   └── ui.store.ts                    # toasts, search modal open
│   ├── types/
│   │   ├── api.ts                         # ApiResponse<T>, error shapes
│   │   ├── product.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   └── user.ts
│   └── middleware.ts                      # Ensures x-session-id cookie exists for guests
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.ts
├── tsconfig.json
├── package.json
└── .env.local
```

---

## 3. Routing Map

| URL | Component file | Type | Backend endpoint(s) |
|---|---|---|---|
| `/` | `app/page.tsx` | RSC | `GET /api/products?limit=8` (new arrivals) |
| `/collections` | `app/(shop)/collections/page.tsx` | RSC | `GET /api/products/categories` |
| `/collections/[slug]` | `app/(shop)/collections/[slug]/page.tsx` | RSC | `GET /api/products?category={slug}&page=&search=&limit=` |
| `/products/[slug]` | `app/(shop)/products/[slug]/page.tsx` | RSC + nested client | `GET /api/products/:slug` (then `GET /api/products?limit=3` for "Complete the Look") |
| `/checkout` | `app/checkout/page.tsx` | Client | `GET /api/cart`, `GET /api/user/addresses`, `POST /api/payment/create-order`, `POST /api/payment/verify` |
| `/checkout/confirmation/[orderId]` | `.../confirmation/[orderId]/page.tsx` | RSC | `GET /api/orders/:id` |
| `/account/login` | `app/account/login/page.tsx` | Client | `POST /api/auth/login` |
| `/account/register` | `app/account/register/page.tsx` | Client | `POST /api/auth/register` |
| `/account/orders` | `app/account/orders/page.tsx` | Client (auth-gated) | `GET /api/orders` |
| `/account/orders/[id]` | `.../orders/[id]/page.tsx` | Client | `GET /api/orders/:id` |
| `/account/addresses` | `.../addresses/page.tsx` | Client | `GET/POST/DELETE /api/user/addresses` |
| Cart drawer (overlay, not a route) | `components/cart/CartDrawer.tsx` | Client | `GET/POST/PUT/DELETE /api/cart/items` |

Auth bootstrap on every page load: `POST /api/auth/refresh` (silent, via httpOnly cookie) → if 200, hydrate `auth.store`; else continue as guest.

---

## 4. Component Inventory

### 4.1 Layout
| Component | Props | Used in |
|---|---|---|
| `Navbar` | `{ links?: NavLink[] }` | `(shop)/layout.tsx` |
| `Marquee` | `{ items: string[]; speed?: number }` | Below Navbar in shop layout |
| `Footer` | `{ minimal?: boolean }` | Shop layout |
| `CheckoutHeader` | `{}` | Checkout layout |

### 4.2 UI primitives
| Component | Props | Used in |
|---|---|---|
| `Button` | `{ variant: 'primary'\|'secondary'\|'accent'\|'ghost'; size?: 'sm'\|'md'\|'lg'; loading?: boolean; ...HTMLButton }` | Everywhere |
| `Input` | `{ label: string; variant?: 'underline'\|'boxed'; error?: string; ...HTMLInput }` | Auth, checkout, address forms |
| `Select` | `{ label: string; options: {value;label}[] }` | Country/state, sort bar |
| `Checkbox` / `Radio` | `{ label: string }` | Newsletter, shipping method, payment method |
| `IconButton` | `{ icon: ReactNode; ariaLabel: string }` | Search, bag, drawer close |
| `Drawer` | `{ open: boolean; onClose: () => void; side?: 'right' }` | CartDrawer |
| `Accordion` | `{ items: {title; content}[] }` | PDP "Fabric & Care", "Shipping & Returns" |
| `Badge` | `{ tone: 'limited'\|'new'\|'soldout' }` | "JUST ADDED", "LIMITED DROP" |
| `Skeleton` | `{ className }` | Loading states |
| `Toast` | `{ tone; title; description }` | Add-to-bag confirmation, errors |

### 4.3 Product
| Component | Props | Used in |
|---|---|---|
| `ProductCard` | `{ product: Product; size?: 'sm'\|'md'\|'lg' }` | Collection grid, Complete the Look |
| `ProductCardLarge` | `{ product: Product; badge?: string }` | Homepage asymmetric grid |
| `ProductGrid` | `{ products: Product[]; cols?: 2\|3\|4 }` | Collection page |
| `ProductGallery` | `{ images: string[]; alt: string }` | PDP |
| `ColorSwatches` | `{ variants: Variant[]; selected?: string; onChange }` | PDP, collection card |
| `SizeSelector` | `{ variants: Variant[]; selected?; onChange }` | PDP |
| `AddToBagButton` | `{ variantId: string; disabled?: boolean }` | PDP |
| `PriceTag` | `{ price: number; comparePrice?: number; currency?: string }` | Cards, PDP |
| `CompleteTheLook` | `{ products: Product[] }` | PDP |
| `FilterSidebar` | `{ categories; sizes; colors; selected; onChange }` | Collection page |

### 4.4 Cart
| Component | Props | Used in |
|---|---|---|
| `CartTrigger` | `{}` | Navbar |
| `CartDrawer` | `{}` (state from store) | `(shop)/layout.tsx` |
| `CartItemRow` | `{ item: CartItem }` | CartDrawer |
| `CartFooter` | `{ subtotal: number }` | CartDrawer |
| `EmptyCart` | `{}` | CartDrawer when items=[] |

### 4.5 Checkout
| Component | Props | Used in |
|---|---|---|
| `ContactSection` | `{ user?: User }` | `/checkout` |
| `ShippingAddressForm` | `{ value; onChange; errors }` | `/checkout` |
| `ShippingMethodSelect` | `{ value; onChange }` | `/checkout` |
| `PaymentSection` | `{ onPayClick }` | `/checkout` |
| `OrderSummary` | `{ items; subtotal; tax; total }` | `/checkout` (sticky right column) |
| `DiscountInput` | `{ onApply }` | OrderSummary |
| `RazorpayLauncher` | `{ orderId; razorpayOrderId; keyId; amount; prefill; onSuccess; onFailure }` | `/checkout` |

### 4.6 Account
| Component | Props | Used in |
|---|---|---|
| `LoginForm` | `{ redirectTo?: string }` | `/account/login` |
| `RegisterForm` | `{}` | `/account/register` |
| `OrdersList` | `{ orders: Order[] }` | `/account/orders` |
| `OrderDetail` | `{ order: Order }` | `/account/orders/[id]`, confirmation page |
| `AddressCard` | `{ address; onEdit; onDelete }` | `/account/addresses` |

---

## 5. Design System Implementation

Tailwind v4 uses `@theme` directly in CSS. We mirror DESIGN.md tokens.

### `src/app/globals.css`
```css
@import "tailwindcss";

@theme {
  /* Surfaces */
  --color-surface: #f9f9f9;
  --color-surface-dim: #dadada;
  --color-surface-bright: #f9f9f9;
  --color-surface-container-lowest: #ffffff;
  --color-surface-container-low: #f3f3f4;
  --color-surface-container: #eeeeee;
  --color-surface-container-high: #e8e8e8;
  --color-surface-container-highest: #e2e2e2;
  --color-on-surface: #1a1c1c;
  --color-on-surface-variant: #444748;
  --color-inverse-surface: #2f3131;
  --color-inverse-on-surface: #f0f1f1;
  --color-outline: #747878;
  --color-outline-variant: #c4c7c7;
  --color-surface-tint: #5f5e5e;
  --color-background: #f9f9f9;

  /* Brand */
  --color-primary: #000000;
  --color-on-primary: #ffffff;
  --color-primary-container: #1c1b1b;
  --color-on-primary-container: #858383;
  --color-secondary: #5d5f5f;
  --color-on-secondary: #ffffff;
  --color-tertiary: #000000;
  --color-tertiary-container: #2f1500;
  --color-on-tertiary-container: #c76c00;   /* MUTED ORANGE accent */
  --color-error: #ba1a1a;
  --color-on-error: #ffffff;

  /* Typography — Inter via next/font */
  --font-sans: var(--font-inter);

  --text-display-xl: 120px;
  --text-display-xl--line-height: 100%;
  --text-display-xl--letter-spacing: -0.04em;
  --text-display-xl--font-weight: 700;

  --text-headline-lg: 48px;
  --text-headline-lg--line-height: 110%;
  --text-headline-lg--letter-spacing: -0.02em;
  --text-headline-lg--font-weight: 700;

  --text-headline-md: 32px;
  --text-headline-md--line-height: 120%;
  --text-headline-md--letter-spacing: -0.01em;
  --text-headline-md--font-weight: 600;

  --text-body-lg: 18px;
  --text-body-lg--line-height: 160%;

  --text-body-md: 16px;
  --text-body-md--line-height: 160%;

  --text-label-caps: 12px;
  --text-label-caps--line-height: 100%;
  --text-label-caps--letter-spacing: 0.1em;
  --text-label-caps--font-weight: 700;

  /* Spacing */
  --spacing-unit: 8px;
  --spacing-gutter: 24px;
  --spacing-margin-edge: 40px;
  --spacing-section-gap: 120px;

  /* Radius — sharp by brand mandate */
  --radius-DEFAULT: 0px;
  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;
}

@layer base {
  html, body { @apply bg-surface text-on-surface antialiased; }
  *, *::before, *::after { box-shadow: none; }
}

@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee { animation: marquee 20s linear infinite; }
```

Inter loaded via `next/font/google` in root layout with weights 400, 600, 700, 900 and `variable: '--font-inter'`.

---

## 6. State Management Strategy

| Concern | Lives in | Rationale |
|---|---|---|
| Product data, collections, categories | RSC (server fetch) | SEO + cache |
| Filter/sort/pagination | URL `searchParams` | Shareable, server-renderable |
| Cart items + open/close | Zustand `cart.store` (client) | Cross-page persistence within session, optimistic UI |
| Auth user + access token | Zustand `auth.store` (client, **memory only**) | Security — no localStorage |
| Refresh token | httpOnly cookie (set by backend) | Standard rotation |
| `x-session-id` for guest cart | Plain cookie (`session_id`) | Sent on every cart fetch via header |
| Toast / drawer / search-modal UI | Zustand `ui.store` | Lightweight UI state |
| Form drafts (checkout) | React Hook Form + local state | No need to globalize |

### Cart-merge flow on login
1. Guest browses with `x-session-id: <uuid>` → backend persists cart against `session_id`.
2. On successful `POST /api/auth/login`, frontend calls `GET /api/cart` with both Bearer token AND lingering `x-session-id` header. Backend's cart service must merge any session cart into the user cart on first authenticated read.
3. After successful merge, frontend deletes the `session_id` cookie and refetches `GET /api/cart`.
4. On logout: clear access token from memory, generate a fresh `session_id` uuid, refetch cart.

---

## 7. API Client Layer (`src/lib/api.ts`)

```ts
type ApiResponse<T> = { success: true; data: T } | { success: false; error: { message: string; code?: string } }

apiFetch<T>(path: string, init?: RequestInit & { auth?: boolean; retry?: boolean }): Promise<T>
```

Behavior:
- Always sends `credentials: 'include'` (refresh cookie).
- Always sends `x-session-id` header if `session_id` cookie present.
- If `auth: true`, injects `Authorization: Bearer ${authStore.accessToken}`.
- On `401` AND `retry !== false`: calls `POST /api/auth/refresh` once. If new token → retry original request. If refresh fails → clear auth store, redirect to `/account/login` (only for protected routes).
- Throws typed `ApiError(status, message, code)` on non-2xx.
- Used by both RSC (forwarding `cookies()`) and client.

Typed wrappers per module: `authApi.login(...)`, `productApi.list(...)`, `cartApi.add(...)`, `paymentApi.createOrder(...)`.

---

## 8. Auth Flow

Storage rules:
- **Access token** (15-min JWT): `auth.store` Zustand state ONLY — never localStorage/sessionStorage.
- **Refresh token**: backend httpOnly cookie. Frontend never reads or sets it.
- **User object**: in `auth.store`.

Bootstrap (in `app/providers.tsx` mount effect):
1. On first client render, `POST /api/auth/refresh` with credentials.
2. If 200 → store accessToken + call `GET /api/auth/me` to populate user.
3. If 401 → remain guest.

Login flow:
1. `LoginForm` posts `POST /api/auth/login`. Body validated client-side with `zod` (mirrors backend schema).
2. On success → store access token + user → trigger cart-merge → redirect.

Logout:
1. `POST /api/auth/logout` (revokes refresh server-side, clears cookie).
2. Clear `auth.store`, regenerate `session_id`, navigate home.

Protected routes (`/account/*`, `/checkout`):
- Client guards: if `auth.store.user === null` after bootstrap → redirect `/account/login?redirectTo=...`.

Token refresh-on-401 handled inside `apiFetch`.

---

## 9. Cart Flow

### Identifiers
- Guest: `middleware.ts` ensures `session_id` cookie (uuid v4, 30-day expiry, `SameSite=Lax`) exists on every request. Sent as `x-session-id` header on cart calls.
- Authed: Bearer token; `x-session-id` continues until merged.

### Endpoints
| Action | Method + path |
|---|---|
| Read cart | `GET /api/cart` |
| Add item | `POST /api/cart/items` body `{ variantId, quantity }` |
| Update qty | `PUT /api/cart/items` body `{ variantId, quantity }` (qty=0 removes) |
| Remove item | `DELETE /api/cart/items/:variantId` |

### UX behavior
- Add-to-Bag (PDP): optimistic insert → fire `POST` → reconcile with server response → open `CartDrawer` → toast "Added to bag".
- Quantity +/-: optimistic; debounce 300ms before PUT; on error revert + toast.
- Remove: optimistic remove + undo toast (5s); after timeout commit DELETE.
- Drawer: focus trap, ESC to close, click backdrop to close, body-scroll lock, `aria-modal="true"`.
- Empty state: `EmptyCart` with "CONTINUE SHOPPING" CTA.

---

## 10. Checkout & Razorpay Flow

### Page sections (mirrors `checkout_final/code.html`)
1. **Contact** — email field + "Log in" link if guest.
2. **Shipping** — country/region, first/last name, address, apt, city, state, zip, phone.
3. **Shipping method** — radio (FREE Standard / $25 Express). UI only until backend shipping endpoint exists.
4. **Payment** — single "Pay with Razorpay" button. Razorpay handles card collection inside its modal.
5. **Right column**: `OrderSummary` (sticky `top-32`).

### Razorpay sequence
1. User clicks "PAY NOW".
2. Frontend validates form (zod, mirroring backend `addressSchema`).
3. `POST /api/payment/create-order` with `{ shippingAddress }`.
4. Backend returns `{ orderId, razorpayOrderId, amount, currency, keyId }`.
5. Ensure Razorpay script loaded (`lib/razorpay.ts#loadRazorpayScript()` — idempotent loader).
6. Open Razorpay checkout:
   ```ts
   const rz = new window.Razorpay({
     key: keyId,
     order_id: razorpayOrderId,
     amount, currency,
     name: 'EGHT Studios',
     prefill: { name, email, contact: phone },
     theme: { color: '#000000' },
     handler: async (resp) => {
       await paymentApi.verify({
         razorpayOrderId: resp.razorpay_order_id,
         razorpayPaymentId: resp.razorpay_payment_id,
         razorpaySignature: resp.razorpay_signature,
       });
       router.push(`/checkout/confirmation/${orderId}`);
     },
     modal: { ondismiss: () => setSubmitting(false) },
   });
   rz.open();
   ```
7. On verify success, navigate to confirmation; clear `cart.store`.
8. On verify failure, toast and remain on checkout.

---

## 11. Product Listing & Filtering

Server-side (RSC `collections/[slug]/page.tsx`):
- Reads `searchParams`: `page`, `search`, `size`, `color`, `sort`.
- Calls `GET /api/products?category={slug}&page=&search=&limit=24` (current backend supports `page`, `limit`, `category`, `search`).
- `size`/`color` filter UI rendered, but client-side filtering is applied to result until backend exposes those facets.
- `sort` is client-side reorder.
- Pagination: "LOAD MORE" button is a client component that increments `page` searchParam.
- `FilterSidebar` is client; uses `useRouter` + `useSearchParams` to update URL.

---

## 12. SEO & Metadata

`src/lib/seo.ts` exposes helpers used by each route's `generateMetadata`:

- **Home**: static metadata.
- **Collection**: `generateMetadata` fetches category, returns title/description/OG.
- **Product**: `generateMetadata` fetches product, returns title `${product.name} — EGHT`, OG image = first image, Twitter card = `summary_large_image`. Page renders `<ProductJsonLd product={product} />` (Schema.org `Product` JSON-LD with offers/image/sku per variant).
- `app/sitemap.ts`: enumerate categories + active products → emit URLs.
- `app/robots.ts`: allow all on prod, disallow `/account`, `/checkout`.

---

## 13. Accessibility Checklist

- All interactive elements keyboard-reachable; visible focus ring (`focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 outline-primary`).
- `Drawer`/`Modal`: focus trap, restore focus on close, `Escape` closes, `aria-modal`, `role="dialog"`, `aria-labelledby`.
- Cart trigger announces count: `aria-label="Cart, 2 items"`.
- Form fields: `<label for=>` paired with `id`; errors via `aria-describedby`; `aria-invalid` on error.
- Color swatches: `aria-label` with color name; selected via `aria-pressed`.
- Size buttons: `aria-disabled="true"` + SR text "Out of stock".
- Marquee: `aria-hidden="true"`.
- Images: meaningful `alt`; decorative bg → `alt=""`.
- Skip-to-content link in root layout.
- Color contrast: black-on-white passes; muted-orange CTAs verified.

---

## 14. Responsive Breakpoints

Tailwind defaults: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`. Site max-width container `1440px`.

| Page | Mobile (< md) | Tablet (md) | Desktop (lg+) |
|---|---|---|---|
| Navbar | Logo center, hamburger left, bag right | Logo + bag (links hidden) | Full inline links |
| Homepage hero | `h-[60vh]` min; headline `text-7xl` | `h-[80vh]` | `h-[921px]`, headline `text-display-xl` |
| New Arrivals grid | 1-col stack | 1-col | 12-col asymmetric (7/1/4) |
| Collection | Filters → top sheet | 2-col grid | Sidebar + 3-col grid |
| PDP | Stacked gallery + info | Stacked | 8/4 split, info sticky |
| Cart drawer | Full-width up to 480px | 480px | 480px |
| Checkout | Stacked, summary bottom | Stacked | 7/5 split, summary sticky |
| Footer | Stacked, centered | Stacked | Row, justify-between |

---

## 15. Performance

- **Images**: `next/image` everywhere; `priority` on hero only; `sizes` per breakpoint; image domains whitelisted in `next.config.ts`.
- **Fonts**: `next/font/google` Inter, `display: 'swap'`, weights `400, 600, 700, 900`, CSS variable `--font-inter`.
- **RSC vs Client split**:
  - RSC: home, collections list, collection detail, product detail, confirmation page, sitemap/robots.
  - Client: Navbar (cart count), Marquee, CartTrigger, CartDrawer, FilterSidebar, SortBar, LoadMore, all forms, ProductDetailClient, RazorpayLauncher, all `/account/*` and `/checkout/*` interactivity.
- **Route segments**: `(shop)` group keeps shop layout out of `/checkout` and `/account`.
- **Caching**: RSC fetches use `next: { revalidate: 60 }` for product/collection lists; product detail `revalidate: 300`.
- **Code splitting**: `RazorpayLauncher` dynamically imported with `ssr: false`.

---

## 16. Build Order / Phased Rollout

**Phase 1 — Foundations** (1–2 days)
- Scaffold Next.js 15 + TS + Tailwind v4 in `frontend/`.
- Wire `next/font` Inter, write `globals.css` with `@theme` tokens.
- `lib/env.ts`, `lib/api.ts` skeleton, `types/api.ts`.
- `middleware.ts` for `session_id` cookie.
- `app/providers.tsx` + Zustand stores.
- `Navbar`, `Marquee`, `Footer`, `(shop)/layout.tsx`.

**Phase 2 — Homepage**
- `Hero`, `NewArrivalsAsymmetric`, `ManifestoSection`.
- RSC fetches `GET /api/products?limit=8`.
- `ProductCardLarge` + `ProductCard`.

**Phase 3 — Collections + PDP**
- `/collections` index, `/collections/[slug]` with `FilterSidebar`, `SortBar`, `ProductGrid`, `LoadMore`.
- `/products/[slug]` with `ProductGallery`, `ColorSwatches`, `SizeSelector`, `Accordion`, `CompleteTheLook`.
- `generateMetadata` for both.

**Phase 4 — Cart Drawer**
- `Drawer` primitive (focus trap, a11y).
- `CartDrawer`, `CartItemRow`, `CartFooter`, `EmptyCart`, `CartTrigger`.
- Optimistic `cart.store` actions; debounce qty PUT.
- Wire `AddToBagButton` from PDP.

**Phase 5 — Auth Screens**
- `LoginForm`, `RegisterForm` with zod + RHF.
- `auth.store` bootstrap effect (silent refresh).
- 401 retry interceptor.
- Cart-merge handshake on login.
- `/account/orders`, `/account/orders/[id]`, `/account/addresses`.

**Phase 6 — Checkout + Razorpay**
- `/checkout` page with all sections.
- `lib/razorpay.ts` script loader.
- `RazorpayLauncher` (dynamic import, `ssr: false`).
- `POST /payment/create-order` → modal → `/payment/verify` → confirmation.
- `/checkout/confirmation/[orderId]` RSC.

**Phase 7 — SEO & polish**
- `sitemap.ts`, `robots.ts`, `ProductJsonLd`.
- OG images per product/collection.
- Loading skeletons + `error.tsx` boundaries.

**Phase 8 — A11y, perf, QA**
- Axe pass on all pages; keyboard tour for drawer/modal.
- Lighthouse: target ≥ 90 perf/SEO/a11y.

---

## 17. Locked Decisions & Backend Implications

**RESOLVED:**
1. **Cart merge** — Backend handles it. Cart service must auto-merge `session_id` cart into user cart on first authenticated `GET /api/cart`. Frontend just continues sending `x-session-id` header alongside the Bearer token until cart returns 200, then deletes the cookie.
2. **Shipping & tax** — Backend computes both. Frontend sends `{ shippingAddress }` to `POST /api/payment/create-order` and renders whatever totals the backend returns. `OrderSummary` reads `subtotal`, `shipping`, `tax`, `total` from a backend totals endpoint (`GET /api/cart/totals?countryCode=&pincode=`) so the user sees live values before paying.
3. **Currency & country** — Multi-country. Default = **India (INR)**. Detection priority:
   1. User-selected (cookie `country=IN|US|...`)
   2. Pincode/zip on entered shipping address (overrides on form change)
   3. IP geolocation (server-side via Vercel `request.geo.country` or a free GeoIP service) on first visit
   Frontend shows currency symbol + price formatted per locale. Backend stores prices in INR canonical and returns converted display price keyed on requested country, OR stores per-currency price columns — backend team to decide. **Backend must add a country/currency field to product responses and `/cart/totals` must accept country.**
4. **Image hosting** — **AWS S3 or Cloudinary** (final pick deferred to deploy phase). `next.config.ts` `remotePatterns` will whitelist both `*.amazonaws.com` and `res.cloudinary.com`.

**Backend additions implied by these decisions (must be built in parallel with frontend):**
- Cart auto-merge logic in `cart.service.js`.
- New endpoint `GET /api/cart/totals?country=&pincode=` returning `{ subtotal, shipping, tax, total, currency }`.
- Country/currency support in product list + product detail responses.
- IP geolocation helper (or rely on Vercel headers).

**Razorpay response shape** — `payment.service.js` already returns `{ orderId, razorpayOrderId, amount, currency, keyId }` (verified in `backend/src/modules/payment/payment.service.js:36-44`). No change needed.

**Scope decisions (deferred — default OUT for v1 unless confirmed later):**
- Discount/coupon codes
- Search (modal vs page)
- Wishlist / favorites
- Product reviews
- Newsletter signup
- Editorial / Lookbook page
- About page
- Color/size filter facets (backend support vs client-side filter)

---

## Critical Files for Implementation
- `/frontend/src/app/globals.css`
- `/frontend/src/lib/api.ts`
- `/frontend/src/store/cart.store.ts`
- `/frontend/src/store/auth.store.ts`
- `/frontend/src/components/checkout/RazorpayLauncher.tsx`
