# Luxe Accessory Haven — Backend

Simple Node/Express backend that provides product and order APIs using file-based JSON storage.

Quick start (Windows PowerShell):

```powershell
cd backend
npm install
npm run dev
```

APIs:
- `GET /api/products` — list products
- `GET /api/products/:id` — product details
- `POST /api/orders` — create an order (body: `{ items: [{ id, quantity }], customer, address, paymentMethod }`)
- `GET /api/orders/:id` — get order by id

Data files live in `backend/data/` (`products.json`, `orders.json`).

Notes:
- This is a minimal starter backend for local development. For production, replace file storage with a real DB and add authentication/payment integrations.
