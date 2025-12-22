import { ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
  async getVendorNotifications(
    vendorId: string,
    filters: { filter: 'all' | 'read' | 'unread'; search: string },
    pagination: { page: number; limit: number; skip: number }
  ) {
    const { filter, search } = filters;
    const { limit, skip } = pagination;

    // Build the query
    const query: any = { 
      $or: [
        { vendorId: new Types.ObjectId(vendorId) },
        { recipientId: new Types.ObjectId(vendorId) }
      ]
    };

    // Apply read/unread filter
    if (filter === 'read') {
      query.isRead = true;
    } else if (filter === 'unread') {
      query.isRead = false;
    }

    // Apply search if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Get counts for all, read, and unread notifications
    const [total, readCount, unreadCount, critical, highPriority] = await Promise.all([
      this.notificationModel.countDocuments(query),
      this.notificationModel.countDocuments({ ...query, isRead: true }),
      this.notificationModel.countDocuments({ ...query, isRead: false }),
      this.notificationModel.countDocuments({ ...query, priority: priority.CRITICAL }),
      this.notificationModel.countDocuments({ ...query, priority: priority.HIGH }),
    ]);

    // Get paginated results
    const notifications = await this.notificationModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      notifications: notifications,
      total: total,
      totalRead: readCount,
      totalUnread: unreadCount,
      totalHigh: highPriority,
      totalCritical: critical,
      pagination: {
        total,
        page: pagination.page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  async getDeskOfficerNotifications(
    deskOfficerId: string,
    filters: { filter: 'all' | 'read' | 'unread'; search: string },
    pagination: { page: number; limit: number; skip: number }
  ) {
    const { filter, search } = filters;
    const { limit, skip } = pagination;

    const query: any = {
      recipient: NotificationRecipient.DESK_OFFICER,
      recipientId: new Types.ObjectId(deskOfficerId),
    };

    if (filter === 'read') {
      query.isRead = true;
    } else if (filter === 'unread') {
      query.isRead = false;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const [total, readCount, unreadCount, critical, highPriority] = await Promise.all([
      this.notificationModel.countDocuments(query),
      this.notificationModel.countDocuments({ ...query, isRead: true }),
      this.notificationModel.countDocuments({ ...query, isRead: false }),
      this.notificationModel.countDocuments({ ...query, priority: priority.CRITICAL }),
      this.notificationModel.countDocuments({ ...query, priority: priority.HIGH }),
    ]);

    const notifications = await this.notificationModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      notifications: notifications,
      total: total,
      totalRead: readCount,
      totalUnread: unreadCount,
      totalHigh: highPriority,
      totalCritical: critical,
      pagination: {
        total,
        page: pagination.page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRegistrarNotifications(
    registrarId: string,
    filters: { filter: 'all' | 'read' | 'unread'; search: string },
    pagination: { page: number; limit: number; skip: number }
  ) {
    const { filter, search } = filters;
    const { limit, skip } = pagination;

    const query: any = {
      recipient: NotificationRecipient.REGISTRAR,
      recipientId: new Types.ObjectId(registrarId),
    };

    if (filter === 'read') {
      query.isRead = true;
    } else if (filter === 'unread') {
      query.isRead = false;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const [total, readCount, unreadCount, critical, highPriority] = await Promise.all([
      this.notificationModel.countDocuments(query),
      this.notificationModel.countDocuments({ ...query, isRead: true }),
      this.notificationModel.countDocuments({ ...query, isRead: false }),
      this.notificationModel.countDocuments({ ...query, priority: priority.CRITICAL }),
      this.notificationModel.countDocuments({ ...query, priority: priority.HIGH }),
    ]);

    const notifications = await this.notificationModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      notifications: notifications,
      total: total,
      totalRead: readCount,
      totalUnread: unreadCount,
      totalHigh: highPriority,
      totalCritical: critical,
      pagination: {
        total,
        page: pagination.page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Mark a single notification as read
   * @param notificationId - ID of the notification to mark as read
   * @param userId - ID of the user making the request
   * @throws {NotFoundException} If notification is not found or doesn't belong to user
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    try{
      const notification = await this.notificationModel.findOneAndUpdate(
        {_id: new Types.ObjectId(notificationId)},
        { $set: { isRead: true } },
        { new: true }
      );
      
      if (!notification) {
        throw new NotFoundException('Notification not found');
      }
    }catch(e){
      this.logger.error(e)
      throw new ConflictException('The server encountered a problem executing your request')
    }
  }

  async checkExpiringDocuments() {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const documents = await this.documentModel.find({
      validTo: {
        $gte: now.toISOString().split('T')[0],
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
      validTo: {
        $lt: now.toISOString().split('T')[0], // Gets today's date in YYYY-MM-DD format
        $ne: ''
      },
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

        // // Notify all admins
        // const admins = await this.userModel.find({ role: 'Admin' });
        // for (const admin of admins) {
        //   await this.notificationModel.create({
        //     type: NotificationType.CERTIFICATE_EXPIRED,
        //     title: 'Vendor Document Expired',
        //     vendorId: doc.vendor,
        //     message: `A vendor's ${doc.documentType} document expired on ${expiredDate}. Immediate action required.`,
        //     recipient: NotificationRecipient.ADMIN,
        //     recipientId: admin._id,
        //     priority: priority.CRITICAL,
        //     isRead: false,
        //   });
        // }

        notificationsSent++;
      }
    }

    this.logger.log(`Checked ${expiredDocuments.length} expired documents, sent ${notificationsSent} notifications`);
    return { total: expiredDocuments.length, notificationsSent };
  }

  async findVendorNotifications(vendorId: any, query:{
    isRead?:boolean,
    page?: number,
    limit?: number,
    skip?: number,
  }): Promise<any> {
    const filter: any = {
      vendorId: new Types.ObjectId(vendorId as Types.ObjectId),
    };
    let isReadFilter: boolean | undefined;
    if (query && typeof query.isRead !== 'undefined') {
      const raw = (query as any).isRead;
      if (raw === true || raw === 'true') {
        isReadFilter = true;
      } else if (raw === false || raw === 'false') {
        isReadFilter = false;
      }
    }

    if (typeof isReadFilter === 'boolean') {
      // Only apply isRead filter when explicitly requested
      filter.isRead = isReadFilter;
    }

    const limit = query?.limit ? Math.min(100, Math.max(1, parseInt(query.limit.toString()))) : 10;
    const skip = query?.skip ? Math.max(0, parseInt(query.skip.toString())) : 0;
    const page = query?.page ? Math.max(1, parseInt(query.page.toString())) : Math.floor(skip / limit) + 1;

    const [vendorNotifications, filteredTotal] = await Promise.all([
      this.notificationModel
        .find(filter)
        .sort({
          createdAt: -1
        })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments(filter),
    ]);

    // Aggregate counts for this vendor
    const baseVendorFilter = { vendorId: new Types.ObjectId(vendorId as Types.ObjectId) };
    const [
      totalNotifications,
      totalUnreadNotifications,
      totalCriticalNotifications,
      totalHighPriorityNotifications,
    ] = await Promise.all([
      this.notificationModel.countDocuments(baseVendorFilter),
      this.notificationModel.countDocuments({ ...baseVendorFilter, isRead: false }),
      this.notificationModel.countDocuments({ ...baseVendorFilter, priority: priority.CRITICAL }),
      this.notificationModel.countDocuments({ ...baseVendorFilter, priority: priority.HIGH }),
    ]);

    const result = vendorNotifications.map((notification) => ({
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      createdAt: notification.createdAt,
      isRead: notification.isRead
    }));
    
    return {
      message: `you have ${result.length} notifications`,
      notifications: result,
      totalNotifications,
      totalUnreadNotifications,
      totalCriticalNotifications,
      totalHighPriorityNotifications,
      pagination: {
        total: filteredTotal,
        page,
        limit,
        totalPages: Math.ceil(filteredTotal / limit),
      },
    }
  }

  async markAllVendorAsRead(vendorId: any): Promise<any> {
    const filter: any = {
      vendorId: new Types.ObjectId(vendorId as Types.ObjectId),
    };
    return await this.notificationModel.updateMany(filter, { isRead: true });
  }

  async deleteVendorNotification(vendorId: any, notificationId: string) {
    const filter: any = {
      _id: new Types.ObjectId(notificationId as string),
      vendorId: new Types.ObjectId(vendorId as Types.ObjectId),
    };
    return await this.notificationModel.deleteOne(filter);
  }

  async deleteMultipleVendorNotifications(vendorId: any, notificationIds: string[]) {
    const ids = (notificationIds || []).map((id) => new Types.ObjectId(id));
    if (ids.length === 0) {
      return { acknowledged: true, deletedCount: 0 };
    }
    const filter: any = {
      vendorId: new Types.ObjectId(vendorId as Types.ObjectId),
      _id: { $in: ids },
    };
    return await this.notificationModel.deleteMany(filter);
  }

  async deleteVendorNotifications(vendorId: any){
    const filter: any = {
      vendorId: new Types.ObjectId(vendorId as Types.ObjectId),
    };
    return await this.notificationModel.deleteMany(filter);
  }

  async findAdminNotifications(query:{
    isRead?:boolean,
    page?: number,
    limit?: number,
    skip?: number,
  }, userId: string): Promise<any> {
    // const adminId = decoded._id;
    const filter: any = {
      recipient:NotificationRecipient.ADMIN
    };

    let isReadFilter: boolean | undefined;
    if (query && typeof query.isRead !== 'undefined') {
      const raw = (query as any).isRead;
      if (raw === true || raw === 'true') {
        isReadFilter = true;
      } else if (raw === false || raw === 'false') {
        isReadFilter = false;
      }
    }

    if (typeof isReadFilter === 'boolean') {
      // Only apply isRead filter when explicitly requested
      filter.isRead = isReadFilter;
    }
    const limit = query?.limit ? Math.min(100, Math.max(1, parseInt(query.limit.toString()))) : 10;
    const skip = query?.skip ? Math.max(0, parseInt(query.skip.toString())) : 0;
    const page = query?.page ? Math.max(1, parseInt(query.page.toString())) : Math.floor(skip / limit) + 1;

    const [adminNotifications, filteredTotal] = await Promise.all([
      this.notificationModel
      .find(filter)
      .sort({createdAt: -1})
      .skip(skip)
      .limit(limit)
      .exec(),
      this.notificationModel.countDocuments(filter),
    ]);
    
    const result = adminNotifications.map((notification) => ({
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      createdAt: notification.createdAt,
      applicationId:notification.applicationId,
      _id: notification._id
    }));

    // Aggregate counts for this admin
    const baseAdminFilter = { recipient: NotificationRecipient.ADMIN };
    const [
      totalNotifications,
      totalUnreadNotifications,
      totalCriticalNotifications,
      totalHighPriorityNotifications,
    ] = await Promise.all([
      this.notificationModel.countDocuments(baseAdminFilter),
      this.notificationModel.countDocuments({ ...baseAdminFilter, isRead: false }),
      this.notificationModel.countDocuments({ ...baseAdminFilter, priority: priority.CRITICAL }),
      this.notificationModel.countDocuments({ ...baseAdminFilter, priority: priority.HIGH }),
    ]);
    
    return {
      message: `you have ${result.length} notifications`,
      notifications: result,
      totalNotifications,
      totalUnreadNotifications,
      totalCriticalNotifications,
      totalHighPriorityNotifications,
      pagination: {
        total: filteredTotal,
        page,
        limit,
        totalPages: Math.ceil(filteredTotal / limit),
      },
    }
  }

  async markAllAdminAsRead(){
    const filter: any = {
      recipient:NotificationRecipient.ADMIN,
    };
    return await this.notificationModel.updateMany(filter, { isRead: true });
  }

  async markOneAdminAsRead(notificationId: string, uid:string, authToken:string){
    const user = await this.userModel.findById(uid);
    
    if(!user){
      throw new NotFoundException("No user found")
    }

    if(user.accessToken!==authToken){
      throw new UnauthorizedException("Invalid or expired token")
    }

    const filter: any = {
      _id: notificationId,
      recipient:NotificationRecipient.ADMIN,
    };
    return await this.notificationModel.updateOne(filter, { isRead: true });
  }



   @Cron(CronExpression.EVERY_30_MINUTES)
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

  
}
