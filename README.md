# 🚀 AI-Powered CRM Frontend

A modern, enterprise-grade CRM dashboard built with React 18, Tailwind CSS, and AI integrations.

## ✨ Features

### 🎯 Core Features
- **Campaign Management** - Create, manage, and track marketing campaigns
- **Lead Management** - Comprehensive lead tracking with AI-powered scoring
- **Call Management** - Retell AI integration for automated calling
- **Communications Hub** - Unified inbox for email, SMS, and calls
- **Task Management** - Automated and manual task assignment
- **Integrations** - External API connections (Twilio, WhatsApp, Meta, Google, Retell AI)
- **Analytics Dashboard** - Real-time insights and performance metrics

### 🤖 AI Features
- **AI Lead Scoring** - Automatic lead quality assessment using LangChain
- **AI Call Analysis** - Real-time call transcription and sentiment analysis
- **Retell AI Integration** - Automated voice conversations with leads
- **Smart Recommendations** - AI-powered follow-up suggestions
- **Automated Workflows** - Intelligent task and lead routing
- **Predictive Analytics** - Conversion probability and forecasting

### 🎨 UI/UX Features
- **Modern SaaS Design** - Clean, professional interface
- **Responsive Layout** - Mobile, tablet, and desktop optimized
- **Dark Mode Ready** - Elegant color scheme with AI-themed accents
- **Real-time Updates** - WebSocket integration for live data
- **Accessibility** - WCAG 2.1 AA compliant

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **Notifications:** React Hot Toast
- **WebSockets:** Socket.io Client

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Laravel backend running on `http://localhost:8000`

### Setup

1. **Install dependencies:**
\`\`\`bash
cd crm-ui
npm install
\`\`\`

2. **Configure environment:**
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` to match your backend API URL:
\`\`\`env
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000
\`\`\`

3. **Start development server:**
\`\`\`bash
npm run dev
\`\`\`

The app will be available at `http://localhost:3000`

## 🏗️ Project Structure

\`\`\`
crm-ui/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable UI components
│   │   ├── dashboard/   # Dashboard-specific components
│   │   ├── layout/      # Layout components (Sidebar, Header)
│   │   └── ui/          # Generic UI components
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Page layouts
│   ├── pages/           # Page components
│   │   ├── auth/        # Authentication pages
│   │   ├── campaigns/   # Campaign pages
│   │   ├── leads/       # Lead pages
│   │   ├── calls/       # Call pages
│   │   ├── communications/
│   │   ├── tasks/
│   │   ├── integrations/ # External integrations (Twilio, WhatsApp, etc.)
│   │   ├── ai/          # AI insights pages
│   │   ├── analytics/   # Analytics pages
│   │   ├── settings/
│   │   └── admin/       # Admin pages (Users, Roles, Audit Logs)
│   ├── services/        # API service layer
│   ├── store/           # Zustand stores
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
\`\`\`

## 🎨 Design System

### Colors
- **Primary (Indigo):** #4f46e5 - Main brand color for CTAs and highlights
- **AI (Purple Gradient):** #9333ea → #7e22ce - AI-specific features
- **Success (Emerald):** #10b981 - Positive actions and status
- **Warning (Amber):** #f59e0b - Alerts and pending items
- **Danger (Red):** #ef4444 - Errors and critical actions
- **Neutrals (Slate):** 50-950 - Text and backgrounds

### Typography
- **Font Family:** Inter (primary font, weights 300-800)
- **Utility Classes:** 
  - `.page-title` - Page headings
  - `.section-title` - Section headings
  - `.metric` - Large numeric displays
  - `.body-text` - Regular content
  - `.label-text` - Form labels

### Design Tokens
- **Border Radius:** rounded-2xl (16px)
- **Padding:** p-6 (24px) for cards and containers
- **Grid Gap:** gap-6 (24px) for layouts
- **Shadow:** shadow-soft for elevation
- **Transitions:** transition-all duration-200 ease-in-out

### Components
All components follow consistent patterns:
- Button variants: primary, secondary, success, danger, AI
- Badge variants: match color system
- Card patterns: consistent padding and shadows
- Form inputs: unified styling with error states

## 🔌 API Integration

The app connects to the Laravel backend via:

1. **REST API** - CRUD operations for all resources
2. **WebSockets** - Real-time updates for calls, notifications
3. **Authentication** - JWT token-based auth

### API Services
- `authService` - Login, register, logout
- `campaignService` - Campaign CRUD
- `leadService` - Lead management
- `callService` - Call history and Retell AI
- `taskService` - Task management
- `communicationService` - Email/SMS
- `integrationService` - External API connections (Twilio, WhatsApp, Meta, Google, Retell AI)
- `aiService` - AI insights and automation

## 🚀 Deployment

### Build for Production
\`\`\`bash
npm run build
\`\`\`

This creates an optimized build in the `dist/` folder.

### Environment Variables (Production)
Update your production `.env`:
\`\`\`env
VITE_API_URL=https://api.yourcrm.com/api
VITE_WS_URL=wss://api.yourcrm.com
\`\`\`

### Hosting Options
- **Vercel** - Recommended for Vite apps
- **Netlify** - Easy static hosting
- **AWS S3 + CloudFront** - Enterprise solution
- **Docker** - Containerized deployment

## 🔐 Authentication Flow

1. User logs in via `/login`
2. Backend returns JWT token
3. Token stored in Zustand + localStorage
4. Token attached to all API requests
5. Protected routes check auth state
6. Automatic redirect on token expiration

## 📱 Responsive Design

- **Mobile:** < 768px (sidebar drawer, stacked layout)
- **Tablet:** 768px - 1024px (collapsed sidebar)
- **Desktop:** > 1024px (full sidebar, multi-column)

## 🤝 Contributing

This is an enterprise CRM system. Follow these guidelines:

1. Use functional React components
2. Follow Tailwind utility-first approach
3. Maintain consistent component structure
4. Add PropTypes or TypeScript types
5. Write clean, documented code

## 📄 License

Proprietary - All rights reserved

## 👥 Team

Built by a Senior UI/UX Developer & Frontend Architect

## 📚 Documentation

All documentation is organized in the `docs/` folder:

- **[Documentation Index](./docs/INDEX.md)** - Complete documentation guide
- **[Design System](./docs/DESIGN_SYSTEM.md)** - Visual guidelines and component styles
- **[Architecture Guide](./docs/ARCHITECTURE.md)** - Component patterns and structure
- **[Component Examples](./docs/COMPONENT_EXAMPLES.jsx)** - Copy-paste ready components
- **[Project Summary](./docs/PROJECT_SUMMARY.md)** - Full project overview and status

## 🆘 Support

For issues or questions:
1. Check the [Documentation Index](./docs/INDEX.md)
2. Review [Component Examples](./docs/COMPONENT_EXAMPLES.jsx)
3. Read the [Design System](./docs/DESIGN_SYSTEM.md) guide
4. Refer to [Architecture Guide](./docs/ARCHITECTURE.md) for patterns

---

**Happy coding! 🎉**
