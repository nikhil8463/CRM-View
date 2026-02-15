import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

/**
 * Conversion Funnel Chart Component
 * Shows the lead conversion funnel with stages and conversion rates
 */
export default function ConversionFunnel() {
  // Mock data - replace with actual API call
  const stages = [
    { name: 'Total Leads', count: 2543, percentage: 100, color: 'bg-primary-500' },
    { name: 'Qualified', count: 1526, percentage: 60, color: 'bg-primary-600' },
    { name: 'Contacted', count: 1018, percentage: 40, color: 'bg-primary-700' },
    { name: 'Engaged', count: 509, percentage: 20, color: 'bg-primary-800' },
    { name: 'Converted', count: 254, percentage: 10, color: 'bg-success-600' },
  ]
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="section-title">Conversion Funnel</h3>
          <p className="body-text text-slate-500 mt-1">Lead progression through stages</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900">10%</div>
          <div className="text-sm text-success-600 flex items-center justify-end">
            <TrendingUp className="w-4 h-4 mr-1" />
            +2.3% vs last month
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div key={stage.name} className="relative">
            {/* Stage Info */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-slate-700">{stage.name}</div>
                <div className="text-xs text-slate-500">{stage.count.toLocaleString()} leads</div>
              </div>
              <div className="text-sm font-semibold text-slate-900">{stage.percentage}%</div>
            </div>
            
            {/* Funnel Bar */}
            <div className="relative h-12 bg-slate-100 rounded-2xl overflow-hidden">
              <div 
                className={`h-full ${stage.color} transition-all duration-500 flex items-center justify-end pr-4`}
                style={{ width: `${stage.percentage}%` }}
              >
                <span className="text-white text-sm font-medium">
                  {stage.count.toLocaleString()}
                </span>
              </div>
            </div>
            
            {/* Drop-off indicator */}
            {index < stages.length - 1 && (
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                <TrendingDown className="w-3 h-3" />
                <span>
                  {Math.round(((stages[index].count - stages[index + 1].count) / stages[index].count) * 100)}% drop-off
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-slate-500 mb-1">Avg. Time to Convert</div>
            <div className="text-lg font-bold text-slate-900">14.5 days</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Best Stage</div>
            <div className="text-lg font-bold text-success-600">Qualified</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Bottleneck</div>
            <div className="text-lg font-bold text-warning-600">Contacted</div>
          </div>
        </div>
      </div>
    </div>
  )
}
