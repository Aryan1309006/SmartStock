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
GROQ_API_KEY=replace_with_your_groq_api_key
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

All routes below are relative to `http://localhost:3000` and require a bearer token unless marked `No`.

### Authentication

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create a user and issue a token |
| POST | `/api/auth/login` | No | Authenticate a user and issue a token |
| GET | `/api/auth/me` | Yes | Return the authenticated user |
| POST | `/api/auth/logout` | Yes | Clear the authentication cookie |

Register and login return the user and token inside `data`:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "user_id", "name": "John Doe", "email": "john@example.com" },
    "token": "jwt"
  }
}
```

`GET /api/auth/me` returns the authenticated user at `user`. Logout returns `success` and `message`.

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

### Dashboard

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/dashboard` | Yes | Return inventory statistics |
| GET | `/api/dashboard/expiring-soon` (new) | Yes | Return active items expiring within seven days, sorted soonest first |
| GET | `/api/dashboard/recently-consumed` (new) | Yes | Return consumed items sorted by consumption date |
| GET | `/api/dashboard/category-count` (new) | Yes | Return active inventory grouped by category |

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

### Analytics (new)

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/analytics/monthly-overview` (new) | Yes | Return the current-month summary and monthly added/consumed chart data |
| GET | `/api/analytics/consumption-overview` (new) | Yes | Return daily added and consumed chart data |

`monthly-overview` returns `data.summary` (`added`, `consumed`, `expired`, `value`) and `data.chartData`. `consumption-overview` returns `data.chartData`.

### Recipe Suggestions (new)

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/recipes/suggest` (new) | Yes | Generate recipes from the user's active food inventory using the configured Groq AI service |

Request body:

```json
{
  "preferences": "vegetarian",
  "servings": 2,
  "avoid": ["peanuts"]
}
```

`servings` must be a positive integer and `avoid` must be an array. The response returns AI-generated recipe data at `data`. Set `GROQ_API_KEY` in `backend/.env` to use this endpoint.

## SmartStock Frontend Integration

The frontend uses `smartstock/src/services/api.js` with `VITE_API_URL` as its API base URL and `withCredentials: true`.

| Backend area | Used by SmartStock frontend now? | Current integration |
| --- | --- | --- |
| Authentication | Yes | `authService.js` uses register, login, and logout; `authContext.jsx` uses `/auth/me` |
| Items | Yes | `itemsService.js` and `itemContext.jsx` use create, list, get, update, delete, consume, and restore |
| Dashboard | No | No frontend service or direct API call currently found |
| Analytics | No | No frontend service or direct API call currently found |
| Recipe suggestions | No | No frontend service or direct API call currently found |

The `(new)` routes are implemented in the backend but still need frontend service methods and UI integration before SmartStock uses them.

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


### Notifications

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/notifications` | Yes | Synchronize and return the user's inventory notifications |
| PATCH | `/api/notifications/:id/read` | Yes | Mark one notification as read |
| PATCH | `/api/notifications/read-all` | Yes | Mark all notifications as read |
| DELETE | `/api/notifications/:id` | Yes | Delete one notification |

Notifications are generated from inventory events such as newly added items,
consumed items, and items that are expiring or expired. Notification state is
stored per user and is loaded by the frontend notifications page.
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
    │   ├── Ai.js
    │   ├── cors.js
    │   └── db.js
    ├── controllers/
    │   ├── analyticsController.js
    │   ├── authController.js
    │   ├── dashboardController.js
    │   ├── itemsController.js
    │   └── suggestRecipesController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── item.js
    │   └── user.js
    └── routes/
      ├── analytics.route.js
        ├── auth.route.js
        ├── dashboard.route.js
      ├── items.route.js
      └── suggest.route.js
```

## Available Script

```bash
npm start
```

This starts `nodemon index.js`.
