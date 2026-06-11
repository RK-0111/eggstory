# The Daily Yolk — Farm Fresh Eggs Store

A full-stack e-commerce platform for selling free range brown eggs and quail eggs online, with Razorpay checkout.

## What's inside

```
eggs-platform/
├── backend/          Express API server (Node.js)
│   └── src/
│       ├── server.js            starts the server
│       ├── app.js               express app: middleware + route mounting
│       ├── config/index.js      reads .env (port, Razorpay keys, CORS)
│       ├── data/products.js     product catalog — SINGLE SOURCE OF TRUTH for prices
│       ├── routes/              URL definitions, one file per module
│       ├── controllers/         translate HTTP <-> service calls, one per module
│       ├── services/            business logic (products, payments, orders)
│       ├── events/bus.js        pub-sub bus — publishes stock/order events
│   └── admin/index.html         OWNER APP: live stock manager at /admin
│       ├── middleware/          error handling
│       └── utils/               helpers
│
└── frontend/         React app (Vite)
    └── src/
        ├── main.jsx             entry point
        ├── App.jsx              page composition — sections plug in here
        ├── styles/tokens.css    brand colors & fonts (change the look in one file)
        ├── styles/global.css    all component styles
        ├── api/                 the ONLY place that talks to the backend
        ├── context/             cart state (React Context + reducer)
        ├── hooks/useRazorpay.js loads & opens Razorpay Checkout
        ├── components/          Navbar, Hero, ProductCard, CartDrawer, ...
        └── utils/               formatting helpers
```

## Running it locally

You need Node.js 18+ installed.

**1. Backend**

```bash
cd backend
npm install
cp .env.example .env        # then edit .env and paste your Razorpay keys
npm run dev                 # starts on http://localhost:5000
```

**2. Frontend** (in a second terminal)

```bash
cd frontend
npm install
npm run dev                 # starts on http://localhost:5173
```

Open http://localhost:5173 — the Vite dev server proxies every `/api` request to the backend automatically.

## The stock manager (owner app)

While the backend is running, open **http://localhost:5000/admin**.
You'll see every product with +/− buttons and a number field. Any change
you save is published on the backend's pub-sub bus and pushed instantly
(via Server-Sent Events) to every open browser — the storefront shows
"Only N left today" or "Out of stock" without anyone refreshing. Paid
orders also stream into the admin page live, and each sale automatically
reduces stock.

Note: stock currently lives in memory, so a backend restart reloads the
numbers written in `data/products.js`. Treat that file as your morning
stock count and the admin app as same-day adjustments. Before deploying
to the internet, add admin authentication to `/admin` and the
`PATCH /api/products/:id/stock` route.

## Adding your Razorpay keys

1. Sign in at https://dashboard.razorpay.com
2. Go to **Settings → API Keys → Generate Test Key** (use Test mode first!)
3. Paste both values into `backend/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
   ```
4. Restart the backend. That's it — the frontend never sees the secret key;
   it receives only the public key id from the create-order response.

In Test mode you can complete fake payments with Razorpay's test cards/UPI.
When ready to take real money, generate Live keys, complete Razorpay KYC,
and swap the values in `.env`.

## How a payment works (the full flow)

1. Customer adds packs to the cart and taps **Pay** in the cart drawer.
2. Frontend `POST /api/payments/create-order` with `{productId, quantity}` items only — **no prices**. The backend recalculates the total from `data/products.js`, so nobody can pay ₹1 for a 30-pack by editing the browser.
3. Backend asks Razorpay to create an order and returns `{orderId, amount, keyId}`.
4. Frontend opens Razorpay Checkout (UPI / cards / netbanking / wallets).
5. After payment, Razorpay hands the browser a `payment_id` + cryptographic `signature`.
6. Frontend `POST /api/payments/verify` — backend recomputes the HMAC-SHA256 signature with the secret key. Match → order marked **paid**. No match → rejected.

## Adding a new module (example: delivery tracking)

Backend — three small files plus one line:
1. `services/delivery.service.js` — the logic
2. `controllers/delivery.controller.js` — request/response handling
3. `routes/delivery.routes.js` — the URLs
4. Mount in `routes/index.js`: `router.use('/delivery', deliveryRoutes);`

Frontend:
1. `api/delivery.js` — fetch functions
2. `components/DeliveryTracker.jsx` — the UI
3. Drop the component into `App.jsx`

## Changing products or prices

Edit `backend/src/data/products.js` only. The frontend fetches the catalog
at load, so prices update everywhere automatically.

## Going to production (later)

- Replace the in-memory order store (`services/orders.service.js`) with a database (MongoDB/Postgres) — only that file changes.
- Add a Razorpay **webhook** endpoint as a backup for payment confirmation (handles cases where the customer's browser closes mid-payment).
- Host the backend (Render/Railway/EC2) and the frontend (Vercel/Netlify), set `VITE_API_URL` to the backend URL and `CORS_ORIGIN` to the frontend URL.
- Protect `GET /api/orders` with admin authentication before deploying.

## Renaming the brand

Search for "The Daily Yolk" across the project (it appears in `index.html`,
`Navbar.jsx`, `Footer.jsx`, `useRazorpay.js`) and replace with your brand name.
Colors and fonts live in `frontend/src/styles/tokens.css`.
