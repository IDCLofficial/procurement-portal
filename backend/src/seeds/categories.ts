import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define schema interface
interface ICategory {
  sector: string;
}

// Define Mongoose schema
const categorySchema = new mongoose.Schema<ICategory>(
  {
    sector: { type: String, required: true }
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

    // Categories data
    const categories: ICategory[] = [
      { sector: 'works' },
      { sector: 'supplies' },
      { sector: 'ict' },
      { sector: 'services' }
    ];

    // Insert categories
    await CategoryModel.insertMany(categories);

    console.log(`✅ Successfully seeded ${categories.length} categories`);
    console.log(`   Sectors: ${categories.map(c => c.sector).join(', ')}`);
    
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