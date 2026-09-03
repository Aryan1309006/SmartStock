# SmartStock Backend API

Node.js and Express API for SmartStock inventory management. The backend uses MongoDB through Mongoose and JWT authentication.

## Stack

- Node.js
- Express 5
- MongoDB and Mongoose
- JWT and bcrypt
- Nodemon for development

## Setup

From the repository root:

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/smartstock
JWT_SECRET=replace_with_a_long_random_secret
PORT=3000
NODE_ENV=development
```

Start the server:

```bash
npm start
```

The API is available at `http://localhost:3000`. The root health check is `GET /`.

## Authentication

Register and login return a JWT in the response and also set an HTTP-only `token` cookie. The current authentication middleware reads the bearer token from the `Authorization` header, so send this header on protected requests:

```http
Authorization: Bearer <jwt>
```

The token expires after one day. In production, the cookie uses `Secure` and `SameSite=None`; development uses `SameSite=Lax`.

## API Routes

All routes below are relative to `http://localhost:3000`.

### Authentication

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create a user and issue a token |
| POST | `/api/auth/login` | No | Authenticate a user and issue a token |
| GET | `/api/auth/me` | Yes | Return the authenticated user |
| POST | `/api/auth/logout` | Yes | Clear the authentication cookie |

Register request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Login request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Successful registration and login responses contain `success`, `message`, and `data.user`, with the token at `data.token`. The current-user response returns the user at `user`:

```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Dashboard

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/dashboard` | Yes | Return inventory statistics |

Response data contains `totalItems`, `freshItems`, `consumedItems`, `expiringItems`, `expiredItems`, and `inventoryValue`.

### Items

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/items` | Yes | Create an item |
| GET | `/api/items` | Yes | List the authenticated user's items |
| GET | `/api/items/:id` | Yes | Get one item |
| PUT | `/api/items/:id` | Yes | Update an item |
| DELETE | `/api/items/:id` | Yes | Delete an item |
| PATCH | `/api/items/:id/consume` | Yes | Mark an item as consumed |
| PATCH | `/api/items/:id/restore` | Yes | Restore an item to available status |

Create-item request:

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

Valid categories are `Pantry`, `Dairy`, `Medicine`, `Toiletries`, `Cleaning`, and `Other`. Valid statuses are `active`, `consumed`, and `expired`.

Item responses use this structure:

```json
{
  "success": true,
  "data": {
    "item": {}
  }
}
```

List responses contain the items at `data.items` and are sorted newest first. Item IDs must be valid MongoDB ObjectIds.

## Error Responses

Errors use this structure:

```json
{
  "success": false,
  "message": "Error message"
}
```

Common status codes:

- `400`: Invalid or incomplete input, including an invalid item ID
- `401`: Missing, expired, or invalid bearer token
- `404`: User or item not found
- `409`: User already exists
- `500`: Internal server error

## Data Models

### User

- `_id`: MongoDB ObjectId
- `name`: required string
- `email`: required string
- `password`: required hashed string
- `createdAt`, `updatedAt`: timestamps

### Item

- `_id`: MongoDB ObjectId
- `userId`: required User reference
- `name`: required string
- `category`: required category enum
- `quantity`: required number, minimum `1`
- `purchaseDate`: required date
- `expiryDate`: required date
- `price`: number, default `0`
- `notes`: optional string
- `status`: `active`, `consumed`, or `expired`
- `consumedAt`: optional date
- `createdAt`, `updatedAt`: timestamps

## Project Structure

```text
backend/
├── index.js
├── package.json
├── README.md
└── src/
    ├── app.js
    ├── config/
    │   ├── cors.js
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── dashboardController.js
    │   └── itemsController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── item.js
    │   └── user.js
    └── routes/
        ├── auth.route.js
        ├── dashboard.route.js
        └── items.route.js
```

## Available Script

```bash
npm start
```

This starts `nodemon index.js`.
