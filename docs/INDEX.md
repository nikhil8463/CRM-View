# 📚 Documentation Index

Welcome to the AI-Powered CRM documentation. All project documentation is organized here for easy access.

---

## 📖 Getting Started

### [README.md](../README.md)
**Start here!** Project overview, installation guide, and quick start instructions.

---

## 🔐 Authentication

### [AUTH_SCREENS.md](./AUTH_SCREENS.md)
Complete authentication documentation:
- Login screen features and design
- Register screen (Admin-only) with role/staff type selection
- Form validation and error handling
- Security features and access control
- API integration details
- Responsive design guidelines

**When to read:** Working with authentication flows or user management

---

## 🏗️ Architecture & Patterns

### [ARCHITECTURE.md](./ARCHITECTURE.md)
Complete component architecture guide covering:
- Component categories and structure
- Design patterns (Container/Presentational, Compound Components, Render Props)
- State management strategies
- Performance optimization
- Testing guidelines
- File naming conventions

**When to read:** Before building new features or refactoring components

---

## 🎨 Design System

### [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
Comprehensive design system documentation:
- Complete color palette (Indigo, Emerald, Amber, Red, Slate, Purple AI)
- **Dark Mode Support** - Full dark theme with `dark:` classes
- Typography hierarchy and scales
- Spacing system (p-6, gap-6 standards)
- Component styles (buttons, cards, badges, inputs, tables)
- Design patterns and principles
- Accessibility guidelines
- Layout guidelines

**When to read:** Before styling any component or creating new UI elements

### Dark Mode System
**Implementation:**
- Zustand store (`useThemeStore`) for persistent state
- Toggle button in navbar (Moon/Sun icon)
- `dark:` Tailwind classes throughout
- Automatic localStorage persistence
- Smooth transitions between modes

**Color Tokens:**
- Background: `bg-slate-50` → `dark:bg-slate-950`
- Cards: `bg-white` → `dark:bg-slate-900`
- Text: `text-slate-900` → `dark:text-slate-100`
- Borders: `border-slate-200` → `dark:border-slate-700`
- Inputs: `bg-white` → `dark:bg-slate-800`

**Usage:**
```jsx
import { useThemeStore } from '@/store/themeStore'

const { isDarkMode, toggleDarkMode } = useThemeStore()
```

**When to read:** Implementing new features with dark mode support

### [DESIGN_SYSTEM_UPDATE.md](./DESIGN_SYSTEM_UPDATE.md)
Summary of design system changes and migration guide:
- Color system transformation
- Typography refinement
- Component styling updates
- Before/after comparisons
- Migration checklist

**When to read:** Understanding recent design changes

---

## 📊 Dashboard & Features

### [DASHBOARD_UI.md](./DASHBOARD_UI.md)
Complete dashboard documentation for both Admin and Staff views:
- Admin Dashboard: 4 stat cards, conversion funnel, AI call outcomes, AI insights panel
- Staff Dashboard: 5 stat cards, activity timeline, personal metrics
- Role-based rendering logic
- Chart components (Conversion Funnel, AI Call Outcomes, Campaign Performance)
- AI Insights Panel with recommendations and alerts
- Recent Activity Timeline
- Responsive layouts and mobile optimization

**When to read:** Building or customizing dashboard widgets and layouts

---

## 📢 Campaign Module

### Campaign Features
Complete campaign management system with list and detail views:

#### Campaign List (Campaigns.jsx)
- **Card Layout**: Responsive grid (1/2/3 columns) with campaign cards
- **Summary Stats**: 4 overview cards (Total Campaigns, Active, Total Leads, Avg Conversion)
- **Search & Filters**: Search bar with Status and Source filter dropdowns
- **Campaign Cards Include**:
  - Campaign name with source icon (LinkedIn, Email, etc.)
  - Status badge (Active, Paused, Completed, Draft)
  - Date range display
  - Lead count and conversion percentage
  - Stacked staff avatars (-space-x-2)
  - Budget progress bar with spent/total amounts
- **Navigation**: Click card to open detail page

#### Campaign Detail (CampaignDetail.jsx)
- **Header**: Campaign name, status badge, back button, action buttons
- **6-Tab Interface**:
  1. **Overview Tab**: 
     - 4 key metric cards (Total Leads, Conversion Rate, Calls Made, AI Actions)
     - Campaign metadata (Description, dates, budget progress bar)
     - Assigned staff list with avatars and roles
     - Lead statistics grid
  2. **Leads Tab**: Placeholder for lead list
  3. **Calls Tab**: Placeholder for call history
  4. **Tasks Tab**: Placeholder for task management
  5. **Communications Tab**: Placeholder for message history
  6. **Analytics Tab**: 
     - Lead Source Bar Chart (4 sources with Indigo bars)
     - AI Call Outcomes Donut Chart (Success 60%, Follow-up 25%, Voicemail 10%, No Answer 5%)
     - Status Distribution Horizontal Bars (New, Contacted, Qualified, Converted)
     - Conversion Trend Line Chart (4-week trend)

**Design Elements**:
- Indigo primary color with Emerald success indicators
- Recharts for all data visualizations
- Progress bars for budget tracking
- Badge system for status/source
- Consistent card spacing (p-6, gap-6, rounded-2xl)

---

## 👥 Leads Module

### Lead Features
Complete lead management with table view and comprehensive detail page:

#### Lead List (Leads.jsx)
- **Data Table** with 8 columns:
  - Checkbox for multi-select
  - Name/Company (two-line display)
  - Campaign
  - Status badge (color-coded)
  - Priority badge (High/Medium/Low)
  - Assigned To (staff member)
  - Source
  - AI Score (colored badge with sparkles icon)
  - Created Date (with calendar icon)
- **Search & Filters**:
  - Search bar for name/company
  - Collapsible filter section with 5 filters:
    - Campaign dropdown
    - Status dropdown (New, Contacted, Qualified, Converted, Lost)
    - Assigned User dropdown
    - Priority dropdown (High, Medium, Low)
    - Date range (placeholder)
- **Bulk Actions**:
  - Select All checkbox in table header
  - Bulk action bar appears when leads selected
  - Dropdown menu: Assign to User, Update Status, Trigger AI Call, Send WhatsApp
- **Features**:
  - Click row to open detail page
  - AI Score color coding: Green (80+), Yellow (60-79), Gray (<60)
  - Empty state with call-to-action
  - Pagination controls
  - Export button

#### Lead Detail (LeadDetail.jsx)
**Back Button**:
- Text-based back link at top: "Back to Leads"
- Arrow icon with hover effect

**Header Card (Full Width)**:
- Large card with white background, rounded corners, shadow
- **Top Section**:
  - Lead name (large heading: text-3xl)
  - Status and Priority badges
  - Edit and Delete icon buttons (top-right corner)
- **Information Grid (2 columns)**:
  - **Left Column**:
    - Company (with Building icon)
    - Position (with User icon)
    - Email (clickable mailto link with Mail icon)
    - Phone (clickable tel link with Phone icon)
  - **Right Column**:
    - Campaign (with Calendar icon)
    - Assigned to (with User icon)
    - Address (with MapPin icon)
    - Website (external link with Globe icon)
  - Each field has: Icon (slate-400), Label (text-xs), Value (text-sm)

