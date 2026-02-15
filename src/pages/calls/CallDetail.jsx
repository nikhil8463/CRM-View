import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  Phone,
  Clock,
  Calendar,
  User,
  Building2,
  Sparkles,
  Play,
  Pause,
  Volume2,
  Download,
  Copy,
  CheckCircle,
  Smile,
  RefreshCw,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { useCall, useCallTranscript, useDeleteCall } from '@/hooks/useCalls'
import toast from 'react-hot-toast'

export default function CallDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = useState(false)
  const [copiedTranscript, setCopiedTranscript] = useState(false)
  
  // Fetch call data and transcript from backend
  const { data: callData, isLoading, error } = useCall(id)
  const { data: transcriptData, isLoading: transcriptLoading } = useCallTranscript(id)
  const { mutate: deleteCall } = useDeleteCall()
  
  const call = callData?.call
  const transcript = transcriptData?.transcripts || transcriptData?.transcript || transcriptData?.data || []
  
  // Handle call deletion
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this call?')) {
      deleteCall(id, {
        onSuccess: () => {
          navigate('/dashboard/calls')
        }
      })
    }
  }
  
  // Handle transcript copy
  const handleCopyTranscript = () => {
    const text = transcript.map(t => `${t.speaker}: ${t.transcript || t.text || ''}`).join('\n')
    navigator.clipboard.writeText(text)
    setCopiedTranscript(true)
    toast.success('Transcript copied to clipboard!')
    setTimeout(() => setCopiedTranscript(false), 2000)
  }
  
  // Helper function to format duration for display
  const formatDuration = (duration) => {
    if (!duration) return '0:00'
    
    // If already a string in MM:SS format, return as-is
    if (typeof duration === 'string') return duration
    
    // If number (seconds), convert to MM:SS format
    if (typeof duration === 'number') {
      const mins = Math.floor(duration / 60)
      const secs = duration % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    
    return '0:00'
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    )
  }
  
  // Error state
  if (error || !call) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/dashboard/calls')}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Calls
        </button>
        <div className="card bg-danger-50 border-danger-200">
          <p className="text-danger-700">Failed to load call details. Please try again.</p>
        </div>
      </div>
    )
  }

  // Safe data access with fallbacks
  const leadName = call.lead?.name || call.lead_name || 'Unknown Lead'
  const leadCompany = call.lead?.company || call.lead_company || 'N/A'
  const leadPosition = call.lead?.title || call.lead_position || 'N/A'
  const callType = call.call_type || call.type || 'manual'
  const callOutcome = call.outcome || call.status || 'completed'
  const callDuration = call.duration || 0
  const callDate = call.started_at || call.created_at || call.date || 'N/A'
  const aiSummary = call.ai_summary || call.summary || ''
  const sentiment = call.sentiment || null
  const keyPoints = Array.isArray(call.key_points) ? call.key_points : []
  const leadUpdates = Array.isArray(call.lead_updates) ? call.lead_updates : []
  const campaignName = call.campaign?.name || call.campaign || 'N/A'
  const agentName = call.user?.name || call.agent || 'N/A'
  const recordingUrl = call.recording_url || null
  const isAICall = callType === 'AI_CALL' || callType === 'ai'
  
  /* Mock data removed - now using backend data
    key_points: [
      'Budget confirmed: $50K-$75K annually',
      'Team size: 50 sales reps',
      'Lead volume: 5,000/month',
      'Current CRM: Salesforce (contract ending Q2)',
      'Main pain point: Lead prioritization',
      'Decision timeline: Q2 2026',
      'Demo scheduled: Tuesday 2 PM',
      'Sales director will join demo'
    ],
    lead_updates: [
      { 
        field: 'Status',
        old_value: 'Contacted',
        new_value: 'Qualified',
        timestamp: '2026-02-15 11:00 AM',
        reason: 'Call outcome: success, high buying intent detected'
      },
      {
        field: 'Priority',
        old_value: 'Medium',
        new_value: 'High',
        timestamp: '2026-02-15 11:00 AM',
        reason: 'Budget confirmed, decision timeline identified'
      },
      {
        field: 'AI Score',
        old_value: 72,
        new_value: 87,
        timestamp: '2026-02-15 11:00 AM',
        reason: 'Positive sentiment, clear budget, authority confirmed'
      }
    ]
  }*/
  
  const outcomeStyles = {
    success: 'bg-success-100 text-success-700',
    voicemail: 'bg-warning-100 text-warning-700',
    no_answer: 'bg-slate-100 text-slate-700',
    busy: 'bg-danger-100 text-danger-700',
  }
  
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/calls')}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Calls
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-xl ${isAICall ? 'bg-purple-100' : 'bg-primary-100'} flex items-center justify-center`}>
              {isAICall ? (
                <Sparkles className="w-8 h-8 text-purple-600" />
              ) : (
                <Phone className="w-8 h-8 text-primary-600" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{leadName}</h1>
              <div className="flex items-center gap-3">
                <span className={`badge ${outcomeStyles[callOutcome] || 'bg-slate-100 text-slate-700'} capitalize`}>
                  {callOutcome}
                </span>
                <span className="badge bg-purple-100 text-purple-700">
                  {isAICall ? 'AI Call' : 'Manual Call'}
                </span>
                {sentiment && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm">
                    <Smile className="w-4 h-4" />
                    Positive Sentiment
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="btn btn-outline btn-sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">Company</div>
              <div className="text-sm text-slate-900">{leadCompany}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">Position</div>
              <div className="text-sm text-slate-900">{leadPosition}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">Duration</div>
              <div className="text-sm text-slate-900">{formatDuration(callDuration)}</div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">Date & Time</div>
              <div className="text-sm text-slate-900">{new Date(callDate).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recording & Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recording Player */}
          <div className="card">
            <h2 className="section-title mb-4">Call Recording</h2>
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <button 
                  className="w-14 h-14 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center transition-colors"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-primary-600 w-1/3 transition-all"></div>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>0:00</span>
                    <span>{formatDuration(callDuration)}</span>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                  <Volume2 className="w-6 h-6 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
          
          {/* AI Summary */}
          {isAICall && aiSummary && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary-600" />
                <h2 className="section-title">AI Summary</h2>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-primary-50 rounded-xl p-6 border border-purple-200">
                <p className="text-slate-700 leading-relaxed">{aiSummary}</p>
              </div>
            </div>
          )}
          
          {/* Full Transcript */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Full Transcript</h2>
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
            {transcriptLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            ) : transcript.length > 0 ? (
              <div className="bg-slate-50 rounded-xl p-6 max-h-[600px] overflow-y-auto">
                <div className="space-y-4">
                  {transcript.map((line, idx) => (
                    <div key={line.id || idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-16 text-xs text-slate-500 font-mono">
                        {line.timestamp || `${idx + 1}`}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <span className={`font-semibold text-sm capitalize ${
                            line.speaker === 'agent' || line.speaker === 'Agent' ? 'text-primary-600' : 'text-slate-900'
                          }`}>
                          {line.speaker}:
                        </span>
                        <p className="text-sm text-slate-700 leading-relaxed flex-1">
                          {line.transcript || line.text || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 rounded-xl p-6 text-center">
                <p className="text-slate-500">No transcript available for this call.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Key Points & Updates */}
        <div className="space-y-6">
          {/* Call Outcome */}
          <div className="card">
            <h2 className="section-title mb-4">Call Outcome</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">Status</span>
                <span className={`badge ${outcomeStyles[callOutcome] || 'bg-slate-100 text-slate-700'} capitalize`}>
                  {callOutcome}
                </span>
              </div>
              {sentiment && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-600">Sentiment</span>
                  <span className="flex items-center gap-1 text-sm text-success-700">
                    <Smile className="w-4 h-4" />
                    {sentiment}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">Campaign</span>
                <span className="text-sm text-slate-900 font-medium">{campaignName}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">Agent</span>
                <span className="text-sm text-slate-900 font-medium">{agentName}</span>
              </div>
            </div>
          </div>
          
          {/* Key Points */}
          {keyPoints.length > 0 && (
            <div className="card">
              <h2 className="section-title mb-4">Key Points</h2>
              <ul className="space-y-2">
                {keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Lead Update History */}
          {leadUpdates.length > 0 && (
            <div className="card">
              <h2 className="section-title mb-4">Lead Update History</h2>
              <div className="space-y-4">
                {leadUpdates.map((update, idx) => (
                  <div key={idx} className="relative pl-6">
                    {idx !== leadUpdates.length - 1 && (
                      <div className="absolute left-2 top-6 bottom-0 w-px bg-slate-200" />
                    )}
                    <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-primary-600 border-4 border-white ring-4 ring-slate-100" />
                    
                    <div>
                      <div className="font-medium text-slate-900 mb-1">{update.field} Updated</div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                        <span className="line-through">{update.old_value}</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="font-medium text-success-600">{update.new_value}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-1">{update.reason}</p>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {update.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => navigate(`/dashboard/leads/${call.lead_id}`)}
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

