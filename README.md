# 📚 BookHaven — Full-Stack Book Store

> A production-grade, full-stack e-commerce bookstore built with the **MERN stack** (MongoDB, Express.js, React, Node.js). Features a rich UI with authentication, an admin dashboard, cart, wishlist, coupon system, order management, and more.

---

## 🖥️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| React Router DOM v7 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| MUI (Material UI) | Component library |
| Framer Motion | Animations & transitions |
| Axios | HTTP client |
| React Hook Form | Form state management |
| React Hot Toast | Toast notifications |
| React Icons / Heroicons | Icon sets |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens (JWT) | Access & refresh token auth |
| bcryptjs | Password hashing |
| Nodemailer | Email service (SMTP) |
| Cloudinary + Multer | Image upload & storage |
| Helmet + CORS | Security headers |
| express-rate-limit | API rate limiting |
| express-validator | Request validation |
| Morgan | HTTP request logging |
| compression | Response compression |

---

## ✨ Features

### 👤 User Features
- **Authentication** — Register, Login, Logout with JWT access & refresh tokens (httpOnly cookies)
- **Password Recovery** — Forgot password & reset via email link
- **Profile Management** — Update personal info, change password, upload avatar
- **Address Book** — Add, edit, delete shipping addresses
- **Book Browsing** — Browse, search, and filter books by category, price, rating
- **Book Details** — Full book info with reviews and ratings
- **Wishlist** — Save books for later
- **Shopping Cart** — Add/remove items, update quantities
- **Checkout** — Apply coupon codes, select address, place orders
- **Orders** — View order history and status tracking
- **Reviews** — Leave star ratings and written reviews on books
- **Notifications** — In-app notification center

### 🛡️ Admin Features
- **Admin Dashboard** — Analytics overview (sales, users, orders)
- **Book Management** — Add, edit, delete books with image uploads
- **Category Management** — Create and manage book categories
- **Order Management** — View and update order statuses
- **Coupon Management** — Create discount coupons with expiry and usage limits
- **User Management** — View all users, manage roles

---

## 📁 Project Structure

```
Book-Store/
├── backend/                    # Express.js REST API
│   ├── src/
│   │   ├── config/             # DB & Cloudinary config
│   │   ├── constants/          # HTTP status codes
│   │   ├── controllers/        # Route handler logic
│   │   ├── middleware/         # Auth, error, upload, logging
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Book.js
│   │   │   ├── Order.js
│   │   │   ├── Cart.js
│   │   │   ├── Wishlist.js
│   │   │   ├── Category.js
│   │   │   ├── Coupon.js
│   │   │   ├── Review.js
│   │   │   ├── Address.js
│   │   │   └── Notification.js
│   │   ├── routes/             # API route definitions
│   │   ├── seed/               # Database seeder & reset scripts
│   │   ├── services/           # Business logic layer
│   │   ├── utils/              # App error handler, logger
│   │   ├── validators/         # Input validation rules
│   │   ├── app.js              # Express app setup
│   │   └── server.js           # Entry point
│   ├── .env.example            # Environment variable template
│   └── package.json
│
└── frontend/                   # React + Vite SPA
    ├── src/
    │   ├── components/         # Reusable UI components
    │   ├── context/            # React Context (Auth, Cart, Wishlist)
    │   ├── layouts/            # Page layout wrappers
    │   ├── pages/              # Route-level page components
    │   │   ├── LandingPage.jsx
    │   │   ├── BooksPage.jsx
    │   │   ├── BookDetailsPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── WishlistPage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── AdminDashboardPage.jsx
    │   │   └── ...
    │   ├── services/           # Axios API call functions
    │   ├── styles/             # Global styles
    │   └── utils/              # Utility helpers
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local instance or MongoDB Atlas)
- **npm** v9+

---

### 1. Clone the Repository

```bash
git clone https://github.com/rishitha4412/Book-Store.git
cd Book-Store
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```



Start the backend server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

#### Optional — Seed the Database

```bash
# Seed with sample books, categories, and an admin user
npm run seed

# Reset (clear) the database
npm run reset-db
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

The frontend runs at **http://localhost:5173** and proxies API calls to the backend at **http://localhost:5000**.

---

## 🔌 API Overview

All routes are prefixed with `/api`.

| Module | Base Route | Description |
|---|---|---|
| Auth | `/api/auth` | Register, login, logout, refresh token, password reset |
| Books | `/api/books` | CRUD for books, search, filter |
| Categories | `/api/categories` | Book categories |
| Cart | `/api/cart` | User shopping cart |
| Wishlist | `/api/wishlist` | User wishlist |
| Orders | `/api/orders` | Place & track orders |
| Reviews | `/api/reviews` | Book reviews & ratings |
| Coupons | `/api/coupons` | Discount coupon management |
| Addresses | `/api/addresses` | User address book |
| Notifications | `/api/notifications` | In-app notifications |
| Upload | `/api/upload` | Image upload via Cloudinary |
| Admin | `/api/admin` | Admin-only management routes |

---

## 🗃️ Database Models

| Model | Description |
|---|---|
| `User` | User account, roles (user/admin), avatar, refresh tokens |
| `Book` | Title, author, description, price, stock, category, images, ratings |
| `Category` | Book category with name and slug |
| `Order` | Order items, totals, status, payment info, shipping address |
| `Cart` | Per-user cart with item quantities |
| `Wishlist` | Per-user saved books |
| `Review` | Star rating + comment, linked to user & book |
| `Coupon` | Discount code, type (percent/fixed), usage limits, expiry |
| `Address` | Saved delivery addresses per user |
| `Notification` | In-app notification records |

---

## 🔐 Security

- Passwords hashed with **bcryptjs**
- Auth via **httpOnly cookie** JWT tokens (access + refresh)
- **Helmet** for secure HTTP headers
- **CORS** restricted to frontend origin
- **Rate limiting** on API routes
- `.env` is **gitignored** — secrets are never committed

---

## 📜 Scripts Reference

### Backend (`/backend`)
| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start` | Start production server |
| `npm run seed` | Seed sample data into MongoDB |
| `npm run reset-db` | Drop all collections |

### Frontend (`/frontend`)
| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run oxlint linter |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

