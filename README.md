# UrbanWear IICT DUET x EDGE Project

Modern fashion eCommerce platform built with the MERN stack featuring stylish UI/UX, product variants, cart & checkout system, wishlist, and complete admin management.

---

# Features

- JWT Authentication
- Role-based Authorization
- Product Variants (Size & Color)
- Shopping Cart & Checkout
- Wishlist System
- User Dashboard
- Admin Dashboard
- Collection Management
- Responsive Modern UI
- Mobile-first Design

---

# Tech Stack

## Frontend
- React.js
- Bootstrap
- Context API

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication & Security
- JWT Authentication
- bcrypt Password Hashing
- Role-based Access Control

---

# Demo Access

## Admin Access

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

## User Access

```json
{
  "email": "shamsur30rahman@gmail.com",
  "password": "shamsur30rahman"
}
```

---

# Project Structure

## Backend Structure

```bash
/src
  /controllers
  /models
  /routes
  /middlewares
  /services
  /utils
```

## Frontend Structure

```bash
/app
/components
/hooks
/services
/store
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd urbanwear
```

---

# Backend Setup

## Install Dependencies

```bash
cd server
npm install
```

## Create Environment Variables

Create a `.env` file inside the backend root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## Run Backend Server

```bash
npm run dev
```

Backend will run on:

```bash
http://localhost:5000
```

---

# Frontend Setup

## Install Dependencies

```bash
cd client
npm install
```

## Run Frontend

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:3000
```

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

---

## Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

---

## Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/user` | User order history |
| GET | `/api/orders` | Get all orders (Admin) |

---

## Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/users/profile` | Update profile |
| PUT | `/api/users/wishlist` | Update wishlist |

---

# Database Models

## Users

```js
{
  name,
  email,
  password,
  role,
  wishlist,
  addresses,
  createdAt
}
```

## Products

```js
{
  name,
  category,
  price,
  discount,
  variants: [
    {
      size,
      color,
      stock
    }
  ],
  images,
  description
}
```

## Orders

```js
{
  userId,
  items: [
    {
      productId,
      quantity,
      size,
      color
    }
  ],
  totalPrice,
  status,
  shippingAddress,
  createdAt
}
```

## Collections

```js
{
  name,
  products,
  season,
  createdAt
}
```

---

# Main Functionalities

## Customer Features

- Browse Products
- Filter by Category, Size, Color & Price
- Product Variant Selection
- Add to Cart
- Wishlist Management
- Checkout System
- Order Tracking
- Profile Management

---

## Admin Features

- Dashboard Analytics
- Product Management
- Collection Management
- Order Management
- User Management
- Inventory Tracking

---

# UI/UX

- Black & White Modern Theme
- Bold Typography
- Large Product Images
- Smooth Hover Effects
- Responsive Design
- Fast Navigation Experience

---

# Security Features

- JWT Authentication
- Password Hashing
- Protected Routes
- Role-based Authorization
- Rate Limiting

---

# Scripts

## Backend

```bash
npm run dev
npm start
```

## Frontend

```bash
npm run dev
npm run build
npm start
```

---

# Future Improvements

- Online Payment Integration
- Product Reviews & Ratings
- Coupon System
- Email Notifications
- Advanced Search
- AI-based Recommendations

---

# License

This project is developed for educational and portfolio purposes.

---

# Author

Developed with ❤️ using the MERN Stack by IICT DUET x EDGE Project.
