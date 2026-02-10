import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

// Role enum matching the User schema
enum Role {
  DESK_OFFICER = "Desk officer",
  AUDITOR = "Auditor",
  REGISTRAR = "Registrar",
  ADMIN = "Admin",
  IIRS = "IIRS"
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

// IIRS user data
const iirsUserData = {
  fullName: 'IIRS Officer',
  email: 'iirs@procurement.im.gov.ng',
  phoneNo: '+234-800-000-1111',
  role: Role.IIRS,
  password: 'IIRS@proc123456', // Will be hashed before saving
  isActive: true,
  assignedApps: 0
};

async function seedIirsUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('✓ Connected to MongoDB');

    // Check if IIRS user already exists
    const existingIirsUser = await User.findOne({ email: iirsUserData.email });
    if (existingIirsUser) {
      console.log('⚠ IIRS user already exists. Skipping seed.');
      await mongoose.connection.close();
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(iirsUserData.password, saltRounds);

    // Create IIRS user with hashed password
    const iirsUser = new User({
      ...iirsUserData,
      password: hashedPassword
    });

    await iirsUser.save();
    
    console.log('✓ Successfully seeded IIRS user');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', iirsUserData.email);
    console.log('🔑 Password:', iirsUserData.password);
    console.log('👤 Role:', iirsUserData.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Please change the password after first login!');

    await mongoose.connection.close();
    console.log('✓ Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding IIRS user:', error);
    process.exit(1);
  }
}

seedIirsUser();
