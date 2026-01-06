import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { SlaSchema } from '../sla/entities/sla.schema';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

async function seedSla() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Create SLA model
    const SlaModel = mongoose.model('Sla', SlaSchema);

    // Check if SLA already exists
    const existingSla = await SlaModel.findOne();
    
    if (existingSla) {
      console.log('SLA configuration already exists. Skipping seed.');
      console.log('Existing SLA:', existingSla);
    } else {
      // Create default SLA configuration
      const sla = new SlaModel({
        deskOfficerReview: 5,
        registrarReview: 3,
        clarificationResponse: 7,
        paymentVerification: 2,
        totalProcessingTarget: 10
      });

      await sla.save();
      console.log('✅ SLA configuration seeded successfully!');
      console.log('SLA Details:', {
        deskOfficerReview: sla.deskOfficerReview,
        registrarReview: sla.registrarReview,
        clarificationResponse: sla.clarificationResponse,
        paymentVerification: sla.paymentVerification,
        totalProcessingTarget: sla.totalProcessingTarget
      });
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding SLA:', error);
    process.exit(1);
  }
}

// Run the seed function
seedSla();
