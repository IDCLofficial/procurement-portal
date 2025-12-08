import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/entities/user.schema';
import { Notification, NotificationDocument, NotificationType, NotificationRecipient, priority } from './entities/notification.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { verificationDocuments, Status } from 'src/documents/entities/document.schema';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(verificationDocuments.name) private documentModel: Model<verificationDocuments>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Check and notify for documents expiring within 7 days
   */
  async checkExpiringDocuments() {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const documents = await this.documentModel.find({
      validTo: {
        $gte: now,
        $lte: sevenDaysFromNow,
      },
    }).populate('vendor');

    let notificationsSent = 0;

    for (const doc of documents) {
      //
      // Check if notification already sent for this document
      const existingNotification = await this.notificationModel.findOne({
        type: NotificationType.CERTIFICATE_RENEWAL_DUE_SOON,
        recipientId: doc.vendor,
        createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }, // Within last 24 hours
      });

      if (!existingNotification && doc.validTo) {
        const expiryDate = new Date(doc.validTo).toLocaleDateString();
        
        // Update the status of the document to expiring
        if (doc.status) {
          doc.status.status = Status.EXPIRING;
        } else {
          doc.status = { status: Status.EXPIRING } as any;
        }
        await doc.save();

        // Notify the vendor
        await this.notificationModel.create({
          type: NotificationType.CERTIFICATE_RENEWAL_DUE_SOON,
          title: 'Document Expiring Soon',
          message: `Your ${doc.documentType} document is expiring on ${expiryDate}. Please renew it to avoid service interruption.`,
          recipient: NotificationRecipient.VENDOR,
          recipientId: doc.vendor,
          priority: priority.HIGH,
          isRead: false,
        });

        notificationsSent++;
      }
    }

    this.logger.log(`Checked ${documents.length} expiring documents, sent ${notificationsSent} notifications`);
    return { total: documents.length, notificationsSent };
  }

  /**
   * Check and notify for expired documents
   */
  async checkExpiredDocuments() {
    const now = new Date();
    
    const expiredDocuments = await this.documentModel.find({
      $or: [
        { validTo: { $eq: now } },
        { validTo: { $gt: now } }
      ]
    }).populate('vendor');

    let notificationsSent = 0;

    for (const doc of expiredDocuments) {
      //
      // Check if notification already sent for this expired document
      const existingExpiredNotification = await this.notificationModel.findOne({
        type: NotificationType.CERTIFICATE_EXPIRED,
        recipientId: doc.vendor,
        createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }, // Within last 24 hours
      });

      if (!existingExpiredNotification && doc.validTo) {
        const expiredDate = new Date(doc.validTo).toLocaleDateString();
        
        // Update the status of the document to expired
        if (doc.status) {
          doc.status.status = Status.EXPIRED;
        } else {
          doc.status = { status: Status.EXPIRED } as any;
        }
        await doc.save();

        // Notify the vendor
        await this.notificationModel.create({
          type: NotificationType.CERTIFICATE_EXPIRED,
          title: 'Document Expired',
          message: `Your ${doc.documentType} document expired on ${expiredDate}. Please renew it immediately to avoid service disruption.`,
          vendorId: doc.vendor,
          recipient: NotificationRecipient.VENDOR,
          recipientId: doc.vendor,
          priority: priority.CRITICAL,
          isRead: false,
        });

        // Notify all admins
        const admins = await this.userModel.find({ role: 'Admin' });
        for (const admin of admins) {
          await this.notificationModel.create({
            type: NotificationType.CERTIFICATE_EXPIRED,
            title: 'Vendor Document Expired',
            vendorId: doc.vendor,
            message: `A vendor's ${doc.documentType} document expired on ${expiredDate}. Immediate action required.`,
            recipient: NotificationRecipient.ADMIN,
            recipientId: admin._id,
            priority: priority.CRITICAL,
            isRead: false,
          });
        }

        notificationsSent++;
      }
    }

    this.logger.log(`Checked ${expiredDocuments.length} expired documents, sent ${notificationsSent} notifications`);
    return { total: expiredDocuments.length, notificationsSent };
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleCron() {
    this.logger.log('Running scheduled checks...');
    
    const expiringResult = await this.checkExpiringDocuments();
    const expiredResult = await this.checkExpiredDocuments();

    this.logger.log(`Processed ${expiringResult.total} expiring and ${expiredResult.total} expired documents`);
    
    return {
      expiring: expiringResult,
      expired: expiredResult,
    };
  }


  async findVendorNotifications(vendorId: any): Promise<any> {
    const vendorNotifications = await this.notificationModel.find({
      vendorId: new Types.ObjectId(vendorId as Types.ObjectId),
    });

    if (!vendorNotifications.length) {
      return {
        message: "You have no notifications at the moment"
      }
    }

    const result = vendorNotifications.map((notification) => ({
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      createdAt: notification.createdAt,
    }));

    if(result.length < 1){
      return {
        message: "You have no notifications at the moment."
      }
    }
    
    return {
      message: `you have ${result.length} notifications`,
      notifications: result
    }
  }

  async findAdminNotifications(): Promise<any> {
    // const adminId = decoded._id;
    const adminNotifications = await this.notificationModel.find({
      recipient:NotificationRecipient.ADMIN,
    });

    if (!adminNotifications.length) {
      return {
        message: "You have no notifications at the moment"
      }
    }

    const result = adminNotifications.map((notification) => ({
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      createdAt: notification.createdAt,
    }));

    if(result.length < 1){
      return {
        message: "You have no notifications at the moment."
      }
    }
    
    return {
      message: `you have ${result.length} notifications`,
      notifications: result
    }
  }
  
}
