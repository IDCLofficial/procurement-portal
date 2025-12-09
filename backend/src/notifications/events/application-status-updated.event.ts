import { Types } from 'mongoose';

export class ApplicationStatusUpdatedEvent {
  constructor(
    public readonly applicationId: Types.ObjectId,
    public readonly applicationNumber: string,
    public readonly companyName: string,
    public readonly vendorId: Types.ObjectId,
    public readonly oldStatus: string,
    public readonly newStatus: string,
  ) {}
}
