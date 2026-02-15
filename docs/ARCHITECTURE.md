# 🎨 Component Architecture Guide

## Overview
This document outlines the component structure and design patterns used in the AI-Powered CRM frontend.

## Component Categories

### 1. Layout Components (`src/components/layout/`)
Core structural components that define the app shell.

#### Sidebar.jsx
- **Purpose:** Main navigation sidebar
- **Features:**
  - Collapsible on mobile
  - Active route highlighting
  - Role-based menu items
  - User profile section
  - AI section indicator
- **Props:** `isOpen`, `onClose`

#### Header.jsx
- **Purpose:** Top navigation bar
- **Features:**
  - Global search
  - Notifications dropdown
  - User menu
  - Mobile menu trigger
- **Props:** `onMenuClick`

### 2. Dashboard Components (`src/components/dashboard/`)
Dashboard-specific visualizations and widgets.

#### StatsCard.jsx
- **Purpose:** Display key metrics
- **Props:** `title`, `value`, `change`, `trend`, `icon`, `color`
- **Variants:** primary, success, warning, danger, ai

#### AIActivityFeed.jsx
- **Purpose:** Real-time AI action stream
- **Features:**
  - Live updates
  - Activity categorization
  - Time-relative timestamps
  - Color-coded events

#### CampaignPerformance.jsx
- **Purpose:** Campaign analytics visualization
- **Features:**
  - Bar chart with Recharts
  - Date range selector
  - Lead vs converted comparison

#### RecentLeads.jsx
- **Purpose:** Latest leads table
- **Features:**
  - Sortable columns
  - AI score display
  - Quick actions (email, call)
  - Status badges

### 3. UI Components (`src/components/ui/`)
Reusable, generic UI elements.