**Left Panel (1/3 width)**:
1. **AI Lead Score Card**
   - Circular progress gauge showing overall score
   - "High Quality Lead" badge
   - 4 Score breakdowns with progress bars:
     - Engagement (92%)
     - Budget Fit (85%)
     - Timeline (78%)
     - Authority (94%)

2. **Company Information Card**
   - Industry
   - Company Size
   - Annual Revenue
   - Source

3. **Status Timeline**
   - Vertical timeline with dots and lines
   - Shows progression: Qualified → Contacted → New
   - Each entry includes: Status, Note, Date/Time, User
   - Connected with vertical line

4. **Notes Card**
   - Lead notes display
   - Edit button

**Right Panel (2/3 width)**:
- **Communication Timeline** with unified activity view (CommunicationTimeline component)
- **6 Communication Types**:
  - `AI_CALL` - Purple badge, includes recording player, transcript, AI summary, sentiment
  - `MANUAL_CALL` - Blue badge, standard call logging
  - `EMAIL` - Blue badge, email tracking
  - `WHATSAPP` - Green badge, WhatsApp messages
  - `NOTE` - Gray badge, internal notes
  - `STATUS_CHANGE` - Yellow badge, automated status updates
- **Filter Tabs with Counts**: All Activity, Calls, Emails, WhatsApp, Notes (shows count per type)
- **Timeline Item Features**:
  - Color-coded icon per type
  - Type badge with unique colors
  - Timestamp and creator
  - **Expandable/Collapsible** - Click to show full content
  - Preview text when collapsed
  - Duration display for calls
  - Outcome badges (Success, No Answer, Voicemail, etc.)
- **AI Call Exclusive Features**:
  - **Recording Player**: Play/Pause controls with progress bar
  - **Transcript**: Scrollable speaker-labeled conversation
  - **AI Summary**: Purple gradient card with key insights
  - **Sentiment Indicator**: Positive (smile), Neutral (meh), Negative (frown) with color coding
  - **Key Points**: Bullet list with checkmarks showing highlights:
    - Budget mentions
    - Decision timeline
    - Pain points
    - Next steps
- **Empty State**: Shown when no communications match filter

**Design Features**:
- Three-section layout: Header card (full width) + Two-column content below
- Header card consolidates all contact and lead info (no duplicate cards)
- Consistent icon + label + value pattern for all fields
- Color-coded badges throughout (Purple for AI, Blue for calls/emails, Green for WhatsApp, Gray for notes, Yellow for status changes)
- SVG circular gauge for AI score
- Timeline dots with rings and connecting lines (Status Timeline)
- Expandable communication cards with border matching type color
- AI insights highlighted with Sparkles icon and gradient backgrounds
- Hover states on interactive elements
- Responsive grid layout (stacks on mobile)
- Audio player controls for call recordings
- Transcript formatting with speaker labels

---

## � Calls Module

### Call Features
Complete call management with list and detail views, AI call recording and transcription:

#### Call List (Calls.jsx)
- **4 Summary Stats**:
  - Total Calls count
  - Successful Calls with success rate percentage
  - Average Duration in minutes
  - AI Calls count with automation percentage
- **Data Table** with 6 columns:
  - Lead (name + company with AI/Manual call icon)
  - Campaign
  - Duration (with clock icon)
  - Outcome badge (Success, Voicemail, No Answer, Busy)
  - AI Summary (preview text)
  - Date & Time
- **Search & Filters**:
  - Search bar for lead name/company
  - Collapsible filter section with 3 filters:
    - Campaign dropdown
    - Outcome dropdown (Success, Voicemail, No Answer, Busy)
    - Date Range (All Time, Today, Last 7 Days, Last 30 Days)
- **Features**:
  - Color-coded call type icons (Purple for AI, Blue for Manual)
  - Click row to open call detail page
  - Outcome badges with icons
  - Empty state with call-to-action
  - Pagination controls
  - Export and Log Call buttons

#### Call Detail (CallDetail.jsx)
**Back Button**: Text link with arrow to return to call list

**Header Card (Full Width)**:
- Large icon badge (Purple for AI Call, Blue for Manual)
- Lead name (large heading)
- Outcome, Call Type, and Sentiment badges
- Download button
- **Information Grid (4 columns)**:
  - Company
  - Position
  - Duration
  - Date & Time

**Left Column (2/3 width)**:
1. **Call Recording Player**
   - Large play/pause button
   - Progress bar with current/total time
   - Volume control
   - Slate background card

2. **AI Summary** (AI Calls only)
   - Purple gradient card with Sparkles icon
   - Full AI-generated summary text
   - Key insights and recommendations

3. **Full Transcript**
   - Scrollable transcript viewer (max-height 600px)
   - **Speaker differentiation**: Agent (blue), Lead (black)
   - **Timestamp** for each line (00:00 format)
   - **Copy option**: Button to copy entire transcript
   - Monospace timestamps for alignment
   - Slate background with padding

**Right Column (1/3 width)**:
1. **Call Outcome Card**
   - Status badge
   - Sentiment indicator with icon
   - Campaign name
   - Agent name
   - Clean key-value layout

2. **Key Points Card**
   - Bullet list with checkmarks
   - Extracted highlights:
     - Budget mentions
     - Decision timeline
     - Pain points
     - Next steps
     - Team size
     - Current solutions

3. **Lead Update History**
   - Vertical timeline with dots and lines
   - Shows field changes from call:
     - Status updates
     - Priority changes
     - AI Score adjustments
   - Each update shows:
     - Field name
     - Old value → New value (with arrow)
     - Reason for change
     - Timestamp
   - "View Lead Profile" button at bottom

**Design Features**:
- Three-section layout: Header card (full width) + Two-column content
- Recording player with interactive controls
- Transcript differentiation with color-coding
- Copy-to-clipboard functionality with confirmation
- Timeline visualization for lead updates
- Purple gradient for AI-specific elements
- Responsive grid layout
- Scrollable transcript with fixed height

---

## �💬 Communication Timeline Component

### CommunicationTimeline.jsx
Reusable component for displaying unified communication history across all channels.

**Location**: `src/components/communications/CommunicationTimeline.jsx`

**Props**:
- `communications` (array): Array of communication objects

**Communication Object Structure**:
```javascript
{
  id: number,
  type: 'AI_CALL' | 'MANUAL_CALL' | 'EMAIL' | 'WHATSAPP' | 'NOTE' | 'STATUS_CHANGE',
  title: string,
  preview: string,           // Shown when collapsed
  content: string,           // Full content (expandable)
  timestamp: string,         // Date/time display
  created_by: string,        // User or 'System'
  duration: string,          // Optional: "28:45" for calls
  outcome: string,           // Optional: 'success', 'voicemail', 'no_answer', etc.
  sentiment: string,         // Optional: 'positive', 'neutral', 'negative' (AI calls)
  recording_url: string,     // Optional: URL to audio file (AI calls)
  ai_summary: string,        // Optional: AI-generated summary (AI calls)
  transcript: array,         // Optional: [{speaker, text}] (AI calls)
  key_points: array          // Optional: [string] highlights (AI calls)
}
```

