# Quick Start - Event-Based Notification System

## Installation

```bash
npm install @nestjs/event-emitter
```

## What Was Implemented

### ✅ Complete Event-Driven Notification System

1. **Notification Schema** with timestamps (`createdAt`, `updatedAt`)
2. **Two Event Types:**
   - Application Submitted (when vendor pays and application is created)
   - Application Status Updated (when admin changes status)

3. **Automatic Notifications:**
   - Admins notified when application is submitted
   - Registrars notified when application forwarded to them
   - Vendors notified when application is approved/rejected

4. **REST API Endpoints:**
   - `GET /notifications` - Get user notifications (paginated)
   - `GET /notifications/unread/count` - Get unread count
   - `PATCH /notifications/:id/read` - Mark as read
   - `PATCH /notifications/read/all` - Mark all as read
   - `DELETE /notifications/:id` - Delete notification

## Files Created/Modified

### New Files
- `src/notifications/entities/notification.entity.ts` - Schema with timestamps
- `src/notifications/events/application-submitted.event.ts`
- `src/notifications/events/application-status-updated.event.ts`
- `NOTIFICATION_SYSTEM.md` - Full documentation
- `QUICK_START.md` - This file

### Modified Files
- `src/notifications/notifications.service.ts` - Event listeners
- `src/notifications/notifications.controller.ts` - REST API
- `src/notifications/notifications.module.ts` - Module config
- `src/payments/payments.service.ts` - Emits application.submitted
- `src/applications/applications.service.ts` - Emits application.status.updated
- `src/app.module.ts` - EventEmitterModule configuration

## How It Works

### When Vendor Submits Application (After Payment)

```
Payment Verified → Application Created → Event Emitted → Admins Notified
```

**Code Location:** `src/payments/payments.service.ts` (line 194)

### When Admin Changes Application Status

```
Status Updated → Event Emitted → Notifications Created Based on Status
```

**Code Location:** `src/applications/applications.service.ts` (line 218)

**Status-Based Notifications:**
- **Approved** → Vendor notified
- **Rejected** → Vendor notified
- **Forwarded to Registrar** → Registrars + Admins notified
- **Other statuses** → Admins notified

## Testing

### 1. Start the Server
```bash
npm run start:dev
```

### 2. Test Application Submission
1. Register as vendor
2. Complete company registration
3. Make payment
4. Check admin notifications: `GET /notifications`

### 3. Test Status Updates
1. Login as admin
2. Update application status: `PATCH /applications/status/:id`
3. Check notifications based on status

### 4. Test Notification Endpoints
```bash
# Get notifications
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/notifications

# Get unread count
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/notifications/unread/count

# Mark as read
curl -X PATCH -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/notifications/:id/read

# Mark all as read
curl -X PATCH -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/notifications/read/all

# Delete notification
curl -X DELETE -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/notifications/:id
```

## API Response Examples

### Get Notifications
```json
{
  "notifications": [
    {
      "_id": "...",
      "type": "Application Submitted",
      "title": "New Application Submitted",
      "message": "Tech Solutions Ltd has submitted a new New application (APP-2025-001) for Grade A.",
      "recipient": "Admin",
      "recipientId": "...",
      "applicationId": "...",
      "isRead": false,
      "metadata": {
        "applicationNumber": "APP-2025-001",
        "companyName": "Tech Solutions Ltd",
        "grade": "A",
        "type": "New"
      },
      "createdAt": "2025-12-01T08:51:00.000Z",
      "updatedAt": "2025-12-01T08:51:00.000Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20,
  "totalPages": 1,
  "unreadCount": 5
}
```

### Get Unread Count
```json
{
  "unreadCount": 5
}
```

## Frontend Integration Example

```typescript
// Get notifications
async function getNotifications(page = 1) {
  const response = await fetch(`/notifications?page=${page}&limit=20`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

// Get unread count for badge
async function getUnreadCount() {
  const response = await fetch('/notifications/unread/count', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const { unreadCount } = await response.json();
  return unreadCount;
}

// Mark as read
async function markAsRead(notificationId) {
  await fetch(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

// Mark all as read
async function markAllAsRead() {
  await fetch('/notifications/read/all', {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
```

## Notification Types

```typescript
enum NotificationType {
  APPLICATION_SUBMITTED = 'Application Submitted',
  STATUS_UPDATED = 'Status Updated',
  APPLICATION_APPROVED = 'Application Approved',
  APPLICATION_REJECTED = 'Application Rejected',
  FORWARDED_TO_REGISTRAR = 'Forwarded to Registrar',
}
```

## Notification Recipients

```typescript
enum NotificationRecipient {
  ADMIN = 'Admin',
  VENDOR = 'Vendor',
  REGISTRAR = 'Registrar',
  DESK_OFFICER = 'Desk Officer',
}
```

## Troubleshooting

### Lint Errors About @nestjs/event-emitter
**Solution:** Run `npm install @nestjs/event-emitter`

### Notifications Not Appearing
1. Check if admins exist in User collection
2. Verify MongoDB connection
3. Check server logs for event emission messages
4. Ensure JWT token is valid

### Events Not Firing
1. Verify EventEmitterModule is in app.module.ts
2. Check if EventEmitter2 is injected in services
3. Ensure event names match exactly

## Next Steps

1. Install the package: `npm install @nestjs/event-emitter`
2. Start the server: `npm run start:dev`
3. Test the endpoints using Postman or curl
4. Integrate with your frontend
5. Monitor logs for event emissions

## Support

For detailed documentation, see `NOTIFICATION_SYSTEM.md`
