# SmartStock Backend API

A Node.js/Express backend for the SmartStock inventory management application. This API provides authentication and CRUD operations for managing inventory items with features like tracking purchase dates, expiry dates, and item consumption status.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt
- **Development**: Nodemon

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

4. Start the server:
```bash
npm start
```

The server will run with nodemon for automatic restarts during development.

---

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

---

## Authentication Endpoints

Base URL: `http://localhost:3000/api/auth`

### 1. Register User
- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new user account
- **Authentication**: Not required
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Success Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
}
```
- **Error Response** (400/409/500):
```json
{
  "success": false,
  "message": "Error message"
}
```

### 2. Login User
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate and login an existing user
- **Authentication**: Not required
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

### 3. Get Current User
- **Endpoint**: `GET /api/auth/me`
- **Description**: Retrieve current authenticated user's information
- **Authentication**: Required (JWT token in cookie or header)
- **Success Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 4. Logout User
- **Endpoint**: `POST /api/auth/logout`
- **Description**: Logout and invalidate user session
- **Authentication**: Required (JWT token)
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Dashboard Endpoints

Base URL: `http://localhost:3000/api`

All dashboard endpoints require authentication (JWT token).

### Get Dashboard Statistics
- **Endpoint**: `GET /api/dashboard`
- **Description**: Retrieve inventory dashboard statistics including total items, fresh items, consumed items, expiring items, expired items, and total inventory value
- **Authentication**: Required (JWT token)
- **Success Response** (200):
```json
{
  "success": true,
  "data": {
    "totalItems": 10,
    "freshItems": 7,
    "consumedItems": 2,
    "expiringItems": 1,
    "expiredItems": 0,
    "inventoryValue": 125.50
  }
}
```
- **Error Response** (500):
```json
{
  "success": false,
  "message": "Internal server error"
}
```

**Dashboard Metrics Explanation**:
- **totalItems**: Total number of items in user's inventory
- **freshItems**: Items that are active and not expiring within 7 days
- **consumedItems**: Items marked as consumed
- **expiringItems**: Items expiring within the next 7 days
- **expiredItems**: Items that have already expired
- **inventoryValue**: Total monetary value of all items (price × quantity)

---

## Items Endpoints

Base URL: `http://localhost:3000/api`

All items endpoints require authentication (JWT token).

### 1. Create Item
- **Endpoint**: `POST /api`
- **Description**: Create a new inventory item
- **Authentication**: Required
- **Request Body**:
```json
{
  "name": "Milk",
  "category": "Dairy",
  "purchaseDate": "2024-01-15",
  "expiryDate": "2024-02-15",
  "price": 5.99,
  "quantity": 2,
  "status": "active",
  "notes": "Store in refrigerator"
}
```
- **Success Response** (201):
```json
{
  "success": true,
  "message": "Item created successfully",
  "data": {
    "item": {
      "_id": "item_id",
      "userId": "user_id",
      "name": "Milk",
      "category": "Dairy",
      "purchaseDate": "2024-01-15",
      "expiryDate": "2024-02-15",
      "price": 5.99,
      "quantity": 2,
      "status": "active",
      "notes": "Store in refrigerator",
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    }
  }
}
```

