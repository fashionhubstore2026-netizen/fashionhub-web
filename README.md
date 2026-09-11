# FashionHub Customer Web

Next.js customer storefront for the FashionHub multi-vendor fashion marketplace.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Runs at http://localhost:3000

## Environment

- `NEXT_PUBLIC_API_URL` — Backend API base URL (default: `http://localhost:4000/api/v1`)

## Scripts

- `pnpm dev` — Development server
- `pnpm build` — Production build
- `pnpm lint` — ESLint
- `pnpm typecheck` — TypeScript check

## Features

Home, categories, product listing/search, product details, cart, wishlist, auth, account, checkout (Razorpay + COD), orders.
