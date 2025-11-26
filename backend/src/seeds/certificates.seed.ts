import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/procurement';

// Define Certificate schema directly
const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  contractorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  contractorName: { type: String, required: true },
  rcBnNumber: { type: String, required: true },
  grade: { type: String, required: true },
  lga: { type: String, required: true },
  status: { type: String, required: true, default: 'Approved' },
  validUntil: { type: Date, required: true }
}, { timestamps: true });

const Certificate = mongoose.model('Certificate', certificateSchema);

// Sample certificate data
const certificatesData = [
  // Approved Certificates
  {
    certificateId: 'CERT-2024-001',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId('6920d094ef1dc716903fd075'),
    contractorName: 'ABC Construction Ltd',
    rcBnNumber: 'RC123456',
    grade: 'A',
    lga: 'Ikeja',
    status: 'approved',
    validUntil: new Date('2025-12-31')
  },
  {
    certificateId: 'CERT-2024-002',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId('6920d094ef1dc716903fd075'),
    contractorName: 'Prime Infrastructure Ltd',
    rcBnNumber: 'RC456789',
    grade: 'C',
    lga: 'Lekki',
    status: 'approved',
    validUntil: new Date('2026-03-20')
  },
  {
    certificateId: 'CERT-2024-003',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId('6920d094ef1dc716903fd075'),
    contractorName: 'Omega Construction Group',
    rcBnNumber: 'RC567890',
    grade: 'B',
    lga: 'Ikoyi',
    status: 'approved',
    validUntil: new Date('2026-01-15')
  },
  {
    certificateId: 'CERT-2024-004',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId('6920d094ef1dc716903fd075'),
    contractorName: 'Theta Infrastructure Ltd',
    rcBnNumber: 'RC012345',
    grade: 'A',
    lga: 'Ajah',
    status: 'approved',
    validUntil: new Date('2026-06-30')
  },
  
  // Expired Certificates
  {
    certificateId: 'CERT-2024-005',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId('6920d094ef1dc716903fd075'),
    contractorName: 'XYZ Engineering Services',
    rcBnNumber: 'RC234567',
    grade: 'B',
    lga: 'Victoria Island',
    status: 'expired',
    validUntil: new Date('2024-11-30')
  },
  {
    certificateId: 'CERT-2024-006',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId('6920d094ef1dc716903fd075'),
    contractorName: 'Beta Contractors Ltd',
    rcBnNumber: 'RC789012',
    grade: 'A',
    lga: 'Yaba',
    status: 'expired',
    validUntil: new Date('2024-09-30')
  },
  {
    certificateId: 'CERT-2024-007',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId('6920d094ef1dc716903fd075'),
    contractorName: 'Alpha Building Solutions',
    rcBnNumber: 'RC901234',
    grade: 'B',
    lga: 'Maryland',
    status: 'expired',
    validUntil: new Date('2024-10-15')
  },
  
  // Revoked Certificates
  {
    certificateId: 'CERT-2024-008',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId('6920d094ef1dc716903fd075'),
    contractorName: 'Delta Builders & Co',
    rcBnNumber: 'RC345678',
    grade: 'A',
    lga: 'Surulere',
    status: 'revoked',
    validUntil: new Date('2025-06-15')
  },
  {
    certificateId: 'CERT-2024-009',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId('6920d094ef1dc716903fd075'),
    contractorName: 'Sigma Engineering Works',
    rcBnNumber: 'RC678901',
    grade: 'D',
    lga: 'Apapa',
    status: 'revoked',
    validUntil: new Date('2025-08-28')
  },
  {
    certificateId: 'CERT-2024-010',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId('6920d094ef1dc716903fd075'),
    contractorName: 'Gamma Construction Services',
    rcBnNumber: 'RC890123',
    grade: 'C',
    lga: 'Gbagada',
    status: 'revoked',
    validUntil: new Date('2025-12-31')
  }
]

async function seedCertificates() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if certificates already exist
    const existingCertificates = await Certificate.find();
    
    if (existingCertificates.length > 0) {
      await Certificate.deleteMany({})
      // Insert all certificates
      await Certificate.insertMany(certificatesData);
      console.log(`✅ Successfully seeded ${certificatesData.length} certificates!`);
      
      console.log('\nCertificate Summary:');
      certificatesData.forEach(cert => {
        console.log(`  - ${cert.certificateId}: ${cert.contractorName} (Grade ${cert.grade}) - Valid until ${cert.validUntil.toDateString()}`);
      });
    }else{
      await Certificate.insertMany(certificatesData);
      console.log(`✅ Successfully seeded ${certificatesData.length} certificates!`);
      
      console.log('\nCertificate Summary:');
      certificatesData.forEach(cert => {
        console.log(`  - ${cert.certificateId}: ${cert.contractorName} (Grade ${cert.grade}) - Valid until ${cert.validUntil.toDateString()}`);
      });
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding certificates:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the seed function
seedCertificates();
