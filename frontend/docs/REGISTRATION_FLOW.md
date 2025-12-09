# Registration Flow Architecture

## Overview
The contractor registration process is split across two routes:
1. **`/register`** - Step 1: Account Creation & Email Verification
2. **`/dashboard/complete-registration`** - Steps 2-9: Complete Registration

## Route Structure

### Route 1: `/register` (Step 1 Only)
**Component**: `RegistrationStepper.tsx`

**Purpose**: Account creation and email verification

**Flow**:
```
User fills form → Creates account → Email verification → Redirects to dashboard
```

**Features**:
- Shows all 9 steps (Step 1 active, others grayed out)
- Account creation form with validation
- Email verification with OTP
- Token generation for authenticated session
- Stores token in sessionStorage

**URL Parameters**:
- `vrf=1` - Verification mode
- `uid={userId}` - User identifier

### Route 2: `/dashboard/complete-registration` (Steps 2-9)
**Component**: `RegistrationContinuation.tsx`

**Purpose**: Complete remaining registration steps

**Flow**:
```
Token validation → Load user data → Continue from Step 2 → Complete registration
```

**Features**:
- Shows all 9 steps (Step 1 checked, current step active, future steps grayed out)
- Token-based authentication
- Progress persistence
- Step-by-step navigation

**URL Parameters**:
- `token={token}` - Authentication token (required)

## Step Indicators

### Visual States

#### **Done Steps** (Step 1 after verification)
- ✅ Green circle with checkmark
- Green border
- Dark text label

#### **Current Step**
- 🟢 Green border with shadow
- Icon in theme green
- Dark text label
- Active ring on mobile

#### **Future Steps**
- ⚪ Gray border
- Gray icon
- Gray text label

## Token Management

### Token Generation
```typescript
// After email verification
const token = userId || 'temp_token_' + Math.random().toString(36).substring(2, 15);
sessionStorage.setItem('registration_token', token);
sessionStorage.setItem('registration_email', formData.email);
```

### Token Validation
```typescript
// On /dashboard/complete-registration
const token = searchParams.get('token');
if (!token) {
    router.push('/register');
    return;
}
```

### Security
- Token stored in sessionStorage (cleared on browser close)
- Token required for dashboard access
- Invalid token redirects to `/register`
- TODO: Backend token validation

## Data Flow

### Step 1 → Dashboard Transition

```
┌─────────────────────────────────────────────────────────────┐
│ /register (Step 1)                                          │
├─────────────────────────────────────────────────────────────┤
│ 1. User fills account form                                  │
│ 2. Click "Continue" → Account created                       │
│ 3. URL: /register?vrf=1&uid={userId}                       │
│ 4. User enters OTP → Email verified                         │
│ 5. Generate token                                            │
│ 6. Store in sessionStorage                                   │
│ 7. Redirect: /dashboard/complete-registration?token={token} │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ /dashboard/complete-registration (Steps 2-9)                │
├─────────────────────────────────────────────────────────────┤
│ 1. Validate token                                            │
│ 2. Load user data (TODO: API call)                          │
│ 3. Show Step 2 form                                          │
│ 4. User completes remaining steps                            │
│ 5. Submit final registration                                 │
└─────────────────────────────────────────────────────────────┘
```

## Progress Indicator Logic

### On `/register`
```typescript
// Step 1 active, all others future
allSteps.map((step) => ({
    status: step.id === 1 ? 'active' : 'future'
}))
```

### On `/dashboard/complete-registration`
```typescript
// Step 1 done, current step active, others future
allSteps.map((step) => ({
    status: step.id === 1 ? 'done' 
          : step.id === currentStep ? 'active' 
          : step.id < currentStep ? 'done' 
          : 'future'
}))
```

## Components

### RegistrationStepper (`/register`)
**Location**: `/components/RegistrationStepper.tsx`

**State**:
- `showEmailVerification`: boolean
- `formData`: Step 1 fields only

**Methods**:
- `handleContinue()`: Validates and creates account
- `handleEmailVerified()`: Generates token and redirects
- `handleCancelVerification()`: Returns to form

### RegistrationContinuation (`/dashboard/complete-registration`)
**Location**: `/components/RegistrationContinuation.tsx`

**State**:
- `currentStep`: 2-9
- `formData`: All registration fields

**Methods**:
- `handleContinue()`: Validates and moves to next step
- `handleBack()`: Returns to previous step (min: step 2)

### Step1Account
**Location**: `/components/registration-steps/Step1Account.tsx`

**Props**:
- `formData`: Account fields
- `onInputChange`: Field update handler
- `onContinue`: Continue button handler

**Features**:
- Debounced validation
- Password strength meter
- Show/hide password toggles
- Integrated Continue button

## Backend Integration Points

### 1. Account Creation
```typescript
POST /api/registration/create
Body: {
    fullName: string,
    email: string,
    phone: string,
    password: string
}
Response: {
    userId: string,
    success: boolean
}
```

### 2. Send OTP
```typescript
POST /api/registration/send-otp
Body: {
    userId: string,
    email: string
}
```

### 3. Verify OTP
```typescript
POST /api/registration/verify-otp
Body: {
    userId: string,
    otp: string
}
Response: {
    verified: boolean,
    token: string
}
```

### 4. Validate Token
```typescript
GET /api/registration/validate-token?token={token}
Response: {
    valid: boolean,
    userId: string,
    email: string
}
```

### 5. Load User Data
```typescript
GET /api/registration/user/{userId}
Response: {
    formData: object,
    currentStep: number
}
```

### 6. Save Progress
```typescript
POST /api/registration/save-progress
Body: {
    userId: string,
    step: number,
    formData: object
}
```

### 7. Complete Registration
```typescript
POST /api/registration/complete
Body: {
    userId: string,
    formData: object
}
Response: {
    success: boolean,
    contractorId: string
}
```

## Session Management

### SessionStorage Keys
- `registration_token`: Authentication token
- `registration_email`: User's email address

### Lifecycle
1. **Created**: After email verification
2. **Used**: On dashboard page load
3. **Cleared**: On browser close or logout

## Error Handling

### Invalid Token
```typescript
if (!token) {
    toast.error('Invalid access. Please complete email verification first.');
    router.push('/register');
}
```

### Expired Session
```typescript
if (!isValidToken) {
    toast.error('Session expired. Please register again.');
    router.push('/register');
}
```

## Mobile Responsiveness

### Desktop/Tablet
- Horizontal step indicator with connecting lines
- Full step names visible
- Progress line shows completion

### Mobile
- Compact current step card
- Horizontal progress bar with percentage
- Mini step indicators (numbered circles)
- Scrollable step preview

## Testing URLs

### Development
```bash
# Step 1 - Account Creation
http://localhost:3000/register

# Step 1 - Email Verification
http://localhost:3000/register?vrf=1&uid=test123

# Steps 2-9 - Complete Registration
http://localhost:3000/dashboard/complete-registration?token=test_token_123
```

### Test OTP
For development: `123456`

## Future Enhancements

1. **Backend Integration**: Replace mock API calls with real endpoints
2. **Token Encryption**: Encrypt tokens for security
3. **Token Expiration**: Add time-based token expiration
4. **Progress Persistence**: Save form data to backend
5. **Resume Registration**: Allow users to return and continue
6. **Step Validation**: Prevent skipping steps
7. **Auto-save**: Periodically save progress
8. **Logout**: Clear session and redirect to login
