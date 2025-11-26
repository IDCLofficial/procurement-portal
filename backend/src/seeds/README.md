# Database Seed Scripts

Scripts to populate the database with sample data for development and testing.

## Available Seeds

### 1. Applications Seed
Seeds 10 sample applications with various statuses.

```bash
npm run seed:applications
```

### 2. Super Admin Seed
Seeds a demo super admin user for initial system access.

```bash
npm run seed:admin
```

**Default Credentials:**
- **Email:** `admin@procurement.gov.ng`
- **Password:** `Admin@123456`
- **Role:** Admin (highest role)

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

### 5. Grades Seed
Seeds vendor grade classifications with registration costs and financial capacity requirements.

```bash
npm run seed:grades
```

**Grades Seeded:**
- Grade A
- Grade B
- Grade C
- Grade D

### 6. SLA Timer Seed
Seeds the default SLA (Service Level Agreement) timer configuration for application processing.

```bash
npm run seed:sla
```

**Default SLA Configuration:**
- Desk Officer Review: 5 business days
- Registrar Review: 3 business days
- Clarification Response: 7 business days
- Payment Verification: 2 business days
- Total Processing Target: 10 business days

### 7. Certificates Seed
Seeds 10 sample certificates for approved vendors.

```bash
npm run seed:certificates
```

**Requirements:**
- Vendors must exist in the database before running this seed
- Each certificate is linked to an existing vendor

**Certificates Include:**
- Unique certificate IDs (CERT-2024-001 to CERT-2024-010)
- Contractor names and RC/BN numbers
- Grade classifications (A, B, C, D)
- LGA assignments
- Validity dates
- Approved status

## What They Do

### Applications Seed
- Connects to MongoDB using `MONGO_URI` from your `.env` file
- Inserts 10 sample applications with various statuses (PENDING, APPROVED, REJECTED)
- Closes the connection when done

### Super Admin Seed
- Connects to MongoDB using `MONGO_URI` from your `.env` file
- Checks if super admin already exists (prevents duplicates)
- Hashes the password using bcrypt
- Creates a super admin user with Admin role
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

### Grades Seed
- Connects to MongoDB using `MONGO_URI` from your `.env` file
- Checks if grades already exist (prevents duplicates)
- Inserts 4 vendor grade classifications (A, B, C, D)
- Each grade has registration cost and financial capacity requirements
- Closes the connection when done

### SLA Timer Seed
- Connects to MongoDB using `MONGO_URI` from your `.env` file
- Checks if SLA configuration already exists (prevents duplicates)
- Creates default SLA timer configuration with 5 business day timers
- Automatically creates configuration if none exists
- Closes the connection when done

### Certificates Seed
- Connects to MongoDB using `MONGO_URI` from your `.env` file
- Fetches existing vendors from the database
- Checks if certificates already exist (prevents duplicates)
- Creates 10 sample certificates linked to existing vendors
- Each certificate includes contractor details, grade, LGA, and validity period
- Displays summary of created certificates
- Closes the connection when done

## Running All Seeds

To set up a fresh database with all seed data, run the scripts in this order:

```bash
npm run seed:admin
npm run seed:categories
npm run seed:grades
npm run seed:documents
npm run seed:sla
npm run seed:applications
npm run seed:certificates
```

**Note:** The `seed:certificates` script requires vendors to exist in the database. Make sure vendors are created (either manually or through the application flow) before running this seed.

## Prerequisites

Make sure your `.env` file has the `MONGO_URI` configured before running any seed script.

Example:
```
MONGO_URI=mongodb://localhost:27017/procurement-portal
```
