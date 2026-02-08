# Migration from Base44 to Custom Backend

This guide shows how to migrate from Base44 BaaS to the new Express + PostgreSQL backend.

## Step 1: Update .env

Rename `.env.new` to `.env` or manually add:
```env
VITE_API_URL=http://localhost:3001
```

## Step 2: Install Backend

```bash
cd backend
npm install
```

## Step 3: Setup PostgreSQL

1. Download PostgreSQL: https://www.postgresql.org/download/
2. Create database:
   ```bash
   psql -U postgres
   CREATE DATABASE safenav_db;
   \q
   ```
3. Update `backend/.env` with your PostgreSQL credentials

## Step 4: Run Migrations

```bash
cd backend
npm run prisma:migrate
```

This creates `CrowdReport` and `SOSRequest` tables.

## Step 5: Start Backend

```bash
cd backend
npm run dev
```

Server runs on `http://localhost:3001`

## Step 6: Update Frontend Imports

**Old (Base44):**
```javascript
import { base44 } from '@/api/base44Client';
await base44.entities.CrowdReport.create({...});
```

**New (Custom Backend):**
```javascript
import { apiClient } from '@/api/apiClient';
await apiClient.entities.CrowdReport.create({...});
```

### Files to Update

Search your project for `base44.entities` and replace with `apiClient.entities`:

1. **src/pages/Home.jsx**
   - Line ~32: `base44.entities.CrowdReport.filter()` → `apiClient.entities.CrowdReport.filter()`

2. **src/components/ReportForm.jsx**
   - Line ~35: `base44.entities.CrowdReport.create()` → `apiClient.entities.CrowdReport.create()`

3. **src/components/SOSButton.jsx**
   - Line ~70: `base44.entities.SOSRequest.create()` → `apiClient.entities.SOSRequest.create()`

4. **src/lib/AuthContext.jsx**
   - Remove all Base44 auth calls (no auth needed for this public app)
   - Remove `base44.auth.me()` calls

## API Compatibility

The new `apiClient` matches the Base44 SDK interface:

```javascript
// All of these work the same:
await apiClient.entities.CrowdReport.filter({ status: 'active' }, '-created_date', 50);
await apiClient.entities.CrowdReport.create(data);
await apiClient.entities.CrowdReport.get(id);
await apiClient.entities.CrowdReport.update(id, data);
await apiClient.entities.CrowdReport.delete(id);

// Same for SOSRequest
await apiClient.entities.SOSRequest.filter({...});
await apiClient.entities.SOSRequest.create({...});
```

## Database Management

### Prisma Studio (GUI)
```bash
cd backend
npm run prisma:studio
```
Opens http://localhost:5555 to view/edit data visually.

### View Database
```bash
psql -U postgres -d safenav_db
\dt              # List tables
SELECT * FROM "CrowdReport";
SELECT * FROM "SOSRequest";
\q
```

## Troubleshooting

**"Cannot find module '@prisma/client'"**
```bash
cd backend
npm install
```

**"connect ECONNREFUSED 127.0.0.1:5432"**
- PostgreSQL not running
- Check your `DATABASE_URL` in `backend/.env`

**"database does not exist"**
- Create database: `CREATE DATABASE safenav_db;`
- Run migrations: `npm run prisma:migrate`

**Backend won't start**
```bash
npm run dev
# Check for error messages
# Ensure PostgreSQL is running
# Check port 3001 isn't in use
```

## Comparison

| Feature | Base44 | Express + PostgreSQL |
|---------|--------|----------------------|
| **Auth** | Token-based | No auth (public) |
| **Database** | Managed cloud | Local PostgreSQL |
| **Hosting** | SaaS (paid) | Self-hosted (free) |
| **Data Ownership** | Base44 | You own it |
| **Cost** | Monthly subscription | ~$0 (local dev) |
| **Learning** | Black box | Full control & visibility |
