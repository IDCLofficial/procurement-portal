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
        sector: 'Ministry of Women Affairs',
        description: 'Imo State Ministry of Women Affairs'
      },
      {
        sector: 'Ministry of Transport',
        description: 'Imo State Ministry of Transport'
      },
      {
        sector: 'Ministry of Health',
        description: 'Imo State Ministry of Health'
      },
      {
        sector: 'Ministry of Mines, Industry',
        description: 'Imo State Ministry of Mines, Industry'
      },
      {
        sector: 'Ministry of Works',
        description: 'Imo State Ministry of Works'
      },
      {
        sector: 'Ministry of Education (Primary/Secondary)',
        description: 'Imo State Ministry of Education (Primary/Secondary)'
      },
      {
        sector: 'Ministry of Tertiary Education',
        description: 'Imo State Ministry of Tertiary Education'
      },
      {
        sector: 'Ministry of Homeland Security',
        description: 'Imo State Ministry of Homeland Security'
      },
      {
        sector: 'Ministry of Rural Development & Economic Empowerment',
        description: 'Imo State Ministry of Rural Development & Economic Empowerment'
      },
      {
        sector: 'Ministry of Petroleum & Natural Gas Development',
        description: 'Imo State Ministry of Petroleum & Natural Gas Development'
      },
      {
        sector: 'Ministry of Budget Planning',
        description: 'Imo State Ministry of Budget Planning'
      },
      {
        sector: 'Ministry of Youth Development & Talent Hunt',
        description: 'Imo State Ministry of Youth Development & Talent Hunt'
      },
      {
        sector: 'Ministry of  Culture and Tourism',
        description: 'Imo State Ministry of  Culture and Tourism'
      },
      {
        sector: 'Ministry of Agriculture and Food Security',
        description: 'Imo State Ministry of Agriculture and Food Security'
      },
      {
        sector: 'Head of Service',
        description: 'Imo State Head of Service'
      },
      {
        sector: 'Ministry of Humanitarian Affairs',
        description: 'Imo State Ministry of Humanitarian Affairs'
      },
      {
        sector: 'Ministry of Information & Startegy',
        description: 'Imo State Ministry of Information & Startegy'
      },
      {
        sector: 'Ministry of Power & Electrification',
        description: 'Imo State Ministry of Power & Electrification'
      },
      {
        sector: 'Ministry of Digital Economy',
        description: 'Imo State Ministry of Digital Economy'
      },
      {
        sector: 'Ministry of Science & Technology',
        description: 'Imo State Ministry of Science & Technology'
      },
      {
        sector: 'Ministry of Special Duties',
        description: 'Imo State Ministry of Special Duties'
      },
      {
        sector: 'Ministry of Lands, Survey & Physical Planning',
        description: 'Imo State Ministry of Lands, Survey & Physical Planning'
      },
      {
        sector: 'Ministry of Sports',
        description: 'Imo State Ministry of Sports'
      },
      {
        sector: 'Ministry of Special Project',
        description: 'Imo State Ministry of Special Project'
      },
      {
        sector: 'Ministry of Justice and Attorney General',
        description: 'Imo State Ministry of Justice and Attorney General'
      },
      {
        sector: 'Ministry of Local Government Area',
        description: 'Imo State Ministry of Local Government Area'
      },
      {
        sector: 'Ministry of Labour & Employment',
        description: 'Imo State Ministry of Labour & Employment'
      },
      {
        sector: 'Ministry of Environment',
        description: 'Imo State Ministry of Environment'
      },
      {
        sector: 'Ministry of Niger Delta',
        description: 'Imo State Ministry of Niger Delta'
      },
      {
        sector: 'Ministry of Finance',
        description: 'Imo State Ministry of Finance'
      },
      {
        sector: 'Ministry of Housing & Urban Renewal',
        description: 'Imo State Ministry of Housing & Urban Renewal'
      },
      {
        sector: 'Ministry of Livestock',
        description: 'Imo State Ministry of Livestock'
      },
      {
        sector: 'Ministry of Trade, Commerce & Investment',
        description: 'Imo State Ministry of Trade, Commerce & Investment'
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