import { connect, disconnect, model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { verificationDocuments, Status, verificationDocument, VerificationDocumentSchema } from '../documents/entities/document.schema';
import { Company, CompanySchema } from '../companies/entities/company.schema';
import { Vendor, VendorSchema } from '../vendors/entities/vendor.schema';

// Configuration
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://idcl:Imodcl%401..@v1.uzw7hnn.mongodb.net/primary';

async function updateCompanyDocumentStatus() {
  try {
    // Connect to MongoDB
    await connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Get command line arguments
    const args = process.argv.slice(2);
    if (args.length < 2) {
      console.log('Usage: ts-node updateDocStatus.ts <companyId> <documentId> [message]');
      console.log('Example: ts-node updateDocStatus.ts 507f1f77bcf86cd799439011 507f1f77bcf86cd799439012 "Document approved successfully"');
      process.exit(1);
    }

    const companyId = args[0];
    const documentId = args[1];
    const message = args[2] || 'Document approved by admin';

    // Validate ObjectIds
    if (!Types.ObjectId.isValid(companyId)) {
      throw new Error(`Invalid companyId: ${companyId}`);
    }
    if (!Types.ObjectId.isValid(documentId)) {
      throw new Error(`Invalid documentId: ${documentId}`);
    }

    // Register models if not already registered
    try {
      model('Company');
    } catch {
      model('Company', CompanySchema);
    }
    
    try {
      model('verificationDocuments');
    } catch {
      model('verificationDocuments', VerificationDocumentSchema);
    }

    const companyModel = model('Company');
    const verificationDocumentModel = model('verificationDocuments');

    // Find the company to get the vendor ID
    const company = await companyModel.findById(companyId).exec();
    if (!company) {
      throw new Error(`Company with ID ${companyId} not found`);
    }

    console.log(`Found company: ${company.companyName}`);
    console.log(`Vendor ID: ${company.userId}`);

    // Find the document
    const document = await verificationDocumentModel.findById(documentId).exec();
    if (!document) {
      throw new Error(`Document with ID ${documentId} not found`);
    }

    console.log(`Found document: ${document.documentType}`);
    console.log(`Current status: ${document.status.status}`);

    // Verify the document belongs to the company's vendor
    if (!document.vendor.equals(company.userId)) {
      throw new Error(`Document does not belong to the company's vendor`);
    }

    // Update the document status to APPROVED
    const updatedDocument = await verificationDocumentModel.findByIdAndUpdate(
      documentId,
      {
        $set: {
          'status.status': Status.APPROVED,
          'status.message': message,
          updatedAt: new Date()
        }
      },
      { new: true }
    ).exec();

    console.log('✅ Document status updated successfully!');
    console.log(`Document ID: ${updatedDocument._id}`);
    console.log(`Document Type: ${updatedDocument.documentType}`);
    console.log(`New Status: ${updatedDocument.status.status}`);
    console.log(`Message: ${updatedDocument.status.message}`);

  } catch (error) {
    console.error('❌ Error updating document status:', error.message);
    process.exit(1);
  } finally {
    // Disconnect from MongoDB
    await disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Alternative function to update all documents for a company
async function updateAllCompanyDocumentsStatus() {
  try {
    await connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const args = process.argv.slice(2);
    if (args.length < 1) {
      console.log('Usage: ts-node updateDocStatus.ts <companyId> [message]');
      console.log('Example: ts-node updateDocStatus.ts 507f1f77bcf86cd799439011 "All documents approved"');
      process.exit(1);
    }

    const companyId = args[0];
    const message = args[1] || 'All documents approved by admin';

    if (!Types.ObjectId.isValid(companyId)) {
      throw new Error(`Invalid companyId: ${companyId}`);
    }

    // Register models if not already registered
    try {
      model('Company');
    } catch {
      model('Company', CompanySchema);
    }
    
    try {
      model('verificationDocuments');
    } catch {
      model('verificationDocuments', VerificationDocumentSchema);
    }

    const companyModel = model('Company');
    const verificationDocumentModel = model('verificationDocuments');

    const company = await companyModel.findById(companyId).exec();
    if (!company) {
      throw new Error(`Company with ID ${companyId} not found`);
    }

    console.log(`Found company: ${company.companyName}`);
    console.log(`Vendor ID: ${company.userId}`);

    // Find all documents for this vendor
    const documents = await verificationDocumentModel.find({
      vendor: company.userId
    }).exec();

    if (documents.length === 0) {
      console.log('No documents found for this company');
      return;
    }

    console.log(`Found ${documents.length} documents`);

    // Update all documents
    const updatePromises = documents.map(async (doc) => {
      return await verificationDocumentModel.findByIdAndUpdate(
        doc._id,
        {
          $set: {
            'status.status': Status.APPROVED,
            'status.message': message,
            updatedAt: new Date()
          }
        },
        { new: true }
      ).exec();
    });

    const updatedDocuments = await Promise.all(updatePromises);

    console.log(`✅ Successfully updated ${updatedDocuments.length} documents to APPROVED status`);
    updatedDocuments.forEach((doc) => {
      console.log(`  - ${doc.documentType}: ${doc.status.status}`);
    });

  } catch (error) {
    console.error('❌ Error updating documents:', error.message);
    process.exit(1);
  } finally {
    await disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Main execution
async function main() {
  await updateAllCompanyDocumentsStatus();
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { updateCompanyDocumentStatus, updateAllCompanyDocumentsStatus };