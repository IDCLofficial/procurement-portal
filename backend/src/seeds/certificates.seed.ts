import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/procurement';

// Define Certificate schema directly (matching the actual schema)
const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  contractorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  contractorName: { type: String, required: true },
  companyName: { type: String, required: true },
  
  // Company Information
  rcBnNumber: { type: String, required: true },
  tin: { type: String, required: true },
  
  // Contact Information
  address: { type: String, required: true },
  lga: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String, required: false },
  
  // Sector & Classification
  approvedSectors: { type: [String], default: [] },
  categories: { type: [String], default: [] },
  grade: { type: String, required: true },
  
  // Registration Status
  status: { type: String, required: true, enum: ['approved', 'expired', 'revoked'] },
  validUntil: { type: Date, required: true }
}, { timestamps: true });

const Certificate = mongoose.model('Certificate', certificateSchema);

// Sample certificate data with complete schema fields
const certificatesData = [
  // Approved Certificates
  {
    certificateId: 'IMO-CONT-2024-A1B2C3',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId(),
    contractorName: 'John Doe',
    companyName: 'ABC Construction Ltd',
    rcBnNumber: 'RC123456',
    tin: '1234567890',
    address: '123 Construction Avenue, Ikeja',
    lga: 'Ikeja',
    phone: '+234-801-234-5678',
    email: 'contact@abcconstruction.com',
    website: 'https://www.abcconstruction.com',
    approvedSectors: ['Works', 'Infrastructure'],
    categories: ['Building Construction', 'Road Construction'],
    grade: 'A',
    status: 'approved',
    validUntil: new Date('2025-12-31')
  },
  {
    certificateId: 'IMO-CONT-2024-D4E5F6',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId(),
    contractorName: 'Jane Smith',
    companyName: 'Prime Infrastructure Ltd',
    rcBnNumber: 'RC456789',
    tin: '2345678901',
    address: '456 Infrastructure Road, Lekki',
    lga: 'Lekki',
    phone: '+234-802-345-6789',
    email: 'info@primeinfra.com',
    website: 'https://www.primeinfra.com',
    approvedSectors: ['Works', 'Services'],
    categories: ['Civil Engineering', 'Electrical Works'],
    grade: 'C',
    status: 'approved',
    validUntil: new Date('2026-03-20')
  },
  {
    certificateId: 'IMO-CONT-2024-G7H8I9',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId(),
    contractorName: 'Michael Johnson',
    companyName: 'Omega Construction Group',
    rcBnNumber: 'RC567890',
    tin: '3456789012',
    address: '789 Builder Street, Ikoyi',
    lga: 'Ikoyi',
    phone: '+234-803-456-7890',
    email: 'contact@omegagroup.com',
    website: 'https://www.omegagroup.com',
    approvedSectors: ['Works', 'Supplies'],
    categories: ['General Construction', 'Material Supply'],
    grade: 'B',
    status: 'approved',
    validUntil: new Date('2026-01-15')
  },
  {
    certificateId: 'IMO-CONT-2024-J0K1L2',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId(),
    contractorName: 'Sarah Williams',
    companyName: 'Theta Infrastructure Ltd',
    rcBnNumber: 'RC012345',
    tin: '4567890123',
    address: '321 Development Avenue, Ajah',
    lga: 'Ajah',
    phone: '+234-804-567-8901',
    email: 'info@thetainfra.com',
    website: 'https://www.thetainfra.com',
    approvedSectors: ['Works', 'ICT'],
    categories: ['Infrastructure Development', 'Technology Integration'],
    grade: 'A',
    status: 'approved',
    validUntil: new Date('2026-06-30')
  },
  
  // Expired Certificates
  {
    certificateId: 'IMO-CONT-2023-M3N4O5',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId(),
    contractorName: 'David Brown',
    companyName: 'XYZ Engineering Services',
    rcBnNumber: 'RC234567',
    tin: '5678901234',
    address: '654 Engineering Plaza, Victoria Island',
    lga: 'Victoria Island',
    phone: '+234-805-678-9012',
    email: 'contact@xyzeng.com',
    website: '',
    approvedSectors: ['Services'],
    categories: ['Engineering Consulting'],
    grade: 'B',
    status: 'expired',
    validUntil: new Date('2024-11-30')
  },
  {
    certificateId: 'IMO-CONT-2023-P6Q7R8',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId(),
    contractorName: 'Emily Davis',
    companyName: 'Beta Contractors Ltd',
    rcBnNumber: 'RC789012',
    tin: '6789012345',
    address: '987 Contractor Lane, Yaba',
    lga: 'Yaba',
    phone: '+234-806-789-0123',
    email: 'info@betacontractors.com',
    website: 'https://www.betacontractors.com',
    approvedSectors: ['Works'],
    categories: ['General Contracting'],
    grade: 'A',
    status: 'expired',
    validUntil: new Date('2024-09-30')
  },
  {
    certificateId: 'IMO-CONT-2023-S9T0U1',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId(),
    contractorName: 'Robert Wilson',
    companyName: 'Alpha Building Solutions',
    rcBnNumber: 'RC901234',
    tin: '7890123456',
    address: '147 Building Road, Maryland',
    lga: 'Maryland',
    phone: '+234-807-890-1234',
    email: 'contact@alphabuilding.com',
    website: '',
    approvedSectors: ['Works', 'Supplies'],
    categories: ['Building Solutions', 'Material Supply'],
    grade: 'B',
    status: 'expired',
    validUntil: new Date('2024-10-15')
  },
  
  // Revoked Certificates
  {
    certificateId: 'IMO-CONT-2024-V2W3X4',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId(),
    contractorName: 'Lisa Anderson',
    companyName: 'Delta Builders & Co',
    rcBnNumber: 'RC345678',
    tin: '8901234567',
    address: '258 Builder Avenue, Surulere',
    lga: 'Surulere',
    phone: '+234-808-901-2345',
    email: 'info@deltabuilders.com',
    website: 'https://www.deltabuilders.com',
    approvedSectors: ['Works'],
    categories: ['Building Construction'],
    grade: 'A',
    status: 'revoked',
    validUntil: new Date('2025-06-15')
  },
  {
    certificateId: 'IMO-CONT-2024-Y5Z6A7',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId(),
    contractorName: 'Thomas Martinez',
    companyName: 'Sigma Engineering Works',
    rcBnNumber: 'RC678901',
    tin: '9012345678',
    address: '369 Engineering Street, Apapa',
    lga: 'Apapa',
    phone: '+234-809-012-3456',
    email: 'contact@sigmaeng.com',
    website: '',
    approvedSectors: ['Services', 'Works'],
    categories: ['Engineering Services', 'Construction'],
    grade: 'D',
    status: 'revoked',
    validUntil: new Date('2025-08-28')
  },
  {
    certificateId: 'IMO-CONT-2024-B8C9D0',
    contractorId: new mongoose.Types.ObjectId(),
    company: new mongoose.Types.ObjectId(),
    contractorName: 'Patricia Taylor',
    companyName: 'Gamma Construction Services',
    rcBnNumber: 'RC890123',
    tin: '0123456789',
    address: '741 Construction Boulevard, Gbagada',
    lga: 'Gbagada',
    phone: '+234-810-123-4567',
    email: 'info@gammaconstruction.com',
    website: 'https://www.gammaconstruction.com',
    approvedSectors: ['Works', 'Supplies'],
    categories: ['Construction Services', 'Supply Chain'],
    grade: 'C',
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
      console.log(`Found ${existingCertificates.length} existing certificates. Deleting...`);
      await Certificate.deleteMany({});
      console.log('✅ Existing certificates deleted.');
    }

    // Insert all certificates
    await Certificate.insertMany(certificatesData);
    console.log(`\n✅ Successfully seeded ${certificatesData.length} certificates!`);
    
    // Count by status
    const approvedCount = certificatesData.filter(c => c.status === 'approved').length;
    const expiredCount = certificatesData.filter(c => c.status === 'expired').length;
    const revokedCount = certificatesData.filter(c => c.status === 'revoked').length;
    
    console.log('\n📊 Certificate Statistics:');
    console.log(`  - Approved: ${approvedCount}`);
    console.log(`  - Expired: ${expiredCount}`);
    console.log(`  - Revoked: ${revokedCount}`);
    
    console.log('\n📋 Certificate Summary:');
    certificatesData.forEach(cert => {
      console.log(`  - ${cert.certificateId}: ${cert.companyName} (${cert.contractorName}) - Grade ${cert.grade} [${cert.status.toUpperCase()}]`);
    });

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
