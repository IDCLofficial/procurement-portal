import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define schema interface
interface ICategory {
  sector: string;
  description:string;
}

// Define Mongoose schema
const categorySchema = new mongoose.Schema<ICategory>(
  {
    sector: { type: String, required: true },
    description: { type: String, required: true }
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
      {
        sector: 'Ministry of Education, Science & Technology',
        description: 'Imo State Ministry of Education, Science and Technology'
      },
      {
        sector: 'Ministry of Commerce, Industry & Tourism',
        description: 'Imo State Ministry of Commerce, Industry and Tourism'
      },
      {
        sector: 'Ministry of Finance',
        description: 'Imo State Ministry of Finance'
      },
      {
        sector: 'Ministry of Health, Women Affairs & Social Development',
        description: 'Imo State Ministry of Health, Women Affairs and Social Development'
      },
      {
        sector: 'Ministry of Lands, Survey, Housing & Urban Planning',
        description: 'Imo State Ministry of Lands, Survey, Housing and Urban Planning'
      },
      {
        sector: 'Ministry of Agriculture & Natural Resources',
        description: 'Imo State Ministry of Agriculture and Natural Resources'
      },
      {
        sector: 'Ministry of Justice',
        description: 'Imo State Ministry of Justice'
      },
      {
        sector: 'Ministry of Works & Transport',
        description: 'Imo State Ministry of Works and Transport'
      },
      {
        sector: 'Ministry of Information, Culture & Tourism',
        description: 'Imo State Ministry of Information, Culture and Tourism'
      },
      {
        sector: 'Ministry of Internal Resources & Pension Matters',
        description: 'Imo State Ministry of Internal Resources and Pension Matters'
      },
      {
        sector: 'Ministry of Community Government, Culture & Traditional Affairs',
        description: 'Imo State Ministry of Community Government, Culture and Traditional Affairs'
      },
      {
        sector: 'Ministry of Public Safety, Youth & Sports',
        description: 'Imo State Ministry of Public Safety, Youth and Sports'
      },
      {
        sector: 'Ministry of Local Government & Rural Development',
        description: 'Imo State Ministry of Local Government and Rural Development'
      }
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