### 2. Get All Items
- **Endpoint**: `GET /api`
- **Description**: Retrieve all items for the authenticated user (sorted by creation date, newest first)
- **Authentication**: Required
- **Success Response** (200):
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "item_id",
        "userId": "user_id",
        "name": "Milk",
        "category": "Dairy",
        "purchaseDate": "2024-01-15",
        "expiryDate": "2024-02-15",
        "price": 5.99,
        "quantity": 2,
        "status": "active",
        "notes": "Store in refrigerator",
        "createdAt": "2024-01-20T10:00:00Z"
      }
    ]
  }
}
```

### 3. Get Single Item
- **Endpoint**: `GET /api/:id`
- **Description**: Retrieve a specific item by ID
- **Authentication**: Required
- **URL Parameters**: `id` - Item ID
- **Success Response** (200):
```json
{
  "success": true,
  "data": {
    "item": {
      "_id": "item_id",
      "userId": "user_id",
      "name": "Milk",
      "category": "Dairy",
      "purchaseDate": "2024-01-15",
      "expiryDate": "2024-02-15",
      "price": 5.99,
      "quantity": 2,
      "status": "active",
      "notes": "Store in refrigerator",
      "createdAt": "2024-01-20T10:00:00Z"
    }
  }
}
```

### 4. Update Item
- **Endpoint**: `PUT /api/:id`
- **Description**: Update an existing item
- **Authentication**: Required
- **URL Parameters**: `id` - Item ID
- **Request Body** (Any fields to update):
```json
{
  "quantity": 1,
  "price": 5.49,
  "status": "active"
}
```
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Item updated successfully",
  "data": {
    "item": {
      "_id": "item_id",
      "userId": "user_id",
      "name": "Milk",
      "quantity": 1,
      "price": 5.49,
      "status": "active",
      "updatedAt": "2024-01-20T11:00:00Z"
    }
  }
}
```

### 5. Delete Item
- **Endpoint**: `DELETE /api/:id`
- **Description**: Delete an item from inventory
- **Authentication**: Required
- **URL Parameters**: `id` - Item ID
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

### 6. Mark Item as Consumed
- **Endpoint**: `PATCH /api/:id/consume`
- **Description**: Mark an item as consumed (decrease quantity or change status)
- **Authentication**: Required
- **URL Parameters**: `id` - Item ID
- **Request Body** (Optional):
```json
{
  "quantityConsumed": 1
}
```
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Item marked as consumed",
  "data": {
    "item": {
      "_id": "item_id",
      "quantity": 1,
      "status": "consumed",
      "updatedAt": "2024-01-20T11:30:00Z"
    }
  }
}
```

### 7. Restore Item
- **Endpoint**: `PATCH /api/:id/restore`
- **Description**: Restore a consumed item back to active status
- **Authentication**: Required
- **URL Parameters**: `id` - Item ID
- **Success Response** (200):
```json
{
  "success": true,
  "message": "Item restored successfully",
  "data": {
    "item": {
      "_id": "item_id",
      "status": "active",
      "updatedAt": "2024-01-20T11:45:00Z"
    }
  }
}
```

---

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. 

- Tokens are obtained from the `/api/auth/register` or `/api/auth/login` endpoints
- Include the token in the `Cookie` header or `Authorization` header for protected endpoints
- Token format: `Authorization: Bearer <token>`
- Token expiry: 1 day

---

## Error Handling

All endpoints return standardized error responses:

- **400 Bad Request**: Incomplete or invalid request data
- **401 Unauthorized**: Missing or invalid authentication token
- **409 Conflict**: Resource already exists
- **500 Internal Server Error**: Server-side error

Standard error response format:
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

---

## Database Models

### User Model
- `_id`: MongoDB ObjectId
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (hashed, required)
- `createdAt`: Date
- `updatedAt`: Date

### Item Model
- `_id`: MongoDB ObjectId
- `userId`: String (reference to User, required)
- `name`: String (required)
- `category`: String (required) - Valid values: 'Pantry', 'Dairy', 'Medicine', 'Toiletries', 'Cleaning', 'Other'
- `purchaseDate`: Date (required)
- `expiryDate`: Date (required)
- `price`: Number (required, must be > 0)
- `quantity`: Number (default: 1)
- `status`: String (required) - Valid values: 'active', 'consumed', 'expired'
- `notes`: String (optional)
- `createdAt`: Date
- `updatedAt`: Date

---

## Project Structure

```
backend/
├── index.js                 # Entry point
├── package.json            # Dependencies and scripts
├── README.md               # This file
└── src/
    ├── app.js              # Express app configuration
    ├── config/
    │   └── db.js          # Database connection
    ├── controllers/
    │   ├── authController.js         # Auth logic
    │   ├── itemsController.js        # Items CRUD logic
    │   └── dashboardController.js    # Dashboard statistics
    ├── middleware/
    │   └── authMiddleware.js      # JWT verification
    ├── models/
    │   ├── user.js        # User schema
    │   └── item.js        # Item schema
    └── routes/
        ├── auth.route.js      # Auth endpoints
        ├── items.route.js     # Items endpoints
        └── dashboard.route.js # Dashboard endpoints
