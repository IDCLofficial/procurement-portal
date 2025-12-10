# Event-Based Notification System

## Overview

This document describes the fully event-driven notification system implemented for the procurement portal. The system uses `@nestjs/event-emitter` to handle asynchronous notifications when important actions occur in the application.

## Architecture

### Event Flow

```
Action Occurs → Event Emitted → Event Listener Triggered → Notification Created → Stored in Database
```

### Key Components

1. **Event Classes** - Define the structure of events
2. **Event Emitters** - Emit events when actions occur
3. **Event Listeners** - Listen for events and create notifications
4. **Notification Schema** - Store notifications with timestamps
5. **REST API** - Endpoints to retrieve and manage notifications

## Installation

### Step 1: Install Required Package

Run the following command in your terminal:

```bash
npm install @nestjs/event-emitter
```

### Step 2: Start the Application

```bash
npm run start:dev
```

## Events

### 1. Application Submitted Event

**Event Name:** `application.submitted`

**Triggered When:** A vendor completes payment and an application is created

**Location:** `src/payments/payments.service.ts` (line 194)

**Event Data:**
- `applicationId` - MongoDB ObjectId of the application
- `applicationNumber` - Application reference number (e.g., APP-2025-001)
- `companyName` - Name of the company
- `vendorId` - MongoDB ObjectId of the vendor
- `grade` - Application grade (A, B, C, D)
- `type` - Application type (New, Renewal, Upgrade)

**Notifications Created:**
- Sent to all users with role "Admin"
- Notification type: "Application Submitted"

### 2. Application Status Updated Event

**Event Name:** `application.status.updated`

**Triggered When:** An admin/desk officer/registrar changes the application status

**Location:** `src/applications/applications.service.ts` (line 218)

**Event Data:**
- `applicationId` - MongoDB ObjectId of the application
- `applicationNumber` - Application reference number
- `companyName` - Name of the company
- `vendorId` - MongoDB ObjectId of the vendor
- `oldStatus` - Previous status
- `newStatus` - New status

**Notifications Created Based on Status:**

#### Approved Status
- Sent to the vendor
- Notification type: "Application Approved"
- Message: "Your application has been approved. Congratulations!"

#### Rejected Status
- Sent to the vendor
- Notification type: "Application Rejected"
- Message: "Your application has been rejected. Please contact support."

#### Forwarded to Registrar
- Sent to all users with role "Registrar"
- Sent to all users with role "Admin"
- Notification type: "Forwarded to Registrar"
- Message: "Application has been forwarded to you for review."

#### Other Status Changes
- Sent to all users with role "Admin"
- Notification type: "Status Updated"

## Database Schema

### Notification Schema

```typescript
{
  type: NotificationType,              // Enum: APPLICATION_SUBMITTED, STATUS_UPDATED, etc.
  title: string,                       // Notification title
  message: string,                     // Notification message
  recipient: NotificationRecipient,    // Enum: ADMIN, VENDOR, REGISTRAR, DESK_OFFICER
  recipientId: ObjectId,               // Reference to User
  applicationId: ObjectId,             // Reference to Application
  isRead: boolean,                     // Default: false
  metadata: {
    applicationNumber: string,
    companyName: string,
    oldStatus: string,
    newStatus: string,
    // ... other metadata
  },
  createdAt: Date,                     // Auto-generated timestamp
  updatedAt: Date                      // Auto-generated timestamp
}
```

## REST API Endpoints

### Base URL: `/notifications`

All endpoints require JWT authentication via Bearer token in the Authorization header.

### 1. Get User Notifications

**GET** `/notifications`

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20)

**Response:**
```json
{
  "notifications": [...],
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3,
  "unreadCount": 5
}
```

### 2. Get Unread Count

**GET** `/notifications/unread/count`

**Response:**
```json
{
  "unreadCount": 5
}
```

### 3. Mark Notification as Read

**PATCH** `/notifications/:id/read`

**Parameters:**
- `id` - Notification ID

**Response:**
```json
{
  "_id": "...",
  "isRead": true,
  ...
}
```

### 4. Mark All Notifications as Read

**PATCH** `/notifications/read/all`

**Response:**
```json
{
  "modifiedCount": 10
}
```

### 5. Delete Notification

**DELETE** `/notifications/:id`

**Parameters:**
- `id` - Notification ID

**Response:**
```json
{
  "message": "Notification deleted successfully"
}
```

## Usage Examples

### For Frontend Integration

#### Get Notifications
```javascript
const response = await fetch('/notifications?page=1&limit=20', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

#### Get Unread Count (for badge)
```javascript
const response = await fetch('/notifications/unread/count', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const { unreadCount } = await response.json();
```

#### Mark as Read
```javascript
await fetch(`/notifications/${notificationId}/read`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Testing the System

### 1. Test Application Submission

1. Complete vendor registration
2. Submit company details
3. Make payment for application
4. After successful payment verification, check:
   - Application is created
   - Event is emitted
   - Notifications are created for all admins

### 2. Test Status Updates

1. Login as Admin/Desk Officer
2. Update application status to "Forwarded to Registrar"
3. Check:
   - Event is emitted
   - Notifications are created for all registrars and admins

4. Update status to "Approved"
5. Check:
   - Event is emitted
   - Notification is created for the vendor

### 3. Verify Notifications

1. Login as Admin
2. GET `/notifications` - Should see new application notification
3. GET `/notifications/unread/count` - Should show unread count
4. PATCH `/notifications/:id/read` - Mark as read
5. Verify `isRead` is now `true`

## File Structure

```
src/
├── notifications/
│   ├── entities/
│   │   └── notification.entity.ts          # Notification schema with timestamps
│   ├── events/
│   │   ├── application-submitted.event.ts  # Application submission event
│   │   └── application-status-updated.event.ts  # Status update event
│   ├── notifications.controller.ts         # REST API endpoints
│   ├── notifications.service.ts            # Event listeners & business logic
│   └── notifications.module.ts             # Module configuration
├── applications/
│   └── applications.service.ts             # Emits status update events
├── payments/
│   └── payments.service.ts                 # Emits application submitted events
└── app.module.ts                           # EventEmitterModule configuration
```

## Configuration

The EventEmitterModule is configured in `app.module.ts` with the following settings:

```typescript
EventEmitterModule.forRoot({
  wildcard: false,
  delimiter: '.',
  newListener: false,
  removeListener: false,
  maxListeners: 10,
  verboseMemoryLeak: false,
  ignoreErrors: false,
})
```

## Logging

The system includes comprehensive logging:

- Application submission events
- Status update events
- Notification creation
- Error handling

Check your console/logs for messages like:
```
[NotificationsService] Handling application submitted event: APP-2025-001
[NotificationsService] Created 3 notifications for admins
[SplitPaymentService] Application submitted event emitted for: APP-2025-001
```

## Error Handling

All event listeners include try-catch blocks to prevent failures from affecting the main application flow. Errors are logged but don't throw exceptions.

## Future Enhancements

Potential improvements:
1. Real-time notifications via WebSockets
2. Email notifications
3. SMS notifications
4. Push notifications
5. Notification preferences per user
6. Notification templates
7. Batch notification processing

## Troubleshooting

### Notifications Not Created

1. Check if `@nestjs/event-emitter` is installed
2. Verify EventEmitterModule is imported in app.module.ts
3. Check logs for event emission messages
4. Verify User collection has admin users
5. Check MongoDB connection

### Events Not Firing

1. Verify EventEmitter2 is injected in services
2. Check event names match exactly (case-sensitive)
3. Ensure event listeners use `@OnEvent` decorator
4. Check if actions that trigger events are executing

## Support

For issues or questions, contact the development team or refer to:
- NestJS Event Emitter Documentation: https://docs.nestjs.com/techniques/events
- Project Repository Issues
