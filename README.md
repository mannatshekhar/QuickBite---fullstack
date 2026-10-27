# 🍔 QuickBite - MERN Food Ordering App

A full-stack food ordering web app inspired by Zomato and Swiggy. Customers browse a menu, sign up, pay online and track their order live. The restaurant owner manages dishes and orders from an admin panel.

**Stack:** React (Vite) · Tailwind CSS · Node.js · Express · MongoDB Atlas · JWT · Razorpay (test mode)

## 🎥 Demo Video
[▶ Watch the QuickBite demo](https://drive.google.com/file/d/1D7xcVzHjXeVPFSkVqeFR_5tizBYUFESL/view?usp=sharing)

## 🌐 Live Site
https://your-vercel-link.vercel.app

> The backend runs on Render's free plan, so the first load after a break can take about 50 seconds.

## ✨ Features
- Menu with search, categories and a veg-only filter
- Cart with quantity controls, free-delivery progress bar and fee calculation
- Sign up and login (bcrypt password hashing and JWT sessions)
- Checkout with Cash on Delivery or online payment through Razorpay (test mode)
- My orders page with a live status tracker (Placed, Preparing, Out for delivery, Delivered)
- Admin panel: dashboard stats, order status updates, add, hide and delete dishes

## 🛠️ Run it locally

1. **Add your Atlas connection string** in `server/.env`:
   ```
   MONGO_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/quickbite?retryWrites=true&w=majority
   ADMIN_KEY=choose-a-passcode
   JWT_SECRET=any-long-random-text
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   RAZORPAY_KEY_SECRET=your_test_secret
   CLIENT_ORIGIN=http://localhost:5173
   ```
   - In Atlas, go to *Network Access* and allow access from anywhere (`0.0.0.0/0`).
   - If your password has special characters (`@ : / #`), URL-encode them (`@` becomes `%40`).
2. **Install everything:** `npm run install:all`
3. **Start both servers:** `npm run dev`

Open http://localhost:5173. The API runs on http://localhost:5000 (health check: `/api/health`).
On first start the empty database is seeded with 18 dishes. Re-seed any time with `npm run seed`.

**Test payment:** card `4111 1111 1111 1111`, any future expiry, any CVV, or UPI ID `success@razorpay`.

## 📄 Pages
| Route | What it does |
|---|---|
| `/` | Hero, categories, search, veg filter, chef's picks, menu, cart drawer |
| `/login` | Sign up and sign in |
| `/checkout` | Delivery details, payment (COD or Razorpay), places the order in MongoDB |
| `/orders` | Your order history with a live status tracker (refreshes automatically) |
| `/admin` | Passcode from `ADMIN_KEY`: stats, update order status, manage dishes |

## 🔌 API
- `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/foods?q=&category=&veg=true` - menu
- `POST /api/orders` - place an order (login required, prices recalculated from the database)
- `GET /api/orders` - the signed-in user's orders
- `POST /api/payments/create`, `POST /api/payments/verify` - Razorpay order and signature check
- Admin (header `x-admin-key`): `POST/PUT/DELETE /api/foods`, `GET /api/orders/admin/all`, `PATCH /api/orders/:id/status`

## 💰 Pricing rules (`server/pricing.js`)
Delivery fee ₹40, free above ₹499, taxes 5%.

## 🧠 How it works
- **Frontend:** React Router pages, Context API for cart and auth, Axios API layer, Tailwind styling.
- **Backend:** Express REST API with Mongoose models `Food`, `Order` and `User`. Protected routes use JWT, and admin routes use a passcode header.
- **Security:** the client sends only dish IDs and quantities. The server looks up the real prices in MongoDB, so totals can't be tampered with. Razorpay payments are confirmed by verifying the payment signature on the server.
- **Deployment:** frontend on Vercel, backend on Render, database on MongoDB Atlas.

## 🚀 Future improvements
Coupon codes, ratings and reviews, multiple restaurants, and live delivery tracking with WebSockets.