**Features**:
- **Type-based Styling**: Each communication type has unique icon and color
- **Expandable Cards**: Click anywhere on card to expand/collapse
- **Filter Tabs**: Filter by type with live counts
- **AI Call Enhancements**:
  - Audio player with play/pause and progress bar
  - Scrollable transcript with speaker labels
  - AI summary with gradient background
  - Sentiment indicators (emoji icons)
  - Key points extraction
- **Responsive Design**: Mobile-friendly with horizontal scroll on filters
- **Empty States**: Contextual messages when no items match filter

**Usage Example**:
```jsx
import CommunicationTimeline from '../../components/communications/CommunicationTimeline'

<CommunicationTimeline communications={communicationsArray} />
```

**Color Scheme**:
- AI_CALL: Purple (bg-purple-100, text-purple-600)
- MANUAL_CALL: Primary Blue (bg-primary-100, text-primary-600)
- EMAIL: Blue (bg-blue-100, text-blue-600)
- WHATSAPP: Success Green (bg-success-100, text-success-600)
- NOTE: Slate Gray (bg-slate-100, text-slate-600)
- STATUS_CHANGE: Warning Yellow (bg-warning-100, text-warning-600)

---

## 📡 Communications Module

### Communications.jsx (Communications List)
Comprehensive communication logs interface showing all interactions across channels with filtering and stats.

**Location**: `src/pages/communications/Communications.jsx`

**Features**:

1. **Statistics Cards** (4 cards)
   - Total Communications: Overall count with MessageCircle icon
   - AI Calls: Count and percentage of AI-powered calls with Bot icon
   - Emails Sent: Email count with Mail icon
   - Success Rate: Percentage and count with TrendingUp and CheckCircle icons
   - Each card has colored icon background

2. **Search & Filters**
   - Search bar: Search by lead name, subject, or company
   - Filter toggle button
   - Expandable filter panel with 3 dropdowns:
     - Communication Type: All/AI Calls/Manual Calls/Emails/WhatsApp
     - Status: All/Successful/Opened/Replied
     - Date Range: All Time/Today/Last 7 Days/Last 30 Days

3. **Communications Table** (7 columns)
   - Type: Badge with icon (AI Call/Manual Call/Email/WhatsApp)
   - Lead: Lead name + company (two lines)
   - Subject: Title + preview snippet (truncated)
   - Campaign: Campaign name
   - Details: Dynamic based on type
     - Calls: Duration + outcome badge + AI score
     - Emails: Opened/Clicked indicators
   - Created By: User avatar (AI Agent/System/User) + name
   - Date: Date + time (two lines)
   - Click any row to navigate to detail page

4. **Type-Specific Indicators**
   - AI Calls: Purple badge, Bot icon, AI score display
   - Manual Calls: Blue badge, Phone icon, duration
   - Emails: Blue badge, Mail icon, open/click stats
   - WhatsApp: Green badge, MessageSquare icon
   - Outcome badges: Success (green), Voicemail (yellow), Failed (red)

5. **Empty State**
   - Displays when no communications match filters
   - Shows appropriate message based on context
   - MessageCircle icon illustration

6. **Pagination**
   - Shows count: "Showing X of Y communications"
   - Previous/Next navigation buttons

**Mock Data Structure**:
```javascript
{
  id: number,
  type: 'AI_CALL' | 'MANUAL_CALL' | 'EMAIL' | 'WHATSAPP',
  lead_name: string,
  lead_company: string,
  campaign: string,
  subject: string,
  preview: string,
  created_at: string,
  created_by: string,
  
  // Call-specific
  duration: string,          // "28:45" format
  outcome: 'success' | 'voicemail' | 'no_answer' | 'failed',
  sentiment: 'positive' | 'neutral' | 'negative',
  ai_score: number,          // 0-100
  
  // Email-specific
  status: 'sent' | 'delivered' | 'bounced',
  opened: boolean,
  clicked: boolean,
  
  // WhatsApp-specific
  replied: boolean
}
```

### CommunicationDetail.jsx (Communication Detail Page)
Dynamic detail view that adapts layout based on communication type (calls vs emails).

**Location**: `src/pages/communications/CommunicationDetail.jsx`

**Layout**: Responsive three-section layout
- Header Card (full width)
- Left Column: Main Content (2/3 width)
- Right Column: Lead and Campaign Info (1/3 width)

**Features**:

1. **Header Card**
   - Large type icon (Bot/Phone/Mail/MessageSquare) with color coding
   - Communication subject (large heading)
   - Type badge with color
   - Outcome/Status badge (for calls)
   - Sentiment badge with emoji icon (for AI calls)
   - 4-column quick info grid:
     - Lead name with User icon
     - Duration with Clock icon (calls only)
     - AI Score with TrendingUp icon (AI calls only)
     - Date with Calendar icon
   - Action buttons (right side):
     - Download Recording (calls with recordings)
     - View Lead (links to lead detail)

2. **Call Recording Player** (AI/Manual Calls with recordings)
   - Gradient background (primary to purple)
   - Play/Pause button with smooth animation
   - Progress bar showing playback position
   - Time indicators (current / total duration)
   - Volume control button
   - White buttons with shadow for depth

3. **AI Summary Section** (AI Calls only)
   - Purple to primary gradient background
   - Bot icon header
   - Full AI-generated summary paragraph
   - Insights about call quality, next steps, budget, timeline

4. **Full Transcript** (Calls with transcript)
   - Scrollable container (max 600px height)
   - Copy to clipboard button with confirmation
   - Speaker-differentiated messages:
     - AI Agent/User messages: Primary blue background
     - Lead messages: White background
   - Timestamp for each message
   - Speaker name labels
   - Slate gray background container

5. **Email Content Section** (Emails only)
   - Mail icon header
   - Copy to clipboard button
   - White bordered container with full email text
   - Preserved formatting and line breaks
   - Professional prose styling

6. **Email Engagement Stats** (Emails only)
   - 4-stat grid with colored backgrounds:
     - Sent time (slate) with Send icon
     - Opens count (green) with Eye icon
     - Clicks count (blue) with MousePointer icon
     - Device type (blue) with CheckCircle icon
   - Additional details section:
     - First opened timestamp
     - Location information

7. **Key Points Section** (AI Calls only)
   - CheckCircle icon header
   - Bulleted list with checkmark icons
   - Extracted highlights from AI analysis:
     - Budget information
     - Decision timeline
     - Technical requirements
     - Pain points
     - Next steps

8. **Lead Information Card** (Right sidebar)
   - Lead name as clickable link with arrow
   - Position title
   - Company name with Building2 icon
   - Contact details:
     - Email (mailto link)
     - Phone (tel link)
   - Lead status badge
   - Hover animation on link

9. **Campaign Card** (Right sidebar)
   - Campaign name as clickable link
   - Campaign type
   - Created by information with avatar
   - Target icon header
   - Link hover effects

