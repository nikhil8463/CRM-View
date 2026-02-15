import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  Bot,
  Calendar,
  User,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Copy,
  ExternalLink,
  Target,
  TrendingUp,
  Play,
  Pause,
  Volume2,
  Smile,
  Meh,
  Frown,
  Send,
  Eye,
  MousePointer
} from 'lucide-react'

export default function CommunicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(false)
  const [copiedTranscript, setCopiedTranscript] = useState(false)
  const [copiedContent, setCopiedContent] = useState(false)
  
  // Mock data - replace with actual API call based on type
  const communication = {
    id: parseInt(id),
    type: 'AI_CALL', // AI_CALL, MANUAL_CALL, EMAIL, WHATSAPP
    lead: {
      id: 1,
      name: 'John Smith',
      company: 'Acme Corp',
      position: 'CTO',
      email: 'john.smith@acmecorp.com',
      phone: '+1 (555) 123-4567',
      status: 'qualified'
    },
    campaign: {
      id: 1,
      name: 'Q1 Enterprise Outreach',
      type: 'Email Campaign'
    },
    subject: 'Product Demo Discussion',
    created_at: '2026-02-14T10:30:00Z',
    created_by: 'AI Agent',
    
    // Call-specific fields
    duration: '28:45',
    outcome: 'success',
    sentiment: 'positive',
    ai_score: 92,
    recording_url: '/recordings/call-001.mp3',
    
    // AI Call specific
    ai_summary: 'This was a highly successful discovery call with John Smith, CTO of Acme Corp. The conversation focused on their need for an enterprise-grade solution to manage their growing customer base. John expressed strong interest in our AI-powered features, particularly the automated lead scoring and predictive analytics capabilities. He mentioned their current system lacks robust reporting and integration options. Budget appears to be $50K-75K annually. Next steps: Schedule technical demo with their IT team next week, send enterprise feature comparison sheet, and provide case studies from similar-sized companies.',
    
    key_points: [
      'Strong interest in AI-powered features',
      'Current system lacks reporting capabilities',
      'Budget range: $50K-75K annually',
      'Decision timeline: End of Q1',
      'Need integration with Salesforce',
      'Team size: 25 users initially',
      'Technical demo scheduled for next week',
      'Requires security compliance documentation'
    ],
    
    transcript: [
      { speaker: 'AI Agent', text: 'Good morning John! This is the AI assistant from our sales team. I hope I\'m catching you at a good time?', timestamp: '00:00' },
      { speaker: 'John Smith', text: 'Yes, good timing actually. I was just reviewing some CRM options.', timestamp: '00:08' },
      { speaker: 'AI Agent', text: 'Perfect! I understand you\'re looking for an enterprise solution. Can you tell me a bit about your current setup?', timestamp: '00:15' },
      { speaker: 'John Smith', text: 'We\'re using an older system that just doesn\'t scale well. We need better reporting and analytics.', timestamp: '00:25' },
      { speaker: 'AI Agent', text: 'I see. What specific reporting challenges are you facing?', timestamp: '00:35' },
      { speaker: 'John Smith', text: 'Well, we can\'t easily track lead progression through our funnel, and the dashboard is pretty basic.', timestamp: '00:42' },
      { speaker: 'AI Agent', text: 'That\'s a common pain point. Our platform offers real-time analytics with customizable dashboards. Would that be valuable?', timestamp: '00:55' },
      { speaker: 'John Smith', text: 'Absolutely. We also need good integration capabilities. We use Salesforce currently.', timestamp: '01:05' },
      { speaker: 'AI Agent', text: 'Great news - we have native Salesforce integration. It syncs bi-directionally in real-time.', timestamp: '01:15' },
      { speaker: 'John Smith', text: 'That sounds promising. What about the AI features you mentioned? How do they work?', timestamp: '01:25' },
      { speaker: 'AI Agent', text: 'Our AI analyzes every interaction to score leads, predict conversion probability, and suggest next best actions. It learns from your successful patterns.', timestamp: '01:35' },
      { speaker: 'John Smith', text: 'Interesting. And what\'s the typical implementation timeline?', timestamp: '01:50' },
      { speaker: 'AI Agent', text: 'For your team size of about 25 users, we typically complete implementation in 4-6 weeks, including training and migration.', timestamp: '02:00' },
      { speaker: 'John Smith', text: 'That works with our timeline. We need to make a decision by end of Q1.', timestamp: '02:15' },
      { speaker: 'AI Agent', text: 'Perfect. Let me schedule a technical demo for next week where we can dive deep into the features. Does Wednesday work?', timestamp: '02:25' },
      { speaker: 'John Smith', text: 'Wednesday afternoon would be great. Can you also send some case studies from similar companies?', timestamp: '02:38' },
      { speaker: 'AI Agent', text: 'Absolutely! I\'ll send those over today along with our enterprise feature comparison sheet. Any other questions?', timestamp: '02:50' },
      { speaker: 'John Smith', text: 'Just one more - what about security and compliance? We need SOC 2 certification.', timestamp: '03:00' },
      { speaker: 'AI Agent', text: 'We\'re SOC 2 Type II certified and GDPR compliant. I\'ll include all our security documentation in the email.', timestamp: '03:10' },
      { speaker: 'John Smith', text: 'Perfect. I think we have what we need for now. Looking forward to the demo.', timestamp: '03:22' },
      { speaker: 'AI Agent', text: 'Excellent! I\'ll send a calendar invite shortly. Thanks for your time, John!', timestamp: '03:30' }
    ],
    
    lead_updates: [
      {
        field: 'Status',
        old_value: 'contacted',
        new_value: 'qualified',
        reason: 'Strong interest expressed, budget confirmed',
        timestamp: '2026-02-14T10:58:00Z'
      },
      {
        field: 'Priority',
        old_value: 'medium',
        new_value: 'high',
        reason: 'Decision timeline is Q1, high engagement',
        timestamp: '2026-02-14T10:58:00Z'
      },
      {
        field: 'AI Score',
        old_value: 65,
        new_value: 92,
        reason: 'Positive sentiment, clear budget, immediate timeline',
        timestamp: '2026-02-14T10:58:00Z'
      }
    ],
    
    // Email-specific fields (if type is EMAIL)
    email_content: `Hi John,

Thank you for your interest in our enterprise CRM solution. I'm excited to share more details about how we can help Acme Corp streamline your sales operations.

Based on our initial conversation, I understand you're looking for:
- Advanced reporting and analytics
- Seamless Salesforce integration
- AI-powered lead scoring
- Enterprise-grade security

I've attached our comprehensive proposal that includes:
✓ Feature comparison sheet
✓ Pricing details for 25 users
✓ Implementation timeline
✓ ROI calculator
✓ Security certifications

Our enterprise plan includes:
- Unlimited custom dashboards
- Real-time AI insights
- Dedicated account manager
- 24/7 premium support
- Custom integrations

Next Steps:
Let's schedule a 45-minute demo next week to show you the platform in action. I'm available Wednesday or Thursday afternoon.

Looking forward to working together!

Best regards,
Jane Doe
Senior Account Executive`,
    
    email_stats: {
      sent_at: '2026-02-14T09:15:00Z',
      delivered_at: '2026-02-14T09:15:30Z',
      opened_at: '2026-02-14T09:45:00Z',
      clicked_at: '2026-02-14T10:20:00Z',
      opens: 3,
      clicks: 2,
      device: 'Desktop',
      location: 'San Francisco, CA'
    }
  }
  
  const getTypeIcon = (type) => {
    switch (type) {
      case 'AI_CALL':
        return <Bot className="w-6 h-6" />
      case 'MANUAL_CALL':
        return <Phone className="w-6 h-6" />
      case 'EMAIL':
        return <Mail className="w-6 h-6" />
      case 'WHATSAPP':
        return <MessageSquare className="w-6 h-6" />
      default:
        return <Phone className="w-6 h-6" />
    }
  }
  
  const getTypeStyle = (type) => {
    const styles = {
      AI_CALL: 'bg-purple-100 text-purple-600',
      MANUAL_CALL: 'bg-primary-100 text-primary-600',
      EMAIL: 'bg-blue-100 text-blue-600',
      WHATSAPP: 'bg-success-100 text-success-600',
    }
    return styles[type] || 'bg-slate-100 text-slate-600'
  }
  
  const getTypeLabel = (type) => {
    const labels = {
      AI_CALL: 'AI Call',
      MANUAL_CALL: 'Manual Call',
      EMAIL: 'Email',
      WHATSAPP: 'WhatsApp Message',
    }
    return labels[type] || type
  }
  
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="w-5 h-5 text-success-600" />
      case 'neutral':
        return <Meh className="w-5 h-5 text-warning-600" />
      case 'negative':
        return <Frown className="w-5 h-5 text-danger-600" />
      default:
        return null
    }
  }
  
  const handleCopyTranscript = () => {
    const transcriptText = communication.transcript
      ?.map(t => `[${t.timestamp}] ${t.speaker}: ${t.text}`)
      .join('\n\n')
    navigator.clipboard.writeText(transcriptText)
    setCopiedTranscript(true)
    setTimeout(() => setCopiedTranscript(false), 2000)
  }
  
  const handleCopyContent = () => {
    navigator.clipboard.writeText(communication.email_content || '')
    setCopiedContent(true)
    setTimeout(() => setCopiedContent(false), 2000)
  }
  
  const isCall = communication.type === 'AI_CALL' || communication.type === 'MANUAL_CALL'
  const isEmail = communication.type === 'EMAIL'
  
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/communications')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Communications</span>
      </button>
      
      {/* Header Card */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start gap-4 flex-1">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getTypeStyle(communication.type)}`}>
              {getTypeIcon(communication.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">{communication.subject}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`badge ${getTypeStyle(communication.type)}`}>
                  {getTypeLabel(communication.type)}
                </span>
                {communication.outcome && (
                  <span className={`badge ${
                    communication.outcome === 'success' ? 'bg-success-100 text-success-700' :
                    communication.outcome === 'voicemail' ? 'bg-warning-100 text-warning-700' :
                    'bg-slate-100 text-slate-700'
                  } capitalize`}>
                    {communication.outcome}
                  </span>
                )}
                {communication.sentiment && (
                  <span className="flex items-center gap-1 badge bg-slate-100 text-slate-700">
                    {getSentimentIcon(communication.sentiment)}
                    <span className="capitalize">{communication.sentiment}</span>
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Lead</p>
                    <p className="text-sm font-medium text-slate-900">{communication.lead.name}</p>
                  </div>
                </div>
                
                {communication.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Duration</p>
                      <p className="text-sm font-medium text-slate-900">{communication.duration}</p>
                    </div>
                  </div>
                )}
                
                {communication.ai_score && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">AI Score</p>
                      <p className="text-sm font-medium text-purple-600">{communication.ai_score}/100</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Date</p>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(communication.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {communication.recording_url && (
              <button className="btn btn-primary">
                <Download className="w-5 h-5 mr-2" />
                Download
              </button>
            )}
            <button
              onClick={() => navigate(`/dashboard/leads/${communication.lead.id}`)}
              className="btn btn-outline"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              View Lead
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content - Different layouts based on type */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recording Player (for calls) */}
          {isCall && communication.recording_url && (
            <div className="card">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-primary-600" />
                Call Recording
              </h2>
              
              <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-full bg-white shadow-soft flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-primary-600" />
                    ) : (
                      <Play className="w-6 h-6 text-primary-600 ml-0.5" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                      <span>0:00</span>
                      <span>{communication.duration}</span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600 rounded-full" style={{ width: '35%' }} />
                    </div>
                  </div>
                  
                  <button className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center hover:scale-105 transition-transform">
                    <Volume2 className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* AI Summary (for AI calls) */}
          {communication.type === 'AI_CALL' && communication.ai_summary && (
            <div className="card">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-600" />
                AI Summary
              </h2>
              <div className="bg-gradient-to-r from-purple-50 to-primary-50 rounded-xl p-6">
                <p className="text-slate-700 leading-relaxed">{communication.ai_summary}</p>
              </div>
            </div>
          )}
          
          {/* Transcript (for calls) */}
          {isCall && communication.transcript && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary-600" />
                  Full Transcript
                </h2>
                <button
                  onClick={handleCopyTranscript}
                  className="btn btn-outline btn-sm"
                >
                  {copiedTranscript ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto bg-slate-50 rounded-xl p-4">
                {communication.transcript.map((entry, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 w-20 text-xs text-slate-500 pt-1">
                      {entry.timestamp}
                    </div>
                    <div className="flex-1">
                      <div className={`rounded-lg p-3 ${
                        entry.speaker.includes('Agent') 
                          ? 'bg-primary-50 border border-primary-200' 
                          : 'bg-white border border-slate-200'
                      }`}>
                        <p className="text-xs font-semibold text-slate-700 mb-1">
                          {entry.speaker}
                        </p>
                        <p className="text-sm text-slate-900">{entry.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Email Content (for emails) */}
          {isEmail && communication.email_content && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Email Content
                </h2>
                <button
                  onClick={handleCopyContent}
                  className="btn btn-outline btn-sm"
                >
                  {copiedContent ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="prose prose-slate max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">
                    {communication.email_content}
                  </pre>
                </div>
              </div>
            </div>
          )}
          
          {/* Email Stats (for emails) */}
          {isEmail && communication.email_stats && (
            <div className="card">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Email Engagement
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <Send className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 mb-1">Sent</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {new Date(communication.email_stats.sent_at).toLocaleTimeString()}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-success-50 rounded-xl">
                  <Eye className="w-6 h-6 text-success-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 mb-1">Opens</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {communication.email_stats.opens}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-primary-50 rounded-xl">
                  <MousePointer className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 mb-1">Clicks</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {communication.email_stats.clicks}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 mb-1">Device</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {communication.email_stats.device}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">First opened:</span> {new Date(communication.email_stats.opened_at).toLocaleString()}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  <span className="font-semibold">Location:</span> {communication.email_stats.location}
                </p>
              </div>
            </div>
          )}
          
          {/* Key Points (for AI calls) */}
          {communication.type === 'AI_CALL' && communication.key_points && (
            <div className="card">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success-600" />
                Key Points
              </h2>
              <div className="space-y-3">
                {communication.key_points.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-700">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column - Sidebar Info (1/3 width) */}
        <div className="space-y-6">
          {/* Lead Information */}
          <div className="card">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              Lead Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Name</p>
                <button
                  onClick={() => navigate(`/dashboard/leads/${communication.lead.id}`)}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 group"
                >
                  {communication.lead.name}
                  <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 mb-1">Position</p>
                <p className="text-sm text-slate-900">{communication.lead.position}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Company</p>
                  <p className="text-sm text-slate-900">{communication.lead.company}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="text-sm">
                  <span className="text-slate-500">Email:</span>
                  <a href={`mailto:${communication.lead.email}`} className="ml-2 text-primary-600 hover:text-primary-700">
                    {communication.lead.email}
                  </a>
                </div>
                <div className="text-sm">
                  <span className="text-slate-500">Phone:</span>
                  <a href={`tel:${communication.lead.phone}`} className="ml-2 text-primary-600 hover:text-primary-700">
                    {communication.lead.phone}
                  </a>
                </div>
                <div>
                  <span className="badge bg-success-100 text-success-700 capitalize">
                    {communication.lead.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Campaign Information */}
          <div className="card">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-600" />
              Campaign
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Campaign Name</p>
                <button
                  onClick={() => navigate(`/dashboard/campaigns/${communication.campaign.id}`)}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 group"
                >
                  {communication.campaign.name}
                  <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 mb-1">Type</p>
                <p className="text-sm text-slate-900">{communication.campaign.type}</p>
              </div>
              
              <div>
                <p className="text-xs text-slate-500 mb-1">Created By</p>
                <div className="flex items-center gap-2 mt-1">
                  {communication.created_by === 'AI Agent' ? (
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-purple-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                  )}
                  <span className="text-sm text-slate-900">{communication.created_by}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lead Updates (for calls with lead changes) */}
          {communication.lead_updates && communication.lead_updates.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success-600" />
                Lead Updates
              </h2>
              <div className="space-y-4">
                {communication.lead_updates.map((update, index) => (
                  <div key={index} className="relative pl-6 pb-4 border-l-2 border-slate-200 last:border-0 last:pb-0">
                    <div className="absolute left-0 top-1 -translate-x-[9px] w-4 h-4 rounded-full bg-success-500 border-2 border-white" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-1">{update.field}</p>
                      <p className="text-xs text-slate-600 mb-2">
                        <span className="text-slate-500">{update.old_value}</span>
                        <ArrowLeft className="w-3 h-3 inline mx-1 rotate-180" />
                        <span className="text-success-600 font-medium">{update.new_value}</span>
                      </p>
                      <p className="text-xs text-slate-500">{update.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => navigate(`/dashboard/leads/${communication.lead.id}`)}
                className="btn btn-outline btn-sm w-full mt-4"
              >
                View Lead Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
