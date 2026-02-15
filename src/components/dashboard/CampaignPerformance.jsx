import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function CampaignPerformance() {
  // Mock data - replace with actual API data
  const data = [
    { name: 'Q1 Outreach', leads: 450, converted: 120, aiScore: 85 },
    { name: 'Summer Sale', leads: 380, converted: 95, aiScore: 78 },
    { name: 'Product Launch', leads: 520, converted: 156, aiScore: 92 },
    { name: 'Webinar Follow', leads: 290, converted: 87, aiScore: 88 },
    { name: 'Referral Prog', leads: 410, converted: 143, aiScore: 90 },
  ]
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="section-title">Leads per Campaign</h3>
          <p className="body-text text-slate-500 mt-1">Lead generation and conversion rates</p>
        </div>
        <select className="input py-2 px-3 text-sm">
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>This year</option>
        </select>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
            />
            <Bar dataKey="leads" fill="#6366f1" name="Total Leads" radius={[8, 8, 0, 0]} />
            <Bar dataKey="converted" fill="#10b981" name="Converted" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
