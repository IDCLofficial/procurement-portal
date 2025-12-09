# Audit Logging Usage Guide

## Overview
The audit logging system automatically tracks all application-related actions including status updates and assignments with comprehensive details about who made the change, what changed, and when.

## How It Works

### Automatic Logging

#### Status Updates
When an application status is updated via `updateApplicationStatus()`, an audit log entry is automatically created with:
- **Actor**: Name of the person making the change
- **Role**: Role of the person (desk officer, registrar, system admin, etc.)
- **Action**: Type of action (approved, rejected, forwarded, etc.)
- **Entity**: Application ID and details
- **Severity**: Visual indicator (Success, Error, Warning, Info)
- **IP Address**: IP address of the requester
- **Metadata**: Additional context (old status, new status, company info, notes)

#### Application Assignments
When an application is assigned via `assignApplication()`, an audit log entry is automatically created with:
- **Actor**: Name of the admin performing the assignment
- **Role**: Admin
- **Action**: APPLICATION_REVIEWED
- **Entity**: Application ID
- **Severity**: Info
- **Details**: Shows who the application was assigned to (or reassigned from/to)
- **Metadata**: Assignment details including previous assignee if applicable

### Status-to-Action Mapping
The system automatically determines the audit action based on the new status:

| New Status | Audit Action | Severity |
|------------|-------------|----------|
| APPROVED | APPLICATION_APPROVED | Success |
| REJECTED | APPLICATION_REJECTED | Error |
| FORWARDED_TO_REGISTRAR | APPLICATION_FORWARDED | Info |
| PENDING_CLARIFICATION | CLARIFICATION_REQUESTED | Warning |
| Others | APPLICATION_REVIEWED | Info |

## Controller Integration

### Status Update Endpoint

To enable full audit logging for status updates, update the controller to pass user information:

```typescript
@Patch('status/:id')
async updateApplicationStatus(
  @Param('id') id: string, 
  @Body() updateApplicationStatusDto: UpdateApplicationStatusDto,
  @Req() req: any
) { 
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    
    if (!decoded._id || !decoded.role) {
      throw new UnauthorizedException('Unauthorized');
    }

    // Get user details
    const user = await this.usersService.findOne(decoded._id);
    
    // Add audit information to DTO
    updateApplicationStatusDto.updatedBy = decoded._id;
    updateApplicationStatusDto.updatedByName = user.fullname;
    updateApplicationStatusDto.updatedByRole = decoded.role;
    updateApplicationStatusDto.ipAddress = req.ip || req.connection.remoteAddress;
    
    return this.applicationsService.updateApplicationStatus(id, updateApplicationStatusDto);
  } catch (err) {
    throw new UnauthorizedException('Unauthorized');
  }
}
```

### Assignment Endpoint

To enable full audit logging for assignments, update the controller to pass admin information:

```typescript
@Patch('assign/:id')
async assignApplication(
  @Param('id') id: string, 
  @Body() assignApplicationDto: AssignApplicationDto,
  @Req() req: any
) {
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    
    if (!decoded._id || decoded.role !== 'Admin') {
      throw new UnauthorizedException('Admin role required');
    }

    // Get admin details
    const admin = await this.usersService.findOne(decoded._id);
    
    // Add audit information to DTO
    assignApplicationDto.assignedBy = decoded._id;
    assignApplicationDto.assignedByName = admin.fullname;
    assignApplicationDto.assignedByRole = decoded.role;
    assignApplicationDto.ipAddress = req.ip || req.connection.remoteAddress;
    
    return this.applicationsService.assignApplication(id, assignApplicationDto);
  } catch (err) {
    throw new UnauthorizedException('Unauthorized');
  }
}
```

## Example Requests

### Status Update Request

```bash
PATCH /applications/status/507f1f77bcf86cd799439011
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
Body: {
  "applicationStatus": "APPROVED",
  "notes": "All documents verified and approved",
  "updatedBy": "507f1f77bcf86cd799439012",
  "updatedByName": "John Doe",
  "updatedByRole": "desk officer",
  "ipAddress": "192.168.1.100"
}
```

### Assignment Request

