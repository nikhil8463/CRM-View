# 🎨 Design System Documentation

## Overview
This design system defines the visual language and component patterns for the AI-Powered CRM platform.

---

## 🎨 Color System

### Primary Brand (Indigo)
The primary brand color represents intelligence, trust, and professionalism.

\`\`\`css
primary-50:  #eef2ff
primary-100: #e0e7ff
primary-200: #c7d2fe
primary-300: #a5b4fc
primary-400: #818cf8
primary-500: #6366f1
primary-600: #4f46e5  /* Main brand color */
primary-700: #4338ca
primary-800: #3730a3
primary-900: #312e81
primary-950: #1e1b4b
\`\`\`

**Usage:**
- Primary buttons
- Active states
- Links and CTAs
- Important highlights

### AI Highlight (Purple Gradient)
Used for AI-specific features and intelligent automation indicators.

\`\`\`css
ai-50:  #faf5ff
ai-100: #f3e8ff
ai-200: #e9d5ff
ai-300: #d8b4fe
ai-400: #c084fc
ai-500: #a855f7
ai-600: #9333ea  /* AI gradient start */
ai-700: #7e22ce  /* AI gradient end */
ai-800: #6b21a8
ai-900: #581c87
\`\`\`

**Gradient:**
\`\`\`css
background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
\`\`\`

**Usage:**
- AI feature badges
- AI action buttons
- Intelligence indicators
- Automated workflow highlights

### Success (Emerald)
Represents successful operations, positive status, and growth.

\`\`\`css
success-50:  #ecfdf5
success-100: #d1fae5
success-200: #a7f3d0
success-300: #6ee7b7
success-400: #34d399
success-500: #10b981  /* Main success color */
success-600: #059669
success-700: #047857
success-800: #065f46
success-900: #064e3b
\`\`\`

**Usage:**
- Success messages
- Positive metrics (growth, conversions)
- Completed status
- Confirmation buttons

### Warning (Amber)
Indicates caution, pending actions, or items requiring attention.

\`\`\`css
warning-50:  #fffbeb
warning-100: #fef3c7
warning-200: #fde68a
warning-300: #fcd34d
warning-400: #fbbf24
warning-500: #f59e0b  /* Main warning color */
warning-600: #d97706
warning-700: #b45309
warning-800: #92400e
warning-900: #78350f
\`\`\`

**Usage:**
- Warning messages
- Pending status
- Alerts
- Incomplete items

### Danger (Red)
Represents errors, destructive actions, and critical issues.

\`\`\`css
danger-50:  #fef2f2
danger-100: #fee2e2
danger-200: #fecaca
danger-300: #fca5a5
danger-400: #f87171
danger-500: #ef4444  /* Main danger color */
danger-600: #dc2626
danger-700: #b91c1c
danger-800: #991b1b
danger-900: #7f1d1d
\`\`\`

**Usage:**
- Error messages
- Delete/destructive buttons
- Failed status
- Critical alerts

### Neutral (Slate)
Base colors for text, backgrounds, and UI elements.

\`\`\`css
slate-50:  #f8fafc  /* Light background */
slate-100: #f1f5f9
slate-200: #e2e8f0  /* Borders */
slate-300: #cbd5e1
slate-400: #94a3b8
slate-500: #64748b  /* Labels */
slate-600: #475569  /* Body text */
slate-700: #334155
slate-800: #1e293b
slate-900: #0f172a  /* Headings */
slate-950: #020617
\`\`\`

**Usage:**
- Text (900 for headings, 600 for body, 500 for labels)
- Backgrounds (50 for main, 100 for cards)
- Borders (200, 300)
- Icons and secondary elements

---

## 📝 Typography

### Font Family
**Primary:** Inter (300, 400, 500, 600, 700, 800)  
**Monospace:** JetBrains Mono (400, 500)

### Typography Hierarchy

#### Page Title
\`\`\`css
.page-title
text-2xl font-semibold text-slate-900
\`\`\`
**Example:** "Campaigns", "Lead Details"  
**Usage:** Top-level page headings

#### Section Title
\`\`\`css
.section-title
text-lg font-medium text-slate-900
\`\`\`
**Example:** "Recent Activity", "Performance Metrics"  
**Usage:** Section headings within pages

#### Metric
\`\`\`css
.metric
text-2xl font-bold text-slate-900
\`\`\`
**Example:** "2,543", "$45,000"  
**Usage:** Large numbers, KPIs, statistics

#### Body Text
\`\`\`css
.body-text
text-sm text-slate-600
\`\`\`
**Example:** Descriptions, paragraphs  
**Usage:** Standard body copy

#### Label Text
\`\`\`css
.label-text
text-xs uppercase tracking-wide text-slate-500
\`\`\`
**Example:** "TOTAL LEADS", "CAMPAIGN STATUS"  
**Usage:** Form labels, category labels

---

## 🔲 Spacing System

### Consistent Spacing
Use the `gap-6` grid system and `p-6` padding throughout:

\`\`\`css
/* Card padding */
padding: 1.5rem (p-6)

/* Grid gaps */
gap: 1.5rem (gap-6)

/* Section margins */
margin-bottom: 1.5rem (mb-6)
\`\`\`

### Spacing Scale
- `gap-2` (0.5rem) - Tight elements
- `gap-4` (1rem) - Related items
- `gap-6` (1.5rem) - **Standard spacing**
- `gap-8` (2rem) - Section separation

---

## 🎭 Components

### Buttons

#### Primary Button
\`\`\`jsx
<button className="btn btn-primary">
  Save Changes
</button>
\`\`\`
- Background: `primary-600`
- Hover: `primary-700`
- Rounded: `rounded-2xl`
- Shadow: `shadow-soft`

#### AI Button
\`\`\`jsx
<button className="btn btn-ai">
  <Sparkles className="w-4 h-4" />
  AI Analyze
</button>
\`\`\`
- Background: Purple gradient
- Glow effect: `shadow-ai-glow`
- Icon spacing: `gap-2`

#### Secondary Button
\`\`\`jsx
<button className="btn btn-secondary">
  Cancel
</button>
\`\`\`
- Background: `slate-200`
- Text: `slate-900`

### Cards

#### Standard Card
\`\`\`jsx
<div className="card">
  <h3 className="section-title mb-4">Card Title</h3>
  <p className="body-text">Card content</p>
</div>
\`\`\`
- Border radius: `rounded-2xl`
- Padding: `p-6`
- Shadow: `shadow-soft`
- Border: `border border-slate-200`

#### Hoverable Card
\`\`\`jsx
<div className="card card-hover">
  Interactive content
</div>
\`\`\`
- Adds hover lift effect
- Smooth transition: `transition-all duration-200 ease-in-out`

### Badges

\`\`\`jsx
<span className="badge badge-primary">New</span>
<span className="badge badge-success">Active</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-danger">Failed</span>
<span className="badge badge-ai">AI Powered</span>
\`\`\`

**Properties:**
- Rounded: `rounded-full`
- Padding: `px-2.5 py-0.5`
- Text: `text-xs font-medium`
- Icon support: `gap-1`

### Inputs

\`\`\`jsx
<input 
  type="text" 
  className="input" 
  placeholder="Enter value"
/>

{/* With error state */}
<input 
  type="text" 
  className="input input-error" 
/>
\`\`\`

**Properties:**
- Border radius: `rounded-2xl`
- Border: `border-slate-300`
- Focus ring: `focus:ring-2 focus:ring-primary-500`
- Transition: `transition-all duration-200 ease-in-out`

### Tables

\`\`\`jsx
<table className="table">
  <thead>
    <tr>
      <th>Header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data</td>
    </tr>
  </tbody>
</table>
\`\`\`

**Properties:**
- Header background: `bg-slate-50`
- Border: `border-slate-200`
- Hover: `hover:bg-slate-50`

---

## 🎯 Design Patterns

### Consistent Border Radius
All components use `rounded-2xl` for a modern, cohesive look:
- Cards: `rounded-2xl`
- Buttons: `rounded-2xl`
- Inputs: `rounded-2xl`
- Modals: `rounded-2xl`

### Smooth Transitions
All interactive elements use consistent transitions:
\`\`\`css
transition-all duration-200 ease-in-out
\`\`\`

### Shadow Hierarchy
- **Soft:** Default shadow for cards (`shadow-soft`)
- **Medium:** Hover state (`shadow-lg`)
- **Glow:** AI-specific elements (`shadow-ai-glow`)

### Spacing Consistency
- **Card padding:** `p-6`
- **Grid gaps:** `gap-6`
- **Section margins:** `mb-6`
- **Element gaps:** `gap-2` or `gap-4`

---

## 🎨 Usage Examples

### Dashboard Card
\`\`\`jsx
<div className="card">
  <div className="flex items-center justify-between mb-6">
    <h2 className="section-title">Campaign Performance</h2>
    <span className="badge badge-success">Active</span>
  </div>
  <div className="metric mb-2">2,543</div>
  <p className="body-text">Total leads this month</p>
</div>
\`\`\`

### AI Feature Button
\`\`\`jsx
<button className="btn btn-ai">
  <Sparkles className="w-4 h-4" />
  Generate AI Insights
</button>
\`\`\`

### Form Field with Label
\`\`\`jsx
<div className="space-y-2">
  <label className="label-text">Campaign Name</label>
  <input 
    type="text" 
    className="input" 
    placeholder="Q1 Outreach Campaign"
  />
</div>
\`\`\`

### Stats Grid
\`\`\`jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <div className="card">
    <p className="label-text mb-2">Total Leads</p>
    <div className="metric">2,543</div>
    <div className="flex items-center gap-2 mt-2">
      <span className="badge badge-success">
        <ArrowUp className="w-3 h-3" />
        12.5%
      </span>
      <span className="body-text">vs last month</span>
    </div>
  </div>
  {/* More stats... */}
</div>
\`\`\`

---

## ♿ Accessibility

### Focus States
All interactive elements have visible focus states:
\`\`\`css
focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
\`\`\`

### Color Contrast
All text meets WCAG AA standards:
- Headings: `slate-900` on white
- Body text: `slate-600` on white
- Labels: `slate-500` on white

### Keyboard Navigation
- All buttons are keyboard accessible
- Proper tab order
- Enter/Space activation

---

## 🎭 Animation Guidelines

### Hover Effects
\`\`\`css
/* Cards */
hover:shadow-lg hover:-translate-y-0.5

/* Buttons */
hover:bg-primary-700

/* Links */
hover:text-primary-600
\`\`\`

### Transitions
Always use smooth, consistent timing:
\`\`\`css
transition-all duration-200 ease-in-out
\`\`\`

### Loading States
Use skeleton screens or spinners with the primary color.

---

## 📐 Layout Guidelines

### Container Widths
- Dashboard content: `max-w-7xl mx-auto`
- Modal/Dialog: `max-w-2xl`
- Form container: `max-w-xl`

### Grid Systems
\`\`\`jsx
{/* Stats grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

{/* Main content + sidebar */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">Main content</div>
  <div>Sidebar</div>
</div>
\`\`\`

### Responsive Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## 🎯 Brand Voice

### Visual Personality
- **Modern:** Rounded corners, gradients, smooth animations
- **Professional:** Clean layouts, clear hierarchy
- **Intelligent:** Purple AI accents, glow effects
- **Trustworthy:** Indigo primary, consistent patterns

### Do's
✅ Use consistent spacing (gap-6, p-6)  
✅ Apply rounded-2xl to all components  
✅ Use transition-all duration-200 ease-in-out  
✅ Follow typography hierarchy  
✅ Use AI gradient for AI features  

### Don'ts
❌ Mix border radius styles  
❌ Use inconsistent spacing  
❌ Skip transition effects  
❌ Overuse AI purple (reserve for AI features)  
❌ Use custom colors outside the palette  

---

**Design System Version:** 1.0.0  
**Last Updated:** February 14, 2026  
**Maintained by:** Frontend Architecture Team
