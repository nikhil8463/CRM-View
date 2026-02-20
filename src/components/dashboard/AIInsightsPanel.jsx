import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, AlertCircle, Target, Brain, Loader2 } from 'lucide-react'
import apiClient from '@/services/apiClient'

/**
 * AI Insights Panel Component
 * Shows AI-powered recommendations and alerts for admins
 */
export default function AIInsightsPanel() {
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAIInsights()
  }, [])

  const fetchAIInsights = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch lead distribution from AI service
      const response = await apiClient.get('/ai/insights/lead-distribution')
      
      if (response.data.success) {
        setInsights(response.data)
      }
    } catch (err) {
      console.error('Error fetching AI insights:', err)
      setError('Unable to load AI insights')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai-600 to-primary-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="section-title">AI Insights</h3>
            <p className="text-xs text-slate-500">Powered by LangChain</p>
          </div>
        </div>
        <div className="text-center py-8">
          <AlertCircle className="w-8 h-8 text-warning-500 mx-auto mb-2" />
          <p className="text-sm text-slate-600">{error}</p>
          <button 
            onClick={fetchAIInsights}
            className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const distribution = insights?.distribution || {}
  const leadScoring = [
    { range: '80-100', label: 'Hot (A)', count: distribution.tier_a || 0, tier: 'a', color: 'bg-danger-500' },
    { range: '60-79', label: 'Warm (B)', count: distribution.tier_b || 0, tier: 'b', color: 'bg-warning-500' },
    { range: '40-59', label: 'Cool (C)', count: distribution.tier_c || 0, tier: 'c', color: 'bg-primary-500' },
    { range: '0-39', label: 'Cold (D)', count: distribution.tier_d || 0, tier: 'd', color: 'bg-slate-400' },
  ]

  const totalLeads = leadScoring.reduce((sum, item) => sum + item.count, 0)
  
  // Calculate percentages
  leadScoring.forEach(item => {
    item.percentage = totalLeads > 0 ? Math.round((item.count / totalLeads) * 100) : 0
  })
  
  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ai-600 to-primary-600 flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="section-title">AI Insights</h3>
          <p className="text-xs text-slate-500">Powered by LangChain & OpenAI</p>
        </div>
        <button 
          onClick={fetchAIInsights}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
        >
          Refresh
        </button>
      </div>
      
      {/* Lead Scoring Distribution */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-success-600" />
          <h4 className="text-sm font-semibold text-slate-900">AI Lead Score Distribution</h4>
        </div>
        
        {totalLeads === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No leads have been scored yet</p>
            <p className="text-xs text-slate-400 mt-1">AI will automatically score new leads</p>
          </div>
        ) : (
          <>
            {/* Horizontal Bar Chart */}
            <div className="mb-4">
              <div className="flex h-10 rounded-xl overflow-hidden shadow-sm">
                {leadScoring.filter(s => s.count > 0).map((score) => (
                  <div
                    key={score.range}
                    className={`${score.color} flex items-center justify-center text-xs font-semibold text-white transition-all hover:opacity-90 cursor-pointer`}
                    style={{ width: `${score.percentage}%` }}
                    title={`${score.label}: ${score.count} leads (${score.percentage}%)`}
                  >
                    {score.percentage > 8 && (
                      <span className="px-2">{score.count}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-3">
              {leadScoring.map((score) => (
                <div key={score.range} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className={`w-4 h-4 rounded ${score.color} shadow-sm`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{score.label}</div>
                    <div className="text-xs text-slate-500">
                      {score.count} leads ({score.percentage}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-slate-900">{totalLeads}</div>
                  <div className="text-xs text-slate-500">Total Scored</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-danger-600">
                    {distribution.tier_a || 0}
                  </div>
                  <div className="text-xs text-slate-500">Hot Leads</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">
                    {insights?.average_score ? Math.round(insights.average_score) : 0}
                  </div>
                  <div className="text-xs text-slate-500">Avg Score</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* AI Status Footer */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-success-600">
            <div className="w-2 h-2 rounded-full bg-success-600 animate-pulse" />
            <span>AI Analysis Active</span>
          </div>
          <span className="text-slate-500">
            {insights?.updated_at ? `Updated ${new Date(insights.updated_at).toLocaleTimeString()}` : 'Just now'}
          </span>
        </div>
      </div>
    </div>
  )
}
