# E-Commerce Backend API

> A high-performance, production-grade REST API designed for modern e-commerce applications using Node.js, Express 5, and MongoDB.
> This backend system covers everything from secure user authentication and product management to cart operations, Stripe payment processing, and webhook automation — built with scalability, security, and clean architecture in mind.

> ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)
> ![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)
> ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)
> ![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe&logoColor=white)
> ![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

---

## Stack

| Technology         | Purpose                        |
| ------------------ | ------------------------------ |
| Node.js            | Runtime environment            |
| Express 5          | Web framework                  |
| MongoDB + Mongoose | Database & ODM                 |
| JWT                | Authentication & authorization |
| Stripe             | Checkout sessions + Webhooks   |
| Multer + Sharp     | Image upload & processing      |
| Express Validator  | Input validation               |

---

## Project Structure

```
Back-end/
├── config/           # DB connection & app configuration
├── controllers/      # Route handler logic
├── middlewares/      # Auth, error handling, uploads
├── models/           # Mongoose schemas
├── routes/           # Express route definitions
├── uploads/          # Served static files
├── utils/            # Helpers & shared utilities
├── config.env        # Environment variables (do NOT commit)
├── package.json
└── server.js
```

---

## Installation

```bash
npm install
```

### Run in development

```bash
npm run start:dev
```

### Run in production

```bash
npm run start:prod
```

**Default local URL:** `http://localhost:8000`  
**Base API prefix:** `/api/v1`

---

## Environment Variables

Create a `config.env` file in the project root:

```env
PORT=
NODE_ENV=                     # development | production
BASE_URL=                     # e.g. http://localhost:8000
DB_URI=                       # MongoDB connection string
JWT_SECRET_KEY=               # Strong random secret
JWT_EXPIRE_TIME=              # e.g. 7d or 1h

# Email (optional — for password reset)
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=

# Stripe
STRIPE_SECRET_KEY=            # sk_test_... or sk_live_...
STRIPE_WEBHOOK_SECRET=        # whsec_... from Stripe dashboard
```

---

## Stripe Integration

This API supports both **Checkout Sessions** and **Webhooks** for payment confirmation.

### Endpoints

| Method | Endpoint                                  | Description                      |
| ------ | ----------------------------------------- | -------------------------------- |
| `GET`  | `/api/v1/orders/checkout-session/:cartId` | Create a Stripe checkout session |
| `POST` | `/api/v1/webhook/stripe`                  | Receive Stripe webhook events    |

```

---

## API Reference

### Auth

```

POST /api/v1/auth/signup
POST /api/v1/auth/login
POST /api/v1/auth/forgotPassword
POST /api/v1/auth/verfiyResetCode
PUT /api/v1/auth/resetPassword

```

### Categories

```

GET /api/v1/categories
GET /api/v1/categories/:id
POST /api/v1/categories
PUT /api/v1/categories/:id
DELETE /api/v1/categories/:id
GET /api/v1/categories/:categoryId/subcategories
POST /api/v1/categories/:categoryId/subcategories

```

### Subcategories

```

GET /api/v1/subcategories
GET /api/v1/subcategories/:id
POST /api/v1/subcategories
PUT /api/v1/subcategories/:id
DELETE /api/v1/subcategories/:id

```

### Brands

```

GET /api/v1/brands
GET /api/v1/brands/:id
POST /api/v1/brands
PUT /api/v1/brands/:id
DELETE /api/v1/brands/:id

```

### Products

```

GET /api/v1/products
GET /api/v1/products/:id
POST /api/v1/products
PUT /api/v1/products/:id
DELETE /api/v1/products/:id
GET /api/v1/products/:productId/reviews
POST /api/v1/products/:productId/reviews

```

### Reviews

```

GET /api/v1/reviews
GET /api/v1/reviews/:id
POST /api/v1/reviews
PUT /api/v1/reviews/:id
DELETE /api/v1/reviews/:id

```

### Users

```

GET /api/v1/users
GET /api/v1/users/:id
POST /api/v1/users
PUT /api/v1/users/:id
DELETE /api/v1/users/:id
GET /api/v1/users/getMe
PUT /api/v1/users/updateMe
PUT /api/v1/users/changeMyPassword
DELETE /api/v1/users/deleteMe
PUT /api/v1/users/changePassword/:id

```

### Wishlist

```

GET /api/v1/wishlists
POST /api/v1/wishlists
DELETE /api/v1/wishlists/:productId

```

### Addresses

```

GET /api/v1/addresses
POST /api/v1/addresses
DELETE /api/v1/addresses/:addressId

```

### Coupons

```

GET /api/v1/coupons
GET /api/v1/coupons/:id
POST /api/v1/coupons
PUT /api/v1/coupons/:id
DELETE /api/v1/coupons/:id

```

### Cart

```

GET /api/v1/carts
POST /api/v1/carts
DELETE /api/v1/carts
PUT /api/v1/carts/applyCoupon
PUT /api/v1/carts/:itemId
DELETE /api/v1/carts/:itemId

```

### Orders

```

GET /api/v1/orders
GET /api/v1/orders/:id
POST /api/v1/orders/:cartId
GET /api/v1/orders/checkout-session/:cartId
POST /api/v1/webhook/stripe
PUT /api/v1/orders/:id/pay
PUT /api/v1/orders/:id/deliver

````

---

## Query Features
These query features are implemented using a custom ApiFeatures utility to provide a flexible and scalable way to handle filtering, sorting, and pagination across all endpoints.

All list endpoints support the following query parameters:
| Parameter    | Description                                      | Example               |
| ------------ | ------------------------------------------------ | --------------------- |
| `page`       | Specify page number for pagination               | `?page=2`             |
| `limit`      | Number of results per page                       | `?limit=20`           |
| `sort`       | Sort results by field (`-` for descending order) | `?sort=-price`        |
| `fields`     | Select specific fields to return                 | `?fields=title,price` |
| `keyword`    | Search items by keyword                          | `?keyword=iphone`     |
| `price[gte]` | Filter results (greater than or equal)           | `?price[gte]=100`     |


**Example:**

```http
GET /api/v1/products?keyword=iphone&sort=-price&fields=title,price&page=1&limit=10
````

---

## Static Uploads

Uploaded images are served statically and accessible via:

```
GET /uploads/categories/:filename
GET /uploads/brands/:filename
GET /uploads/products/:filename
GET /uploads/users/:filename
```

Full URL format: `{BASE_URL}/uploads/products/filename.jpeg`

---

## License

MIT