```

---

## Development

To start the development server:
```bash
npm start
```

The server will run on the port specified in your `.env` file (default: 3000) and automatically restart when files change thanks to Nodemon.

---

## Debugging & Fixed Issues

This section documents all issues found and fixed during the development process:

### 1. **Typo in Function Name (authController.js)**
- **Issue**: Function was declared as `generetToken` but called as `generateToken`
- **Error**: `generateToken is not a function`
- **Fix**: Renamed function to `generateToken` (corrected typo)

### 2. **Variable Shadowing (authController.js)**
- **Issue**: In `getme()` function, `const user = user.findById()` shadowed the User model
- **Error**: `TypeError: user.findById is not a function`
- **Fix**: Changed to `const user = User.findById()` (capital U)

### 3. **Async/Await Missing (authController.js)**
- **Issue**: `getme()` function was not declared as async but used await
- **Error**: Returned promise instead of user data
- **Fix**: Added `async` keyword to function declaration

### 4. **Wrong Model Import (dashboardController.js)**
- **Issue**: Imported `../models/itemModel` which doesn't exist
- **Error**: `Module not found`
- **Fix**: Changed to `../models/item`

### 5. **Variable Name Mismatch (dashboardController.js)**
- **Issue**: Variable declared as `sevenDay` but used as `sevenDaysLater`
- **Error**: `sevenDaysLater is not defined`
- **Fix**: Changed usage to `sevenDay`

### 6. **Wrong Field Names (dashboardController.js)**
- **Issue**: Used `user: userId` instead of `userId: userId` in queries
- **Error**: Queries returned no results
- **Fix**: Changed to `userId: userId` to match schema

### 7. **Missing Model Export (item.js)**
- **Issue**: Item schema defined but never exported
- **Error**: `Cannot import Item model`
- **Fix**: Added `module.exports = mongoose.model("Item", itemSchema);`

### 8. **Assignment to Const Variable (authController.js)**
- **Issue**: Declared `const { email }` but tried to reassign: `email = email.trim().toLowerCase()`
- **Error**: `TypeError: Assignment to constant variable`
- **Fix**: Changed `const` to `let` in destructuring

### 9. **Missing Authentication Middleware (auth.route.js)**
- **Issue**: `/api/auth/me` and `/api/auth/logout` endpoints missing `protect` middleware
- **Error**: `Cannot read properties of undefined (reading 'userId')`
- **Fix**: Imported and added `protect` middleware to protected routes

### 10. **Invalid Category Enum (item.js)**
- **Issue**: Item model enum only had `["Pantry", "Medicine", "Toiletries", "Cleaning", "Other"]` but "Dairy" was used in examples
- **Error**: `Dairy is not a valid enum value for path category`
- **Fix**: Added "Dairy" to the enum array

### 11. **Database Connection Not Awaited (index.js)**
- **Issue**: `connectToDB()` called without await, server started before MongoDB connection
- **Error**: `Connection refused` on all POST requests
- **Fix**: Made `startServer()` async and awaited `connectToDB()` before starting the server

### 12. **Route Order Conflict (app.js)**
- **Issue**: Dashboard route registered after items route, `/api/dashboard` matched `/:id` pattern first
- **Error**: `CastError: Cast to ObjectId failed for value "dashboard"`
- **Fix**: Moved dashboard route registration before items routes

### 13. **Deprecation Warnings (itemsController.js)**
- **Issue**: Used deprecated `{ new: true }` option in `findByIdAndUpdate()` calls
- **Warning**: `mongoose: the new option for findOneAndUpdate() is deprecated`
- **Fix**: Replaced with `{ returnDocument: 'after' }` in 3 places:
  - `updateOne()` function
  - `markConsume()` function
  - `restore()` function

### 14. **Schema Validation Issue (user.js)**
- **Issue**: Used `require: true` instead of `required: true` in schema fields
- **Error**: Validation not enforced properly
- **Fix**: Changed all `require` to `required` in User schema

---

## License

ISC
