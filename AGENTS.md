# SmartStock — Engineering Rules & Architecture Guide

This document defines the architectural guidelines, domain business rules, service design, and engineering conventions for the **SmartStock** application.

---

## 1. System Architecture

SmartStock is a modular monolith structured with clear layer boundaries:

```text
React Pages / Components (smartstock/)
  ↳ Domain Contexts & API Services (Axios withCredentials)
    ↳ Express Routes (backend/src/routes/)
      ↳ Controllers (backend/src/controllers/) — HTTP parsing, input validation, status responses
        ↳ Services (backend/src/services/) — Domain business logic, transactions, calculations
          ↳ Mongoose Models (backend/src/models/) & External Providers (Groq SDK)
            ↳ MongoDB Database
```

### Dependency Rules:
1. **Routes → Controllers → Services → Models / Providers**: Code must strictly flow in this direction.
2. **Controllers are thin**: They extract inputs from `req.body`, `req.params`, and `req.query`, invoke the appropriate service method, and format the HTTP response.
3. **Services own domain logic**: Services encapsulate database operations, external API calls, and business calculations. They do not depend on Express `req` or `res` objects.
4. **Centralized Error Handling**: Services throw `AppError(message, statusCode)`. The global error handler in `backend/src/middleware/errorHandler.js` translates errors into predictable JSON envelopes: `{ success: false, message, errors }`.
5. **No client-supplied user IDs**: User identification is always established server-side from `req.user.userId` via JWT authentication.

---

## 2. Critical Inventory Business Rule

### Total Items must exclude consumed items

> **MANDATORY INVARIANT:**
> `Total Items` represents only active inventory that has **not** been consumed. Consumed inventory records must **never** contribute to `totalItems` or active status breakdowns.

### Metric Definitions:
- **`totalItems`**: Count of inventory records belonging to the user where status is not consumed (`status !== "consumed"` and `consumedAt` is null).
- **`consumedItems`**: Count of consumed inventory records (`status === "consumed"` or `consumedAt` is not null).
- **`freshItems`**: Count of unconsumed inventory records where days until expiry is greater than 7 (`daysRemaining > 7` and `status !== "expired"`).
- **`expiringItems`**: Count of unconsumed inventory records where days until expiry is between 0 and 7 inclusive (`0 <= daysRemaining <= 7` and `status !== "expired"`).
- **`expiredItems`**: Count of unconsumed inventory records where `status === "expired"` or `daysRemaining < 0`.
- **`totalItems = freshItems + expiringItems + expiredItems`**: Consumed items are entirely separate and must **never** be added into `totalItems`.

### Record Counts vs. Quantities:
- **Dashboard cards and inventory counters** display **record counts** (`totalItems`, `freshItems`, `consumedItems`, `expiringItems`, `expiredItems`).
- **Sum of quantities** (`totalActiveQuantity`, `totalConsumedQuantity`) represents the unit sum across records and is reported separately when quantity-level granularity is needed.
- **Inventory Value (`inventoryValue`)**: Sum of `(price * quantity)` across active, unconsumed, non-expired inventory items.

### Consumption & Restoration Lifecycle:
- **Partial Consumption**: If `amount < item.quantity`, the item's `quantity` decreases by `amount`, while the item remains in its active status.
- **Full Consumption**: If `amount >= item.quantity` or amount is omitted, the item transitions to `status = "consumed"` and `consumedAt = new Date()`. It immediately drops from `totalItems` and active breakdowns.
- **Restoration**: Calling `restoreItem` sets `status = "active"` and `consumedAt = null`, restoring the item into `totalItems` and active breakdowns.

---

## 3. AI Recipe Search Architecture

Recipe suggestions are powered by Groq and orchestrated through `recipeService.js`.

### Business & Safety Rules:
1. **Clean Inventory List**: Only eligible, unconsumed, non-expired food inventory (`category` in `Pantry`, `Dairy`, or `Other`) is provided to the AI model.
2. **Strict Exclusions**:
   - Consumed items (`status === "consumed"` or `consumedAt != null`) are **never** passed to the AI.
   - Expired items (`status === "expired"` or `expiryDate < today`) are **never** passed to the AI.
   - Items matching the user's `avoid` list are filtered out prior to prompt generation.
3. **Empty States**: If no eligible ingredients exist, the backend immediately returns a helpful message:
   `"Add available food items to receive recipe suggestions."` without making an unnecessary external API call.
4. **Provider Resilience**:
   - `GROQ_API_KEY` is loaded from backend environment variables and is never exposed to the client.
   - The Groq model is configurable via `GROQ_MODEL` (defaults to `openai/gpt-oss-20b`).
   - Requests are protected by a 25-second timeout and bounded retries (1 retry with exponential delay) for transient errors (HTTP 429, 503, network timeouts).
   - Markdown code fences (` ```json ... ``` `) are automatically stripped before JSON parsing.
   - Output schema is strictly validated and normalized to guarantee `{ recipes: [ ... ] }` structure with valid `ingredients`, `steps`, `prepTime`, and `servings`.

---

## 4. Backend Services & Files

| Service | Path | Responsibility |
|---|---|---|
| `inventoryService` | `backend/src/services/inventoryService.js` | CRUD, input validation, partial/full consumption, item restoration |
| `dashboardService` | `backend/src/services/dashboardService.js` | Authoritative summary metrics, expiring soon, recently consumed, category distribution |
| `analyticsService` | `backend/src/services/analyticsService.js` | Monthly overview, daily consumption charts, expired vs consumed isolation |
| `recipeService` | `backend/src/services/recipeService.js` | AI recipe generation, ingredient filtering, schema validation, recipe persistence |
| `notificationService`| `backend/src/services/notificationService.js` | Event recording, idempotent sync, notification listing and reads |
| `authService` | `backend/src/services/authService.js` | Registration, login, password hashing, JWT generation, cookie configuration |
| `inventoryCalculations` | `backend/src/utils/inventoryCalculations.js` | Single source of truth for active vs consumed inventory metrics |

---

## 5. Development & Testing Commands

### Backend Tests:
The backend utilizes Node.js's native test runner (`node:test`):
```bash
cd backend
npm test
```
The test suite covers:
- Complete inventory metric calculation rules (acceptance cases 1 through 8).
- Recipe output parsing, markdown fence removal, schema validation, and missing field fallback.
- Consumed and expired inventory exclusion invariants.
- Parameter validation, authorization checks, and error responses.

### Frontend Production Build & Lint:
```bash
cd smartstock
npm run lint
npm run build
```

---

## 6. Environment Variables

Reference template: `backend/.env.example`

| Variable | Description | Example |
|---|---|---|
| `PORT` | API server listen port | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for signing authentication tokens | `your_jwt_secret` |
| `NODE_ENV` | Runtime environment (`development` or `production`) | `development` |
| `GROQ_API_KEY` | Groq API Key for AI recipe generation | `gsk_...` |
| `GROQ_MODEL` | Groq chat model identifier | `openai/gpt-oss-20b` |
| `CLIENT_URL` | Allowed frontend origin for CORS | `http://localhost:5173` |
| `ALLOWED_ORIGINS` | Comma-separated list of additional CORS origins | `http://localhost:5173,https://smart-stock13.vercel.app` |