```bash
PATCH /applications/assign/507f1f77bcf86cd799439011
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
Body: {
  "userId": "507f1f77bcf86cd799439013",
  "userName": "John Doe",
  "assignedBy": "507f1f77bcf86cd799439012",
  "assignedByName": "Admin User",
  "assignedByRole": "Admin",
  "ipAddress": "192.168.1.100"
}
```

## Viewing Audit Logs

### Get all audit logs for an application
```bash
GET /audit-logs/entity/Application/app-2024-001
```

### Get recent audit logs
```bash
GET /audit-logs/recent?limit=10
```

### Filter audit logs
```bash
GET /audit-logs?entityType=Application&action=APPLICATION_APPROVED&severity=Success&limit=50
```

## Audit Log Entry Examples

### Status Update Log

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "timestamp": "2024-11-13T10:15:30.000Z",
  "actor": "Chiamaka Okonkwo",
  "actorId": "507f1f77bcf86cd799439012",
  "role": "desk officer",
  "action": "Application Approved",
  "entityType": "Application",
  "entityId": "app-2024-001",
  "details": "Approved application for ABC Construction Ltd: All documents verified",
  "severity": "Success",
  "ipAddress": "192.168.1.100",
  "metadata": {
    "oldStatus": "PENDING_DESK_REVIEW",
    "newStatus": "APPROVED",
    "companyId": "507f1f77bcf86cd799439013",
    "companyName": "ABC Construction Ltd",
    "notes": "All documents verified"
  },
  "createdAt": "2024-11-13T10:15:30.000Z",
  "updatedAt": "2024-11-13T10:15:30.000Z"
}
```

### Assignment Log

```json
{
  "_id": "507f1f77bcf86cd799439014",
  "timestamp": "2024-11-13T09:30:00.000Z",
  "actor": "Emeka Nwankwo",
  "actorId": "507f1f77bcf86cd799439015",
  "role": "Admin",
  "action": "Application Reviewed",
  "entityType": "Application",
  "entityId": "app-2024-002",
  "details": "Assigned application app-2024-002 to Chukwudi Obi",
  "severity": "Info",
  "ipAddress": "192.168.1.101",
  "metadata": {
    "applicationId": "507f1f77bcf86cd799439016",
    "assignedTo": "507f1f77bcf86cd799439017",
    "assignedToName": "Chukwudi Obi",
    "previouslyAssignedTo": null,
    "previousAssigneeName": null,
    "isReassignment": false
  },
  "createdAt": "2024-11-13T09:30:00.000Z",
  "updatedAt": "2024-11-13T09:30:00.000Z"
}
```

### Reassignment Log

```json
{
  "_id": "507f1f77bcf86cd799439018",
  "timestamp": "2024-11-13T11:45:00.000Z",
  "actor": "Emeka Nwankwo",
  "actorId": "507f1f77bcf86cd799439015",
  "role": "Admin",
  "action": "Application Reviewed",
  "entityType": "Application",
  "entityId": "app-2024-003",
  "details": "Reassigned application app-2024-003 from Chukwudi Obi to Ngozi Okoro",
  "severity": "Info",
  "ipAddress": "192.168.1.101",
  "metadata": {
    "applicationId": "507f1f77bcf86cd799439019",
    "assignedTo": "507f1f77bcf86cd799439020",
    "assignedToName": "Ngozi Okoro",
    "previouslyAssignedTo": "507f1f77bcf86cd799439017",
    "previousAssigneeName": "Chukwudi Obi",
    "isReassignment": true
  },
  "createdAt": "2024-11-13T11:45:00.000Z",
  "updatedAt": "2024-11-13T11:45:00.000Z"
}
```

## Benefits

1. **Complete Audit Trail**: Every status change and assignment is tracked with full context
2. **Accountability**: Know exactly who made each change and when
3. **Compliance**: Meet regulatory requirements for record-keeping
4. **Debugging**: Trace issues back to specific actions
5. **Analytics**: Generate reports on application processing patterns
6. **Security**: Track suspicious activities or unauthorized access attempts
7. **Reassignment Tracking**: Clearly shows when applications are reassigned from one user to another

## Notes

- Audit logging is non-blocking - if it fails, the status update still succeeds
- All audit log failures are logged to the application logger
- Audit logs are immutable - they cannot be edited or deleted through the API
- The system stores comprehensive metadata for future analysis
