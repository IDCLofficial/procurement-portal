import { connect, disconnect, model } from 'mongoose';
import { GradeSchema } from '../categories/entities/grade.schema';

// Configuration
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://idcl:Imodcl%401..@v1.uzw7hnn.mongodb.net/primary';

async function fixGradeIndexes() {
  try {
    // Connect to MongoDB
    await connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Register Grade model
    let GradeModel;
    try {
      GradeModel = model('Grade');
    } catch {
      GradeModel = model('Grade', GradeSchema);
    }

    // Get existing indexes
    const indexes = await GradeModel.collection.getIndexes();
    console.log('\nCurrent indexes:');
    console.log(JSON.stringify(indexes, null, 2));

    // Drop the problematic single-field grade index if it exists
    if (indexes['grade_1']) {
      console.log('\n⚠️  Found single-field "grade_1" index. Dropping it...');
      await GradeModel.collection.dropIndex('grade_1');
      console.log('✅ Successfully dropped "grade_1" index');
    } else {
      console.log('\n✅ No problematic "grade_1" index found');
    }

    // Ensure the compound index exists
    console.log('\nEnsuring compound index { category: 1, grade: 1 } exists...');
    await GradeModel.collection.createIndex(
      { category: 1, grade: 1 },
      { unique: true }
    );
    console.log('✅ Compound index created/verified');

    // Show final indexes
    const finalIndexes = await GradeModel.collection.getIndexes();
    console.log('\nFinal indexes:');
    console.log(JSON.stringify(finalIndexes, null, 2));

    console.log('\n✅ Index fix completed successfully!');
    console.log('You can now create grades with the same grade letter for different categories.');

  } catch (error) {
    console.error('❌ Error fixing indexes:', error.message);
    process.exit(1);
  } finally {
    // Disconnect from MongoDB
    await disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  fixGradeIndexes().catch(console.error);
}

export { fixGradeIndexes };
