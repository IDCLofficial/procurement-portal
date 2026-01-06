import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define enums
enum expiryEnum {
  yes = "yes",
  no = "no"
}

enum renewalFreq {
  none = "n/a",
  annual = "annual"
}

// Define schema interface
interface IVerificationDocPreset {
  documentName: string;
  isRequired: boolean;
  hasExpiry: expiryEnum;
  renewalFrequency: renewalFreq;
}

// Define Mongoose schema
const verificationDocPresetSchema = new mongoose.Schema<IVerificationDocPreset>(
  {
    documentName: { type: String, required: true },
    isRequired: { type: Boolean, required: true, default: false },
    hasExpiry: { type: String, enum: Object.values(expiryEnum), required: true, default: expiryEnum.no },
    renewalFrequency: { type: String, enum: Object.values(renewalFreq), required: true, default: renewalFreq.none }
  },
  { timestamps: true }
);

// Create model
const VerificationDocPresetModel = mongoose.model<IVerificationDocPreset>(
  'verificationdocpreset',
  verificationDocPresetSchema
);

async function seedDocumentPresets() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || '';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing presets
    await VerificationDocPresetModel.deleteMany({});
    console.log('Cleared existing document presets');

    // Document presets based on the image
    const documentPresets: IVerificationDocPreset[] = [
      {
        documentName: 'CAC Incorporation Certificate',
        isRequired: true,
        hasExpiry: expiryEnum.no,
        renewalFrequency: renewalFreq.none
      },
      {
        documentName: 'Tax Clearance Certificate (TCC)',
        isRequired: true,
        hasExpiry: expiryEnum.yes,
        renewalFrequency: renewalFreq.annual
      },
      {
        documentName: 'PENCOM Compliance Certificate',
        isRequired: true,
        hasExpiry: expiryEnum.yes,
        renewalFrequency: renewalFreq.annual
      },
      {
        documentName: 'ITF Certificate',
        isRequired: true,
        hasExpiry: expiryEnum.yes,
        renewalFrequency: renewalFreq.annual
      },
      {
        documentName: 'NSITF Certificate',
        isRequired: true,
        hasExpiry: expiryEnum.yes,
        renewalFrequency: renewalFreq.annual
      },
      {
        documentName: 'Sworn Affidavit of Authenticity',
        isRequired: true,
        hasExpiry: expiryEnum.no,
        renewalFrequency: renewalFreq.none
      },
      {
        documentName: 'Bank Reference Letter',
        isRequired: false,
        hasExpiry: expiryEnum.no,
        renewalFrequency: renewalFreq.none
      },
      {
        documentName: 'Past Project References',
        isRequired: false,
        hasExpiry: expiryEnum.no,
        renewalFrequency: renewalFreq.none
      }
    ];

    // Insert presets
    await VerificationDocPresetModel.insertMany(documentPresets);

    console.log(`✅ Successfully seeded ${documentPresets.length} document presets`);
    
    // Close connection
    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDocumentPresets()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });