# 📊 Dashboard UI Documentation

## Overview

The CRM features role-based dashboards with distinct layouts and widgets for Admin and Staff users, powered by AI insights and real-time data visualization.

---

## 🎯 Admin Dashboard

### Stat Cards (4 Cards - Grid: lg:grid-cols-4)
1. **Total Leads** - 2,543 leads (+12.5% vs last month)
   - Icon: Users
   - Color: Primary (Indigo)
   
2. **Active Campaigns** - 8 campaigns (+2 vs last month)
   - Icon: Target
   - Color: Success (Emerald)
   
3. **Calls Today** - 145 calls (+23.8% vs last month)
   - Icon: Phone
   - Color: Warning (Amber)
   
4. **AI Actions** - 1,234 actions (+45.2% vs last month)
   - Icon: Sparkles
   - Color: AI (Purple)

### Charts & Visualizations

#### 1. Conversion Funnel
**Component:** `ConversionFunnel.jsx`  
**Location:** Top left (2-column grid)

**Features:**
- 5-stage funnel visualization:
  - Total Leads (100%) - 2,543 leads
  - Qualified (60%) - 1,526 leads
  - Contacted (40%) - 1,018 leads
  - Engaged (20%) - 509 leads
  - Converted (10%) - 254 leads
- Percentage-based horizontal bars
- Drop-off indicators between stages
- Summary metrics:
  - Avg. Time to Convert: 14.5 days
  - Best Stage: Qualified
  - Bottleneck: Contacted
- Overall conversion rate with trend

**Design:**
- Gradient bars from primary-500 to success-600
- Slate-100 background bars
- Drop-off percentages with TrendingDown icon

#### 2. AI Call Outcomes
**Component:** `AICallOutcomes.jsx`  
**Location:** Top right (2-column grid)

**Features:**
- Donut chart visualization showing call distribution
- 4 outcome categories:
  - Answered (60%) - 87 calls - Success green
  - Voicemail (24%) - 35 calls - Warning amber
  - No Answer (12%) - 18 calls - Slate gray
  - Failed (4%) - 5 calls - Danger red
- Success rate percentage in header
- Detailed outcome list with icons
- AI Insight card at bottom with optimization tips

**Design:**
- SVG donut chart with colored segments
- Center shows total calls count
- Icon badges for each outcome
- Gradient AI insight badge

#### 3. Leads per Campaign (Campaign Performance)
**Component:** `CampaignPerformance.jsx`  
**Location:** Bottom left (2/3 width in 3-column grid)

**Features:**
- Bar chart showing leads and conversions per campaign
- 5 campaigns displayed:
  - Q1 Outreach, Summer Sale, Product Launch, Webinar Follow, Referral Prog
- Two bars per campaign:
  - Total Leads (Indigo #6366f1)
  - Converted (Emerald #10b981)
- Time period selector (Last 30/90 days, This year)
- Recharts library integration

**Design:**
- Rounded bar tops (radius: 8px)
- Slate grid lines
- Interactive tooltips
- Legend at bottom

#### 4. AI Insights Panel
**Component:** `AIInsightsPanel.jsx`  
**Location:** Bottom right (1/3 width in 3-column grid)

**Features:**
- **Recommended Follow-ups:**
  - Top 3 high-priority leads
  - AI reasoning for each recommendation
  - Priority badges (High/Medium)
  - Suggested actions
  
- **Campaign Alerts:**
  - Performance warnings (red)
  - Success notifications (green)
  - Actionable recommendations
  
- **Lead Score Distribution:**
  - Horizontal bar chart showing score ranges
  - 4 categories: Hot (80-100), Warm (60-79), Cool (40-59), Cold (0-39)
  - Lead counts per category
  - Color-coded visualization

- **AI Status Footer:**
  - Live indicator with pulse animation
  - Last update timestamp

**Design:**
- Brain icon header with gradient badge
- Compact card layout for scrolling
- Color-coded alerts and priorities
- Gradient AI insight backgrounds

#### 5. Recent Leads
**Component:** `RecentLeads.jsx`  
**Location:** Full width below charts

**Features:**
- Table view of latest leads
- Lead details with AI scores
- Quick action buttons
- Status indicators

---

## 👤 Staff Dashboard

### Stat Cards (5 Cards - Grid: lg:grid-cols-5)
1. **Assigned Campaigns** - 3 campaigns (+1 vs last month)
   - Icon: Target
   - Color: Primary (Indigo)
   
2. **My Leads** - 45 leads (+8 vs last month)
   - Icon: Users
   - Color: Success (Emerald)
   
3. **Today's Tasks** - 12 tasks (+3 vs last month)
   - Icon: CheckSquare
   - Color: Warning (Amber)
   
4. **AI Calls Triggered** - 23 calls (+15.2% vs last month)
   - Icon: Phone
   - Color: AI (Purple)
   
5. **Overdue Tasks** - 2 tasks (-1 vs last month, trending down)
   - Icon: AlertTriangle
   - Color: Danger (Red)

### Layout (3-column grid)

#### Left Column (2/3 width)
1. **Campaign Performance** - Same bar chart as admin
2. **Recent Leads** - Table of assigned leads

#### Right Column (1/3 width)
1. **AI Activity Feed**
   **Component:** `AIActivityFeed.jsx`
   
   **Features:**
   - Real-time AI action stream
   - Activity types: Lead scoring, Call analysis, Task automation
   - Timestamps for each activity
   - Compact scrollable list
   
2. **Recent Activity Timeline**
   **Component:** `RecentActivityTimeline.jsx`
   
   **Features:**
   - Chronological activity log
   - Activity types with icons:
     - Calls completed (CheckCircle - Green)
     - Tasks completed (CheckCircle - Blue)
     - New leads assigned (Circle - Orange)
     - Overdue alerts (AlertCircle - Red)
     - AI calls triggered (CheckCircle - Green)
     - Status updates (CheckCircle - Blue)
   - Vertical timeline with connecting line
   - Relative timestamps ("15 min ago", "2 hours ago")
   - Icon badges for each activity
   - Hover effects on activity cards
   - Load more functionality

   **Design:**
   - Vertical timeline line on left
   - Icon badges (w-10 h-10) with color backgrounds
   - Activity cards with slate-50 background
   - Slate-200 timeline connector
   - Relative time display with date-fns

---

## 🎨 Design System Integration

### Color Palette
- **Primary (Indigo):** #6366f1 - Main charts and stats
- **Success (Emerald):** #10b981 - Positive metrics, conversions
- **Warning (Amber):** #f59e0b - Alerts, pending items
- **Danger (Red):** #ef4444 - Failures, overdue items
- **AI (Purple):** #9333ea → #7e22ce - AI features gradient
- **Slate Neutrals:** 50-950 - Backgrounds and text

### Typography
- **Headings:** `.section-title` class (text-lg font-semibold)
- **Body Text:** `.body-text` class (text-sm)
- **Metrics:** Large bold numbers (text-3xl font-bold)

### Components
- **Cards:** `.card` class with rounded-2xl, p-6, shadow-soft
- **Grid Gaps:** gap-6 (24px) standard spacing
- **Transitions:** transition-all duration-200 ease-in-out
- **Hover Effects:** `.card-hover` for interactive cards

### Layout Breakpoints
- **Mobile:** < 768px - Single column, stacked cards
- **Tablet:** 768px - 1024px - 2-column grid
- **Desktop:** > 1024px - Full multi-column layouts

---

## 🔌 Data Integration

### Mock Data Structure
All components currently use mock data. Replace with actual API calls:

```javascript
// Example: Fetch admin stats
const { data: stats } = useQuery({
  queryKey: ['admin-stats'],
  queryFn: async () => {
    const response = await axios.get('/api/dashboard/stats')
    return response.data
  }
})
```

### API Endpoints Needed
- `GET /api/dashboard/stats` - Stat card data
- `GET /api/dashboard/conversion-funnel` - Funnel stages
- `GET /api/dashboard/call-outcomes` - Call results
- `GET /api/dashboard/campaigns` - Campaign performance
- `GET /api/dashboard/ai-insights` - AI recommendations
- `GET /api/dashboard/recent-leads` - Latest leads
- `GET /api/dashboard/activities` - Activity timeline
- `GET /api/dashboard/ai-feed` - AI activity stream

---

## 🎯 Role-Based Rendering

### Admin View
- 4 stat cards in 4-column grid
- Conversion funnel + AI call outcomes
- Full AI insights panel
- Campaign performance chart
- Recent leads table

### Staff View
- 5 stat cards in 5-column grid
- Campaign performance chart
- Personal leads table
- AI activity feed (right sidebar)
- Recent activity timeline (right sidebar)

### Implementation
```javascript
const isAdmin = user?.role?.name === 'Admin'

// Conditional stats
const stats = isAdmin ? adminStats : staffStats

// Conditional layout
{isAdmin && <AdminDashboardLayout />}
{!isAdmin && <StaffDashboardLayout />}
```

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Stat cards stack vertically (1 column)
- Charts full width
- Sidebars become full width sections

### Tablet (768px - 1024px)
- 2-column stat card grid
- Charts remain full width or 2-column
- Reduced sidebar width

### Desktop (> 1024px)
- Full multi-column grid layouts
- Admin: 4-column stats, 2-column charts, 3-column bottom section
- Staff: 5-column stats, 3-column layout (2:1 ratio)

---

## ⚡ Performance Optimization

### Best Practices Applied
1. **Lazy Loading:** Charts load only when visible
2. **Memoization:** Use React.memo for chart components
3. **Data Caching:** TanStack Query caches API responses
4. **Debouncing:** Time period selectors debounced
5. **Virtual Scrolling:** For long activity timelines

### Recommended Enhancements
- [ ] Implement React.memo for expensive chart renders
- [ ] Add loading skeletons for better UX
- [ ] Use React Query's refetchInterval for real-time updates
- [ ] Implement WebSocket for live activity feed
- [ ] Add error boundaries for chart failures

---

## 🚀 Future Enhancements

### Planned Features
- [ ] Drag-and-drop widget customization
- [ ] Export dashboard as PDF/PNG
- [ ] Custom date range selectors
- [ ] Dashboard templates (presets)
- [ ] Widget favorites/pinning
- [ ] Real-time WebSocket updates
- [ ] Custom alert rules
- [ ] Dashboard sharing with team
- [ ] Mobile app integration
- [ ] Voice command dashboard navigation

### AI Enhancements
- [ ] Predictive lead scoring trends
- [ ] Campaign success forecasting
- [ ] Automated anomaly detection
- [ ] Natural language dashboard queries
- [ ] Personalized widget recommendations

---

**Component Files Created:**
- ✅ `ConversionFunnel.jsx` - Lead conversion stages
- ✅ `AICallOutcomes.jsx` - Call result distribution
- ✅ `AIInsightsPanel.jsx` - AI recommendations & alerts
- ✅ `RecentActivityTimeline.jsx` - Staff activity log
- ✅ Updated `Dashboard.jsx` - Role-based layouts
- ✅ Updated `CampaignPerformance.jsx` - Design system colors

**Last Updated:** February 14, 2026
