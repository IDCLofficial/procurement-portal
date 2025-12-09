import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

// Role enum matching the User schema
enum Role {
  DESK_OFFICER = "Desk officer",
  AUDITOR = "Auditor",
  REGISTRAR = "Registrar",
  ADMIN = "Admin"
}

// User schema definition
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNo: { type: String, required: true },
  role: { type: String, required: true, enum: Object.values(Role) },
  password: { type: String, required: true },
  isActive: { type: Boolean, required: true, default: true },
  assignedApps: { type: Number, required: true, default: 0 },
  lastLogin: { type: Date }
}, { timestamps: true });

// Add indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

// Demo SuperAdmin user data
const superAdminData = {
  fullName: 'Super Admin',
  email: 'admin@procurement.gov.ng',
  phoneNo: '+234-800-000-0000',
  role: Role.ADMIN, // Admin as the highest role
  password: 'Admin@123456', // Will be hashed before saving
  isActive: true,
  assignedApps: 0
};

async function seedSuperAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('✓ Connected to MongoDB');

    // Check if super admin already exists
    const existingAdmin = await User.findOne({ role: Role.ADMIN });
    if (existingAdmin) {
      console.log('⚠ Super admin already exists. Skipping seed.');
      await mongoose.connection.close();
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(superAdminData.password, saltRounds);

    // Create super admin with hashed password
    const superAdmin = new User({
      ...superAdminData,
      password: hashedPassword
    });

    await superAdmin.save();
    
    console.log('✓ Successfully seeded super admin user');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', superAdminData.email);
    console.log('🔑 Password:', superAdminData.password);
    console.log('👤 Role:', superAdminData.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Please change the password after first login!');

    await mongoose.connection.close();
    console.log('✓ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding super admin:', error);
    process.exit(1);
  }
}

seedSuperAdmin();