import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define enums
enum Grade {
  A = "A",
  B = "B",
  C = "C"
}

// Define schema interface
interface ICategory {
  sector: string;
  grade: Grade;
  fee: number;
  effectiveDate: string;
}

// Define Mongoose schema
const categorySchema = new mongoose.Schema<ICategory>(
  {
    sector: { type: String, required: true },
    grade: { type: String, enum: Object.values(Grade), required: true },
    fee: { type: Number, required: true },
    effectiveDate: { type: String, required: true }
  },
  { timestamps: true }
);

// Create model
const CategoryModel = mongoose.model<ICategory>('categories', categorySchema);

async function seedCategories() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/procurement';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await CategoryModel.deleteMany({});
    console.log('Cleared existing categories');

    // Get current date for effectiveDate
    const currentDate = new Date().toISOString().split('T')[0];

    // Categories data - each sector with all grades
    const sectors = ['works', 'supplies', 'ict', 'services'];
    const categories: ICategory[] = [];

    // Generate categories for each sector with all grades
    for (const sector of sectors) {
      // Grade A
      categories.push({
        sector: sector,
        grade: Grade.A,
        fee: 100000,
        effectiveDate: currentDate
      });

      // Grade B
      categories.push({
        sector: sector,
        grade: Grade.B,
        fee: 75000,
        effectiveDate: currentDate
      });

      // Grade C
      categories.push({
        sector: sector,
        grade: Grade.C,
        fee: 50000,
        effectiveDate: currentDate
      });
    }

    // Insert categories
    await CategoryModel.insertMany(categories);

    console.log(`✅ Successfully seeded ${categories.length} categories`);
    console.log(`   - ${sectors.length} sectors: ${sectors.join(', ')}`);
    console.log(`   - 3 grades per sector (A, B, C)`);
    
    // Close connection
    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedCategories()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });