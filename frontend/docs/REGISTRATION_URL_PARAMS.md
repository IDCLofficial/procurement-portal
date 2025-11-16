# Registration URL Parameters

This document describes the URL parameters used in the contractor registration flow for security and state management.

## Obscure Parameter Names

For security purposes, we use shortened, non-descriptive parameter names:

| Parameter | Full Name | Description | Example Values | Requirements |
|-----------|-----------|-------------|----------------|--------------|
| `uid` | User Identifier | Encrypted/hashed user ID | `abc123xyz` | Required for all authenticated states |
| `vrf` | Verification | Indicates email verification mode | `1` (active), `0` or absent (inactive) | **Requires `uid`** |
| `stp` | Step Number | Registration step to resume from | `1-9` | **Requires `uid`** |

**Important:** Both `vrf` and `stp` parameters are only valid when `uid` is present. Without `uid`, they are ignored and the user starts from Step 1.

## Usage Examples

### 1. Email Verification Mode
When a user clicks the verification link in their email:
```
/register?vrf=1&uid=abc123xyz
```
- Shows email OTP verification form
- Hides navigation buttons
- User must verify before continuing

### 2. Resume Registration
When a user returns to complete registration:
```
/register?uid=abc123xyz&stp=3
```
- Loads user data from backend
- Starts at step 3 (Directors)
- Shows progress from previous session

### 3. Combined State
Email verification after partial registration:
```
/register?vrf=1&uid=abc123xyz&stp=2
```
- User must verify email first
- After verification, continues to step 2

### 4. Invalid Parameter Combinations (Ignored)
These URLs will default to Step 1 without verification:
```
/register?vrf=1              # Missing uid - ignored
/register?stp=3              # Missing uid - ignored
/register?vrf=1&stp=3        # Missing uid - both ignored
```
- Without `uid`, the user is treated as a new registration
- Starts from Step 1 with no verification mode

## Implementation Details

### Frontend (RegistrationStepper.tsx)
```typescript
// Parse userId first
const userId = searchParams.get('uid') || '';

// vrf and stp only work if uid is present
const isVerificationMode = userId && searchParams.get('vrf') === '1';
const resumeStep = userId ? parseInt(searchParams.get('stp') || '1') : 1;
```

**Security Logic:**
- `userId` is checked first
- `isVerificationMode` only true if both `uid` exists AND `vrf=1`
- `resumeStep` only parsed if `uid` exists, otherwise defaults to 1

### Backend Requirements
1. **User ID Generation**: Generate secure, non-sequential user IDs
2. **Email Verification**: Send verification link with `vrf=1&uid={userId}`
3. **Session Management**: Store registration progress with user ID
4. **Resume Registration**: Fetch user data when `uid` and `stp` are present

## Security Considerations

1. **User ID Encryption**: The `uid` should be:
   - Non-sequential (use UUID or hash)
   - Encrypted or signed
   - Time-limited (expire after 24-48 hours)

2. **Verification Token**: Consider adding a separate token parameter:
   ```
   /register?vrf=1&uid=abc123xyz&tkn=verification_token
   ```

3. **Step Validation**: Backend should verify:
   - User has completed previous steps
   - User owns the registration session
   - Step number is valid (1-9)

## Flow Diagrams

### Email Verification Flow
```
User fills Step 1 form and clicks Continue
    ↓
Frontend creates account (API call)
    ↓
URL updates to: /register?vrf=1&uid={userId}&stp=1
    ↓
Shows OTP verification form
    ↓
Backend sends email with 6-digit code
    ↓
User enters OTP → Verified
    ↓
URL updates to: /register?uid={userId}&stp=2
    ↓
User continues to Step 2 (Company Details)
```

### Resume Registration Flow
```
User partially completes registration (stops at step 4)
    ↓
Backend saves progress with userId
    ↓
User returns later with: /register?uid={userId}&stp=4
    ↓
Frontend loads saved data
    ↓
User continues from step 4
```

## Testing

### Test URLs
```bash
# Email verification
http://localhost:3000/register?vrf=1&uid=test123

# Resume from step 3
http://localhost:3000/register?uid=test123&stp=3

# Combined
http://localhost:3000/register?vrf=1&uid=test123&stp=2
```

### Test OTP Code
For development, the OTP code `123456` is accepted.
