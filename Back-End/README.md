# E-Commerce Backend API

> A high-performance, production-grade REST API designed for modern e-commerce applications using Node.js, Express 5, and MongoDB.
> This backend system covers everything from secure user authentication and product management to cart operations, Stripe payment processing, and webhook automation — built with scalability, security, and clean architecture in mind.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-F7B731?style=flat-square&logo=jsonwebtokens&logoColor=black)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Stripe Integration](#stripe-integration)
- [API Reference](#api-reference)
- [Query Parameters](#query-parameters)
- [Static File Serving](#static-file-serving)
- [License](#license)

---

## Tech Stack

| Technology | Role |
|---|---|
| Node.js 18+ | Runtime |
| Express 5 | Web framework |
| MongoDB + Mongoose | Database & ODM |
| JWT | Auth & authorization |
| Stripe | Payments & webhooks |
| Multer + Sharp | Image upload & processing |
| Express Validator | Input validation |

---

## Project Structure

```
Back-end/
├── config/         # DB connection & app config
├── controllers/    # Route handler logic
├── middlewares/    # Auth, error handling, file uploads
├── models/         # Mongoose schemas
├── routes/         # Express route definitions
├── uploads/        # Static file storage
├── utils/          # Shared helpers & utilities
├── config.env      # Environment variables (never commit this)
├── package.json
└── server.js
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start in development mode
npm run start:dev

# Start in production mode
npm run start:prod
```

> **Base URL:** `http://localhost:8000`  
> **API Prefix:** `/api/v1`

---

## Environment Variables

Create a `config.env` file in the root directory:

```env
PORT=8000
NODE_ENV=development
BASE_URL=http://localhost:8000

DB_URI=mongodb://localhost:27017/ecommerce

JWT_SECRET_KEY=your_jwt_secret_here
JWT_EXPIRE_TIME=7d

# Email — required for password reset flow
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

## Stripe Integration

Supports full **Checkout Sessions** and **Webhook** flows for payment confirmation.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/orders/checkout-session/:cartId` | Create a checkout session |
| `POST` | `/api/v1/webhook/stripe` | Handle Stripe webhook events |

---

## API Reference

### Authentication
```
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/forgotPassword
POST   /api/v1/auth/verfiyResetCode
PUT    /api/v1/auth/resetPassword
```

### Categories
```
GET    /api/v1/categories
GET    /api/v1/categories/:id
POST   /api/v1/categories
PUT    /api/v1/categories/:id
DELETE /api/v1/categories/:id
GET    /api/v1/categories/:categoryId/subcategories
POST   /api/v1/categories/:categoryId/subcategories
```

### Subcategories
```
GET    /api/v1/subcategories
GET    /api/v1/subcategories/:id
POST   /api/v1/subcategories
PUT    /api/v1/subcategories/:id
DELETE /api/v1/subcategories/:id
```

### Brands
```
GET    /api/v1/brands
GET    /api/v1/brands/:id
POST   /api/v1/brands
PUT    /api/v1/brands/:id
DELETE /api/v1/brands/:id
```

### Products
```
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id
GET    /api/v1/products/:productId/reviews
POST   /api/v1/products/:productId/reviews
```

### Reviews
```
GET    /api/v1/reviews
GET    /api/v1/reviews/:id
POST   /api/v1/reviews
PUT    /api/v1/reviews/:id
DELETE /api/v1/reviews/:id
```

### Users
```
GET    /api/v1/users
GET    /api/v1/users/:id
POST   /api/v1/users
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id

GET    /api/v1/users/getMe
PUT    /api/v1/users/updateMe
PUT    /api/v1/users/changeMyPassword
DELETE /api/v1/users/deleteMe
PUT    /api/v1/users/changePassword/:id
```

### Wishlist
```
GET    /api/v1/wishlists
POST   /api/v1/wishlists
DELETE /api/v1/wishlists/:productId
```

### Addresses
```
GET    /api/v1/addresses
POST   /api/v1/addresses
DELETE /api/v1/addresses/:addressId
```

### Coupons
```
GET    /api/v1/coupons
GET    /api/v1/coupons/:id
POST   /api/v1/coupons
PUT    /api/v1/coupons/:id
DELETE /api/v1/coupons/:id
```

### Cart
```
GET    /api/v1/carts
POST   /api/v1/carts
DELETE /api/v1/carts
PUT    /api/v1/carts/applyCoupon
PUT    /api/v1/carts/:itemId
DELETE /api/v1/carts/:itemId
```

### Orders
```
GET    /api/v1/orders
GET    /api/v1/orders/:id
POST   /api/v1/orders/:cartId
GET    /api/v1/orders/checkout-session/:cartId
POST   /api/v1/webhook/stripe
PUT    /api/v1/orders/:id/pay
PUT    /api/v1/orders/:id/deliver
```

---

## Query Parameters

All list endpoints support flexible querying via a custom `ApiFeatures` utility:

| Parameter | Description | Example |
|---|---|---|
| `page` | Page number | `?page=2` |
| `limit` | Results per page | `?limit=20` |
| `sort` | Sort field (`-` for descending) | `?sort=-price` |
| `fields` | Comma-separated field selection | `?fields=title,price` |
| `keyword` | Full-text search | `?keyword=iphone` |
| `price[gte]` | Greater than or equal filter | `?price[gte]=100` |
| `price[lte]` | Less than or equal filter | `?price[lte]=500` |

**Example:**
```
GET /api/v1/products?keyword=iphone&sort=-price&fields=title,price&page=1&limit=10
```

---

## Static File Serving

Uploaded images are served statically at:

```
GET /uploads/categories/:filename
GET /uploads/brands/:filename
GET /uploads/products/:filename
GET /uploads/users/:filename
```

Full URL format: `{BASE_URL}/uploads/products/image.jpeg`

---

## License

[MIT](LICENSE)