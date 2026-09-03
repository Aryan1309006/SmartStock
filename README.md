# SmartStock 📦

## Problem Statement

Managing household and personal inventory manually can be difficult and inefficient. Users often forget what items they have, how much quantity is remaining, when an item was purchased, or when it is going to expire.

Traditional methods such as notebooks, spreadsheets, or manually checking every item make inventory management time-consuming and provide no centralized way to monitor stock.

This creates problems such as:

- Difficulty tracking available items
- Forgetting low-stock products
- Missing product expiry dates
- No centralized inventory management
- Difficulty knowing the total inventory value
- Time wasted manually checking and updating stock

---

## 💡 Proposed Solution

**SmartStock** is a full-stack inventory management application designed to make inventory tracking simple and organized.

The application provides users with a centralized dashboard where they can add, view, update, search, and delete inventory items.

SmartStock also tracks important information such as **quantity, price, purchase date, expiry date, category, and stock status**, allowing users to quickly understand the current state of their inventory.

The dashboard provides an overview of the inventory through useful statistics such as:

- Total items
- Low-stock items
- Expiring items
- Total inventory value
- Category-wise inventory

---

## 🚀 Key Features

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes
- Secure password hashing using bcrypt

### 📦 Inventory Management

Users can:

- Add inventory items
- View inventory
- Update item information
- Delete items
- Track quantity
- Track item status
- Store purchase and expiry dates

### 🔎 Search & Filter

Users can easily find inventory items using:

- Item name
- Category
- Stock status

Example:

```text
Search: Milk

→ Milk
→ Amul Milk
→ Milk Powder
```

### 📊 Dashboard

The dashboard provides a quick overview of inventory:

```text
┌─────────────────────────────────┐
│ Total Items       24            │
│ Low Stock          5            │
│ Expiring Soon      3            │
│ Inventory Value   ₹4,850        │
└─────────────────────────────────┘
```

### ⏰ Expiry Tracking

Users can store expiry dates for products and identify items that are approaching their expiry date.

### 📱 Responsive Design

The application is designed to work across:

- Desktop
- Tablet
- Mobile

---

## 🔄 How SmartStock Works

```text
             USER
               │
               ▼
        Register / Login
               │
               ▼
       JWT Authentication
               │
               ▼
          Dashboard
               │
       ┌───────┼────────┐
       ▼       ▼        ▼
     Items   Search   Statistics
       │
       ▼
 Add / Update / Delete
       │
       ▼
     MongoDB
```

---

## 🛠️ Technology Stack

### Frontend

- React.js
- React Router
- Context API
- Axios
- Tailwind CSS
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- CORS
- dotenv

---

## 🏗️ System Architecture

```text
┌──────────────────────┐
│     React Frontend   │
│                      │
│  Components          │
│  Pages               │
│  Context API         │
│  Axios               │
└──────────┬───────────┘
           │
           │ REST API
           ▼
┌──────────────────────┐
│    Express Backend   │
│                      │
│  Routes              │
│  Controllers         │
│  Middleware          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       MongoDB        │
│                      │
│  Users               │
│  Items               │
└──────────────────────┘
```

---

## 🔐 Authentication Flow

```text
Register
   ↓
User Data Validation
   ↓
Password Hashing
   ↓
MongoDB
   ↓
Login
   ↓
JWT Token
   ↓
AuthContext
   ↓
Protected Routes
```

The JWT token is used to authenticate requests to protected inventory APIs.

---

## 📡 API Overview

### Authentication APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get logged-in user |

### Inventory APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/items` | Get inventory |
| GET | `/api/items/:id` | Get single item |
| POST | `/api/items` | Create item |
| PUT | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Delete item |

---

## 📦 Example Inventory Item

```json
{
  "name": "Milk",
  "category": "Dairy",
  "purchaseDate": "2026-09-01",
  "price": 60,
  "quantity": 2,
  "status": "In Stock",
  "expiryDate": "2026-09-05",
  "notes": "Keep refrigerated"
}
```

---

## 🎯 Expected Outcome

SmartStock provides a centralized and user-friendly solution for managing everyday inventory.

Instead of manually checking products, users can use one application to:

```text
Track → Organize → Monitor → Update
```

This helps reduce forgotten items, identify low-stock products, monitor expiry dates, and understand overall inventory value.

---

## 🔮 Future Scope

Future versions of SmartStock can include:

- 🔔 Expiry notifications
- 📧 Email reminders
- 📷 Barcode scanning
- 🧾 Receipt scanning
- 📊 Advanced analytics
- 📈 Inventory charts
- 👥 Shared household inventory
- 📱 Progressive Web App (PWA)
- 🤖 AI-based inventory suggestions

---

## 👨‍💻 Author

**Aryan Patil**

B.E. Information Technology

---

## ⭐ Conclusion

**SmartStock transforms traditional inventory management into a centralized digital solution.**

By combining a responsive React frontend, RESTful Express APIs, JWT authentication, and MongoDB, the project provides a practical full-stack solution for tracking and managing inventory efficiently.