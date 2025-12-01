import { connect, connection } from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/procurement';

async function migrateApplicationStatus() {
  try {
    console.log('Connecting to MongoDB...');
    await connect(MONGO_URI);
    console.log('Connected successfully');

    const db = connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    const applicationsCollection = db.collection('applications');

    // Find all applications where applicationStatus is a string (old format)
    const applicationsToMigrate = await applicationsCollection
      .find({
        $or: [
          { applicationStatus: { $type: 'string' } },
          { currentStatus: { $exists: false } }
        ]
      })
      .toArray();

    console.log(`Found ${applicationsToMigrate.length} applications to migrate`);

    let migratedCount = 0;

    for (const app of applicationsToMigrate) {
      const oldStatus = typeof app.applicationStatus === 'string' 
        ? app.applicationStatus 
        : 'Pending Desk Review';

      // Convert old status to new format
      const newApplicationStatus = [{
        status: oldStatus,
        timestamp: app.submissionDate || app.createdAt || new Date(),
        notes: 'Migrated from old format'
      }];

      await applicationsCollection.updateOne(
        { _id: app._id },
        {
          $set: {
            applicationStatus: newApplicationStatus,
            currentStatus: oldStatus
          }
        }
      );

      migratedCount++;
      console.log(`Migrated application ${app.applicationId || app._id}`);
    }

    console.log(`\nMigration completed successfully!`);
    console.log(`Total applications migrated: ${migratedCount}`);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await connection.close();
    console.log('Database connection closed');
  }
}

// Run the migration
migrateApplicationStatus();
