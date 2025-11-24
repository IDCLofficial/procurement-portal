import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

// Define enums
enum ApplicationStatus {
  PENDING_DESK_REVIEW = 'Pending Desk Review',
  FORWARDED_TO_REGISTRAR = 'Forwarded to Registrar',
  PENDING_PAYMENT = 'Pending Payment',
  CLARIFICATION_REQUESTED = 'Clarification Requested',
  SLA_BREACH = 'SLA Breach',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

enum ApplicationType {
  NEW = 'New',
  RENEWAL = 'Renewal',
  UPGRADE = 'Upgrade'
}

enum SLAStatus {
  ON_TIME = 'On Time',
  AT_RISK = 'At Risk',
  BREACHED = 'Breached'
}

const applicationSchema = new mongoose.Schema({
  applicationId: { type: String, required: true },
  contractorName: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  rcBnNumber: { type: String, required: true },
  sectorAndGrade: { type: String, required: true },
  grade: { type: String, required: true },
  type: { type: String, enum: Object.values(ApplicationType), required: true },
  submissionDate: { type: Date, required: true },
  slaStatus: { type: String, enum: Object.values(SLAStatus) },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedToName: String,
  applicationStatus: { 
    type: String, 
    enum: Object.values(ApplicationStatus), 
    required: true, 
    default: ApplicationStatus.PENDING_DESK_REVIEW 
  }
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

const applications = [
  {
    applicationId: 'APP-2024-009',
    contractorName: 'Excellence Services Ltd',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC1112345',
    sectorAndGrade: 'Services - Grade B',
    grade: 'B',
    type: ApplicationType.NEW,
    submissionDate: new Date('2024-11-13'),
    slaStatus: SLAStatus.ON_TIME,
    assignedTo: null,
    assignedToName: 'Unassigned',
    applicationStatus: ApplicationStatus.PENDING_DESK_REVIEW
  },
  {
    applicationId: 'APP-2024-006',
    contractorName: 'Swift Logistics Ltd',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC4645578',
    sectorAndGrade: 'Supplies - Grade C',
    grade: 'C',
    type: ApplicationType.NEW,
    submissionDate: new Date('2024-11-12'),
    slaStatus: SLAStatus.ON_TIME,
    assignedTo: new mongoose.Types.ObjectId(),
    assignedToName: 'Oluwole Obi',
    applicationStatus: ApplicationStatus.PENDING_DESK_REVIEW
  },
  {
    applicationId: 'APP-2024-008',
    contractorName: 'InfoTech Systems',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC2223456',
    sectorAndGrade: 'ICT - Grade B',
    grade: 'B',
    type: ApplicationType.RENEWAL,
    submissionDate: new Date('2024-11-11'),
    slaStatus: SLAStatus.AT_RISK,
    assignedTo: new mongoose.Types.ObjectId(),
    assignedToName: 'Chiamaka Okonkwo',
    applicationStatus: ApplicationStatus.FORWARDED_TO_REGISTRAR
  },
  {
    applicationId: 'APP-2024-001',
    contractorName: 'ABC Construction Ltd',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC1234567',
    sectorAndGrade: 'Works - Grade A',
    grade: 'A',
    type: ApplicationType.NEW,
    submissionDate: new Date('2024-11-10'),
    slaStatus: SLAStatus.ON_TIME,
    assignedTo: new mongoose.Types.ObjectId(),
    assignedToName: 'Chiamaka Okonkwo',
    applicationStatus: ApplicationStatus.PENDING_DESK_REVIEW
  },
  {
    applicationId: 'APP-2024-007',
    contractorName: 'Mega Construction Group',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC3334567',
    sectorAndGrade: 'Works - Grade A',
    grade: 'A',
    type: ApplicationType.UPGRADE,
    submissionDate: new Date('2024-11-09'),
    slaStatus: SLAStatus.ON_TIME,
    assignedTo: null,
    assignedToName: 'Unassigned',
    applicationStatus: ApplicationStatus.PENDING_PAYMENT
  },
  {
    applicationId: 'APP-2024-002',
    contractorName: 'XYZ Supplies Nigeria',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC7654321',
    sectorAndGrade: 'Supplies - Grade B',
    grade: 'B',
    type: ApplicationType.RENEWAL,
    submissionDate: new Date('2024-11-08'),
    slaStatus: SLAStatus.AT_RISK,
    assignedTo: new mongoose.Types.ObjectId(),
    assignedToName: 'Chiamaka Okonkwo',
    applicationStatus: ApplicationStatus.CLARIFICATION_REQUESTED
  },
  {
    applicationId: 'APP-2024-010',
    contractorName: 'BuildTech Engineering',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC9998888',
    sectorAndGrade: 'Works - Grade C',
    grade: 'C',
    type: ApplicationType.RENEWAL,
    submissionDate: new Date('2024-11-06'),
    slaStatus: SLAStatus.BREACHED,
    assignedTo: new mongoose.Types.ObjectId(),
    assignedToName: 'Oluwole Obi',
    applicationStatus: ApplicationStatus.SLA_BREACH
  },
  {
    applicationId: 'APP-2024-003',
    contractorName: 'Prime Services International',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC3456789',
    sectorAndGrade: 'Services - Grade A',
    grade: 'A',
    type: ApplicationType.NEW,
    submissionDate: new Date('2024-11-05'),
    slaStatus: SLAStatus.ON_TIME,
    assignedTo: new mongoose.Types.ObjectId(),
    assignedToName: 'Oluwole Obi',
    applicationStatus: ApplicationStatus.FORWARDED_TO_REGISTRAR
  },
  {
    applicationId: 'APP-2024-004',
    contractorName: 'TechHub ICT Solutions',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC9871234',
    sectorAndGrade: 'ICT - Grade A',
    grade: 'A',
    type: ApplicationType.NEW,
    submissionDate: new Date('2024-11-01'),
    slaStatus: SLAStatus.ON_TIME,
    assignedTo: new mongoose.Types.ObjectId(),
    assignedToName: 'Chiamaka Okonkwo',
    applicationStatus: ApplicationStatus.APPROVED
  },
  {
    applicationId: 'APP-2024-005',
    contractorName: 'Global Engineering Works',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC5556789',
    sectorAndGrade: 'Works - Grade B',
    grade: 'B',
    type: ApplicationType.RENEWAL,
    submissionDate: new Date('2024-10-28'),
    slaStatus: SLAStatus.BREACHED,
    assignedTo: new mongoose.Types.ObjectId(),
    assignedToName: 'Oliva Eze',
    applicationStatus: ApplicationStatus.REJECTED
  },
  {
    applicationId: 'APP-2024-011',
    contractorName: 'Digital Solutions Hub',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC7778889',
    sectorAndGrade: 'ICT - Grade D',
    grade: 'D',
    type: ApplicationType.NEW,
    submissionDate: new Date('2024-11-14'),
    slaStatus: SLAStatus.ON_TIME,
    assignedTo: new mongoose.Types.ObjectId(),
    assignedToName: 'Ngozi Obi',
    applicationStatus: ApplicationStatus.PENDING_DESK_REVIEW
  },
  {
    applicationId: 'APP-2024-012',
    contractorName: 'Premium Supplies Co',
    companyId: new mongoose.Types.ObjectId(),
    rcBnNumber: 'RC5554443',
    sectorAndGrade: 'Supplies - Grade A',
    grade: 'A',
    type: ApplicationType.UPGRADE,
    submissionDate: new Date('2024-11-15'),
    slaStatus: SLAStatus.ON_TIME,
    assignedTo: null,
    assignedToName: 'Unassigned',
    applicationStatus: ApplicationStatus.PENDING_PAYMENT
  }
];

async function seedApplications() {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('Connected to MongoDB');

    // Clear existing applications
    await Application.deleteMany({});
    console.log('Cleared existing applications');

    // Insert new applications
    await Application.insertMany(applications);
    console.log(`✅ Successfully seeded ${applications.length} applications`);
    
    // Log status breakdown
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.applicationStatus] = (acc[app.applicationStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\nStatus breakdown:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   - ${status}: ${count}`);
    });

    await mongoose.disconnect();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding applications:', error);
    process.exit(1);
  }
}

seedApplications()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });