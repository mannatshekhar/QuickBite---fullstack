# QuickBite - MERN Food Ordering App

React + Vite + Tailwind | Node + Express | MongoDB Atlas

## Run it (3 steps)

1. **Add your Atlas connection string** in `server/.env`:
   ```
   MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/quickbite?retryWrites=true&w=majority
   ```
   - Atlas -> *Database* -> *Connect* -> *Drivers* -> copy the string, and add `/quickbite` before the `?`
   - Atlas -> *Network Access* -> *Add IP Address* -> *Allow access from anywhere*
   - If your password has special characters (`@ : / #`), URL-encode them (`@` becomes `%40`)
2. **Install everything:** `npm run install:all`
3. **Start both servers:** `npm run dev`

Open http://localhost:5173. The API runs on http://localhost:5000 (health check: `/api/health`).
On first start the empty database is auto-seeded with 18 dishes. Re-seed any time with `npm run seed`.

## Pages
| Route | What it does |
|---|---|
| `/` | Hero, categories, search, veg filter, chef's picks, menu, cart drawer |
| `/checkout` | Delivery details, simulated payment (COD / UPI / Card), places order in MongoDB |
| `/orders` | Order history by phone number with live status tracker (auto-refreshes) |
| `/admin` | Passcode `quickbite-admin` (change `ADMIN_KEY` in `server/.env`): stats, update order status, add/hide/delete dishes |

## API
- `GET /api/foods?q=&category=&veg=true` - menu
- `POST /api/orders` - place order (server recalculates prices from DB)
- `GET /api/orders?phone=` - order history
- Admin (header `x-admin-key`): `POST/PUT/DELETE /api/foods`, `GET /api/orders/admin/all`, `PATCH /api/orders/:id/status`

## Pricing rules (server/pricing.js)
Delivery fee ₹40, free above ₹499, taxes 5%.

## Project explanation (for your viva/demo)
- **Frontend:** React Router pages, Context API cart (persisted in localStorage), Axios API layer, Tailwind styling.
- **Backend:** Express REST API, Mongoose models `Food` and `Order`, admin routes protected by a passcode header.
- **Security detail worth mentioning:** the client sends only dish IDs and quantities; the server looks up real prices in MongoDB, so totals can't be tampered with.
- **Payments:** simulated on purpose (no real gateway).
- **Next steps:** JWT user auth, real payments (Razorpay), live order updates with WebSockets.