10. **Lead Updates Timeline** (Calls with changes)
    - TrendingUp icon header
    - Vertical timeline with dots and lines
    - Shows field changes:
      - Status updates
      - Priority changes
      - AI Score adjustments
    - Each update shows:
      - Field name
      - Old → New value with arrow
      - Reason for change
    - "View Lead Profile" button at bottom

**Dynamic Content by Type**:
- **AI Calls**: Recording player + AI Summary + Transcript + Key Points + Lead Updates
- **Manual Calls**: Recording player + Transcript (if available)
- **Emails**: Email Content + Engagement Stats
- **WhatsApp**: Message content + delivery status

**Design Features**:
- Adaptive layout based on communication type
- Color-coded type indicators throughout
- Gradient backgrounds for AI features
- Interactive recording player with state management
- Copy-to-clipboard functionality with visual feedback
- Timeline visualization for lead updates
- Engagement metrics for email tracking
- Clickable reference links with hover states
- Responsive grid layout
- Professional typography and spacing

---

## ✅ Tasks Module

### Tasks.jsx (Task List)
Main task management interface with table view, filtering, and multiple view modes.

**Location**: `src/pages/tasks/Tasks.jsx`

**Features**:

1. **Statistics Cards** (4 cards)
   - All Tasks: Total count with CheckSquare icon
   - My Tasks: Tasks assigned to current user with User icon
   - Overdue: Count of overdue tasks with AlertCircle icon
   - Completed: Count and completion percentage with Target icon
   - Each card has colored icon background

2. **View Tabs** (3 modes with counts)
   - All Tasks: Shows all tasks in system
   - My Tasks: Filtered to current user's assignments
   - Overdue Tasks: Shows only overdue tasks
   - Tab badges show count for each view
   - Active tab highlighted with primary color

3. **Search & Filters**
   - Search bar: Search by task title or lead name
   - Filter toggle button
   - Expandable filter panel with 3 dropdowns:
     - Priority: All/High/Medium/Low
     - Status: All/Pending/In Progress/Completed/Overdue
     - Assigned To: All users + individual team members

4. **Tasks Table** (7 columns)
   - Title: Task name (bold, clickable)
   - Lead: Lead name + company (two lines)
   - Campaign: Campaign name
   - Due Date: Date with calendar icon + days until/overdue indicator
   - Priority: Color-coded badge (High=red, Medium=yellow, Low=gray)
   - Assigned To: User avatar icon + name
   - Status: Badge with icon (Pending/In Progress/Completed/Overdue)
   - Click any row to navigate to task detail

5. **Smart Status Logic**
   - Automatically marks tasks as overdue if past due date
   - Due date indicators:
     - Red text for overdue
     - Yellow text for due today
     - Gray text for future dates
   - Days calculation: "X days overdue", "Due today", "Due tomorrow", "X days left"

6. **Empty State**
   - Displays when no tasks match filters
   - Shows appropriate message based on context
   - CheckSquare icon illustration

7. **Pagination**
   - Shows count: "Showing X of Y tasks"
   - Previous/Next navigation buttons

**Mock Data Structure**:
```javascript
{
  id: number,
  title: string,
  description: string,
  lead_name: string,
  lead_company: string,
  campaign: string,
  due_date: string,           // YYYY-MM-DD format
  priority: 'high' | 'medium' | 'low',
  assigned_to: string,
  assigned_to_id: number,
  status: 'pending' | 'in_progress' | 'completed' | 'overdue',
  created_at: string
}
```

### TaskDetail.jsx (Task Detail Page)
Comprehensive task detail view with actions, lead/campaign references, and notes.

**Location**: `src/pages/tasks/TaskDetail.jsx`

**Layout**: Three-section responsive layout
- Header Card (full width)
- Left Column: Description and Notes (2/3 width)
- Right Column: Lead and Campaign Info (1/3 width)

**Features**:

1. **Task Header Card**
   - FileText icon with task title (large heading)
   - Priority badge: Color-coded (High/Medium/Low)
   - Status badge with icon:
     - Pending: Clock icon, gray
     - In Progress: Clock icon, blue
     - Completed: CheckCircle2 icon, green
     - Overdue: AlertCircle icon, red
   - 4-column info grid:
     - Due Date: Date + days until/overdue indicator
     - Assigned To: Name + email
     - Created: Date + creator name
     - Last Updated: Date timestamp
   - Action buttons (right side):
     - Mark Complete: Primary button (hidden if already completed)
     - Edit Task: Outline button
     - Delete: Outline button with red text

2. **Task Description Section**
   - Full task description with preserved formatting
   - Whitespace and line breaks maintained
   - Prose styling for readability
   - FileText icon header

3. **Notes & Updates Section**
   - Add Note Form:
     - Large textarea for new notes
     - "Add Note" button with Send icon
     - Slate background to differentiate
   - Notes Timeline:
     - User avatar icon for each note
     - Author name (bold) + timestamp
     - Note text content
     - Divider lines between notes

4. **Lead Information Card** (Right sidebar)
   - Lead name as clickable link to lead profile
   - Lead position
   - Company name with Building2 icon
   - Contact details:
     - Email (clickable mailto link)
     - Phone (clickable tel link)
   - Lead status badge
   - Arrow icon on name link for visual feedback

5. **Campaign Card** (Right sidebar)
   - Campaign name as clickable link
   - Campaign type
   - Target icon header
   - Arrow icon on link with hover animation

6. **Delete Confirmation Modal**
   - Modal overlay with backdrop
   - Warning icon in danger red circle
   - "Delete Task" heading
   - Confirmation message
   - Two buttons: Cancel (outline) + Delete (red solid)

**Interactions**:
- Back button: Returns to tasks list
- Mark Complete: Shows loading state ("Completing...") then redirects
- Edit Task: Opens edit form (placeholder)
- Delete Task: Shows confirmation modal, then redirects after deletion
- Lead/Campaign links: Navigate to respective detail pages with hover effects
- Add Note: Adds new note to timeline (placeholder functionality)

**Design Features**:
- Three-column responsive grid layout
- Color-coded priority badges
- Status badges with appropriate icons
- Clickable reference links with hover states
- Modal dialog for destructive actions
- Loading states for async operations
- Preserved formatting in description
- Timeline visualization for notes
- Consistent card styling throughout

---

## 👥 Users Module (Admin Only)

### Users.jsx (User List)
User management interface for administrators with role-based access control.

**Location**: `src/pages/admin/Users.jsx`

**Features**:

1. **Statistics Cards** (4 cards)
   - Total Users: Overall count with UsersIcon
   - Active Users: Count and percentage with CheckCircle icon
   - Administrators: Count of admin users with Shield icon
   - Avg Campaigns: Average campaigns per user with Target icon

2. **Search & Filters**
   - Search bar: Search by name or email
   - Filter toggle button
   - Expandable filter panel with 2 dropdowns:
     - Role: All/Admin/Sales Manager/Sales Rep
     - Status: All/Active/Inactive

3. **Users Table** (7 columns)
   - Name: Avatar with initials + name + join date
   - Email: Email address with Mail icon
   - Role: Color-coded badge (Admin=yellow, Sales Manager=blue, Rep=gray)
   - Status: Active/Inactive badge with CheckCircle/XCircle icon
   - Assigned Campaigns: Count + list of campaign names (truncated)
   - Last Active: Date + time (two lines)
   - Actions: Edit button + Toggle status button
   - Click Edit to navigate to user detail

4. **Toggle Status Functionality**
   - ToggleRight icon for active users (click to deactivate)
   - ToggleLeft icon for inactive users (click to activate)
   - Instant state update in table

5. **Empty State**
   - Displays when no users match filters
   - UsersIcon illustration

6. **Pagination**
   - Shows count: "Showing X of Y users"
   - Previous/Next navigation buttons

### UserDetail.jsx (User Detail Page)
Comprehensive user profile with editable information, campaign assignments, and activity tracking.

**Location**: `src/pages/admin/UserDetail.jsx`

**Layout**: Three-section responsive layout
- Header Card (full width)
- Left Column: Basic Info & Campaigns (2/3 width)
- Right Column: Activity Logs (1/3 width)

**Features**:

1. **Header Card**
   - Large avatar with initials (colored background)
   - Name (editable when in edit mode)
   - Role badge (Admin/Sales Manager/Sales Rep)
   - Status badge (Active/Inactive)
   - 4-column quick info:
     - Email with Mail icon (editable)
     - Phone with Phone icon (editable)
     - Joined date with Calendar icon
     - Last Active with Activity icon
   - Action buttons:
     - Edit User (switches to edit mode)
     - Save Changes (in edit mode)
     - Cancel (in edit mode)

2. **Performance Stats** (6 mini cards)
   - Total Calls with PhoneCall icon
   - Successful calls with CheckCircle icon
   - Emails Sent with Send icon
   - Emails Opened with Eye icon
   - Leads Qualified with TrendingUp icon
   - Tasks Completed with CheckCircle icon

3. **Basic Information Section**
   - Editable form fields:
     - Department (text input or display)
     - Reports To (dropdown select or display)
     - Role (dropdown select or display)
     - Status (dropdown select or badge)
   - 2-column grid layout
   - Icons for each field

4. **Campaign Assignments Section**
   - List of assigned campaigns with count
   - Each campaign shows:
     - Campaign name (bold heading)
     - Leads assigned count + Status badge
     - Completion percentage with progress bar
     - "View" button to navigate to campaign
   - Empty state if no campaigns assigned

5. **Recent Activity Logs** (Right sidebar)
   - Scrollable feed (max 600px height)
   - Color-coded activity icons:
     - Calls: Primary blue
     - Emails: Blue
     - Leads: Success green
     - Tasks: Warning yellow
   - Each log shows:
     - Action description
     - Lead name + Campaign name
     - Timestamp with Clock icon
   - Divider lines between entries

**Edit Mode Functionality**:
- Toggle between view and edit modes
- All editable fields become input/select elements
- Save/Cancel buttons replace Edit button
- Form validation (placeholder)

**Design Features**:
- Avatar with auto-generated initials
- Color-coded role badges
- Inline editing capability
- Progress bars for campaign completion
- Activity timeline with icons
- Responsive grid layouts
- Professional form styling

---

## 🛡️ Roles Module (Admin Only)

### Roles.jsx (Role List)
Role management interface with permission tracking and user assignment counts.

**Location**: `src/pages/admin/Roles.jsx`

**Features**:

1. **Statistics Cards** (4 cards)
   - Total Roles: Overall count with Shield icon
   - Custom Roles: User-created roles count with Edit icon
   - Total Users: Users across all roles with Users icon
   - Avg Permissions: Average permissions per role with Lock icon

2. **Search**
   - Search bar: Search by role name or description
   - No expandable filters (simple search only)

3. **Roles Grid Layout**
   - Card-based grid (3 columns on desktop)
   - Each role card shows:
     - Large Shield icon with color coding
     - "System" badge (if system role with Lock icon)
     - Role name (large heading)
     - Description (2-line truncated)
     - Permissions count with CheckCircle icon
     - Users count with Users icon
     - Edit button (primary)
     - Delete button (disabled for system roles)
   - Hover effect with shadow

4. **Color Coding**
   - Super Admin: Red/Danger
   - Admin: Yellow/Warning
   - Sales Manager: Blue/Primary
   - Sales Rep: Green/Success
   - Marketing: Blue
   - Custom roles: Assigned colors

5. **System Role Protection**
   - System roles have Lock badge
   - Delete button disabled and grayed out
   - Alert if attempting to delete system role

6. **Delete Confirmation Modal**
   - Shows role name being deleted
   - Warning if users are assigned to role
   - Cancel + Delete buttons
   - Danger styling

7. **Empty State**
   - Shield icon illustration
   - Contextual message based on search

### RoleDetail.jsx (Role Detail Page)
Permission management interface with granular permission control organized by category.

**Location**: `src/pages/admin/RoleDetail.jsx`

**Features**:

1. **Header Card**
   - Large Shield icon (primary color)
   - Role name (editable in edit mode)
   - Description (editable textarea in edit mode)
   - Badges showing:
     - System Role badge (if applicable, with Lock icon)
     - Permissions count (X of Y permissions)
     - Users count (X users)
   - Action buttons:
     - Edit Role (disabled for system roles)
     - Save Changes (in edit mode)
     - Cancel (in edit mode)

2. **Permissions Grid** (2-column layout)
   - 8 permission categories:
     - **Campaigns**: View/Create/Edit/Delete/Assign (5 permissions)
     - **Leads**: View/Create/Edit/Delete/Export/Import (6 permissions)
     - **Communications**: View/Create/Delete (3 permissions)
     - **Calls**: View/Make/AI/Download (4 permissions)
     - **Tasks**: View/Create/Edit/Delete/Assign (5 permissions)
     - **Analytics**: View/Export/Advanced (3 permissions)
     - **User Management**: View/Create/Edit/Delete (4 permissions)
     - **Settings**: View/Edit/Integrations (3 permissions)

3. **Permission Category Cards**
   - Category heading with permission count
   - "Select All" button (enables all in category)
   - "Clear All" button (disables all in category)
   - Checkbox list for each permission:
     - Large checkbox (5x5)
     - Permission label
     - CheckCircle icon when enabled
     - Border changes when selected (primary border + bg)
     - Hover effects
   - Footer showing enabled count (X of Y)

4. **Interactive Permissions**
   - Click checkbox or label to toggle
   - Visual feedback with color changes
   - Bulk actions with Select/Clear All
   - Disabled state when not in edit mode
   - Real-time count updates

5. **System Role Notice**
   - Warning card with Lock icon
   - Yellow/Warning background
   - Explanation that system roles cannot be edited
   - Only shown for system roles

**Edit Mode Features**:
- Checkboxes become interactive
- Select All/Clear All buttons enabled
- Permission cards become clickable
- Color changes on hover and selection
- Save button stores changes

**Permission Structure**:
```javascript
{
  id: 'campaigns.view',
  label: 'View Campaigns',
  enabled: true/false
}
```

**Design Features**:
- Two-column responsive grid
- Interactive checkboxes with animations
- Color-coded selections (primary blue)
- Bulk selection controls
- Permission counts per category
- System role protection UI
- Visual hierarchy with borders and backgrounds

---

## 📋 Audit Logs Module (Admin Only)

