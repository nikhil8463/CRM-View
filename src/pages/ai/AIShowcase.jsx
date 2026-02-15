import { useState } from 'react'
import AIBadge, { AIGlowRing } from '@/components/ai/AIBadge'
import AIInsightCard, { AIInsightInline } from '@/components/ai/AIInsightCard'
import { 
  Sparkles, 
  Phone, 
  Mail, 
  TrendingUp,
  Calendar,
  User,
  Target
} from 'lucide-react'

export default function AIShowcase() {
  const [selectedInsight, setSelectedInsight] = useState(null)
  
  // Mock data for AI insights
  const suggestedActions = [
    {
      id: 1,
      title: 'Call lead within 2 hours',
      description: 'Lead showed high engagement with pricing page. Strike while interest is hot.',
      action_type: 'call',
      confidence: 92
    },
    {
      id: 2,
      title: 'Send personalized follow-up email',
      description: 'Lead downloaded whitepaper. Send related case study to nurture interest.',
      action_type: 'email',
      confidence: 85
    },
    {
      id: 3,
      title: 'Schedule demo for next week',
      description: 'Lead profile matches ideal customer. They are likely ready for a demo.',
      action_type: 'schedule',
      confidence: 78
    }
  ]
  
  const retrySuggestions = [
    {
      id: 1,
      title: 'Retry call at 2:00 PM today',
      description: 'Previous calls to this lead succeeded between 2-4 PM on weekdays.',
      action_type: 'call',
      confidence: 88
    },
    {
      id: 2,
      title: 'Try SMS outreach instead',
      description: 'Lead has not answered 3 calls but opened previous SMS messages.',
      action_type: 'sms',
      confidence: 75
    }
  ]
  
  const scoringDetails = {
    score: 87,
    factors: [
      { name: 'Engagement Level', value: 92 },
      { name: 'Company Fit', value: 85 },
      { name: 'Budget Signals', value: 78 },
      { name: 'Timeline Urgency', value: 90 },
      { name: 'Decision Authority', value: 82 }
    ],
    explanation: 'This lead shows exceptional fit based on company size, industry, and recent engagement with high-intent content. Budget signals and timeline indicators suggest active buying process.'
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="page-title flex items-center gap-3">
          <Sparkles className="w-7 h-7 text-purple-600" />
          AI Visual Language Showcase
        </h1>
        <p className="body-text text-slate-600 mt-2">
          Explore AI-powered indicators, badges, and insight cards used throughout the CRM
        </p>
      </div>
      
      {/* AI Badges Section */}
      <div className="card">
        <h2 className="section-title mb-4">AI Badges & Indicators</h2>
        <p className="text-sm text-slate-600 mb-6">
          Visual indicators that show when AI has taken action. Hover for explanations.
        </p>
        
        <div className="space-y-6">
          {/* All Badge Sizes */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Badge Sizes
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <AIBadge type="scored" size="sm" />
              <AIBadge type="scored" size="md" />
              <AIBadge type="scored" size="lg" />
            </div>
          </div>
          
          {/* All Badge Types */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Badge Types
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <AIBadge type="routed" />
              <AIBadge type="scored" />
              <AIBadge type="triggered" />
              <AIBadge type="updated" />
              <AIBadge type="analyzed" />
              <AIBadge type="optimized" />
            </div>
          </div>
          
          {/* Without Animation */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Without Pulse Animation
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <AIBadge type="scored" animate={false} />
              <AIBadge type="triggered" animate={false} />
            </div>
          </div>
          
          {/* Without Icon */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Text Only (No Icon)
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <AIBadge type="scored" showIcon={false} />
              <AIBadge type="routed" showIcon={false} />
            </div>
          </div>
          
          {/* Custom Tooltips */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Custom Tooltip Messages
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <AIBadge 
                type="scored" 
                tooltip="This lead scored 87% based on 12 data points including engagement, company fit, and budget signals." 
              />
              <AIBadge 
                type="triggered" 
                tooltip="AI initiated this call at optimal time based on lead's timezone and previous engagement patterns." 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Glow Ring Section */}
      <div className="card">
        <h2 className="section-title mb-4">AI Glow Ring</h2>
        <p className="text-sm text-slate-600 mb-6">
          Highlight AI-enhanced content with glowing borders
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AIGlowRing intensity="subtle">
            <div className="bg-white p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Subtle Glow</h3>
              </div>
              <p className="text-sm text-slate-600">For secondary AI features</p>
            </div>
          </AIGlowRing>
          
          <AIGlowRing intensity="normal">
            <div className="bg-white p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-slate-900">Normal Glow</h3>
              </div>
              <p className="text-sm text-slate-600">For standard AI content</p>
            </div>
          </AIGlowRing>
          
          <AIGlowRing intensity="strong">
            <div className="bg-white p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-slate-900">Strong Glow</h3>
              </div>
              <p className="text-sm text-slate-600">For critical AI insights</p>
            </div>
          </AIGlowRing>
        </div>
      </div>
      
      {/* AI Insight Cards Section */}
      <div className="card">
        <h2 className="section-title mb-4">AI Insight Cards</h2>
        <p className="text-sm text-slate-600 mb-6">
          Rich cards displaying AI-generated recommendations and analysis
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Suggested Actions */}
          <AIInsightCard
            type="suggestion"
            title="Recommended Next Actions"
            subtitle="AI analyzed lead behavior and suggests these actions"
            insights={suggestedActions}
            onAction={(insight) => setSelectedInsight(insight)}
            onDismiss={() => console.log('Dismissed')}
          />
          
          {/* Retry Suggestions */}
          <AIInsightCard
            type="retry"
            title="Smart Retry Suggestions"
            subtitle="Based on historical patterns for this lead"
            insights={retrySuggestions}
            onAction={(insight) => setSelectedInsight(insight)}
          />
          
          {/* Lead Scoring */}
          <AIInsightCard
            type="scoring"
            title="AI Lead Score Breakdown"
            subtitle="Detailed analysis of lead quality"
            scoringDetails={scoringDetails}
            showPulse={true}
          />
          
          {/* Warning Type */}
          <AIInsightCard
            type="warning"
            title="Action Required"
            subtitle="Lead at risk of going cold"
            insights={[
              {
                id: 1,
                title: 'Follow up within 24 hours',
                description: 'No contact in 5 days. Lead engagement dropping.',
                action_type: 'follow_up',
                confidence: 95
              }
            ]}
            onAction={(insight) => setSelectedInsight(insight)}
          />
          
          {/* Success Type */}
          <AIInsightCard
            type="success"
            title="High-Value Opportunity"
            subtitle="This lead is ready to convert"
            insights={[
              {
                id: 1,
                title: 'Schedule demo immediately',
                description: 'All buying signals present. Decision maker engaged.',
                action_type: 'schedule',
                confidence: 98
              }
            ]}
            showPulse={false}
          />
          
          {/* Empty State */}
          <AIInsightCard
            type="suggestion"
            title="No Insights Available"
            subtitle="Check back later for AI recommendations"
            insights={[]}
          />
        </div>
      </div>
      
      {/* Inline Insights Section */}
      <div className="card">
        <h2 className="section-title mb-4">Inline AI Insights</h2>
        <p className="text-sm text-slate-600 mb-6">
          Compact inline indicators for embedding in other components
        </p>
        
        <div className="flex flex-wrap gap-3">
          <AIInsightInline 
            text="AI suggests calling between 2-4 PM" 
            icon={Phone}
            type="suggestion"
          />
          <AIInsightInline 
            text="High conversion probability detected" 
            icon={TrendingUp}
            type="success"
          />
          <AIInsightInline 
            text="Lead may need re-engagement" 
            icon={Mail}
            type="warning"
          />
          <AIInsightInline 
            text="Optimal time for follow-up" 
            icon={Calendar}
            type="suggestion"
          />
        </div>
      </div>
      
      {/* Usage in Context Section */}
      <div className="card">
        <h2 className="section-title mb-4">Usage in Context</h2>
        <p className="text-sm text-slate-600 mb-6">
          Examples of AI indicators in real component layouts
        </p>
        
        {/* Lead Card Example */}
        <AIGlowRing intensity="normal" className="mb-4">
          <div className="bg-white p-6 rounded-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-slate-900">John Smith</h3>
                  <AIBadge type="scored" size="sm" />
                  <AIBadge type="routed" size="sm" />
                </div>
                <p className="text-sm text-slate-600">Tech Solutions Inc. • CEO</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600 mb-1">87%</div>
                <p className="text-xs text-slate-500">AI Score</p>
              </div>
            </div>
            
            <AIInsightInline 
              text="High engagement - call within 2 hours" 
              icon={Phone}
              type="success"
              className="w-full"
            />
          </div>
        </AIGlowRing>
        
        {/* Campaign Card Example */}
        <div className="bg-white border-2 border-slate-200 p-6 rounded-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-slate-900">Q1 Product Launch</h3>
                <AIBadge type="optimized" size="sm" animate={false} />
              </div>
              <p className="text-sm text-slate-600">Enterprise SaaS Campaign</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Leads</p>
              <p className="text-xl font-bold text-slate-900">284</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Conversion</p>
              <p className="text-xl font-bold text-success-600">12.5%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">AI Score</p>
              <p className="text-xl font-bold text-purple-600">92%</p>
            </div>
          </div>
          
          <AIInsightInline 
            text="Campaign performing 23% above benchmark" 
            icon={TrendingUp}
            type="success"
            className="w-full"
          />
        </div>
      </div>
      
      {/* Selected Insight Display */}
      {selectedInsight && (
        <div className="card bg-purple-50 border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-900 mb-1">
                Action Selected
              </p>
              <p className="text-lg font-bold text-slate-900 mb-2">
                {selectedInsight.title}
              </p>
              <p className="text-sm text-slate-600">
                {selectedInsight.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedInsight(null)}
              className="text-purple-600 hover:text-purple-800"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
