// 🎨 Design System Component Reference
// Copy these examples directly into your components

// ============================================
// 📊 DASHBOARD STAT CARD
// ============================================
<div className="card">
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <p className="label-text mb-2">Total Leads</p>
      <p className="metric">2,543</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="badge badge-success">
          <ArrowUp className="w-3 h-3" />
          12.5%
        </span>
        <span className="body-text">vs last month</span>
      </div>
    </div>
    <div className="p-3 rounded-2xl bg-primary-50 text-primary-600">
      <Users className="w-6 h-6" />
    </div>
  </div>
</div>

// ============================================
// 🤖 AI FEATURE CARD
// ============================================
<div className="card ai-gradient-subtle border-ai-300">
  <div className="flex items-center gap-3 mb-4">
    <div className="p-2 rounded-2xl bg-ai-600 text-white">
      <Sparkles className="w-5 h-5" />
    </div>
    <div>
      <h3 className="section-title">AI Insights</h3>
      <p className="body-text">Powered by LangChain</p>
    </div>
  </div>
  <button className="btn btn-ai w-full">
    <Brain className="w-4 h-4" />
    Generate Insights
  </button>
</div>

// ============================================
// 📝 FORM SECTION
// ============================================
<div className="card">
  <h2 className="section-title mb-6">Campaign Details</h2>
  
  <div className="space-y-4">
    <div>
      <label className="label-text block mb-2">Campaign Name</label>
      <input 
        type="text" 
        className="input" 
        placeholder="Q1 Outreach Campaign"
      />
    </div>
    
    <div>
      <label className="label-text block mb-2">Description</label>
      <textarea 
        className="input min-h-[100px]" 
        placeholder="Enter campaign description..."
      />
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="label-text block mb-2">Start Date</label>
        <input type="date" className="input" />
      </div>
      <div>
        <label className="label-text block mb-2">End Date</label>
        <input type="date" className="input" />
      </div>
    </div>
  </div>
  
  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-200">
    <button className="btn btn-primary">
      <Save className="w-4 h-4" />
      Save Campaign
    </button>
    <button className="btn btn-secondary">Cancel</button>
  </div>
</div>

// ============================================
// 📊 DATA TABLE
// ============================================
<div className="card">
  <div className="flex items-center justify-between mb-6">
    <h2 className="section-title">Recent Leads</h2>
    <button className="btn btn-primary">
      <Plus className="w-4 h-4" />
      Add Lead
    </button>
  </div>
  
  <div className="overflow-x-auto">
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>AI Score</th>
          <th>Created</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div>
              <p className="font-medium text-slate-900">John Smith</p>
              <p className="text-xs text-slate-500">john@company.com</p>
            </div>
          </td>
          <td>
            <span className="badge badge-success">Qualified</span>
          </td>
          <td>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ai-600" />
              <span className="badge badge-ai">92%</span>
            </div>
          </td>
          <td>
            <span className="text-sm text-slate-600">2 hours ago</span>
          </td>
          <td>
            <button className="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-all duration-200 ease-in-out">
              <ExternalLink className="w-4 h-4" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

// ============================================
// 🎯 STATUS BADGES
// ============================================
<div className="flex flex-wrap gap-2">
  <span className="badge badge-primary">New</span>
  <span className="badge badge-success">Active</span>
  <span className="badge badge-warning">Pending</span>
  <span className="badge badge-danger">Failed</span>
  <span className="badge badge-ai">
    <Sparkles className="w-3 h-3" />
    AI Powered
  </span>
</div>

// ============================================
// 🔘 BUTTON GROUP
// ============================================
<div className="flex items-center gap-3">
  <button className="btn btn-primary">
    <Save className="w-4 h-4" />
    Save
  </button>
  
  <button className="btn btn-ai">
    <Sparkles className="w-4 h-4" />
    AI Generate
  </button>
  
  <button className="btn btn-success">
    <Check className="w-4 h-4" />
    Approve
  </button>
  
  <button className="btn btn-danger">
    <Trash className="w-4 h-4" />
    Delete
  </button>
  
  <button className="btn btn-secondary">Cancel</button>
</div>

// ============================================
// 📈 METRIC CARD WITH TREND
// ============================================
<div className="card card-hover">
  <div className="flex items-center justify-between mb-4">
    <p className="label-text">Conversion Rate</p>
    <TrendingUp className="w-5 h-5 text-success-600" />
  </div>
  
  <div className="flex items-baseline gap-2 mb-2">
    <span className="metric">34.2%</span>
    <span className="badge badge-success">
      <ArrowUp className="w-3 h-3" />
      8.3%
    </span>
  </div>
  
  <p className="body-text">vs last month</p>
  
  {/* Mini progress bar */}
  <div className="mt-4 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
    <div className="h-full bg-gradient-to-r from-success-500 to-success-600" style={{ width: '34.2%' }}></div>
  </div>
