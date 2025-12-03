import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitter2 } from 'eventemitter2';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification, NotificationSchema } from './entities/notification.entity';
import { User, UserSchema } from '../users/entities/user.schema';
import { Certificate, CertificateSchema } from '../certificates/entities/certificate.schema';
import { Application, ApplicationSchema } from '../applications/entities/application.schema';
import { verificationDocuments, VerificationDocumentSchema } from '../documents/entities/document.schema';
import { Vendor, VendorSchema } from '../vendors/entities/vendor.schema';
import { Sla, SlaSchema } from '../sla/entities/sla.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: User.name, schema: UserSchema },
      { name: Certificate.name, schema: CertificateSchema },
      { name: Application.name, schema: ApplicationSchema },
      { name: verificationDocuments.name, schema: VerificationDocumentSchema },
      { name: Vendor.name, schema: VendorSchema },
      { name: Sla.name, schema: SlaSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
