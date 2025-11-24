import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define enums
enum GradeType {
  A = "A",
  B = "B",
  C = "C",
  D = "D"
}

// Define schema interface
interface IGrade {
  grade: GradeType;
  registrationCost: number;
  financialCapacity: number;
}

// Define Mongoose schema
const gradeSchema = new mongoose.Schema<IGrade>(
  {
    grade: { type: String, enum: Object.values(GradeType), required: true, unique: true },
    registrationCost: { type: Number, required: true },
    financialCapacity: { type: Number, required: true }
  },
  { timestamps: true }
);

// Create model
const GradeModel = mongoose.model<IGrade>('grades', gradeSchema);

async function seedGrades() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/procurement';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing grades
    await GradeModel.deleteMany({});
    console.log('Cleared existing grades');

    // Grades data based on the UI
    const grades: IGrade[] = [
      {
        grade: GradeType.A,
        registrationCost: 150000,
        financialCapacity: 150000
      },
      {
        grade: GradeType.B,
        registrationCost: 100000,
        financialCapacity: 150000
      },
      {
        grade: GradeType.C,
        registrationCost: 70000,
        financialCapacity: 150000
      },
      {
        grade: GradeType.D,
        registrationCost: 40000,
        financialCapacity: 150000
      }
    ];

    // Insert grades
    await GradeModel.insertMany(grades);

    console.log(`✅ Successfully seeded ${grades.length} grades`);
    console.log('   Grade A: ₦150,000 registration, ₦150,000 capacity');
    console.log('   Grade B: ₦100,000 registration, ₦150,000 capacity');
    console.log('   Grade C: ₦70,000 registration, ₦150,000 capacity');
    console.log('   Grade D: ₦40,000 registration, ₦150,000 capacity');
    
    // Close connection
    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedGrades()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });