import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument, NotificationType, NotificationRecipient } from './entities/notification.entity';
import { ApplicationSubmittedEvent } from './events/application-submitted.event';
import { ApplicationStatusUpdatedEvent } from './events/application-status-updated.event';
import { ApplicationStatus } from '../applications/entities/application.schema';
import { User, UserDocument } from '../users/entities/user.schema';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    
  ) {}
}