### AuditLogs.jsx (Audit Trail)
Comprehensive audit logging system tracking all system changes with before/after comparison.

**Location**: `src/pages/admin/AuditLogs.jsx`

**Features**:

1. **Statistics Cards** (4 cards)
   - Total Logs: Overall count with Shield icon
   - Created: New records count with Plus icon
   - Updated: Modifications count with Edit icon
   - Deleted: Removed records count with Trash2 icon

2. **Filters** (3 dropdowns)
   - Model Type: All/Lead/Campaign/Task/User/Role/Communication
   - User: Filter by user who performed action
   - Date Range: All Time/Today/Last 7 Days/Last 30 Days
   - Search bar for record name or user

3. **Audit Logs Table** (6 columns + expand)
   - **Expand Toggle**: Chevron icon (right/down)
   - **Action**: Color-coded badge with icon
     - Create: Green with Plus icon
     - Update: Blue with Edit icon
     - Delete: Red with Trash2 icon
     - View: Light blue with Eye icon
   - **User**: Avatar + name + IP address
   - **Model**: Badge with model type (Lead, Campaign, etc.)
   - **Record**: Record name + ID
   - **Timestamp**: Date + time (two lines)
   - Click entire row to expand/collapse

4. **Expandable Row - Changes Details**
   - Shows when row is clicked
   - Gray background to differentiate
   - Grid layout (2 columns) for all changed fields
   - Each field card shows:
     - Field name (uppercase, small text)
     - **Before** section:
       - XCircle icon (red)
       - Value in danger/red background
       - Null values in gray italic
     - **After** section:
       - CheckCircle icon (green)
       - Value in success/green background
       - Null values in gray italic
   - Code formatting for values
   - Auto-formats field names (replaces underscores)

5. **Action Icons and Colors**
   - Create: Plus icon, green badge
   - Update: Edit icon, blue badge
   - Delete: Trash2 icon, red badge
   - View: Eye icon, light blue badge

6. **User Information Display**
   - User avatar with initials
   - User name
   - IP address (for security tracking)

7. **Export Functionality**
   - Export button in header
   - Download icon
   - Exports to CSV (placeholder)

8. **Empty State**
   - Shield icon illustration
   - Contextual message based on filters

9. **Pagination**
   - Shows count: "Showing X of Y logs"
   - Previous/Next navigation buttons

**Mock Data Structure**:
```javascript
{
  id: number,
  action: 'create' | 'update' | 'delete' | 'view',
  user: string,
  user_id: number,
  model: string,
  model_id: number,
  record_name: string,
  timestamp: string,
  ip_address: string,
  changes: {
    field_name: {
      before: value | null,
      after: value | null
    }
  }
}
```

**Expandable Row Interaction**:
- Click row to toggle expansion
- State managed with Set data structure
- Smooth transitions
- Multiple rows can be expanded simultaneously
- Changes displayed in organized grid

**Design Features**:
- Expandable rows with smooth animations
- Before/After visual comparison with color coding
- IP address tracking for security auditing
- Color-coded action types
- Code-style formatting for values
- Grid layout for multiple changes
- Professional audit trail presentation
- Null value handling with distinct styling
- Clean visual hierarchy

---

## 🎨 Component Library

### [COMPONENT_EXAMPLES.jsx](./COMPONENT_EXAMPLES.jsx)
Copy-paste ready component examples:
- Dashboard stat cards
- AI feature cards
- Forms and inputs
- Data tables
- Status badges
- Button groups
- Modals and dialogs
- Empty states
- Tabs and navigation
- Search bars
- Progress indicators
- Alerts and notifications

**When to read:** Building new features - copy examples directly into your code!

---

## 📊 Project Status

### [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
Complete project overview and status:
- What's been built
- Technology stack
- File structure
- Current implementation status
- Next steps and roadmap
- Success metrics

**When to read:** Onboarding, project planning, or status updates

---

## 🔗 Quick Links

| Document | Purpose | Read Time |
|----------|---------|-----------|
| [README](../README.md) | Setup & Installation | 5 min |
| [ARCHITECTURE](./ARCHITECTURE.md) | Component Patterns | 15 min |
| [DESIGN_SYSTEM](./DESIGN_SYSTEM.md) | Visual Guidelines | 20 min |
| [AUTH_SCREENS](./AUTH_SCREENS.md) | Authentication Flows | 10 min |
| [DASHBOARD_UI](./DASHBOARD_UI.md) | Dashboard Layouts | 10 min |
| [COMPONENT_EXAMPLES](./COMPONENT_EXAMPLES.jsx) | Copy-Paste Components | 5 min |
| [PROJECT_SUMMARY](./PROJECT_SUMMARY.md) | Full Overview | 10 min |

---

## 🎯 Documentation by Role

### For Developers
1. Start with [README](../README.md) for setup
2. Read [ARCHITECTURE](./ARCHITECTURE.md) for patterns
3. Reference [COMPONENT_EXAMPLES](./COMPONENT_EXAMPLES.jsx) while coding
4. Check this INDEX for Campaign and Leads module details
5. Review [PROJECT_SUMMARY](./PROJECT_SUMMARY.md) for API details

### For Designers
1. Study [DESIGN_SYSTEM](./DESIGN_SYSTEM.md) for complete visual language
2. Review Campaign and Leads sections above for UI patterns
3. Check [COMPONENT_EXAMPLES](./COMPONENT_EXAMPLES.jsx) for UI patterns
4. Review [DESIGN_SYSTEM_UPDATE](./DESIGN_SYSTEM_UPDATE.md) for recent changes

### For Project Managers
1. Read [PROJECT_SUMMARY](./PROJECT_SUMMARY.md) for full status
2. Check Campaign and Leads module sections for feature details
3. Review [README](../README.md) for tech stack
4. Check [ARCHITECTURE](./ARCHITECTURE.md) for scalability approach

---

## 📝 Documentation Standards

All documentation follows these principles:
- ✅ Clear, concise language
- ✅ Code examples with syntax highlighting
- ✅ Visual hierarchy with emojis
- ✅ Practical, actionable content
- ✅ Regular updates with project changes

---

## 🔄 Keeping Docs Updated

When making changes:
1. Update relevant documentation
2. Add examples to `COMPONENT_EXAMPLES.jsx` for new patterns
3. Update `PROJECT_SUMMARY.md` if features change
4. Add module documentation to this INDEX for new features (like Campaigns, Leads)
5. Document new reusable components (like CommunicationTimeline)
6. Maintain design system docs for new colors/typography

---

## 📋 Feature Module Checklist

When building new feature modules, ensure:
- ✅ List view with search and filters
- ✅ Detail view with comprehensive information
- ✅ Consistent card styling (rounded-2xl, p-6, gap-6)
- ✅ Color-coded status badges
- ✅ Responsive layouts (mobile/tablet/desktop)
- ✅ Empty states with call-to-action
- ✅ Loading states and error handling
- ✅ Role-based access control
- ✅ AI features highlighted with Sparkles icon
- ✅ Consistent typography (page-title, section-title, body-text)
- ✅ Communication timeline integration where applicable

**Reference**: See Campaign and Leads modules above as templates