</div>

// ============================================
// 🔔 ALERT / NOTIFICATION
// ============================================
<div className="rounded-2xl border border-warning-200 bg-warning-50 p-4">
  <div className="flex items-start gap-3">
    <div className="p-2 rounded-lg bg-warning-100">
      <AlertCircle className="w-5 h-5 text-warning-600" />
    </div>
    <div className="flex-1">
      <h4 className="font-medium text-warning-900 mb-1">Action Required</h4>
      <p className="body-text text-warning-700">
        3 leads require follow-up within the next 24 hours.
      </p>
      <button className="text-sm font-medium text-warning-600 hover:text-warning-700 mt-2">
        Review Leads →
      </button>
    </div>
  </div>
</div>

// ============================================
// 🎭 MODAL / DIALOG
// ============================================
<div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="section-title">Confirm Action</h2>
      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200 ease-in-out">
        <X className="w-5 h-5" />
      </button>
    </div>
    
    <p className="body-text mb-6">
      Are you sure you want to delete this campaign? This action cannot be undone.
    </p>
    
    <div className="flex items-center gap-3">
      <button className="btn btn-danger flex-1">
        <Trash className="w-4 h-4" />
        Delete
      </button>
      <button className="btn btn-secondary flex-1">Cancel</button>
    </div>
  </div>
</div>

// ============================================
// 📱 EMPTY STATE
// ============================================
<div className="card text-center py-12">
  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
    <Inbox className="w-8 h-8 text-slate-400" />
  </div>
  <h3 className="section-title mb-2">No campaigns yet</h3>
  <p className="body-text mb-6 max-w-sm mx-auto">
    Get started by creating your first campaign to start managing leads.
  </p>
  <button className="btn btn-primary mx-auto">
    <Plus className="w-4 h-4" />
    Create Campaign
  </button>
</div>

// ============================================
// 🎯 TABS
// ============================================
<div className="card">
  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl mb-6">
    <button className="flex-1 px-4 py-2 rounded-xl bg-white text-slate-900 font-medium shadow-soft transition-all duration-200 ease-in-out">
      Overview
    </button>
    <button className="flex-1 px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 transition-all duration-200 ease-in-out">
      Activity
    </button>
    <button className="flex-1 px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 transition-all duration-200 ease-in-out">
      Settings
    </button>
  </div>
  
  {/* Tab content */}
  <div>Tab content goes here...</div>
</div>

// ============================================
// 🔍 SEARCH BAR
// ============================================
<div className="relative">
  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
    <Search className="w-5 h-5 text-slate-400" />
  </div>
  <input
    type="text"
    className="input pl-11 pr-4"
    placeholder="Search leads, campaigns, calls..."
  />
</div>

// ============================================
// 💡 INFO CALLOUT
// ============================================
<div className="rounded-2xl border border-primary-200 bg-primary-50 p-4">
  <div className="flex items-start gap-3">
    <div className="p-2 rounded-lg bg-primary-100">
      <Lightbulb className="w-5 h-5 text-primary-600" />
    </div>
    <div className="flex-1">
      <h4 className="font-medium text-primary-900 mb-1">Pro Tip</h4>
      <p className="body-text text-primary-700">
        Enable AI scoring to automatically prioritize your hottest leads.
      </p>
    </div>
  </div>
</div>

// ============================================
// 📊 PROGRESS INDICATOR
// ============================================
<div className="card">
  <div className="flex items-center justify-between mb-2">
    <span className="label-text">Campaign Progress</span>
    <span className="metric text-lg">67%</span>
  </div>
  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
    <div 
      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-in-out" 
      style={{ width: '67%' }}
    ></div>
  </div>
  <p className="body-text mt-2">245 of 365 leads contacted</p>
</div>

// ============================================
// 🎨 COLOR PALETTE REFERENCE
// ============================================
/*
Primary (Indigo):  bg-primary-600  text-primary-600
AI (Purple):       bg-ai-600       text-ai-600
Success (Emerald): bg-success-600  text-success-600
Warning (Amber):   bg-warning-600  text-warning-600
Danger (Red):      bg-danger-600   text-danger-600
Neutral (Slate):   bg-slate-600    text-slate-600
*/

// ============================================
// 📝 TYPOGRAPHY REFERENCE
// ============================================
/*
Page Title:    className="page-title"
Section Title: className="section-title"
Metric:        className="metric"
Body Text:     className="body-text"
Label:         className="label-text"
*/
