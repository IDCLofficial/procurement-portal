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

### 3. Document Presets Seed
Seeds verification document presets required for vendor registration.

```bash
npm run seed:documents
```

**Documents Seeded:**
- CAC Incorporation Certificate
- Tax Clearance Certificate (TCC)
- PENCOM Compliance Certificate
- ITF Certificate
- NSITF Certificate
- Sworn Affidavit of Authenticity
- Bank Reference Letter
- Past Project References

### 4. Categories Seed
Seeds procurement categories/sectors.

```bash
npm run seed:categories
```

**Categories Seeded:**
- Works
- Supplies
- ICT
- Services

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

### Document Presets Seed
- Connects to MongoDB using `MONGO_URI` from your `.env` file
- Clears existing document presets
- Inserts 8 verification document presets with expiry and renewal settings
- Each document has `isRequired`, `hasExpiry`, and `renewalFrequency` properties
- Closes the connection when done

### Categories Seed
- Connects to MongoDB using `MONGO_URI` from your `.env` file
- Clears existing categories
- Inserts 4 procurement sector categories
- Closes the connection when done

## Running All Seeds

To set up a fresh database with all seed data, run the scripts in this order:

```bash
npm run seed:admin
npm run seed:categories
npm run seed:documents
npm run seed
```

## Prerequisites

Make sure your `.env` file has the `MONGO_URI` configured before running any seed script.

Example:
```
MONGO_URI=mongodb://localhost:27017/procurement-portal
```
