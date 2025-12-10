# Vendor Activity Logging System

## Overview
The vendor activity logging system tracks all important actions performed by vendors on the platform. This provides an audit trail and helps vendors see their recent activities.

## Schema
Location: `src/vendors/entities/vendor-activity-log.schema.ts`

### Activity Types
- `ACCOUNT_CREATED` - When a vendor account is created
- `PROFILE_UPDATED` - When vendor profile is updated
- `COMPANY_REGISTERED` - When company information is registered
- `COMPANY_UPDATED` - When company information is updated
- `APPLICATION_CREATED` - When a new application is created
- `APPLICATION_SUBMITTED` - When an application is submitted
- `PAYMENT_INITIATED` - When a payment process starts
- `PAYMENT_COMPLETED` - When payment is successful
- `PAYMENT_FAILED` - When payment fails
- `DOCUMENT_UPLOADED` - When a document is uploaded
- `DOCUMENT_UPDATED` - When a document is updated
- `PROFILE_RENEWAL_INITIATED` - When profile renewal starts
- `PROFILE_RENEWAL_COMPLETED` - When profile renewal completes
- `PASSWORD_CHANGED` - When password is changed
- `LOGIN` - When vendor logs in
- `LOGOUT` - When vendor logs out

## API Endpoint

### Get Activity Logs
**GET** `/vendors/activity-logs`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "activityType": "Account Created",
    "description": "Vendor account successfully created",
    "metadata": { "email": "vendor@example.com" },
    "timestamp": "2024-12-01T10:00:00.000Z"
  },
  {
    "activityType": "Application Created",
    "description": "New application submitted for Grade A",
    "metadata": { "applicationId": "APP-2024-001", "grade": "A" },
    "timestamp": "2024-12-02T14:30:00.000Z"
  }
]
```

Returns the **latest 5 activities** for the authenticated vendor.

## Usage in Code

### Creating Activity Logs

To log an activity, inject `VendorsService` and call `createActivityLog`:

```typescript
// Example: Log account creation
await this.vendorsService.createActivityLog(
  vendorId,
  ActivityType.ACCOUNT_CREATED,
  'Vendor account successfully created',
  { email: vendor.email, fullname: vendor.fullname },
  req.ip,
  req.headers['user-agent']
);

// Example: Log application creation
await this.vendorsService.createActivityLog(
  vendorId,
  ActivityType.APPLICATION_CREATED,
  `New application submitted for Grade ${grade}`,
  { 
    applicationId: application.applicationId,
    grade: application.grade,
    type: application.type
  }
);

// Example: Log payment completion
await this.vendorsService.createActivityLog(
  vendorId,
  ActivityType.PAYMENT_COMPLETED,
  `Payment of ₦${amount} completed successfully`,
  { 
    paymentId: payment._id,
    amount: payment.amount,
    reference: payment.reference
  }
);

// Example: Log document upload
await this.vendorsService.createActivityLog(
  vendorId,
  ActivityType.DOCUMENT_UPLOADED,
  `${documentType} document uploaded`,
  { 
    documentId: document._id,
    documentType: document.documentType,
    fileName: document.fileName
  }
);
```

### Method Signature

```typescript
async createActivityLog(
  vendorId: string | Types.ObjectId,
  activityType: ActivityType,
  description: string,
  metadata?: Record<string, any>,
  ipAddress?: string,
  userAgent?: string
): Promise<VendorActivityLog>
```

**Parameters:**
- `vendorId` - The vendor's user ID
- `activityType` - Type of activity from ActivityType enum
- `description` - Human-readable description of the activity
- `metadata` (optional) - Additional data about the activity
- `ipAddress` (optional) - IP address of the request
- `userAgent` (optional) - User agent string from the request

## Integration Points

Add activity logging at these key points in your application:

### 1. Authentication Service
- Log `LOGIN` when vendor logs in
- Log `LOGOUT` when vendor logs out
- Log `PASSWORD_CHANGED` when password is updated

### 2. Vendors Service
- Log `ACCOUNT_CREATED` in `create()` method
- Log `PROFILE_UPDATED` in `update()` method

### 3. Companies Service
- Log `COMPANY_REGISTERED` when company is created
- Log `COMPANY_UPDATED` when company info is updated

### 4. Applications Service
- Log `APPLICATION_CREATED` when application is created
- Log `APPLICATION_SUBMITTED` when application is submitted

### 5. Payments Service
- Log `PAYMENT_INITIATED` when payment starts
- Log `PAYMENT_COMPLETED` when payment succeeds
- Log `PAYMENT_FAILED` when payment fails

### 6. Documents Service
- Log `DOCUMENT_UPLOADED` when document is uploaded
- Log `DOCUMENT_UPDATED` when document is updated

### 7. Renewal Process
- Log `PROFILE_RENEWAL_INITIATED` when renewal starts
- Log `PROFILE_RENEWAL_COMPLETED` when renewal completes

## Best Practices

1. **Be Descriptive**: Write clear, user-friendly descriptions
2. **Include Metadata**: Add relevant IDs and details in metadata
3. **Don't Log Sensitive Data**: Never log passwords, tokens, or sensitive personal information
4. **Be Consistent**: Use the same activity type for similar actions across the application
5. **Handle Errors**: Wrap logging in try-catch to prevent it from breaking main functionality

## Example Integration

```typescript
// In vendors.service.ts create() method
async create(createVendorDto: CreateVendorDto, req?: Request) {
  try {
    // ... existing vendor creation code ...
    
    const newVendor = await vendor.save();
    
    // Log the activity
    await this.createActivityLog(
      newVendor._id,
      ActivityType.ACCOUNT_CREATED,
      'Vendor account successfully created',
      { 
        email: newVendor.email,
        fullname: newVendor.fullname 
      },
      req?.ip,
      req?.headers['user-agent']
    );
    
    return newVendor;
  } catch (error) {
    // ... error handling ...
  }
}
```

## Database Indexes

The schema includes an index on `(vendorId, createdAt)` for efficient querying of vendor activities sorted by date.

## Future Enhancements

Consider adding:
- Pagination for viewing more than 5 activities
- Filtering by activity type
- Date range filtering
- Export activity logs to CSV/PDF
- Admin dashboard to view all vendor activities
