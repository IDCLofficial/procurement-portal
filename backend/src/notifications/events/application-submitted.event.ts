import { Types } from 'mongoose';

export class ApplicationSubmittedEvent {
  constructor(
    public readonly applicationId: Types.ObjectId,
    public readonly applicationNumber: string,
    public readonly companyName: string,
    public readonly vendorId: Types.ObjectId,
    public readonly grade: string,
    public readonly type: string,
  ) {}
}
