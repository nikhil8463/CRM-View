import { useState } from 'react'
import { 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Target,
  X,
  ChevronRight,
  Lightbulb,
  RotateCcw,
  Info
} from 'lucide-react'

/**
 * AIInsightCard - Display AI-generated suggestions and insights
 * 
 * Usage:
 * <AIInsightCard
 *   type="suggestion"
 *   title="Recommended Next Action"
 *   insights={[...]}
 *   onAction={(insight) => console.log(insight)}
 * />
 */

const INSIGHT_TYPES = {
  suggestion: {
    icon: Lightbulb,
    gradient: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  retry: {
    icon: RotateCcw,
    gradient: 'from-indigo-500 to-blue-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600'
  },
  scoring: {
    icon: Target,
    gradient: 'from-purple-600 to-pink-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  warning: {
    icon: AlertCircle,
    gradient: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  success: {
    icon: CheckCircle,
    gradient: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  }
}

const ACTION_ICONS = {
  call: Phone,
  email: Mail,
  sms: MessageSquare,
  schedule: Calendar,
  follow_up: TrendingUp,
  default: ChevronRight
}

export default function AIInsightCard({ 
  type = 'suggestion',
  title,
  subtitle,
  insights = [],
  scoringDetails = null,
  onAction = null,
  onDismiss = null,
  className = '',
  showPulse = true
}) {
  const [dismissed, setDismissed] = useState(false)
  
  if (dismissed) return null
  
  const config = INSIGHT_TYPES[type] || INSIGHT_TYPES.suggestion
  const IconComponent = config.icon
  
  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }
  
  const handleInsightClick = (insight) => {
    onAction?.(insight)
  }
  
  return (
    <div className={`
      relative overflow-hidden
      ${config.bgColor} ${config.borderColor}
      border-2 rounded-2xl p-6
      ${showPulse ? 'animate-pulse-glow-soft' : ''}
      ${className}
    `}>
      {/* Gradient Accent Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`} />
      
      {/* Dismiss Button */}
      {onDismiss && (
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
          <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          {subtitle && (
            <p className="text-sm text-slate-600">{subtitle}</p>
          )}
        </div>
      </div>
      
      {/* Scoring Details */}
      {scoringDetails && (
        <div className="mb-4 p-4 bg-white/50 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700">Score Breakdown</span>
            <span className={`text-2xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
              {scoringDetails.score}%
            </span>
          </div>
          
          <div className="space-y-2">
            {scoringDetails.factors?.map((factor, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-600">{factor.name}</span>
                  <span className="font-medium text-slate-900">{factor.value}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${config.gradient} transition-all duration-500`}
                    style={{ width: `${factor.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {scoringDetails.explanation && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  {scoringDetails.explanation}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Insights List */}
      {insights.length > 0 && (
        <div className="space-y-2">
          {insights.map((insight, idx) => {
            const ActionIcon = ACTION_ICONS[insight.action_type] || ACTION_ICONS.default
            
            return (
              <button
                key={idx}
                onClick={() => handleInsightClick(insight)}
                disabled={!onAction}
                className={`
                  w-full flex items-center justify-between gap-3
                  p-3 rounded-xl bg-white/70
                  border border-slate-200
                  ${onAction ? 'hover:bg-white hover:shadow-md hover:border-purple-300 cursor-pointer' : 'cursor-default'}
                  transition-all duration-200 group
                `}
              >
                <div className="flex items-start gap-3 flex-1 text-left">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${config.iconBg}
                    ${onAction ? 'group-hover:scale-110' : ''}
                    transition-transform duration-200
                  `}>
                    <ActionIcon className={`w-4 h-4 ${config.iconColor}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 mb-0.5">
                      {insight.title}
                    </p>
                    {insight.description && (
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {insight.description}
                      </p>
                    )}
                    {insight.confidence && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">Confidence:</span>
                        <div className="flex-1 max-w-[100px] bg-slate-200 rounded-full h-1 overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${config.gradient}`}
                            style={{ width: `${insight.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-700">{insight.confidence}%</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {onAction && (
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      )}
      
      {/* Empty State */}
      {insights.length === 0 && !scoringDetails && (
        <div className="text-center py-6">
          <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No insights available at this time</p>
        </div>
      )}
    </div>
  )
}

// Compact version for inline use
export function AIInsightInline({ 
  text, 
  icon: Icon = Sparkles,
  type = 'suggestion',
  className = '' 
}) {
  const config = INSIGHT_TYPES[type] || INSIGHT_TYPES.suggestion
  
  return (
    <div className={`
      inline-flex items-center gap-2 
      px-3 py-2 rounded-lg
      ${config.bgColor} ${config.borderColor} border
      ${className}
    `}>
      <Icon className={`w-4 h-4 ${config.iconColor} flex-shrink-0`} />
      <span className="text-sm text-slate-700">{text}</span>
    </div>
  )
}
