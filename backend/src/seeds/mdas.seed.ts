import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

interface IMda {
  name: string;
  code: string;
}

const mdaSchema = new mongoose.Schema<IMda>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
  },
  { timestamps: true }
);

// Use model name "Mda" so collection name matches Nest schema ("mdas")
const MdaModel = mongoose.model<IMda>('Mda', mdaSchema);

function generateCode(length: number = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function seedMdas() {
  try {
    const mongoUri = process.env.MONGO_URI || '';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const mdas: IMda[] = [
      { name: 'Ministry of Women Affairs', code: generateCode() },
      { name: 'Ministry of Transport', code: generateCode() },
      { name: 'Ministry of Health', code: generateCode() },
      { name: 'Ministry of Industry, Mines and Solid Minerals', code: generateCode() },
      { name: 'Ministry of Works', code: generateCode() },
      { name: 'Ministry of Education (Primary/Secondary)', code: generateCode() },
      { name: 'Ministry of Tertiary Education', code: generateCode() },
      { name: 'Ministry of Homeland Security', code: generateCode() },
      { name: 'Ministry of Rural Development & Economic Empowerment', code: generateCode() },
      { name: 'Ministry of Petroleum & Natural Gas Development', code: generateCode() },
      { name: 'Ministry of Budget Planning', code: generateCode() },
      { name: 'Ministry of Youth Development & Talent Hunt', code: generateCode() },
      { name: 'Ministry of  Culture and Tourism', code: generateCode() },
      { name: 'Ministry of Agriculture and Food Security', code: generateCode() },
      { name: 'Head of Service', code: generateCode() },
      { name: 'Ministry of Humanitarian Affairs', code: generateCode() },
      { name: 'Ministry of Information & Startegy', code: generateCode() },
      { name: 'Ministry of Power & Electrification', code: generateCode() },
      { name: 'Ministry of Digital Economy', code: generateCode() },
      { name: 'Ministry of Science & Technology', code: generateCode() },
      { name: 'Ministry of Special Duties', code: generateCode() },
      { name: 'Ministry of Lands, Survey & Physical Planning', code: generateCode() },
      { name: 'Ministry of Sports', code: generateCode() },
      { name: 'Ministry of Special Project', code: generateCode() },
      { name: 'Ministry of Justice and Attorney General', code: generateCode() },
      { name: 'Ministry of Local Government Area', code: generateCode() },
      { name: 'Ministry of Labour & Employment', code: generateCode() },
      { name: 'Ministry of Environment', code: generateCode() },
      { name: 'Ministry of Niger Delta', code: generateCode() },
      { name: 'Ministry of Finance', code: generateCode() },
      { name: 'Ministry of Housing & Urban Renewal', code: generateCode() },
      { name: 'Ministry of Livestock', code: generateCode() },
      { name: 'Ministry of Trade, Commerce & Investment', code: generateCode() },
    ];

    await MdaModel.insertMany(mdas);

    console.log(`✅ Successfully seeded ${mdas.length} MDAs`);
    console.log(`   Names: ${mdas.map(m => m.name).join(', ')}`);

    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Seeding MDAs failed:', error);
    process.exit(1);
  }
}

seedMdas()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });

//