#### Buttons
\`\`\`jsx
// Primary button
<button className="btn btn-primary">Click Me</button>

// Secondary button
<button className="btn btn-secondary">Cancel</button>

// AI button (gradient)
<button className="btn btn-ai">AI Action</button>

// Success/Danger
<button className="btn btn-success">Save</button>
<button className="btn btn-danger">Delete</button>
\`\`\`

#### Badges
\`\`\`jsx
<span className="badge badge-primary">New</span>
<span className="badge badge-success">Active</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-danger">Failed</span>
<span className="badge badge-ai">AI Powered</span>
\`\`\`

#### Cards
\`\`\`jsx
// Basic card
<div className="card">
  <h3>Title</h3>
  <p>Content</p>
</div>

// Hoverable card
<div className="card card-hover">
  <h3>Interactive</h3>
</div>
\`\`\`

#### Forms
\`\`\`jsx
// Input field
<input className="input" type="text" />

// With error
<input className="input input-error" type="text" />

// Select
<select className="input">
  <option>Option 1</option>
</select>
\`\`\`

### 4. Page Components (`src/pages/`)
Full-page views that compose smaller components.

#### Dashboard Structure
\`\`\`
Dashboard (page)
├── StatsCard × 4
├── CampaignPerformance
├── RecentLeads
└── AIActivityFeed
\`\`\`

#### Lead Detail Structure
\`\`\`
LeadDetail (page)
├── LeadHeader
├── Tabs
│   ├── Overview
│   │   ├── LeadInfo
│   │   ├── AIScore
│   │   └── Timeline
│   ├── Communications
│   ├── Tasks
│   └── Activity
└── QuickActions
\`\`\`

#### Campaign Detail Structure
\`\`\`
CampaignDetail (page)
├── CampaignHeader
├── Stats
├── LeadsTable
├── PerformanceChart
└── AIInsights
\`\`\`

## Design Patterns

### 1. Container/Presentational Pattern
- **Container:** Handles logic, data fetching
- **Presentational:** Renders UI based on props

\`\`\`jsx
// Container
function LeadsContainer() {
  const { data, isLoading } = useQuery(['leads'], leadService.getLeads)
  return <LeadsList leads={data} loading={isLoading} />
}

// Presentational
function LeadsList({ leads, loading }) {
  if (loading) return <Spinner />
  return <div>{leads.map(lead => <LeadCard {...lead} />)}</div>
}
\`\`\`

### 2. Compound Components
For complex, related components.

\`\`\`jsx
<Tabs defaultTab="overview">
  <TabsList>
    <Tab id="overview">Overview</Tab>
    <Tab id="activity">Activity</Tab>
  </TabsList>
  <TabPanel id="overview">
    <OverviewContent />
  </TabPanel>
  <TabPanel id="activity">
    <ActivityContent />
  </TabPanel>
</Tabs>
\`\`\`

### 3. Render Props
For flexible, reusable logic.

\`\`\`jsx
<DataFetcher url="/api/leads">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />
    if (error) return <Error error={error} />
    return <LeadsList data={data} />
  }}
</DataFetcher>
\`\`\`

### 4. Custom Hooks
Encapsulate reusable logic.

\`\`\`jsx
// useLeads hook
function useLeads(filters) {
  return useQuery(['leads', filters], () => 
    leadService.getLeads(filters)
  )
}

// Usage
function LeadsPage() {
  const { data, isLoading } = useLeads({ status: 'new' })
  // ...
}
\`\`\`

## Styling Guidelines

### 1. Tailwind Utilities
Use utility classes for most styling:

\`\`\`jsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-soft">
  <h3 className="text-lg font-semibold text-gray-900">Title</h3>
  <button className="btn btn-primary">Action</button>
</div>
\`\`\`

### 2. Component Classes
For reusable patterns, use component classes defined in `index.css`:

\`\`\`css
.card { @apply bg-white rounded-lg shadow-soft border border-gray-200 p-6; }
.btn { @apply inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium; }
\`\`\`

### 3. Custom Styles
For unique, one-off styles:

\`\`\`jsx
<div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
  AI Gradient
</div>
\`\`\`

## State Management

### 1. Local State (useState)
For component-specific state:

\`\`\`jsx
const [isOpen, setIsOpen] = useState(false)
\`\`\`

### 2. Global State (Zustand)
For app-wide state:

\`\`\`jsx
// authStore.js
export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))

// Usage
const { user, setUser } = useAuthStore()
\`\`\`

### 3. Server State (React Query)
For API data:

\`\`\`jsx
const { data, isLoading, error } = useQuery(
  ['leads'],
  leadService.getLeads
)
\`\`\`

## Performance Optimization

### 1. Code Splitting
Use lazy loading for routes:

\`\`\`jsx
const Dashboard = lazy(() => import('./pages/Dashboard'))
\`\`\`

### 2. Memoization
Prevent unnecessary re-renders:

\`\`\`jsx
const MemoizedComponent = React.memo(ExpensiveComponent)
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b])
const memoizedCallback = useCallback(() => handleClick(a, b), [a, b])
\`\`\`

### 3. Virtual Scrolling
For large lists (when implemented):

\`\`\`jsx
import { FixedSizeList } from 'react-window'
\`\`\`

## Accessibility

### 1. Semantic HTML
\`\`\`jsx
<nav>...</nav>
<main>...</main>
<article>...</article>
\`\`\`

### 2. ARIA Attributes
\`\`\`jsx
<button aria-label="Close menu" aria-expanded={isOpen}>
  <X />
</button>
\`\`\`

### 3. Keyboard Navigation
\`\`\`jsx
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Clickable div
</div>
\`\`\`

## Testing Strategy

### 1. Component Tests
\`\`\`jsx
test('renders StatsCard with correct value', () => {
  render(<StatsCard title="Leads" value="100" />)
  expect(screen.getByText('100')).toBeInTheDocument()
})
\`\`\`

### 2. Integration Tests
Test component interactions and data flow.

### 3. E2E Tests
Test complete user workflows with Playwright/Cypress.

## File Naming Conventions

- **Components:** PascalCase (`StatsCard.jsx`)
- **Utilities:** camelCase (`helpers.js`)
- **Styles:** kebab-case (`custom-scrollbar.css`)
- **Hooks:** camelCase with "use" prefix (`useLeads.js`)

## Import Order

\`\`\`jsx
// 1. React imports
import { useState, useEffect } from 'react'

// 2. Third-party imports
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

// 3. Local component imports
import StatsCard from '@/components/dashboard/StatsCard'

// 4. Service/util imports
import { leadService } from '@/services/leadService'
import { formatNumber } from '@/utils/helpers'

// 5. Style imports
import './styles.css'
\`\`\`

---

**Built with ❤️ for scalable, maintainable React applications**
