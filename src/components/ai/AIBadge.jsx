import { Sparkles, Info } from 'lucide-react'
import { useState } from 'react'

/**
 * AIBadge - Visual indicator for AI-powered actions
 * 
 * Usage:
 * <AIBadge type="routed" />
 * <AIBadge type="scored" tooltip="AI analyzed 12 data points" />
 * <AIBadge type="triggered" size="lg" />
 */

const AI_BADGE_CONFIGS = {
  routed: {
    label: 'AI Routed',
    gradient: 'from-purple-500 to-indigo-600',
    glowColor: 'shadow-purple-500/50',
    description: 'Automatically assigned by AI based on lead characteristics and agent availability'
  },
  scored: {
    label: 'AI Scored',
    gradient: 'from-indigo-500 to-purple-600',
    glowColor: 'shadow-indigo-500/50',
    description: 'Lead quality score calculated using AI analysis of multiple data points'
  },
  triggered: {
    label: 'AI Triggered Call',
    gradient: 'from-purple-600 to-pink-600',
    glowColor: 'shadow-purple-500/50',
    description: 'Automated call initiated by AI based on lead engagement signals'
  },
  updated: {
    label: 'AI Updated Status',
    gradient: 'from-indigo-600 to-blue-600',
    glowColor: 'shadow-indigo-500/50',
    description: 'Status automatically updated by AI based on lead behavior and interactions'
  },
  analyzed: {
    label: 'AI Analyzed',
    gradient: 'from-purple-500 to-pink-500',
    glowColor: 'shadow-purple-500/50',
    description: 'Content analyzed and categorized using AI natural language processing'
  },
  optimized: {
    label: 'AI Optimized',
    gradient: 'from-indigo-500 to-cyan-500',
    glowColor: 'shadow-indigo-500/50',
    description: 'Campaign settings optimized by AI for better performance'
  }
}

const SIZE_CONFIGS = {
  sm: {
    badge: 'px-2 py-1 text-xs',
    icon: 'w-3 h-3',
    glow: 'shadow-sm'
  },
  md: {
    badge: 'px-3 py-1.5 text-sm',
    icon: 'w-3.5 h-3.5',
    glow: 'shadow-md'
  },
  lg: {
    badge: 'px-4 py-2 text-base',
    icon: 'w-4 h-4',
    glow: 'shadow-lg'
  }
}

export default function AIBadge({ 
  type = 'scored', 
  size = 'md',
  tooltip = null,
  showIcon = true,
  animate = true,
  className = ''
}) {
  const [showTooltip, setShowTooltip] = useState(false)
  
  const config = AI_BADGE_CONFIGS[type]
  const sizeConfig = SIZE_CONFIGS[size]
  
  if (!config) {
    console.warn(`AIBadge: Unknown type "${type}"`)
    return null
  }
  
  const tooltipText = tooltip || config.description
  
  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* AI Badge */}
      <span 
        className={`
          inline-flex items-center gap-1.5 
          bg-gradient-to-r ${config.gradient}
          ${sizeConfig.badge}
          ${sizeConfig.glow} ${config.glowColor}
          text-white font-medium rounded-full
          ${animate ? 'animate-pulse-glow' : ''}
          ${className}
        `}
      >
        {showIcon && <Sparkles className={`${sizeConfig.icon} flex-shrink-0`} />}
        <span className="whitespace-nowrap">{config.label}</span>
      </span>
      
      {/* Tooltip */}
      {showTooltip && tooltipText && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 animate-fade-in">
          <div className="bg-slate-900 text-white text-xs rounded-lg p-3 shadow-xl">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">{tooltipText}</p>
            </div>
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Glow ring animation utility
export function AIGlowRing({ children, intensity = 'normal', className = '' }) {
  const intensityClasses = {
    subtle: 'ring-2 ring-purple-500/20 shadow-sm shadow-purple-500/20',
    normal: 'ring-2 ring-purple-500/40 shadow-md shadow-purple-500/30',
    strong: 'ring-4 ring-purple-500/60 shadow-lg shadow-purple-500/40'
  }
  
  return (
    <div className={`${intensityClasses[intensity]} rounded-xl transition-all duration-300 ${className}`}>
      {children}
    </div>
  )
}
