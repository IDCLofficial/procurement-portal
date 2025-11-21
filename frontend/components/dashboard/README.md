# Dashboard Components

## RegistrationStatusCard

A dynamic card component that displays different states of vendor registration status.

### Status Types

#### 1. **Approved** (Default)
- **Badge**: Green with checkmark icon
- **Info Cards**: Green (Registration ID) + Blue (Valid Until)
- **Actions**: 
  - Download Certificate
  - Update Profile
- **Example**: `/dashboard` (main page)

#### 2. **Declined**
- **Badge**: Red with X icon
- **Alert**: Red alert box showing decline reason
- **Info Cards**: Red (Registration ID only)
- **Actions**: 
  - Reapply for Registration
  - Contact Support
- **Example**: `/dashboard/examples/declined`

#### 3. **Expired**
- **Badge**: Orange with exclamation icon
- **Alert**: Orange alert box with expiration message
- **Info Cards**: Orange (Registration ID) + Blue (Expired On)
- **Actions**: 
  - Renew Registration
  - Update Profile
- **Example**: `/dashboard/examples/expired`

#### 4. **Suspended**
- **Badge**: Yellow with ban icon
- **Alert**: Yellow alert box showing suspension reason
- **Info Cards**: Yellow (Registration ID) + Blue (Valid Until)
- **Actions**: 
  - Contact Support
  - View Details
- **Example**: `/dashboard/examples/suspended`

### Props

```typescript
interface RegistrationStatusCardProps {
    registrationId: string;              // Required: Registration ID
    validUntil?: string;                 // Optional: Expiry date (not shown for declined)
    daysRemaining?: number;              // Optional: Days until expiry (shown for approved only)
    status: 'approved' | 'declined' | 'expired' | 'suspended';  // Required: Status type
    declineReason?: string;              // Optional: Reason for decline (shown for declined status)
    suspensionReason?: string;           // Optional: Reason for suspension (shown for suspended status)
    onDownloadCertificate?: () => void;  // Callback for download button (approved only)
    onUpdateProfile?: () => void;        // Callback for update/view profile button
    onReapply?: () => void;              // Callback for reapply/renew button (declined/expired)
    onContactSupport?: () => void;       // Callback for contact support button (declined/suspended)
}
```

### Usage Examples

#### Approved Status
```tsx
<RegistrationStatusCard
    registrationId="IDN-CONT-2024-001"
    validUntil="31 December 2024"
    daysRemaining={317}
    status="approved"
    onDownloadCertificate={() => {}}
    onUpdateProfile={() => {}}
/>
```

#### Declined Status
```tsx
<RegistrationStatusCard
    registrationId="IDN-CONT-2024-002"
    status="declined"
    declineReason="Incomplete documentation: Tax Clearance Certificate is missing or invalid."
    onReapply={() => {}}
    onContactSupport={() => {}}
/>
```

#### Expired Status
```tsx
<RegistrationStatusCard
    registrationId="IDN-CONT-2023-001"
    validUntil="31 December 2023"
    status="expired"
    onReapply={() => {}}
    onUpdateProfile={() => {}}
/>
```

#### Suspended Status
```tsx
<RegistrationStatusCard
    registrationId="IDN-CONT-2024-001"
    validUntil="31 December 2024"
    status="suspended"
    suspensionReason="Temporarily suspended due to pending compliance review."
    onContactSupport={() => {}}
    onUpdateProfile={() => {}}
/>
```

## Other Components

- **QuickActionsCard**: Displays quick action buttons with icons
- **RenewalReminderCard**: Shows renewal reminder with countdown
- **ComplianceDocumentsCard**: Lists compliance documents with status
- **RecentActivityCard**: Shows timeline of recent activities

All components are fully independent and reusable.
