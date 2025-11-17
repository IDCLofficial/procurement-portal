# Registration Renewal Components

This directory contains all components for the Registration Renewal flow.

## Step Components

### Step1ReviewInformation
**Location:** `/components/renewal/Step1ReviewInformation.tsx`

The first step in the renewal process where users review their current registration details.

**Props:**
- `registrationId: string` - The registration ID
- `companyName: string` - Company name
- `currentExpiryDate: string` - Current expiry date
- `newExpiryDate: string` - New expiry date after renewal
- `categories: Category[]` - Array of registration categories with grades
- `verificationItems: VerificationItem[]` - Array of verification items (CAC, TIN)
- `onUpdateCompanyInfo: () => void` - Callback when user clicks to update company info

**Features:**
- Displays registration details in a grid
- Shows registration categories with grade badges
- Shows company verification details
- Success alert with link to update company info

---

### Step2UpdateDocuments
**Location:** `/components/renewal/Step2UpdateDocuments.tsx`

The second step where users upload renewed certificates.

**Props:**
- `onContinue: () => void` - Callback to proceed to next step

**Status:** Placeholder - To be implemented

---

### Step3Payment
**Location:** `/components/renewal/Step3Payment.tsx`

The third step where users process the renewal fee payment.

**Props:**
- `onComplete: () => void` - Callback when payment is complete

**Status:** Placeholder - To be implemented

---

## Utility Components

### StepIndicator
**Location:** `/components/renewal/StepIndicator.tsx`

Horizontal step progress indicator with 3 steps.

**Props:**
- `steps: Step[]` - Array of step objects with number, title, subtitle, and status

**Features:**
- Shows completed, active, and pending states
- Progress bar animation
- Responsive design

---

### InfoItem
**Location:** `/components/renewal/InfoItem.tsx`

Displays a label-value pair in a gray card.

**Props:**
- `label: string` - The label text
- `value: string` - The value text
- `valueColor?: 'default' | 'red' | 'green'` - Color variant for value

---

### CategoryBadge
**Location:** `/components/renewal/CategoryBadge.tsx`

Displays a category with its grade badge.

**Props:**
- `category: string` - Category name (e.g., "WORKS")
- `grade: string` - Grade level (e.g., "Grade A")

---

### VerificationItem
**Location:** `/components/renewal/VerificationItem.tsx`

Simple label-value display for verification details.

**Props:**
- `label: string` - The label (e.g., "CAC Number")
- `value: string` - The value

---

### SuccessAlert
**Location:** `/components/renewal/SuccessAlert.tsx`

Green success banner with optional clickable link.

**Props:**
- `title: string` - Alert title
- `message: string` - Alert message
- `linkText?: string` - Optional link text
- `onLinkClick?: () => void` - Optional link click handler

---

### WarningAlert
**Location:** `/components/renewal/WarningAlert.tsx`

Yellow warning banner.

**Props:**
- `title: string` - Alert title
- `children: React.ReactNode` - Alert content

---

### DocumentUpdateItem
**Location:** `/components/renewal/DocumentUpdateItem.tsx`

Displays a document that requires updating with its status.

**Props:**
- `title: string` - Document title
- `expiryDate: string` - Current expiry date
- `status: 'expiring_soon' | 'expired'` - Document status

**Features:**
- Orange icon background
- Status badge (Expiring Soon/Expired)
- Shows current expiry date

---

### DocumentsRequiringUpdateSection
**Location:** `/components/renewal/DocumentsRequiringUpdateSection.tsx`

Container for all documents requiring update.

**Props:**
- `documents: Document[]` - Array of documents with title, expiryDate, and status

**Features:**
- Yellow warning container
- Lists all documents requiring update
- Uses WarningAlert and DocumentUpdateItem components

---

## Usage Example

```tsx
import Step1ReviewInformation from '@/components/renewal/Step1ReviewInformation';
import DocumentsRequiringUpdateSection from '@/components/renewal/DocumentsRequiringUpdateSection';
import StepIndicator from '@/components/renewal/StepIndicator';

export default function RenewalPage() {
    const steps = [
        { number: 1, title: 'Review Information', subtitle: 'Current status', status: 'active' },
        { number: 2, title: 'Update Documents', subtitle: 'Upload renewed certificate', status: 'pending' },
        { number: 3, title: 'Payment', subtitle: 'Process renewal fee', status: 'pending' },
    ];

    const categories = [
        { category: 'WORKS', grade: 'Grade A' },
        { category: 'ICT', grade: 'Grade A' },
    ];

    const verificationItems = [
        { label: 'CAC Number', value: 'RC1234567' },
        { label: 'TIN', value: 'TIN-12345678' },
    ];

    const documents = [
        { title: 'Tax Clearance Certificate (TCC)', expiryDate: '31/12/2024', status: 'expiring_soon' },
        { title: 'PENCOM Compliance Certificate', expiryDate: '15/12/2024', status: 'expired' },
    ];

    return (
        <>
            <StepIndicator steps={steps} />
            
            <Step1ReviewInformation
                registrationId="IMO-CONT-2024-001"
                companyName="ABC Construction Limited"
                currentExpiryDate="31 December 2024"
                newExpiryDate="31 December 2025"
                categories={categories}
                verificationItems={verificationItems}
                onUpdateCompanyInfo={() => router.push('/dashboard/profile')}
            />
            
            <DocumentsRequiringUpdateSection documents={documents} />
        </>
    );
}
```

## Component Architecture

All components are:
- ✅ Independent and reusable
- ✅ Fully typed with TypeScript
- ✅ Client-side components ('use client')
- ✅ Follow consistent design patterns
- ✅ Properly documented with props interfaces
