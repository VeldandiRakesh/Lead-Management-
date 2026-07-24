# LeadFlow CRM – Full Stack Lead Management System

**LeadFlow CRM** is a production-ready, full-stack customer relationship management application designed to track, organize, and transition customer acquisition pipelines. Built with React (Vite) and Node.js (Express), it leverages SQLite for database persistence and secures routes via JSON Web Tokens (JWT) with role-based access control.

---

## 1. Project Overview
LeadFlow CRM provides sales teams and administrators with a unified workspace to monitor leads, log transaction timelines, and review activity history logs. 
- **Roles & Permissions**: Access boundaries are enforced between administrative figures and general representatives.
- **Client Integrity**: The portal bridges real-time CRUD operations, CSV/PDF exporting utilities, and debounced database searches.

---

## 2. Key Features

### Authentication & Authorization
- **JWT Login**: Secure token-based sessions saved in local storage and HTTP headers.
- **Session Recovery**: Checks signature credentials on page reloads to maintain states.
- **Guarded Navigation**: Protections on `/dashboard`, `/leads`, `/profile`, `/settings`, and `/audit-log` paths.
- **Role-Based Rules**: Lowercase roles (`admin` and `member`) hide/show sidebar items and enforce API access bounds.

### Lead Management
- **Full CRUD Operations**: Create leads, view profiles, edit properties, or delete opportunities (Admin only).
- **Interactive Comment Notes**: Add conversation notes on profiles. Logs the author name, date, and time.
- **Change Activity Streams**: Dynamically logs edits (status changes, representative re-assignments) in an audit list.
- **Advanced Dashboard**: Visualizes status progress distribution and monthly trends using responsive SVG elements.

### Workspace Controls
- **Bulk Operations**: Perform batch status updates, batch representative reassignments, or batch deletes.
- **Data Exporter**: Downloads checked leads directly into a formatted CSV sheet.
- **Print Reports**: Generates print-optimized windows layout for browser PDF print engines.
- **Debounced Searches**: Prevents excessive API queries by delaying search inputs by 500ms.
- **Theme Color Personalization**: Select branding colors (Indigo, Violet, Blue, Emerald, Rose) and toggle Light/Dark modes.

---

## 3. Technology Stack

### Frontend Architecture
- **Framework**: React.js (Vite environment)
- **Styling**: Tailwind CSS (Tailwind v4)
- **Icons**: React Icons (Feather Icons pack)
- **API Client**: Axios (configured with request/response interceptors)
- **Routing**: React Router DOM (Lazy loaded page routes and code splitting)

### Backend Architecture
- **Runtime**: Node.js
- **Server**: Express.js
- **Database Engine**: Native `node:sqlite` (SQLite binary wrapper, zero C++ compilation steps required)
- **Security**: JWT (`jsonwebtoken`) and password salting (`bcrypt`)

---

## 4. Folder Structure

The project repository divides cleanly between client-side assets and server configurations:

```
Lead-Management/
  ├── backend/                      # Express.js Server API
  │     ├── src/
  │     │     ├── config/           # SQLite connection & env loaders
  │     │     ├── controllers/      # REST endpoint handlers
  │     │     ├── middleware/       # JWT auth, error & rate limiters
  │     │     ├── repositories/     # SQLite database SQL abstractions
  │     │     ├── routes/           # Endpoint path mappings
  │     │     ├── validators/       # express-validator schemas
  │     │     ├── utils/            # Standard response helpers
  │     │     ├── database/         # leadflow.db SQLite file
  │     │     ├── logs/
  │     │     ├── app.js            # Express middlewares registry
  │     │     └── server.js         # Entry server launcher & signals
  │     ├── .env.example
  │     ├── package.json
  │     └── README.md
  │
  ├── src/                          # React Frontend Application
  │     ├── components/             # Reusable cards, dialogs & buttons
  │     ├── context/                # Auth, Lead & Toast contexts
  │     ├── hooks/                  # useDebounce custom hook
  │     ├── layouts/                # DashboardLayout sidebar frame
  │     ├── pages/                  # Lazy pages (Dashboard, Leads, AuditLog, etc.)
  │     ├── services/               # api.js Axios configuration
  │     ├── styles/                 # index.css Tailwind entry
  │     ├── App.jsx                 # Routing and Suspense configurations
  │     └── main.jsx
  │
  ├── package.json
  └── README.md                     # Global System documentation
```