---

## 🔌 Integrations Module

External integrations and API connections management.

### Integration List (`src/pages/integrations/Integrations.jsx`)

**Features:**
- Card grid layout showing all available integrations
- Search and filter by status (active/inactive)
- Stats cards: Total, Active, Inactive integrations
- Service-specific icons and color coding
- Status badges with visual indicators
- Feature tags preview (up to 3 features + count)
- Last synced timestamp for active integrations
- Configure button navigating to detail page

**Layout:**
1. **Header Section:**
   - Page title and description
   - No action buttons (configuration in detail)

2. **Stats Cards (3 columns):**
   - Total Integrations (Plug icon, Indigo)
   - Active Integrations (CheckCircle icon, Success green)
   - Inactive Integrations (XCircle icon, Slate gray)

3. **Search & Filters:**
   - Search input (by name or description)
   - Status dropdown filter (All/Active/Inactive)

4. **Integration Cards Grid (3 columns):**
   - Large service icon with color-coded background
   - Status badge (Active/Inactive with icons)
   - Service name and description
   - Category label
   - Last synced date (if active)
   - Features list (3 visible + count)
   - Configure button

**Mock Data Structure:**
```javascript
{
  id: 'twilio',
  name: 'Twilio SMS',
  description: 'Send and receive SMS messages through Twilio API',
  icon: MessageSquare,
  color: 'bg-danger-100 text-danger-600',
  status: 'active',
  category: 'Communication',
  last_synced: '2026-02-14T10:30:00Z',
  features: ['SMS Sending', 'SMS Receiving', 'MMS Support', 'Delivery Reports']
}
```

**Available Integrations:**
1. **Twilio SMS** - Communication (Danger red)
2. **WhatsApp Business** - Communication (Success green)
3. **Meta (Facebook)** - Marketing (Primary blue)
4. **Google Workspace** - Productivity (Blue)
5. **Retell AI** - AI (Purple)

**Design Elements:**
- Service icons: MessageSquare, Bot, Globe, Mail
- Color-coded backgrounds matching service branding
- Rounded-2xl cards with hover shadow transition
- Line-clamp-2 for description truncation
- Badge-sm for feature tags
- Empty state with centered message

### Integration Detail (`src/pages/integrations/IntegrationDetail.jsx`)

**Features:**
- Service-specific configuration forms
- Status toggle (Active/Inactive)
- API key/credential management with show/hide
- Test connection functionality
- Webhook URL display with copy buttons
- Documentation link to external docs
- Edit mode with save/cancel
- Real-time connection testing

**Layout:**
1. **Header Section:**
   - Back button to integrations list
   - Large service icon with color
   - Service name and description
   - Status badge and toggle button

2. **Configuration Card:**
   - Edit/Save/Cancel buttons
   - Service-specific form fields
   - Required field indicators (*)
   - Password fields with eye toggle
   - Input validation states

3. **Test Connection Card:**
   - Test button with loading state
   - Result display (success/error)
   - Visual feedback (CheckCircle/XCircle)
   - Disabled when service inactive

4. **Webhooks Card (if applicable):**
   - Webhook name and URL pairs
   - Copy to clipboard buttons
   - Code-styled URL display
   - Slate background cards

5. **Documentation Card:**
   - Description text
   - External link button to official docs
   - Opens in new tab

**Service Configurations:**

**Twilio SMS:**
- Account SID, Auth Token, Phone Number
- Messaging Service SID, Status Callback URL
- 2 webhooks (Incoming SMS, Status Updates)

**WhatsApp Business:**
- Phone Number ID, Access Token
- Business Account ID, Webhook Verify Token
- 2 webhooks (Incoming Messages, Message Status)

**Meta (Facebook):**
- App ID, App Secret, Access Token
- Page ID, Instagram Account ID
- Webhook Verify Token
- 2 webhooks (Lead Ads, Page Messages)

**Google Workspace:**
- Client ID, Client Secret, Refresh Token
- Redirect URI, Scopes
- No webhooks (OAuth flow)

**Retell AI:**
- API Key, Default Agent ID
- Webhook URL, Voice ID, Language
- 3 webhooks (Call Started, Call Ended, Transcription)

**Interactive Elements:**
- Status toggle: Activate/Deactivate button
- Edit mode toggle: Edit Configuration button
- Show/hide password fields: Eye/EyeOff icons
- Test connection: Loading spinner, 2s simulation
- Copy webhook URLs: Click to copy
- Form autosave prevention when not editing

**Design Elements:**
- Service-specific color schemes
- Password input with toggle visibility
- Code blocks for webhook URLs
- Success/Error result cards with colored borders
- Disabled states for inactive integrations
- Required field asterisks
- External link icon for documentation

**When to read:** Implementing external API connections, OAuth flows, webhook handling

---

## � AI Visual Language System

Complete AI-powered visual indicators and components for consistent AI feature representation.

### AI Components (`src/components/ai/`)

#### AIBadge Component (`AIBadge.jsx`)

**Purpose:** Visual indicators showing AI-powered actions with tooltips

**Badge Types:**
1. **AI Routed** - Purple to Indigo gradient
   - Shows automatic assignment by AI
   - Tooltip: Assignment logic explanation
   
2. **AI Scored** - Indigo to Purple gradient
   - Indicates AI quality scoring
   - Tooltip: Score calculation details
   
3. **AI Triggered Call** - Purple to Pink gradient
   - Shows AI-initiated calls
   - Tooltip: Trigger reason explanation
   
4. **AI Updated Status** - Indigo to Blue gradient
   - Indicates automatic status changes
   - Tooltip: Status change reasoning
   
5. **AI Analyzed** - Purple to Pink gradient
   - Shows AI content analysis
   - Tooltip: Analysis summary
   
6. **AI Optimized** - Indigo to Cyan gradient
   - Indicates AI optimization
   - Tooltip: Optimization details

**Features:**
- Three sizes: `sm`, `md`, `lg`
- Sparkles icon (can be hidden)
- Pulse glow animation (can be disabled)
- Hover tooltips with detailed explanations
- Gradient backgrounds with glow shadows
- Custom tooltip text support

**Usage:**
```jsx
import AIBadge from '@/components/ai/AIBadge'

// Basic usage
<AIBadge type="scored" />

// Custom size and tooltip
<AIBadge 
  type="routed" 
  size="lg"
  tooltip="Custom explanation here"
/>

// Without animation or icon
<AIBadge 
  type="triggered" 
  animate={false}
  showIcon={false}
/>
```

**AIGlowRing Component:**
Wraps content with AI-themed glow effect

**Intensity Levels:**
- `subtle` - Light glow for secondary features
- `normal` - Standard glow for AI content
- `strong` - Prominent glow for critical insights

**Usage:**
```jsx
import { AIGlowRing } from '@/components/ai/AIBadge'

<AIGlowRing intensity="normal">
  <div className="card">
    {/* AI-enhanced content */}
  </div>
</AIGlowRing>
```

#### AIInsightCard Component (`AIInsightCard.jsx`)

**Purpose:** Rich cards displaying AI-generated recommendations and analysis

