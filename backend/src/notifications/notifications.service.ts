import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/entities/user.schema';
import { Notification, NotificationDocument, NotificationType, NotificationRecipient } from './entities/notification.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Certificate, CertificateDocument, certificateStatus } from '../certificates/entities/certificate.schema';
import { Application, ApplicationDocument, ApplicationStatus, SLAStatus } from '../applications/entities/application.schema';
import { verificationDocuments, verificationDocument, Status as DocumentStatus } from '../documents/entities/document.schema';
import { Vendor, VendorDocument } from '../vendors/entities/vendor.schema';
import { Sla, SlaDocument } from '../sla/entities/sla.schema';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    this.logger.log('Running scheduled checks...');
  }
  
}
