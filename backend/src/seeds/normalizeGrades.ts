import { connect, disconnect, model } from 'mongoose';
import { GradeSchema } from '../categories/entities/grade.schema';

// Configuration
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://idcl:Imodcl%401..@v1.uzw7hnn.mongodb.net/primary';

async function normalizeGrades() {
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

    // Get all grades
    const grades = await GradeModel.find().exec();
    console.log(`Found ${grades.length} grades to normalize`);

    let updatedCount = 0;
    const duplicates: Array<{
      original: { id: any; category: string; grade: string };
      duplicate: { id: any; category: string; grade: string };
    }> = [];

    for (const grade of grades) {
      const normalizedCategory = grade.category.trim().toLowerCase();
      const normalizedGrade = grade.grade.trim().toLowerCase();

      // Check if normalization is needed
      if (grade.category !== normalizedCategory || grade.grade !== normalizedGrade) {
        // Check for potential duplicate after normalization
        const existingNormalized = await GradeModel.findOne({
          _id: { $ne: grade._id },
          category: normalizedCategory,
          grade: normalizedGrade
        }).exec();

        if (existingNormalized) {
          duplicates.push({
            original: {
              id: grade._id,
              category: grade.category,
              grade: grade.grade
            },
            duplicate: {
              id: existingNormalized._id,
              category: existingNormalized.category,
              grade: existingNormalized.grade
            }
          });
          console.log(`⚠️  Duplicate found: Grade ${grade.grade} for category ${grade.category} (ID: ${grade._id})`);
          console.log(`   Conflicts with: Grade ${existingNormalized.grade} for category ${existingNormalized.category} (ID: ${existingNormalized._id})`);
        } else {
          // Safe to update
          grade.category = normalizedCategory;
          grade.grade = normalizedGrade;
          await grade.save();
          updatedCount++;
          console.log(`✅ Updated: ${grade.grade} for ${grade.category}`);
        }
      }
    }

    console.log('\n=== Summary ===');
    console.log(`Total grades: ${grades.length}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Duplicates found: ${duplicates.length}`);

    if (duplicates.length > 0) {
      console.log('\n⚠️  WARNING: Duplicates detected!');
      console.log('Please manually review and delete duplicate entries:');
      duplicates.forEach((dup, index) => {
        console.log(`\n${index + 1}. Duplicate pair:`);
        console.log(`   Original: ID ${dup.original.id} - ${dup.original.grade} for ${dup.original.category}`);
        console.log(`   Duplicate: ID ${dup.duplicate.id} - ${dup.duplicate.grade} for ${dup.duplicate.category}`);
      });
    }

  } catch (error) {
    console.error('❌ Error normalizing grades:', error.message);
    process.exit(1);
  } finally {
    // Disconnect from MongoDB
    await disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  normalizeGrades().catch(console.error);
}

export { normalizeGrades };
