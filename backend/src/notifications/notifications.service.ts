import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import { Notification, NotificationDocument, NotificationType, NotificationRecipient } from './entities/notification.entity';
import { ApplicationSubmittedEvent } from './events/application-submitted.event';
import { ApplicationStatusUpdatedEvent } from './events/application-status-updated.event';
import { ApplicationStatus } from '../applications/entities/application.schema';
import { User, UserDocument } from '../users/entities/user.schema';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Event listener for application submission
   * Notifies all admins when a vendor submits an application
   */
  @OnEvent('application.submitted')
  async handleApplicationSubmitted(event: ApplicationSubmittedEvent) {
    this.logger.log(`Handling application submitted event: ${event.applicationNumber}`);

    try {
      // Get all admin users
      const admins = await this.userModel.find({ role: 'Admin' }).exec();

      // Create notification for each admin
      const notifications = admins.map(admin => ({
        type: NotificationType.APPLICATION_SUBMITTED,
        title: 'New Application Submitted',
        message: `${event.companyName} has submitted a new ${event.type} application (${event.applicationNumber}) for Grade ${event.grade}.`,
        recipient: NotificationRecipient.ADMIN,
        recipientId: admin._id as Types.ObjectId,
        applicationId: event.applicationId,
        isRead: false,
        metadata: {
          applicationNumber: event.applicationNumber,
          companyName: event.companyName,
          grade: event.grade,
          type: event.type,
        },
      }));

      await this.notificationModel.insertMany(notifications);
      this.logger.log(`Created ${notifications.length} notifications for admins`);
    } catch (error) {
      this.logger.error(`Failed to create notifications for application submission: ${error.message}`);
    }
  }

  /**
   * Event listener for application status updates
   * Notifies admins and vendors based on status change
   */
  @OnEvent('application.status.updated')
  async handleApplicationStatusUpdated(event: ApplicationStatusUpdatedEvent) {
    this.logger.log(`Handling status update event: ${event.applicationNumber} - ${event.oldStatus} -> ${event.newStatus}`);

    try {
      const notifications: any[] = [];

      // Determine notification type based on new status
      let notificationType: NotificationType;
      let title: string;
      let message: string;

      switch (event.newStatus) {
        case ApplicationStatus.APPROVED:
          notificationType = NotificationType.APPLICATION_APPROVED;
          title = 'Application Approved';
          message = `Your application (${event.applicationNumber}) has been approved. Congratulations!`;
          
          // Notify vendor
          notifications.push({
            type: notificationType,
            title,
            message,
            recipient: NotificationRecipient.VENDOR,
            recipientId: event.vendorId,
            applicationId: event.applicationId,
            isRead: false,
            metadata: {
              applicationNumber: event.applicationNumber,
              companyName: event.companyName,
              oldStatus: event.oldStatus,
              newStatus: event.newStatus,
            },
          });
          break;

        case ApplicationStatus.REJECTED:
          notificationType = NotificationType.APPLICATION_REJECTED;
          title = 'Application Rejected';
          message = `Your application (${event.applicationNumber}) has been rejected. Please contact support for more information.`;
          
          // Notify vendor
          notifications.push({
            type: notificationType,
            title,
            message,
            recipient: NotificationRecipient.VENDOR,
            recipientId: event.vendorId,
            applicationId: event.applicationId,
            isRead: false,
            metadata: {
              applicationNumber: event.applicationNumber,
              companyName: event.companyName,
              oldStatus: event.oldStatus,
              newStatus: event.newStatus,
            },
          });
          break;

        case ApplicationStatus.FORWARDED_TO_REGISTRAR:
          notificationType = NotificationType.FORWARDED_TO_REGISTRAR;
          title = 'Application Forwarded to Registrar';
          message = `Application ${event.applicationNumber} from ${event.companyName} has been forwarded to you for review.`;
          
          // Notify all registrars
          const registrars = await this.userModel.find({ role: 'Registrar' }).exec();
          notifications.push(...registrars.map(registrar => ({
            type: notificationType,
            title,
            message,
            recipient: NotificationRecipient.REGISTRAR,
            recipientId: registrar._id as Types.ObjectId,
            applicationId: event.applicationId,
            isRead: false,
            metadata: {
              applicationNumber: event.applicationNumber,
              companyName: event.companyName,
              oldStatus: event.oldStatus,
              newStatus: event.newStatus,
            },
          })));

          // Also notify admins
          const admins = await this.userModel.find({ role: 'Admin' }).exec();
          notifications.push(...admins.map(admin => ({
            type: NotificationType.STATUS_UPDATED,
            title: 'Application Status Updated',
            message: `Application ${event.applicationNumber} from ${event.companyName} has been forwarded to registrar.`,
            recipient: NotificationRecipient.ADMIN,
            recipientId: admin._id as Types.ObjectId,
            applicationId: event.applicationId,
            isRead: false,
            metadata: {
              applicationNumber: event.applicationNumber,
              companyName: event.companyName,
              oldStatus: event.oldStatus,
              newStatus: event.newStatus,
            },
          })));
          break;

        default:
          // For other status changes, notify admins
          notificationType = NotificationType.STATUS_UPDATED;
          title = 'Application Status Updated';
          message = `Application ${event.applicationNumber} status changed from ${event.oldStatus} to ${event.newStatus}.`;
          
          const allAdmins = await this.userModel.find({ role: 'Admin' }).exec();
          notifications.push(...allAdmins.map(admin => ({
            type: notificationType,
            title,
            message,
            recipient: NotificationRecipient.ADMIN,
            recipientId: admin._id as Types.ObjectId,
            applicationId: event.applicationId,
            isRead: false,
            metadata: {
              applicationNumber: event.applicationNumber,
              companyName: event.companyName,
              oldStatus: event.oldStatus,
              newStatus: event.newStatus,
            },
          })));
      }

      if (notifications.length > 0) {
        await this.notificationModel.insertMany(notifications);
        this.logger.log(`Created ${notifications.length} notifications for status update`);
      }
    } catch (error) {
      this.logger.error(`Failed to create notifications for status update: ${error.message}`);
    }
  }

  /**
   * Get all notifications for a specific user
   */
  async findAllByUser(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.notificationModel
        .find({ recipientId: new Types.ObjectId(userId) })
        .populate('applicationId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments({ recipientId: new Types.ObjectId(userId) }).exec(),
    ]);

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      unreadCount: await this.notificationModel.countDocuments({ 
        recipientId: new Types.ObjectId(userId), 
        isRead: false 
      }).exec(),
    };
  }

  /**
   * Get unread notifications count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({ 
      recipientId: new Types.ObjectId(userId), 
      isRead: false 
    }).exec();
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.notificationModel.findOneAndUpdate(
      { 
        _id: new Types.ObjectId(notificationId), 
        recipientId: new Types.ObjectId(userId) 
      },
      { isRead: true },
      { new: true }
    ).exec();

    if (!notification) {
      throw new Error('Notification not found');
    }

    return notification;
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string) {
    const result = await this.notificationModel.updateMany(
      { recipientId: new Types.ObjectId(userId), isRead: false },
      { isRead: true }
    ).exec();

    return { modifiedCount: result.modifiedCount };
  }

  /**
   * Delete a notification
   */
  async remove(notificationId: string, userId: string) {
    const result = await this.notificationModel.deleteOne({
      _id: new Types.ObjectId(notificationId),
      recipientId: new Types.ObjectId(userId)
    }).exec();

    if (result.deletedCount === 0) {
      throw new Error('Notification not found');
    }

    return { message: 'Notification deleted successfully' };
  }
}
