# Lagrange

Lagrange is a web-based aquaculture management platform designed to help fish farmers manage ponds, production cycles, feed usage, fish populations, and health monitoring from a single dashboard.

## Features

* User management and authentication
* Pond management
* Pond cycle tracking
* Feed management
* Fish type management
* Pond member management
* Fish health and spike log tracking
* Reporting and data export
* Modern React frontend
* RESTful Express API backend

## Tech Stack

### Backend

* Node.js
* Express.js
* MySQL
* db-migrate
* JWT Authentication
* Express Middleware

### Frontend

* React
* Vite
* React Router

### Infrastructure

* npm Workspaces (Monorepo)
* MySQL Database

---

## Project Structure

```text
lagrange/
├── apps/
│   ├── api/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   ├── src/
│   │   └── package.json
│   │
│   └── web/
│       ├── src/
│       ├── public/
│       ├── vite.config.js
│       └── package.json
│
├── package.json
├── package-lock.json
└── README.md
```

---

## Prerequisites

Before running the application, make sure you have:

* Node.js 20+
* npm 11+
* MySQL 8+

Verify installation:

```bash
node -v
npm -v
mysql --version
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd lagrange
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create an environment file:

```bash
cp apps/api/.env.example apps/api/.env
```

Example:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=lagrange
DB_USER=root
DB_PASSWORD=password

JWT_SECRET=your-secret-key
```

---

## Database Migration

Run migrations:

```bash
npm run migrate --workspace=lagrangeapi
```

Rollback the latest migration:

```bash
npm run migrate:down --workspace=lagrangeapi
```

Create a new migration:

```bash
npm run migrate:create --workspace=lagrangeapi -- migration-name
```

---

## Running the Application

### Backend

```bash
npm run dev:api
```

Backend will be available at:

```text
http://localhost:3000
```

### Frontend

```bash
npm run dev:web
```

Frontend will be available at:

```text
http://localhost:5173
```

---

## Production Build

Build the frontend:

```bash
npm run build --workspace=lagrangeweb
```

Start the backend:

```bash
npm run start --workspace=lagrangeapi
```

---

## API Endpoints

Example API routes:

```text
POST   /api/auth/login
POST   /api/auth/register

GET    /api/users
POST   /api/users

GET    /api/pools
POST   /api/pools

GET    /api/pools/:id
PUT    /api/pools/:id
DELETE /api/pools/:id
```

Additional routes may be available depending on the application version.

---

## Development Workflow

Install a dependency for the backend:

```bash
npm install <package-name> --workspace=lagrangeapi
```

Install a dependency for the frontend:

```bash
npm install <package-name> --workspace=lagrangeweb
```

Run backend:

```bash
npm run dev:api
```

Run frontend:

```bash
npm run dev:web
```

---

## License

This project is licensed under the MIT License.
