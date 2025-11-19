# Database Seed Script

Simple script to populate the database with sample application data.

## Usage

```bash
npm run seed
```

This will seed 10 sample applications to your database.

## What it does

- Connects to MongoDB using `MONGO_URI` from your `.env` file
- Inserts 10 sample applications with various statuses (PENDING, APPROVED, REJECTED)
- Closes the connection when done

## Note

Make sure your `.env` file has the `MONGO_URI` configured before running the seed script.
