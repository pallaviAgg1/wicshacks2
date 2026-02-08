# SafeNav Backend

Custom Express + PostgreSQL backend replacing Base44 BaaS.

## Setup

### 1. Install PostgreSQL
Download and install PostgreSQL from https://www.postgresql.org/download/

### 2. Create Database
```bash
# Open PostgreSQL CLI
psql -U postgres

# Create database
CREATE DATABASE safenav_db;

# Exit
\q
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

### 4. Configure .env
Edit `backend/.env` with your PostgreSQL credentials:
```
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/safenav_db"
PORT=3001
NODE_ENV="development"
```

### 5. Run Prisma Migrations
```bash
npm run prisma:migrate
```
This creates the CrowdReport and SOSRequest tables.

### 6. Start Backend
```bash
npm run dev
```

Server runs on `http://localhost:3001`

## API Endpoints

### Crowd Reports
- `GET /api/entities/CrowdReport` - List all reports
- `GET /api/entities/CrowdReport/:id` - Get single report
- `POST /api/entities/CrowdReport` - Create report
- `PUT /api/entities/CrowdReport/:id` - Update report
- `DELETE /api/entities/CrowdReport/:id` - Delete report

### SOS Requests
- `GET /api/entities/SOSRequest` - List all requests
- `GET /api/entities/SOSRequest/:id` - Get single request
- `POST /api/entities/SOSRequest` - Create request
- `PUT /api/entities/SOSRequest/:id` - Update request
- `DELETE /api/entities/SOSRequest/:id` - Delete request

## Development

### Prisma Studio (GUI for database)
```bash
npm run prisma:studio
```
Opens http://localhost:5555 to manage data visually.

### Update Schema
1. Edit `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