**Card Types:**
1. **suggestion** - Lightbulb icon, Purple theme
   - Recommended next actions
   - Best practice suggestions
   
2. **retry** - RotateCcw icon, Indigo theme
   - Smart retry suggestions
   - Optimal timing recommendations
   
3. **scoring** - Target icon, Purple-Pink theme
   - Lead quality breakdown
   - Score factor analysis
   
4. **warning** - AlertCircle icon, Amber theme
   - Action required alerts
   - Risk notifications
   
5. **success** - CheckCircle icon, Emerald theme
   - High-value opportunities
   - Positive outcomes

**Features:**
- Gradient accent bar
- Dismissible with close button
- Action items with confidence scores
- Score breakdown visualization
- Progress bars for factors
- Clickable insights (optional)
- Action type icons (call, email, sms, schedule)
- Hover effects and animations
- Empty state handling

**Props:**
- `type` - Card type (suggestion, retry, scoring, warning, success)
- `title` - Main heading
- `subtitle` - Supporting text
- `insights` - Array of action items
- `scoringDetails` - Object with score breakdown
- `onAction` - Callback when insight clicked
- `onDismiss` - Callback when dismissed
- `showPulse` - Enable pulse animation

**Insight Object Structure:**
```javascript
{
  id: 1,
  title: 'Call lead within 2 hours',
  description: 'Lead showed high engagement...',
  action_type: 'call', // call, email, sms, schedule, follow_up
  confidence: 92 // 0-100
}
```

**Scoring Details Structure:**
```javascript
{
  score: 87,
  factors: [
    { name: 'Engagement Level', value: 92 },
    { name: 'Company Fit', value: 85 }
  ],
  explanation: 'This lead shows exceptional fit...'
}
```

**Usage:**
```jsx
import AIInsightCard from '@/components/ai/AIInsightCard'

// Suggestions with actions
<AIInsightCard
  type="suggestion"
  title="Recommended Next Actions"
  subtitle="AI analyzed lead behavior"
  insights={suggestedActions}
  onAction={(insight) => handleAction(insight)}
  onDismiss={() => console.log('Dismissed')}
/>

// Lead scoring breakdown
<AIInsightCard
  type="scoring"
  title="AI Lead Score Breakdown"
  scoringDetails={{
    score: 87,
    factors: [...],
    explanation: '...'
  }}
/>
```

**AIInsightInline Component:**
Compact inline version for embedding in other components

**Usage:**
```jsx
import { AIInsightInline } from '@/components/ai/AIInsightCard'

<AIInsightInline 
  text="AI suggests calling between 2-4 PM" 
  icon={Phone}
  type="suggestion"
/>
```

### AI Showcase Page (`src/pages/ai/AIShowcase.jsx`)

**Purpose:** Interactive gallery of all AI visual components

**Sections:**
1. **AI Badges & Indicators**
   - All badge types and sizes
   - Animation examples
   - Custom tooltip demos
   
2. **AI Glow Ring**
   - Three intensity levels
   - Usage examples
   
3. **AI Insight Cards**
   - All card types
   - With and without actions
   - Scoring breakdowns
   - Empty states
   
4. **Inline Insights**
   - Compact versions
   - Different action types
   
5. **Usage in Context**
   - Real component examples
   - Lead cards with AI badges
   - Campaign cards with insights

**Access:**
- Direct: `/dashboard/ai-showcase`
- From AI Insights: Top button "View AI Components"
- From AI Insights: Bottom section "AI Visual Components" link

### AI Insights Page (`src/pages/ai/AIInsights.jsx`)

**Purpose:** Main AI analytics and recommendations dashboard

**Features:**
- Navigation to AI Showcase (prominent card + button)
- AI metrics stats (4 cards)
- Top AI recommendations card
- AI performance metrics
- Quick links to AI features

**Sections:**
1. **Header** - Title with AI badge + Showcase button
2. **Showcase Access Card** - Large clickable card to AI Showcase
3. **AI Metrics** - 4 stat cards (Actions, Leads Scored, Calls, Conversion)
4. **Recommendations** - AIInsightCard with top suggestions
5. **Performance** - Progress bars for AI accuracy metrics
6. **Quick Links** - Navigation to AI features

**When to read:** Implementing AI features, adding AI indicators to pages, creating AI-themed components

### Animations & Effects

**CSS Classes (in `src/index.css`):**

1. **animate-pulse-glow** - Strong pulsing glow effect
   - 2s duration
   - Purple shadow animation
   - For badges and interactive elements

2. **animate-pulse-glow-soft** - Subtle pulsing effect
   - 3s duration
   - Gentle Y-axis movement
   - For cards and containers

3. **animate-fade-in** - Smooth fade in animation
   - 0.2s duration
   - Slight Y-axis slide
   - For tooltips and overlays

**Keyframes:**
- `pulseGlow` - Shadow intensity animation
- `pulseGlowSoft` - Soft shadow + transform
- `fadeIn` - Opacity + translateY
- `shimmer` - Background position animation

### Design Guidelines

**When to Use AI Indicators:**
- ✅ Automatic lead assignment by AI
- ✅ AI-calculated lead scores
- ✅ AI-triggered automated calls
- ✅ AI-updated lead statuses
- ✅ AI-analyzed content or sentiment
- ✅ AI-optimized campaign settings

**Color Palette:**
- Primary AI: Purple (#9333ea) to Indigo (#6366f1)
- Alternative: Purple to Pink, Indigo to Blue, Indigo to Cyan
- Glow shadows: rgba(147, 51, 234, 0.3-0.5)

**Best Practices:**
1. Always provide tooltip explanations
2. Use appropriate badge size for context
3. Don't overuse animations - disable for secondary instances
4. Combine badges with glow rings for emphasis
5. Use insight cards for actionable recommendations
6. Provide confidence scores for transparency
7. Make insights clickable when actions available

**When to read:** Before adding AI features, implementing AI indicators, creating AI-themed UI

---

## �🧩 Reusable Components

**CommunicationTimeline** (`src/components/communications/CommunicationTimeline.jsx`)
- Unified timeline for all communication types
- Expandable cards with type-specific styling
- AI call features: recording player, transcript, sentiment
- Filter tabs with counts
- Use in any module that tracks communications (Leads, Campaigns, etc.)

**When to use**: Any page displaying communication history, call logs, or activity feeds

**AIBadge** (`src/components/ai/AIBadge.jsx`)
- Visual indicators for AI-powered actions
- 6 types with gradient backgrounds
- Tooltips with explanations
- Glow animations and effects
- See AI Visual Language section above for details

**When to use**: Anywhere AI has taken action (scoring, routing, triggering, analyzing, optimizing)

**AIInsightCard** (`src/components/ai/AIInsightCard.jsx`)
- Rich insight cards with recommendations
- 5 types for different contexts
- Score breakdowns with visualizations
- Actionable insights with confidence scores
- See AI Visual Language section above for details

**When to use**: Displaying AI recommendations, lead scoring details, suggested actions

---

**Need help?** All documentation is searchable (Ctrl+F / Cmd+F)

**Contributing?** Keep the same format and style for consistency

---

*Last Updated: February 14, 2026*  
*Documentation Version: 1.0.0*

