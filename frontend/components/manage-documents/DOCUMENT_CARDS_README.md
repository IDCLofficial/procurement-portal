# Document Card Components

Individual components for different document/certificate card states based on the UI design.

## Components

### 1. **DocumentCard** (Unified Component)
A single component that handles all document card variants through props.

#### Status Types:
- `verified` - Document is verified and active
- `required` - Document is required but not uploaded
- `expiring` - Document is verified but expiring soon
- `expired` - Document has expired

#### Usage Examples:

**Verified Document:**
```tsx
<DocumentCard
    title="CAC Incorporation Certificate"
    status="verified"
    certificateNumber="CAC: Certificate123"
    fileSize="2.4 MB"
    uploadDate="15 Oct 2024"
    onView={() => {}}
    onDownload={() => {}}
/>
```

**Required Document:**
```tsx
<DocumentCard
    title="Tax Clearance Certificate"
    status="required"
    onView={() => {}}
    onDownload={() => {}}
/>
```

**Expiring Document:**
```tsx
<DocumentCard
    title="Tax Clearance Certificate (TCC)"
    status="expiring"
    certificateNumber="TCC-2024-001"
    fileSize="6 kB"
    uploadDate="15 Oct 2024"
    expiryStatus="Expires Annually"
    validFrom="Replace Document"
    validTo="31 Dec 2024"
    showReplaceSection={true}
    onView={() => {}}
    onDownload={() => {}}
    onClose={() => {}}
    onReplace={() => {}}
/>
```

**Expired Document:**
```tsx
<DocumentCard
    title="Tax Clearance Certificate (TCC)"
    status="expired"
    certificateNumber="TCC-2024-001"
    fileSize="6 kB"
    uploadDate="15 Oct 2024"
    errorMessage="This document has expired. Please upload an updated certificate immediately to avoid suspension."
    showReplaceSection={true}
    onView={() => {}}
    onDownload={() => {}}
    onClose={() => {}}
    onReplace={() => {}}
/>
```

### 2. **DocumentCardVerified** (Standalone)
Simple verified document card without expiry features.

### 3. **DocumentCardExpiring** (Standalone)
Document card with expiry warning and replace functionality.

### 4. **DocumentCardExpired** (Standalone)
Document card with error state and replace functionality.

## Props

### DocumentCard Props
```typescript
interface DocumentCardProps {
    title: string;                              // Document title
    status: 'verified' | 'required' | 'expiring' | 'expired';  // Document status
    certificateNumber?: string;                 // Certificate/document number
    fileSize?: string;                          // File size (e.g., "2.4 MB")
    uploadDate?: string;                        // Upload date
    expiryStatus?: 'Expires Annually' | 'Expired';  // Expiry badge text
    validFrom?: string;                         // Valid from date
    validTo?: string;                           // Valid to date
    errorMessage?: string;                      // Error message for expired docs
    showReplaceSection?: boolean;               // Show replace document section
    onView?: () => void;                        // View button callback
    onDownload?: () => void;                    // Download button callback
    onClose?: () => void;                       // Close button callback (expiring/expired only)
    onReplace?: () => void;                     // Replace button callback
}
```

## Visual Features

### Verified State
- Gray document icon
- Green checkmark with "Verified" text
- View and Download buttons
- Standard white card with gray border

### Required State
- Gray document icon
- Gray "Required" text
- View and Download buttons
- Standard white card with gray border

### Expiring State
- Gray document icon
- Green checkmark with "Verified" text
- Red "Expires Annually" badge
- Valid From/To date sections
- Replace document section
- View, Download, and Close buttons
- Standard white card with gray border

### Expired State
- Red exclamation icon on red background
- Red "Expired" text with icon
- Red error alert banner
- Replace document section
- View, Download, and Close buttons
- Red-tinted card (red border + light red background)

## Best Practices

1. Use the unified `DocumentCard` component for flexibility
2. Use standalone components when you only need specific variants
3. Always provide `onView` and `onDownload` callbacks
4. Show replace section only when user can upload new documents
5. Provide clear error messages for expired documents
6. Include file size and upload date for better context
