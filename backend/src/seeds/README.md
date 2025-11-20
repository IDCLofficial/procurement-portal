# Database Seed Scripts

Scripts to populate the database with sample data for development and testing.

## Available Seeds

### 1. Applications Seed
Seeds 10 sample applications with various statuses.

```bash
npm run seed
```

### 2. Super Admin Seed
Seeds a demo super admin user for initial system access.

```bash
npm run seed:admin
```

**Default Credentials:**
- **Email:** `admin@procurement.gov.ng`
- **Password:** `Admin@123456`
- **Role:** Registrar (highest role)

⚠️ **Important:** Change the password immediately after first login!

## What They Do

### Applications Seed
- Connects to MongoDB using `MONGO_URI` from your `.env` file
- Inserts 10 sample applications with various statuses (PENDING, APPROVED, REJECTED)
- Closes the connection when done

### Super Admin Seed
- Connects to MongoDB using `MONGO_URI` from your `.env` file
- Checks if super admin already exists (prevents duplicates)
- Hashes the password using bcrypt
- Creates a super admin user with Registrar role
- Displays login credentials in the console
- Closes the connection when done

## Prerequisites

Make sure your `.env` file has the `MONGO_URI` configured before running any seed script.

Example:
```
MONGO_URI=mongodb://localhost:27017/procurement-portal
```
