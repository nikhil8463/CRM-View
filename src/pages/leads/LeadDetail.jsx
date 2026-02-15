import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Edit,
  Trash2,
  Sparkles,
  User,
  Building2,
  MapPin,
  Globe,
  Clock,
  TrendingUp,
  Plus,
  Loader2,
  Send,
  CheckSquare
} from 'lucide-react'
import CommunicationTimeline from '../../components/communications/CommunicationTimeline'
import LogCommunicationModal from '../../components/modals/LogCommunicationModal'
import AddTaskModal from '../../components/modals/AddTaskModal'
import { useLead, useLeadTimeline, useUpdateLead, useUpdateLeadStatus, useAssignLead, useDeleteLead } from '@/hooks/useLeads'
import { useUsers } from '@/hooks/useUsers'
import toast from 'react-hot-toast'

export default function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [editingStatus, setEditingStatus] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(false)
  const [showLogCommModal, setShowLogCommModal] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [selectedCommType, setSelectedCommType] = useState('call')
  
  // Fetch lead data from backend
  const { data: leadData, isLoading, error } = useLead(id)
  const { data: timelineData } = useLeadTimeline(id)
  const { data: usersData } = useUsers()
  const { mutate: updateLead } = useUpdateLead()
  const { mutate: updateStatus } = useUpdateLeadStatus()
  const { mutate: assignLead } = useAssignLead()
  const { mutate: deleteLead } = useDeleteLead()
  
  // Extract lead from response - backend returns {lead: {...}}
  const lead = leadData?.lead
  // Timeline returns: {timeline: {lead: {...}, calls: [...], tasks: [...], communication_logs: [...]}}
  const timeline = timelineData?.timeline || {}
  // Users returns paginated data
  const users = usersData?.data || []
  
  // Handle status change with instant UI sync
  const handleStatusChange = (newStatus) => {
    updateStatus(
      { id, status: newStatus },
      {
        onSuccess: () => {
          setEditingStatus(false)
        }
      }
    )
  }
  
  // Handle assignment change with instant UI sync
  const handleAssignmentChange = (userId) => {
    assignLead(
      { id, user_id: userId },
      {
        onSuccess: () => {
          setEditingAssignment(false)
        }
      }
    )
  }
  
  // Handle lead deletion
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${lead?.name}"?`)) {
      deleteLead(id, {
        onSuccess: () => {
          navigate('/dashboard/leads')
        }
      })
    }
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    )
  }
  
  // Error state - only show if there's an actual error AND no data
  if (error && !lead) {
    return (
      <div className="card bg-danger-50 border-danger-200">
        <p className="text-danger-700">
          Failed to load lead details. {error?.message || 'Please try again.'}
        </p>
        <button 
          onClick={() => navigate('/dashboard/leads')}
          className="btn btn-secondary mt-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Leads
        </button>
      </div>
    )
  }
  
  // If still loading data, show loading
  if (!lead) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    )
  }
  
  // Safe computed values with fallbacks
  const aiScore = lead.ai_score || 0
  const metadata = lead.metadata ? (typeof lead.metadata === 'string' ? JSON.parse(lead.metadata) : lead.metadata) : {}
  
  // AI Score breakdown
  const scoreBreakdown = [
    { label: 'Engagement', score: 92, color: 'bg-success-500' },
    { label: 'Budget Fit', score: 85, color: 'bg-primary-500' },
    { label: 'Timeline', score: 78, color: 'bg-warning-500' },
    { label: 'Authority', score: 94, color: 'bg-success-500' },
  ]
  
  // Status timeline
  const statusTimeline = [
    { status: 'Qualified', date: '2026-02-15', user: 'Jane Doe', note: 'Met all qualification criteria' },
    { status: 'Contacted', date: '2026-02-08', user: 'Jane Doe', note: 'Initial discovery call completed' },
    { status: 'New', date: '2026-02-01', user: 'System', note: 'Lead created from LinkedIn campaign' },
  ]
  
  // Communication timeline with new unified format
  const communications = [
    {
      id: 1,
      type: 'AI_CALL',
      title: 'Discovery Call',
      preview: 'Discussed pain points and solution requirements. Very positive conversation.',
      content: 'Had an in-depth discussion about their current challenges with lead management. John expressed strong interest in our AI capabilities.',
      timestamp: '2026-02-15 10:30 AM',
      created_by: 'AI Agent',
      duration: '28:45',
      outcome: 'success',
      sentiment: 'positive',
      recording_url: '/recordings/call-001.mp3',
      ai_summary: 'High buying intent detected. Lead is ready to move forward with a demo. Budget range mentioned: $50K-$75K annually. Decision timeline: Q2 2026. Key decision maker confirmed.',
      transcript: [
        { speaker: 'Agent', text: 'Hi John, thanks for taking the time to speak with me today.' },
        { speaker: 'John', text: 'Happy to chat! I\'ve been looking into CRM solutions for a while now.' },
        { speaker: 'Agent', text: 'Great! Can you tell me about your current challenges?' },
        { speaker: 'John', text: 'We\'re struggling with lead tracking and our sales team needs better AI tools.' },
        { speaker: 'Agent', text: 'I understand. Our AI-powered CRM can definitely help with that...' }
      ],
      key_points: [
        'Budget mentioned: $50K-$75K annually',
        'Decision timeline: Q2 2026',
        'Key pain points: Lead tracking, AI capabilities',
        'Next step: Product demo scheduled'
      ]
    },
    {
      id: 2,
      type: 'EMAIL',
      title: 'Follow-up: Product Information',
      preview: 'Sent comprehensive product brochure and case studies',
      content: 'Hi John,\n\nThank you for the great conversation today. As promised, I\'m sending over our product brochure and some relevant case studies from companies in your industry.\n\nKey materials attached:\n- Product Overview & Features\n- ROI Calculator\n- Case Study: TechCorp (similar company size)\n- Implementation Timeline\n\nLooking forward to our demo next week!\n\nBest regards,\nJane',
      timestamp: '2026-02-14 2:15 PM',
      created_by: 'Jane Doe',
      outcome: 'answered'
    },
    {
      id: 3,
      type: 'WHATSAPP',
      title: 'Quick Check-in',
      preview: 'Thanks for the demo link! Will review with team this week.',
      content: 'Thanks for the demo link! Will review with team this week. Really impressed with the AI features you showed me.',
      timestamp: '2026-02-12 4:45 PM',
      created_by: 'John Smith'
    },
    {
      id: 4,
      type: 'MANUAL_CALL',
      title: 'Initial Contact Attempt',
      preview: 'Left voicemail with callback number',
      content: 'Called John\'s direct line. No answer. Left a professional voicemail introducing our company and mentioning the LinkedIn connection. Provided callback number and email.',
      timestamp: '2026-02-08 11:00 AM',
      created_by: 'Jane Doe',
      duration: '0:45',
      outcome: 'voicemail'
    },
    {
      id: 5,
      type: 'NOTE',
      title: 'Lead Research Notes',
      preview: 'Completed background research on Acme Corp and John\'s role',
      content: 'Research findings:\n- Acme Corp recently secured Series B funding ($25M)\n- Expanding sales team (10 new hires in Q1)\n- Current CRM: Salesforce (contract ending Q2)\n- John has been VP of Ops for 2 years\n- Previously worked at Fortune 500 tech company\n- Active on LinkedIn, posts about sales automation\n\nRecommendation: Position our AI capabilities as key differentiator. Emphasize ease of migration from Salesforce.',
      timestamp: '2026-02-07 3:30 PM',
      created_by: 'Jane Doe'
    },
    {
      id: 6,
      type: 'STATUS_CHANGE',
      title: 'Status Updated: New → Contacted',
      preview: 'Lead status changed after initial outreach',
      content: 'Lead status automatically updated from "New" to "Contacted" after successful phone connection.',
      timestamp: '2026-02-08 11:45 AM',
      created_by: 'System'
    },
    {
      id: 7,
      type: 'EMAIL',
      title: 'Introduction Email',
      preview: 'Initial outreach via LinkedIn connection',
      content: 'Hi John,\n\nI noticed we\'re connected on LinkedIn and saw your recent post about sales automation challenges. I work with companies like yours to streamline their CRM processes using AI.\n\nWould you be open to a brief call next week to discuss how we\'ve helped similar companies increase their conversion rates by 40%?\n\nLooking forward to connecting!\n\nBest,\nJane',
      timestamp: '2026-02-05 9:00 AM',
      created_by: 'Jane Doe',
      outcome: 'answered'
    }
  ]
  
  const statusStyles = {
    new: 'bg-primary-100 text-primary-700',
    contacted: 'bg-warning-100 text-warning-700',
    qualified: 'bg-success-100 text-success-700',
    converted: 'bg-slate-700 text-white',
    lost: 'bg-danger-100 text-danger-700',
  }
  
  const priorityStyles = {
    high: 'bg-danger-100 text-danger-700',
    medium: 'bg-warning-100 text-warning-700',
    low: 'bg-slate-100 text-slate-700',
  }
  
  const availableStatuses = ['new', 'contacted', 'qualified', 'converted', 'lost']
  
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/leads')}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Leads
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">{lead.name}</h1>
            <div className="flex items-center gap-3">
              {/* Status Badge with Edit */}
              {editingStatus ? (
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  onBlur={() => setEditingStatus(false)}
                  className="badge bg-primary-100 text-primary-700 cursor-pointer"
                  autoFocus
                >
                  {availableStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              ) : (
                <span 
                  className={`badge ${statusStyles[lead.status]} capitalize cursor-pointer`}
                  onClick={() => setEditingStatus(true)}
                >
                  {lead.status}
                </span>
              )}
              <span className={`badge ${priorityStyles[lead.priority]} capitalize`}>
                {lead.priority}
              </span>
            </div>
          </div>
          
          {/* Edit and Delete Buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate(`/dashboard/leads/${id}/edit`)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4 text-slate-600" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-2 hover:bg-danger-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-danger-600" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">Company</div>
                <div className="text-sm text-slate-900">{lead.company}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">Position</div>
                <div className="text-sm text-slate-900">{lead.position}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">Email</div>
                <a href={`mailto:${lead.email}`} className="text-sm text-primary-600 hover:text-primary-700">
                  {lead.email}
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">Phone</div>
                <a href={`tel:${lead.phone}`} className="text-sm text-slate-900">
                  {lead.phone}
                </a>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">Campaign</div>
                <div className="text-sm text-slate-900">{lead.campaign?.name || lead.campaign || '-'}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <div className="text-xs text-slate-500 font-medium mb-1">Assigned to</div>
                {editingAssignment ? (
                  <select
                    value={lead.assigned_user?.id || ''}
                    onChange={(e) => handleAssignmentChange(e.target.value)}
                    onBlur={() => setEditingAssignment(false)}
                    className="text-sm text-slate-900 border border-slate-300 rounded px-2 py-1"
                    autoFocus
                  >
                    <option value="">Unassigned</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                ) : (
                  <div 
                    className="text-sm text-slate-900 cursor-pointer hover:text-primary-600"
                    onClick={() => setEditingAssignment(true)}
                  >
                    {lead.assigned_user?.name || 'Unassigned'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">Address</div>
                <div className="text-sm text-slate-900">{lead.address}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <div className="text-xs text-slate-500 font-medium mb-1">Website</div>
                <a 
                  href={`https://${lead.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  {lead.website}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions Bar */}
      <div className="card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Quick Actions</h3>
          <div className="flex items-center gap-2">
            {/* Call Button */}
            <button 
              onClick={() => {
                setSelectedCommType('call');
                setShowLogCommModal(true);
              }}
              className="btn btn-outline btn-sm gap-2"
              title="Log a call"
            >
              <Phone className="w-4 h-4" />
              Call
            </button>
            
            {/* Email Button */}
            <button 
              onClick={() => {
                setSelectedCommType('email');
                setShowLogCommModal(true);
              }}
              className="btn btn-outline btn-sm gap-2"
              title="Log an email"
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            
            {/* SMS Button */}
            <button 
              onClick={() => {
                setSelectedCommType('sms');
                setShowLogCommModal(true);
              }}
              className="btn btn-outline btn-sm gap-2"
              title="Log SMS"
            >
              <MessageSquare className="w-4 h-4" />
              SMS
            </button>
            
            {/* WhatsApp Button */}
            <button
              onClick={() => {
                setSelectedCommType('whatsapp');
                setShowLogCommModal(true);
              }}
              className="btn btn-outline btn-sm gap-2"
              title="Log WhatsApp"
            >
              <Send className="w-4 h-4" />
              WhatsApp
            </button>
            
            {/* Add Task Button */}
            <button 
              onClick={() => setShowAddTaskModal(true)}
              className="btn btn-primary btn-sm gap-2"
              title="Create task"
            >
              <CheckSquare className="w-4 h-4" />
              Add Task
            </button>
          </div>
        </div>
      </div>
      
      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Communications */}
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-slate-500 font-medium mb-1">Communications</p>
              <p className="text-2xl font-bold text-slate-900">{communications.length}</p>
            </div>
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Calls */}
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-slate-500 font-medium mb-1">Calls</p>
              <p className="text-2xl font-bold text-slate-900">
                {communications.filter(c => c.type === 'CALL').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-success-600" />
            </div>
          </div>
        </div>

        {/* Emails */}
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-slate-500 font-medium mb-1">Emails</p>
              <p className="text-2xl font-bold text-slate-900">
                {communications.filter(c => c.type === 'EMAIL').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-slate-500 font-medium mb-1">Open Tasks</p>
              <p className="text-2xl font-bold text-slate-900">
                {timeline?.tasks?.filter(t => t.status !== 'completed').length || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-warning-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Lead Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Score Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">AI Lead Score</h2>
              <Sparkles className="w-5 h-5 text-primary-600" />
            </div>
            
            {/* Overall Score */}
            <div className="text-center mb-6">
              <div className="relative w-32 h-32 mx-auto mb-3">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-slate-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - aiScore / 100)}`}
                    className="text-success-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-slate-900">{aiScore}</div>
                  <div className="text-xs text-slate-500">Overall</div>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                {aiScore >= 80 ? 'High Quality Lead' : aiScore >= 50 ? 'Medium Quality Lead' : 'Developing Lead'}
              </div>
            </div>
            
            {/* Score Breakdown */}
            <div className="space-y-3">
              {scoreBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-medium text-slate-900">{item.score}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Company Information Card */}
          <div className="card">
            <h2 className="section-title mb-4">Company Information</h2>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">Industry</div>
                <div className="text-sm text-slate-900">{lead.industry}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Company Size</div>
                <div className="text-sm text-slate-900">{lead.company_size} employees</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Annual Revenue</div>
                <div className="text-sm text-slate-900">{lead.annual_revenue}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Source</div>
                <div className="text-sm text-slate-900">{lead.source}</div>
              </div>
            </div>
          </div>
          
          {/* Status Timeline Card */}
          <div className="card">
            <h2 className="section-title mb-4">Status Timeline</h2>
            <div className="space-y-4">
              {statusTimeline.map((item, index) => (
                <div key={index} className="relative pl-6">
                  {/* Timeline line */}
                  {index !== statusTimeline.length - 1 && (
                    <div className="absolute left-2 top-6 bottom-0 w-px bg-slate-200" />
                  )}
                  
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-primary-600 border-4 border-white ring-4 ring-slate-100" />
                  
                  <div>
                    <div className="font-medium text-slate-900">{item.status}</div>
                    <div className="text-sm text-slate-600 mt-1">{item.note}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                      <Clock className="w-3 h-3" />
                      {new Date(item.date).toLocaleString()}
                      <span>•</span>
                      <span>{item.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Notes Card */}
          <div className="card">
            <h2 className="section-title mb-4">Notes</h2>
            <div className="text-sm text-slate-700 leading-relaxed">
              {lead.notes}
            </div>
            <button className="btn btn-outline btn-sm mt-4 w-full">
              <Edit className="w-4 h-4 mr-2" />
              Edit Notes
            </button>
          </div>
        </div>
        
        {/* Right Column - Communication Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">Communication Timeline</h2>
              <div className="flex items-center gap-2">
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setSelectedCommType('call');
                    setShowLogCommModal(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Log Activity
                </button>
              </div>
            </div>
            
            <CommunicationTimeline communications={communications} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <LogCommunicationModal
        isOpen={showLogCommModal}
        onClose={() => setShowLogCommModal(false)}
        leadId={id}
        campaignId={lead?.campaign_id}
        defaultType={selectedCommType}
      />

      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        leadId={id}
        campaignId={lead?.campaign_id}
      />
    </div>
  )
}
