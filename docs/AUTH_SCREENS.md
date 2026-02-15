# 🔐 Authentication Screens Documentation

## Overview

The CRM features modern, enterprise-grade authentication screens with a clean design system following our Indigo primary color theme.

---

## 📄 Login Screen

**Location:** `src/pages/auth/Login.jsx`  
**Route:** `/login`

### Features
- ✅ **Email Input**
  - Mail icon prefix
  - Email validation
  - Error state display
  - Placeholder: "you@example.com"

- ✅ **Password Input**
  - Lock icon prefix
  - Password visibility toggle (Eye/EyeOff)
  - Minimum 6 characters validation
  - Error state display
  - Placeholder: "••••••••"

- ✅ **Remember Me Checkbox**
  - Styled with primary-600 accent
  - Smooth transition effects

- ✅ **Forgot Password Link**
  - Primary-600 color
  - Hover effect with primary-700

- ✅ **Submit Button**
  - Full width gradient button
  - Gradient: primary-600 to primary-700
  - Hover: primary-700 to primary-800
  - Loading state with spinner
  - Text changes to "Signing in..."

- ✅ **Design Elements**
  - Clean centered card (max-w-md)
  - White background with shadow-soft
  - Rounded-2xl borders
  - Icon badge: Gradient bg (primary-600 to ai-600)
  - Lock icon (w-8 h-8)
  - Title: "Welcome Back" (text-3xl, font-bold, text-slate-900)
  - Subtitle: "Sign in to access your AI-powered CRM" (text-slate-600)

### Validation
- Email must be valid format
- Password minimum 6 characters
- Error messages displayed below fields in danger-600

### User Flow
1. User enters email and password
2. Optional: Check "Remember me"
3. Click "Sign In" button
4. Loading state shows spinner
5. On success: Navigate to /dashboard with toast notification
6. On error: Display error message

---

## 📝 Register Screen (Admin Only)

**Location:** `src/pages/auth/Register.jsx`  
**Route:** `/register`  
**Access:** Admin users only

### Features
- ✅ **Full Name Input**
  - User icon prefix
  - Minimum 2 characters
  - Placeholder: "John Doe"

- ✅ **Email Input**
  - Mail icon prefix
  - Email validation
  - Placeholder: "john@company.com"

- ✅ **Role Selection**
  - Shield icon prefix
  - Dropdown with roles (Admin, Manager, Agent)
  - Required field
  - Two-column grid layout (md:grid-cols-2)

- ✅ **Staff Type Selection**
  - Briefcase icon prefix
  - Dropdown with types (Sales, Support, Marketing)
  - Required field
  - Two-column grid layout (md:grid-cols-2)

- ✅ **Password Input**
  - Lock icon prefix
  - Password visibility toggle
  - Minimum 8 characters
  - Two-column grid layout (md:grid-cols-2)
  - Placeholder: "••••••••"

- ✅ **Confirm Password Input**
  - Lock icon prefix
  - Password visibility toggle
  - Must match password
  - Two-column grid layout (md:grid-cols-2)
  - Placeholder: "••••••••"

- ✅ **Action Buttons**
  - Cancel button (outline style, navigates to /dashboard/users)
  - Create User button (gradient primary, with UserPlus icon)
  - Both buttons flex-1 in flex container with gap-4

- ✅ **Design Elements**
  - Full-screen gradient background (from-slate-50 via-white to-slate-50)
  - Wider card (max-w-2xl)
  - White background with shadow-soft
  - Rounded-2xl borders
  - Icon badge: Gradient bg (primary-600 to ai-600)
  - UserPlus icon (w-8 h-8)
  - Title: "Create New User" (text-3xl, font-bold, text-slate-900)
  - Subtitle: "Add a new team member to your CRM" (text-slate-600)
  - Back link: "← Back to Users List"

### Access Control
- Admin-only component
- Checks user role on mount
- Non-admin users redirected to /dashboard with error toast
- Success navigates to /dashboard/users

