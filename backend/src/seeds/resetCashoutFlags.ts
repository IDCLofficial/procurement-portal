import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Payment } from '../payments/entities/payment.schema';

async function resetCashoutFlags() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const paymentModel = app.get<Model<Payment>>(getModelToken(Payment.name));
    
    console.log('Resetting isCashout flags for all payments...');
    
    // Set isCashout to false for all processing fee payments that don't have it set
    const result = await paymentModel.updateMany(
      { 
        type: 'processing fee',
        $or: [
          { isCashout: { $exists: false } },
          { isCashout: null }
        ]
      },
      { 
        $set: { isCashout: false } 
      }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} payment records`);
    
    // Show stats
    const totalProcessingFees = await paymentModel.countDocuments({
      type: 'processing fee',
      status: 'completed'
    });
    
    const cashedOut = await paymentModel.countDocuments({
      type: 'processing fee',
      status: 'completed',
      isCashout: true
    });
    
    const available = await paymentModel.countDocuments({
      type: 'processing fee',
      status: 'completed',
      isCashout: { $ne: true }
    });
    
    console.log('\n📊 Payment Statistics:');
    console.log(`Total completed processing fees: ${totalProcessingFees}`);
    console.log(`Already cashed out: ${cashedOut}`);
    console.log(`Available for cashout: ${available}`);
    
  } catch (error) {
    console.error('❌ Error resetting cashout flags:', error);
  } finally {
    await app.close();
  }
}

resetCashoutFlags();