---

## 5. Installation & Setup

### 1. Configure Environment Variables
Inside the `/backend` directory, duplicate the template file and create a `.env` configuration:
```bash
cd backend
cp .env.example .env
```
Ensure you inspect the variables and set parameters like your `PORT` or `JWT_SECRET`.

### 2. Set Up the Backend Server
Install dependencies and run the Node development server:
```bash
npm install
npm run dev
```

### 3. Set Up the Frontend Application
In a separate terminal window at the project root directory, install dependencies and launch Vite:
```bash
npm install
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## 6. Environment Variables (Backend)

The server relies on the following configurations in `/backend/.env`:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | HTTP Server port listener | `5000` |
| `NODE_ENV` | Mode of deployment environment | `development` |
| `DB_PATH` | Path location of the SQLite database | `./src/database/leadflow.db` |
| `JWT_SECRET` | Secret signature key for JWT | `your_secret_passphrase_key_here` |
| `CLIENT_URL` | Trusted client URL origin for CORS policy | `http://localhost:5173` |

---

## 7. Core REST API Endpoints

All private endpoints require the header `Authorization: Bearer <JWT_TOKEN>`.

### Authentication APIs
* `POST /api/auth/login` - Sign in, generate cookie/JWT.
* `POST /api/auth/logout` - Clear cookies and terminate session.
* `GET /api/auth/me` - [Private] Retrieve active user session profile.

### Leads & Notes APIs
* `GET /api/leads` - [Private] Paginated search, filters, and sorted lead list.
* `GET /api/leads/:id` - [Private] Get lead profile, notes, and activity log.
* `POST /api/leads` - [Private] Register a new lead opportunity.
* `PUT /api/leads/:id` - [Private] Modify lead attributes. Logs change activity.
* `DELETE /api/leads/:id` - [Private] [Admin Only] Delete lead and cascade child data.
* `POST /api/leads/:id/notes` - [Private] Post a comment to a lead timeline.

---

## 8. Demo Accounts & Credentials

The SQLite engine automatically seeds the following credentials if the `users` table is empty:

### Administrative Account (Admin Role)
- **Email**: `admin@leadflow.com`
- **Password**: `Admin123`
- **Permissions**: Can view all tabs (including Users, Settings, and system-wide Audit Logs) and execute lead deletions.

### Representative Account (Member Role)
- **Email**: `member@leadflow.com`
- **Password**: `Member123`
- **Permissions**: Restricted. Settings, Users, and Audit Logs tabs are hidden. Deletion requests are rejected with a 403 status.

---

## 9. Interface Demonstration (Screenshots)

* **Sign In Portal**:
  `![Sign In Portal Mockup Placeholder](./src/assets/login_placeholder.png)`
* **Overview Analytics Dashboard**:
  `![Dashboard Mockup Placeholder](./src/assets/dashboard_placeholder.png)`
* **Leads Directory Directory Grid**:
  `![Leads Grid Mockup Placeholder](./src/assets/leads_placeholder.png)`
* **Audit Transaction Trails**:
  `![Audit Log Mockup Placeholder](./src/assets/audit_placeholder.png)`

---

## 10. Future System Improvements
- **Real-Time WebSockets Alerts**: Immediate browser toast notification signals upon assignments.
- **Direct Email Integration**: Sync Outlook/Gmail streams to send proposals from lead profile pages.
- **Shared Calendar Dashboard**: Intersect callbacks with Google Calendar schedulers.
- **SMS/WhatsApp Triggers**: Automate message alerts to check new lead inquiries.

---

## 11. Author

**Rakesh Veldandi**  
- **GitHub**: [https://github.com/rakesh-veldandi-placeholder](https://github.com/rakesh-veldandi-placeholder)  
- **LinkedIn**: [https://linkedin.com/in/rakesh-veldandi-placeholder](https://linkedin.com/in/rakesh-veldandi-placeholder)
#   L e a d - M a n a g e m e n t -  
 