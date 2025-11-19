import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const applicationSchema = new mongoose.Schema({
  applicationId: String,
  contractorName: String,
  companyId: mongoose.Schema.Types.ObjectId,
  rcBnNumber: String,
  sectorAndGrade: String,
  grade: String,
  type: String,
  submissionDate: Date,
  slaStatus: String,
  currentStatus: String,
  assignedTo: mongoose.Schema.Types.ObjectId,
  assignedToName: String,
  applicationStatus: String
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

const applications = [
  {
    applicationId: 'app-2024-009',
    contractorName: 'Excellence Services Ltd',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC1112345',
    sectorAndGrade: 'SERVICES',
    grade: 'B',
    type: 'New',
    submissionDate: new Date('2024-11-13'),
    currentStatus: 'Pending Desk Review',
    assignedTo: null,
    assignedToName: 'Unassigned',
    applicationStatus: 'PENDING'
  },
  {
    applicationId: 'app-2024-006',
    contractorName: 'Swift Logistics Ltd',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC4645578',
    sectorAndGrade: 'SUPPLIES',
    grade: 'C',
    type: 'New',
    submissionDate: new Date('2024-11-12'),
    currentStatus: 'Pending Desk Review',
    assignedTo: new mongoose.Types.ObjectId(),
    assignedToName: 'Oluwole Obi',
    applicationStatus: 'PENDING'
  },
  {
    applicationId: 'app-2024-008',
    contractorName: 'InfoTech Systems',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC2223456',
    sectorAndGrade: 'ICT',
    grade: 'B',
    type: 'Renewal',
    submissionDate: new Date('2024-11-11'),
    currentStatus: 'Forwarded to Registrar',
    assignedTo: new mongoose.Types.ObjectId(),
    assignedToName: 'Chiamaka Okonkwo, Ngozi Obi',
    applicationStatus: 'PENDING'
  },
  {
    applicationId: 'app-2024-001',
    contractorName: 'ABC Construction Ltd',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC1234567',
    sectorAndGrade: 'WORKS',
    grade: 'A',
    type: 'New',
    submissionDate: new Date('2024-11-10'),
    currentStatus: 'Pending Desk Review',
    assignedTo: new mongoose.Types.ObjectId(),
    assignedToName: 'Chiamaka Okonkwo',
    applicationStatus: 'PENDING'
  },
  {
    applicationId: 'app-2024-007',
    contractorName: 'Mega Construction Group',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC3334567',
    sectorAndGrade: 'WORKS',
    grade: 'A',
    type: 'Upgrade',
    submissionDate: new Date('2024-11-09'),
    currentStatus: 'Pending Payment',
    assignedTo: null,
    assignedToName: 'Unassigned',
    applicationStatus: 'PENDING'
  },
  {
    applicationId: 'app-2024-002',
    contractorName: 'XYZ Supplies Nigeria',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC7654321',
    sectorAndGrade: 'SUPPLIES',
    grade: 'B',
    type: 'Renewal',
    submissionDate: new Date('2024-11-08'),
    currentStatus: 'Clarification Requested',
    assignedTo: new mongoose.Types.ObjectId(),
    assignedToName: 'Chiamaka Okonkwo',
    applicationStatus: 'PENDING'
  },
  {
    applicationId: 'app-2024-010',
    contractorName: 'BuildTech Engineering',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC9998888',
    sectorAndGrade: 'WORKS',
    grade: 'C',
    type: 'Renewal',
    submissionDate: new Date('2024-11-06'),
    currentStatus: 'SLA Breach',
    assignedTo: new mongoose.Types.ObjectId(),
    assignedToName: 'Oluwole Obi',
    applicationStatus: 'REJECTED'
  },
  {
    applicationId: 'app-2024-003',
    contractorName: 'Prime Services International',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC3456789',
    sectorAndGrade: 'SERVICES',
    grade: 'A',
    type: 'New',
    submissionDate: new Date('2024-11-05'),
    currentStatus: 'Forwarded to Registrar',
    assignedTo: new mongoose.Types.ObjectId(),
    assignedToName: 'Oluwole Obi, Oliva Eze',
    applicationStatus: 'PENDING'
  },
  {
    applicationId: 'app-2024-004',
    contractorName: 'TechHub ICT Solutions',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC9871234',
    sectorAndGrade: 'ICT',
    grade: 'A',
    type: 'New',
    submissionDate: new Date('2024-11-01'),
    currentStatus: 'Approved',
    assignedTo: new mongoose.Types.ObjectId(),
    assignedToName: 'Chiamaka Okonkwo, Ngozi Okon',
    applicationStatus: 'APPROVED'
  },
  {
    applicationId: 'app-2024-005',
    contractorName: 'Global Engineering Works',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC5556789',
    sectorAndGrade: 'WORKS',
    grade: 'B',
    type: 'Renewal',
    submissionDate: new Date('2024-10-28'),
    currentStatus: 'Rejected',
    assignedTo: new mongoose.Types.ObjectId(),
    assignedToName: 'Chiamaka Okonkwo, Oliva Eze',
    applicationStatus: 'REJECTED'
  }
];

async function seedApplications() {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('Connected to MongoDB');

    await Application.insertMany(applications);
    console.log(`✓ Successfully seeded ${applications.length} applications`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding applications:', error);
    process.exit(1);
  }
}

seedApplications();