### Validation
- Name: Minimum 2 characters
- Email: Valid email format
- Role: Required selection
- Staff Type: Required selection
- Password: Minimum 8 characters
- Password Confirmation: Must match password
- All error messages in danger-600

### User Flow (Admin)
1. Admin navigates to register page
2. Fills in all required fields
3. Selects role and staff type from dropdowns
4. Enters password twice
5. Clicks "Create User" button
6. Loading state shows spinner with "Creating..."
7. On success: Navigate to /dashboard/users with success toast
8. On error: Display error message

---

## 🎨 Design System Integration

### Color Palette
- **Primary Gradient:** from-primary-600 to-primary-700
- **Hover Gradient:** from-primary-700 to-primary-800
- **AI Gradient (Badge):** from-primary-600 to-ai-600
- **Text:** slate-900 (headings), slate-600 (body), slate-400 (icons)
- **Danger:** danger-600 (errors)

### Typography
- **Headings:** text-3xl, font-bold
- **Labels:** label-text utility class
- **Body:** text-slate-600
- **Errors:** text-sm text-danger-600

### Components
- **Input:** Custom `.input` class with pl-10 for icons
- **Button:** `.btn` with `.btn-primary` or `.btn-outline`
- **Card:** White bg, rounded-2xl, shadow-soft, p-8 lg:p-10
- **Icons:** Lucide React icons (w-5 h-5 for inputs, w-8 h-8 for badges)

### Spacing & Layout
- Card padding: p-8 lg:p-10
- Form spacing: space-y-6
- Grid gap: gap-6
- Badge size: w-16 h-16 rounded-2xl
- Max width: max-w-md (login), max-w-2xl (register)

### Transitions
- All interactive elements: transition-colors
- Icon hover: text-slate-400 to text-slate-600
- Button hover: Gradient shifts

---

## 🔌 API Integration

### Login Endpoint
```javascript
POST /api/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  user: User,
  token: string
}
```

### Register Endpoint
```javascript
POST /api/auth/register
Body: {
  name: string,
  email: string,
  role_id: number,
  staff_type_id: number,
  password: string,
  password_confirmation: string
}
Response: {
  user: User,
  message: string
}
```

---

## 🛡️ Security Features

1. **Password Validation**
   - Minimum length requirements
   - Confirmation matching
   - Secure password fields

2. **Email Validation**
   - Format checking
   - Real-time error display

3. **Role-Based Access**
   - Register page restricted to admins
   - Automatic redirection for unauthorized users

4. **JWT Token Management**
   - Stored securely in Zustand + localStorage
   - Attached to all API requests
   - Auto-logout on expiration

5. **Error Handling**
   - User-friendly error messages
   - Toast notifications for feedback
   - Field-level validation errors

---

## 📱 Responsive Design

### Mobile (< 768px)
- Single column layout
- Full-width inputs
- Stacked form fields
- Adjusted padding (p-8)

### Desktop (≥ 768px)
- Centered card layout
- Two-column grids for register form
- Enhanced padding (lg:p-10)
- Wider max-width for register (max-w-2xl)

---

## 🎯 Best Practices

1. **Form Validation**
   - Use Zod schemas for type-safe validation
   - React Hook Form for form state
   - Display errors below fields immediately

2. **User Feedback**
   - Loading states on buttons
   - Success/error toast notifications
   - Clear error messages

3. **Accessibility**
   - Proper label associations
   - Focus states on inputs
   - Keyboard navigation support
   - ARIA labels where needed

4. **UX Improvements**
   - Password visibility toggle
   - Remember me option
   - Clear navigation links
   - Gradient buttons for visual appeal

---

## 🚀 Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Microsoft)
- [ ] Password strength indicator
- [ ] Email verification flow
- [ ] Account recovery via email
- [ ] Session management dashboard
- [ ] Login activity logs
- [ ] Biometric authentication support

---

**Last Updated:** February 14, 2026
