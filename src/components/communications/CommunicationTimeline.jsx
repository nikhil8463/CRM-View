import { useState } from 'react'
import { 
  Phone,
  Mail,
  MessageSquare,
  FileText,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Volume2,
  Sparkles,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Smile,
  Meh,
  Frown
} from 'lucide-react'

export default function CommunicationTimeline({ communications = [] }) {
  const [expandedItems, setExpandedItems] = useState(new Set())
  const [playingAudio, setPlayingAudio] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'AI_CALL':
      case 'MANUAL_CALL':
        return <Phone className="w-5 h-5" />
      case 'EMAIL':
        return <Mail className="w-5 h-5" />
      case 'WHATSAPP':
        return <MessageSquare className="w-5 h-5" />
      case 'NOTE':
        return <FileText className="w-5 h-5" />
      case 'STATUS_CHANGE':
        return <RefreshCw className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'AI_CALL':
        return 'bg-purple-100 text-purple-600 border-purple-200'
      case 'MANUAL_CALL':
        return 'bg-primary-100 text-primary-600 border-primary-200'
      case 'EMAIL':
        return 'bg-blue-100 text-blue-600 border-blue-200'
      case 'WHATSAPP':
        return 'bg-success-100 text-success-600 border-success-200'
      case 'NOTE':
        return 'bg-slate-100 text-slate-600 border-slate-200'
      case 'STATUS_CHANGE':
        return 'bg-warning-100 text-warning-600 border-warning-200'
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200'
    }
  }

  const getTypeBadge = (type) => {
    const labels = {
      AI_CALL: 'AI Call',
      MANUAL_CALL: 'Manual Call',
      EMAIL: 'Email',
      WHATSAPP: 'WhatsApp',
      NOTE: 'Note',
      STATUS_CHANGE: 'Status Change'
    }
    return labels[type] || type
  }

  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'success':
      case 'answered':
        return <CheckCircle className="w-4 h-4" />
      case 'no_answer':
      case 'voicemail':
        return <AlertCircle className="w-4 h-4" />
      case 'failed':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getOutcomeBadge = (outcome) => {
    const styles = {
      success: 'bg-success-100 text-success-700',
      answered: 'bg-success-100 text-success-700',
      no_answer: 'bg-warning-100 text-warning-700',
      voicemail: 'bg-warning-100 text-warning-700',
      failed: 'bg-danger-100 text-danger-700',
      busy: 'bg-slate-100 text-slate-700'
    }
    return styles[outcome] || 'bg-slate-100 text-slate-700'
  }

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="w-5 h-5 text-success-600" />
      case 'neutral':
        return <Meh className="w-5 h-5 text-slate-600" />
      case 'negative':
        return <Frown className="w-5 h-5 text-danger-600" />
      default:
        return null
    }
  }

  const getSentimentLabel = (sentiment) => {
    const labels = {
      positive: 'Positive',
      neutral: 'Neutral',
      negative: 'Negative'
    }
    return labels[sentiment] || sentiment
  }

  const filteredCommunications = activeFilter === 'all' 
    ? communications 
    : communications.filter(c => {
        if (activeFilter === 'calls') return c.type === 'AI_CALL' || c.type === 'MANUAL_CALL'
        if (activeFilter === 'emails') return c.type === 'EMAIL'
        if (activeFilter === 'whatsapp') return c.type === 'WHATSAPP'
        if (activeFilter === 'notes') return c.type === 'NOTE'
        return true
      })

  const filterCounts = {
    all: communications.length,
    calls: communications.filter(c => c.type === 'AI_CALL' || c.type === 'MANUAL_CALL').length,
    emails: communications.filter(c => c.type === 'EMAIL').length,
    whatsapp: communications.filter(c => c.type === 'WHATSAPP').length,
    notes: communications.filter(c => c.type === 'NOTE').length
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-primary-100 text-primary-700'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Activity
          <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs">{filterCounts.all}</span>
        </button>
        <button
          onClick={() => setActiveFilter('calls')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeFilter === 'calls'
              ? 'bg-primary-100 text-primary-700'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Phone className="w-4 h-4 inline mr-2" />
          Calls
          <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs">{filterCounts.calls}</span>
        </button>
        <button
          onClick={() => setActiveFilter('emails')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeFilter === 'emails'
              ? 'bg-primary-100 text-primary-700'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4 inline mr-2" />
          Emails
          <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs">{filterCounts.emails}</span>
        </button>
        <button
          onClick={() => setActiveFilter('whatsapp')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeFilter === 'whatsapp'
              ? 'bg-primary-100 text-primary-700'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          WhatsApp
          <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs">{filterCounts.whatsapp}</span>
        </button>
        <button
          onClick={() => setActiveFilter('notes')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeFilter === 'notes'
              ? 'bg-primary-100 text-primary-700'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Notes
          <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs">{filterCounts.notes}</span>
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredCommunications.map((item) => {
          const isExpanded = expandedItems.has(item.id)
          const isAICall = item.type === 'AI_CALL'
          
          return (
            <div key={item.id} className="relative">
              <div className={`bg-white rounded-xl border-2 ${getTypeColor(item.type)} overflow-hidden transition-all`}>
                {/* Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleExpanded(item.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-lg ${getTypeColor(item.type)} flex items-center justify-center flex-shrink-0`}>
                      {getTypeIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900">{item.title}</h3>
                          <span className={`badge text-xs ${getTypeColor(item.type)}`}>
                            {getTypeBadge(item.type)}
                          </span>
                          {item.outcome && (
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getOutcomeBadge(item.outcome)}`}>
                              {getOutcomeIcon(item.outcome)}
                              <span className="capitalize">{item.outcome.replace('_', ' ')}</span>
                            </span>
                          )}
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 transition-colors">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.timestamp}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {item.created_by}
                        </span>
                        {item.duration && (
                          <span className="flex items-center gap-1">
                            <Volume2 className="w-3 h-3" />
                            {item.duration}
                          </span>
                        )}
                      </div>

                      {/* Preview Text (collapsed) */}
                      {!isExpanded && item.preview && (
                        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{item.preview}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4 border-t border-slate-200">
                    {/* Main Content */}
                    {item.content && (
                      <div className="pt-4">
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {item.content}
                        </p>
                      </div>
                    )}

                    {/* AI Call Specific Content */}
                    {isAICall && (
                      <div className="space-y-4">
                        {/* Recording Player */}
                        {item.recording_url && (
                          <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <button 
                                className="w-10 h-10 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPlayingAudio(playingAudio === item.id ? null : item.id)
                                }}
                              >
                                {playingAudio === item.id ? (
                                  <Pause className="w-5 h-5 text-white" />
                                ) : (
                                  <Play className="w-5 h-5 text-white ml-0.5" />
                                )}
                              </button>
                              <div className="flex-1">
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-primary-600 w-1/3"></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                  <span>1:24</span>
                                  <span>{item.duration}</span>
                                </div>
                              </div>
                              <button className="text-slate-400 hover:text-slate-600">
                                <Volume2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Sentiment Indicator */}
                        {item.sentiment && (
                          <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3">
                            {getSentimentIcon(item.sentiment)}
                            <div>
                              <div className="text-xs text-slate-500 mb-0.5">Sentiment</div>
                              <div className="text-sm font-medium text-slate-900">
                                {getSentimentLabel(item.sentiment)}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* AI Summary */}
                        {item.ai_summary && (
                          <div className="bg-gradient-to-br from-purple-50 to-primary-50 rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center gap-2 mb-3">
                              <Sparkles className="w-5 h-5 text-primary-600" />
                              <h4 className="font-semibold text-slate-900">AI Summary</h4>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">{item.ai_summary}</p>
                          </div>
                        )}

                        {/* Transcript Preview */}
                        {item.transcript && (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-2">Transcript</h4>
                            <div className="bg-slate-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                              <div className="space-y-3 text-sm">
                                {item.transcript.map((line, idx) => (
                                  <div key={idx} className="flex gap-3">
                                    <span className="font-medium text-slate-600 min-w-[60px]">
                                      {line.speaker}:
                                    </span>
                                    <span className="text-slate-700">{line.text}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Key Points */}
                        {item.key_points && item.key_points.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-2">Key Points</h4>
                            <ul className="space-y-2">
                              {item.key_points.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                  <CheckCircle className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredCommunications.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No communications yet</h3>
          <p className="text-slate-600">Start engaging with this lead</p>
        </div>
      )}
    </div>
  )
}
