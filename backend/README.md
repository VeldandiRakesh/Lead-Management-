# LeadFlow CRM - Backend Foundation API Server

This directory contains the Express.js and SQLite backend API server foundation for the **LeadFlow CRM** application.

---

## Technical Stack
- **Runtime**: Node.js (v22.5.0+)
- **Server Framework**: Express.js
- **Database Engine**: SQLite via Node.js native `node:sqlite` (no compiler tools required)
- **Security & Utilities**:
  - `cors` (Cross-Origin Resource Sharing restrictions)
  - `helmet` (Secure HTTP headers)
  - `morgan` (Request logging)
  - `compression` (Response payload compression)
  - `express-rate-limit` (IP-based global rate limiting)
  - `cookie-parser` (HTTP-only cookie parsing)

---

## Folder Structure

The server layout follows a modular clean architecture:

```
backend/
  ├── src/
  │     ├── config/
  │     │     ├── database.js  # SQLite connection handle using better-sqlite3
  │     │     └── env.js       # Validated environment loader
  │     ├── controllers/       # HTTP controllers (empty placeholder)
  │     ├── routes/            # Route maps
  │     │     └── health.routes.js
  │     ├── middleware/        # Global error, 404, and rate limit intercepts
  │     │     ├── error.middleware.js
  │     │     └── rateLimit.middleware.js
  │     ├── services/          # Business logic handlers (empty placeholder)
  │     ├── models/            # Schema declarations (empty placeholder)
  │     ├── repositories/      # Database abstraction layer (empty placeholder)
  │     ├── validators/        # Schema validators (empty placeholder)
  │     ├── utils/             # Helpers and response wrappers
  │     │     └── response.js
  │     ├── database/          # SQLite active database binaries (.db / WAL logs)
  │     │     └── leadflow.db
  │     ├── logs/              # Log files output
  │     ├── app.js             # Express middlewares registry
  │     └── server.js          # Startup listener and graceful shutdown rules
  ├── .env.example             # Local configuration templates
  ├── package.json             # Commands and dependencies
  └── README.md                # Documentation guide
```

---

## Installation & Setup

### 1. Pre-requisites
- Ensure you have **Node.js** (v18+) installed.

### 2. Set Up Environment File
Clone the template configuration file:
```bash
cp .env.example .env
```
Ensure you inspect the newly created `.env` file to customize parameters like `PORT` or `CLIENT_URL`.

### 3. Install Dependencies
Run the package installer from the `backend/` directory:
```bash
npm install
```

---

## Available Run Commands

### Start in Development Mode (Hot Reloading via Nodemon)
```bash
npm run dev
```

### Start in Production Mode
```bash
npm start
```

---

## Verification Endpoints
When running locally (defaulting to port `5000`), you can query:

- **Health Probe**:
  - **Method**: `GET`
  - **URL**: `http://localhost:5000/api/health`
  - **Response**:
    ```json
    {
      "success": true,
      "message": "LeadFlow API Running"
    }
    ```
