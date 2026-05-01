# EGHT — Project Context & Architecture Brain

## Project Overview
**Brand:** EGHT Studios — Premium Streetwear E-Commerce
**Goal:** Fully functional e-commerce store with custom backend API and Next.js frontend
**Root Directory:** `/Users/harshilvalecha/harshil /development/eght/`

---

## Tech Stack (LOCKED)

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 15 (App Router) | SSR, SEO-optimized |
| Styling | Tailwind CSS + EGHT Design System | No component library |
| Backend | Node.js + Express.js | Feature-based module architecture |
| Database | PostgreSQL (raw `pg`) | No Prisma, no ORM — raw SQL |
| Auth | JWT | Access + refresh token pair |
| Payments | Razorpay | India-first payment gateway |
| Image Storage | Cloudinary | Signed uploads via `/api/admin/uploads/sign`. Requires `CLOUDINARY_*` env. |

---

## Project Structure

```
eght/
├── frontend/          ← Next.js 15 App Router
├── backend/           ← Express.js + raw pg
├── agent_sop.md
└── gyaan_context.md   ← THIS FILE (always update after decisions)
```

---

## Backend Architecture

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js          # pg Pool connection
│   │   └── env.js         # env validation
│   ├── modules/
│   │   ├── auth/          # register, login, refresh, logout
│   │   ├── product/       # CRUD, variants, inventory
│   │   ├── cart/          # add, remove, update qty
│   │   ├── order/         # create, list, detail, status
│   │   ├── payment/       # Razorpay order create + webhook verify
│   │   └── user/          # profile, address management
│   ├── middlewares/
│   │   ├── auth.middleware.js     # JWT verify
│   │   ├── error.middleware.js    # Global error handler
│   │   └── validate.middleware.js # Joi/Zod request validation
│   ├── utils/
│   │   ├── logger.js      # structured logging (winston or pino)
│   │   └── helpers.js     # shared utilities
│   ├── app.js             # Express app setup
│   └── server.js          # Entry point
├── migrations/            # Raw SQL migration files
├── tests/
├── .env
└── package.json
```

---

## Frontend Architecture

```
frontend/
├── app/
│   ├── page.tsx              # Homepage
│   ├── collections/
│   │   └── [slug]/page.tsx   # Collection page
│   ├── products/
│   │   └── [slug]/page.tsx   # Product detail page
│   ├── checkout/
│   │   └── page.tsx          # Checkout
│   ├── account/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── orders/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/                   # Primitives (Button, Input, etc.)
│   ├── cart/                 # CartDrawer, CartItem
│   ├── product/              # ProductCard, ProductGallery, SizeSelector
│   ├── layout/               # Navbar, Footer, Marquee
│   └── checkout/             # CheckoutForm, OrderSummary
├── lib/
│   ├── api.ts                # Axios/fetch API client
│   ├── auth.ts               # JWT token management
│   └── store/                # Zustand cart + auth state
└── types/                    # Shared TypeScript types
```

---

## Database Schema (PostgreSQL — Raw SQL)

### Tables
- `users` — id, email, password_hash, first_name, last_name, role, created_at
- `refresh_tokens` — id, user_id, token_hash, expires_at, revoked
- `products` — id, name, slug, description, price, compare_price, images[], category_id, is_active, created_at
- `product_variants` — id, product_id, size, color, sku, stock_qty
- `categories` — id, name, slug, description
- `carts` — id, user_id (nullable for guest), session_id, created_at
- `cart_items` — id, cart_id, variant_id, quantity
- `orders` — id, user_id, status, total_amount, razorpay_order_id, shipping_address, created_at
- `order_items` — id, order_id, variant_id, quantity, unit_price
- `addresses` — id, user_id, line1, line2, city, state, pincode, is_default

---

## Auth Strategy (JWT)
- **Access token:** 15 minutes, signed with `JWT_SECRET`
- **Refresh token:** 7 days, stored in DB (`refresh_tokens` table), hash stored (not raw)
- **Delivery:** Access token in response body, refresh token in `httpOnly` cookie
- **Routes:** POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/logout

---

## Payment Flow (Razorpay)
1. Frontend calls POST /payment/create-order → backend creates Razorpay order → returns `razorpay_order_id`
2. Frontend opens Razorpay checkout modal
3. On success, frontend sends `razorpay_payment_id + razorpay_order_id + razorpay_signature` to POST /payment/verify
4. Backend verifies HMAC signature → marks order as `paid` → returns order confirmation
5. Webhook endpoint `/payment/webhook` handles async events (refunds, failures)

---

## Design System (EGHT)
- **Primary:** #000000 (black)
- **Accent:** #D97706 (muted orange — CTAs, limited labels only)
- **Background:** #F9F9F9
- **Font:** Inter (400, 600, 700, 900)
- **Corners:** Sharp (0px radius) — brand requirement
- **Layout:** 12-column grid, 40px margins, 120px section gaps
- **Reference files:** `stitch_eght_premium_streetwear_experience/` — 5 HTML mockups + DESIGN.md

---

## Key Decisions Log
| Date | Decision | Reason |
|---|---|---|
| 2026-04-28 | No Prisma — raw `pg` | User preference, simpler, full SQL control |
| 2026-04-28 | Razorpay over Stripe | India-first market |
| 2026-04-28 | JWT with httpOnly refresh cookie | Security best practice |
| 2026-04-28 | Next.js App Router | SSR for SEO on product/collection pages |
| 2026-04-28 | Feature-based backend modules | Scalability, separation of concerns |
| 2026-05-01 | Cloudinary for image hosting | Free tier, on-the-fly transformations, simpler than S3 IAM. Backend will upload via signed URL + `CLOUDINARY_*` env vars when upload UI is built. `next.config.ts` already whitelists `res.cloudinary.com`. |
| 2026-05-01 | Multi-currency canonical = INR + FX table | Backend stores INR; product list/detail and `/cart/totals` return `currency` + converted display amounts via fixed-rate `COUNTRIES` table in `backend/src/utils/pricing.js`. Razorpay always charges INR (paise). |
| 2026-05-01 | Country detection via cookie + IP geo | `proxy.ts` seeds `country` cookie from `x-vercel-ip-country` / `cf-ipcountry`; user override stored back to cookie; backend `resolveCountry(req)` reads query → cookie → header → default IN. |
| 2026-05-01 | `force-dynamic` retained on shop pages | Justified: product prices now vary per-request by country cookie/IP. Static prerender would cache INR-only HTML for all visitors. Build-time timeout that originally prompted the flag is also addressed since dynamic pages skip prerender entirely. |

---

## Session Log
### Session 1 — 2026-04-28
- Read agent_sop.md, locked full tech stack
- Defined architecture for both frontend and backend
- Wrote this context file
- Built complete backend: Express app, all 6 modules (auth, product, cart, order, payment, user), raw SQL migrations, JWT auth, Razorpay payment flow

### Session 2 — 2026-04-28
- Wrote `plan.md` — full frontend implementation plan (17 sections, 8 phases)
- Resolved 4 blockers: cart-merge (backend handles), shipping/tax (backend), multi-country/INR default, AWS S3 or Cloudinary images
- **Phase 1 COMPLETE:**
  - Next.js 16.2.4 scaffolded in `frontend/`
  - Deps: zustand, react-hook-form, @hookform/resolvers, zod, uuid
  - `globals.css` — full EGHT `@theme` design tokens (colors, radii 0px, spacing, typography utilities)
  - `layout.tsx` — Inter font via next/font, skip-to-content, Providers wrapper
  - `proxy.ts` — guest session_id cookie (Next.js 16 renamed middleware → proxy)
  - `lib/env.ts`, `lib/api.ts` (typed fetch wrapper + module wrappers), `lib/session.ts`, `lib/country.ts`, `lib/format.ts`
  - `store/auth.store.ts`, `store/cart.store.ts`, `store/ui.store.ts`
  - `components/layout/Navbar.tsx`, `Marquee.tsx`, `Footer.tsx`, `CheckoutHeader.tsx`
  - `app/(shop)/layout.tsx` — shop route group with Navbar + Marquee + Footer
  - `app/checkout/layout.tsx` — stripped checkout chrome
  - `app/providers.tsx` — silent refresh bootstrap on mount
  - `error.tsx`, `not-found.tsx`, `loading.tsx`
  - Build: ✅ clean, lint: ✅ 0 errors 0 warnings
- **Next:** Phase 2 — Homepage (Hero + NewArrivalsAsymmetric + ManifestoSection)

### Session 3 — 2026-04-28
- Phase 2 confirmed complete (Hero, NewArrivalsAsymmetric, ManifestoSection, ProductCard, ProductCardLarge, ProductGrid, PriceTag were already scaffolded)
- **Phase 3 COMPLETE:**
  - `/collections` index — category grid with links
  - `/collections/[slug]` — FilterSidebar (category nav + UI-only size/color) + CollectionGrid (sort + load more)
  - `/products/[slug]` — ProductGallery (vertical stack) + ProductDetailClient (ColorSwatches, SizeSelector, AddToBagButton stub, Accordion)
  - `CompleteTheLook` section on PDP
  - `generateMetadata` on both routes
  - Fixed `CollectionGrid` to use `env.apiUrl` instead of raw `process.env`
  - Backend `.env` created, migrations run, seed data loaded (3 categories, 6 products, full variant/stock data)
  - All routes verified end-to-end: collections, collection detail, PDP
- **Next:** Phase 4 — Cart Drawer (Drawer primitive, CartDrawer, CartItemRow, CartFooter, EmptyCart, CartTrigger, wire AddToBagButton)

### Session 4 — 2026-04-28
- **Phase 4 COMPLETE:**
  - `types/cart.ts` — `RawCartItem`, `CartApiResponse` shapes matching backend
  - `lib/cart-utils.ts` — `mapCartItem` / `mapCartResponse` (snake_case → camelCase, price string → float)
  - `lib/api.ts` — typed `cartApi` (get returns `CartApiResponse`, mutations return `RawCartItem[]`)
  - `components/ui/Drawer.tsx` — focus trap, ESC, backdrop click, body-scroll lock, `createPortal`, `aria-modal`
  - `components/ui/Toaster.tsx` — live region toast renderer from `ui.store`
  - `components/cart/EmptyCart.tsx` — empty state with continue shopping CTA
  - `components/cart/CartItemRow.tsx` — optimistic qty +/- (debounce 300ms), immediate remove, sync via `cartApi.get()` reconcile
  - `components/cart/CartFooter.tsx` — subtotal + checkout CTA
  - `components/cart/CartDrawer.tsx` — composes Drawer + header + item list + footer + loading spinner
  - `components/product/AddToBagButton.tsx` — wired: optimistic add → `cartApi.add` → `cartApi.get()` reconcile → open drawer → toast
  - `app/(shop)/products/[slug]/ProductDetailClient.tsx` — builds `bagItem` (full CartItem shape) and passes to AddToBagButton
  - `app/(shop)/layout.tsx` — mounts `<CartDrawer />`
  - `app/providers.tsx` — mounts `<Toaster />`
  - Build: ✅ clean (TypeScript + Next.js 16.2.4)
- **Next:** Phase 5 — Auth screens (LoginForm, RegisterForm, 401 retry, cart-merge, account pages)

### Session 5 — 2026-04-28
- **Phase 5 COMPLETE:**
  - `backend/cart.service.js` — cart auto-merge on first authed GET (mergeGuestCart called when userId + sessionId both present)
  - `types/user.ts` — BackendUser (snake_case), Address
  - `types/order.ts` — Order, OrderItem, OrderSummary
  - `lib/auth-utils.ts` — mapUser (snake_case → camelCase AuthUser)
  - `lib/api.ts` — all APIs fully typed: authApi, cartApi, userApi, orderApi
  - `app/providers.tsx` — fixed: now uses mapUser to properly map backend user on silent refresh
  - `components/ui/Input.tsx` — label, error, aria-invalid, aria-describedby
  - `components/ui/Button.tsx` — primary/secondary/ghost, loading spinner
  - `components/account/LoginForm.tsx` — zod+RHF, cart-merge on login, clearSessionId after merge
  - `components/account/RegisterForm.tsx` — same flow as login after register
  - `components/account/AuthGuard.tsx` — bootstrapping spinner, redirect to /account/login?redirectTo=... if no user
  - `components/account/AccountSidebar.tsx` — user info, nav links, logout (clears auth + regen session + refresh guest cart)
  - `components/account/OrdersList.tsx` — list with status badge, amount, date
  - `components/account/OrderDetail.tsx` — items, total, shipping address, back link
  - `components/account/AddressCard.tsx` — display + delete
  - `app/account/layout.tsx` — thin passthrough (no shared chrome; login/register are full-page, orders/addresses include sidebar)
  - `app/account/login/page.tsx` — centered form, Suspense wrapper for useSearchParams
  - `app/account/register/page.tsx` — centered form
  - `app/account/orders/page.tsx` — AuthGuard + AccountSidebar + OrdersList (client fetch)
  - `app/account/orders/[id]/page.tsx` — AuthGuard + AccountSidebar + OrderDetail (client fetch)
  - `app/account/addresses/page.tsx` — AuthGuard + AccountSidebar + AddressCard list + add form
  - Build: ✅ clean (TypeScript + Next.js 16.2.4), all 10 routes generated
- **Next:** Phase 6 — Checkout + Razorpay (checkout page, lib/razorpay.ts, RazorpayLauncher, confirmation page)

### Session 6 — 2026-04-29
- **Site Audit & Bug Fixes:**
  - Audited site using a browser subagent and found several dead clicks, 404s, and broken images.
  - Fixed 404 for `/collections/new-arrivals` by explicitly routing it to load the newest 24 products without a category filter in `app/(shop)/collections/[slug]/page.tsx`.
  - Created placeholder static pages for `/editorial`, `/about`, `/privacy`, `/terms`, `/shipping`, and `/stores` using consistent prose-invert styling.
  - Fixed a silent failure of `next/image` on the homepage by directly updating the `wide-leg-trouser` database record with a valid Unsplash image URL.
  - Solved a Next.js hydration mismatch error on the `<body>` tag caused by browser extensions injecting `__processed_xxx` attributes. Added `suppressHydrationWarning` to `<html>` and `<body>` in `layout.tsx`.

### Session 7 — 2026-05-01 (Phase 7 leftovers + Phase 8 + multi-currency)
- **Phase 7 leftovers (commit `8e5845b`):**
  - `components/seo/BreadcrumbJsonLd.tsx` — wired into product + collection pages.
  - `components/seo/CollectionJsonLd.tsx` (CollectionPage + ItemList) — wired into `/collections/[slug]`.
  - `app/opengraph-image.tsx` + `app/twitter-image.tsx` — branded default OG via `next/og` ImageResponse (system font, no external file deps).
  - Root `layout.tsx` metadata: `metadataBase`, `twitter` card, `openGraph.url`, `robots`.
  - `error.tsx` + `loading.tsx` boundaries for `/account` and `/checkout` (parity with shop tree).
- **Phase 8 a11y (same commit):**
  - Global `prefers-reduced-motion` CSS rule + Drawer `motion-reduce:` modifiers.
  - Removed dead Search button from Navbar (no v1 search → focus trap removed).
  - `<h1 className="sr-only">Checkout</h1>` on checkout page.
  - `OrderDetail` header `<p>` → `<h1>` (heading hierarchy).
  - Drawer `setState`-in-effect React 19 lint error fixed via `useSyncExternalStore` SSR-safe pattern.
  - ESLint config: `_`-prefix exemption for unused vars.
- **Backend multi-currency + totals (commit `08ed707`):**
  - `backend/src/utils/pricing.js` — `COUNTRIES` table (IN/US/GB/AE), `computeTotals`, `resolveCountry`, `detectCountryFromHeaders`. Tax: GST 18% IN, VAT 20% GB, 5% AE, 0% US. Shipping: IN ₹99 (free ≥ ₹2000), intl ₹2500 (free ≥ ₹15000).
  - `GET /api/cart/totals?country=&pincode=` returns `{country, currency, taxLabel, subtotal, shipping, tax, total, ...Inr canonical}`.
  - Product list/detail return `currency`, `display_price`, `display_compare_price` per resolved country.
  - `payment.service.createPaymentOrder` charges via `computeTotals` (single source of truth) + returns `breakdown`. Razorpay still charges INR paise.
  - Payment route: phone 7-20, postal 3-12 (international), `country` 2-letter optional.
  - Frontend: `proxy.ts` seeds `country` cookie from `x-vercel-ip-country` / `cf-ipcountry` headers; `cartApi.totals(...)`; `OrderSummary` rewritten to fetch totals + show tax label; checkout disables Pay until totals load + shows server total in user currency; `ShippingMethodSelect` retired (server picks shipping in v1); pincode validation country-aware.
- **Display prices + FX + uploads + switcher (commit `35eb39f`):**
  - `backend/src/config/fx.js` — FX rates per 1 INR with `FX_RATES` JSON env override + `FX_UPDATED_AT` stamp.
  - `pricing.js` refactored: `COUNTRY_RULES` composes tax + FX from config.
  - `GET /api/config/fx` → `{defaultCountry, updatedAt, countries[]}`.
  - `POST /api/admin/uploads/sign` (admin-only, JWT) — Cloudinary signed-upload signature using `CLOUDINARY_*` env. Returns 503 if not configured. Schema: `{folder, publicId?}`.
  - `.env.example` documents `CLOUDINARY_*` + optional `FX_RATES` JSON.
  - Frontend `store/fx.store.ts` — Zustand: `config`, `country`, `meta()`, `convert(inr) → {amount, currency, symbol}`.
  - `providers.tsx` bootstraps FX + reads country cookie at mount.
  - `PriceTag` resolution order: backend `display_price` → client FX convert → INR canonical.
  - `ProductCard`, `ProductCardLarge`, `ProductDetailClient` pass display fields through.
  - `CartItemRow` + `CartFooter` use FX `convert()` for per-line + subtotal.
  - `format.formatCurrency` locale-aware (en-US, en-GB, en-AE, en-IN).
  - `components/layout/CountrySwitcher.tsx` — accessible listbox in Footer; sets cookie, reloads page.
  - `lib/api.ts` adds `configApi.fx()` + `uploadApi.sign()`.
- **Verify:** lint clean, `next build` green, 17 routes incl. `/opengraph-image` + `/twitter-image`. Backend `node --check` clean on all touched files. Pricing util smoke confirmed (IN ₹3000→₹3540, US ₹5000→$90, GB ₹20000→£228).
- **Loose ends remaining:**
  - Admin upload UI (route exists; no consumer yet).
  - FX cron job (env-only override; auto-refresh deferred until rate provider picked).
  - Cart/Order persisted records still INR canonical; display only converts client-side.

## Next.js Version Note
Running **Next.js 16.2.4** (not 15). Key differences:
- `middleware.ts` renamed to `proxy.ts`, export named `proxy` (not `middleware`)
- Otherwise App Router API is the same
