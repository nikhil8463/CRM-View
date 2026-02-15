import { Link } from 'react-router-dom'
import { ExternalLink, Phone, Mail, Sparkles } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function RecentLeads() {
  // Mock data - replace with actual API data
  const leads = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      campaign: 'Q1 Outreach',
      status: 'new',
      aiScore: 92,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@business.com',
      phone: '+1 (555) 234-5678',
      campaign: 'Product Launch',
      status: 'contacted',
      aiScore: 85,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'm.chen@enterprise.com',
      phone: '+1 (555) 345-6789',
      campaign: 'Webinar Follow',
      status: 'qualified',
      aiScore: 78,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
    {
      id: 4,
      name: 'Emma Williams',
      email: 'emma.w@startup.io',
      phone: '+1 (555) 456-7890',
      campaign: 'Summer Sale',
      status: 'new',
      aiScore: 88,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  ]
  
  const statusColors = {
    new: 'badge-primary',
    contacted: 'badge-warning',
    qualified: 'badge-success',
    lost: 'badge-danger',
  }
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success-600 bg-success-50'
    if (score >= 60) return 'text-warning-600 bg-warning-50'
    return 'text-danger-600 bg-danger-50'
  }
  
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
          <p className="text-sm text-gray-600 mt-1">Newest leads from all campaigns</p>
        </div>
        <Link to="/dashboard/leads" className="text-sm font-medium text-primary-600 hover:text-primary-700">
          View All →
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Contact</th>
              <th>Campaign</th>
              <th>Status</th>
              <th>AI Score</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <div>
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    <p className="text-sm text-gray-500">{lead.email}</p>
                  </div>
                </td>
                <td>
                  <div className="flex items-center space-x-2">
                    <a 
                      href={`mailto:${lead.email}`}
                      className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    <a 
                      href={`tel:${lead.phone}`}
                      className="p-1.5 text-gray-400 hover:text-success-600 hover:bg-success-50 rounded"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </td>
                <td>
                  <span className="text-sm text-gray-700">{lead.campaign}</span>
                </td>
                <td>
                  <span className={`badge ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-ai-600" />
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getScoreColor(lead.aiScore)}`}>
                      {lead.aiScore}%
                    </span>
                  </div>
                </td>
                <td>
                  <span className="text-sm text-gray-600">
                    {formatDistanceToNow(lead.createdAt, { addSuffix: true })}
                  </span>
                </td>
                <td>
                  <Link 
                    to={`/dashboard/leads/${lead.id}`}
                    className="p-1.5 text-gray-400 hover:text-primary-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
