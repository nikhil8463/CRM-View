import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  Calendar,
  User,
  CheckCircle2,
  Edit,
  Trash2,
  Target,
  Building2,
  Clock,
  AlertCircle,
  FileText,
  Send,
  Loader2
} from 'lucide-react'
import { useTask, useUpdateTask, useCompleteTask, useDeleteTask } from '@/hooks/useTasks'
import toast from 'react-hot-toast'

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Fetch task data from backend
  const { data: taskData, isLoading, error } = useTask(id)
  const { mutate: updateTask } = useUpdateTask()
  const { mutate: completeTask, isPending: isCompleting } = useCompleteTask()
  const { mutate: deleteTask } = useDeleteTask()
  
  const task = taskData?.task
  
  // Safe data access with fallbacks
  const assignedToName = task?.assigned_user?.name || task?.assigned_to?.name || 'Unassigned'
  const assignedToEmail = task?.assigned_user?.email || task?.assigned_to?.email || ''
  const createdByName = task?.creator?.name || task?.created_by?.name || task?.created_by || 'Unknown'
  const leadName = task?.lead?.name || task?.lead_name || 'N/A'
  const leadCompany = task?.lead?.company || task?.lead_company || 'N/A'
  
  // Handle task completion with instant UI sync
  const handleComplete = () => {
    completeTask(id, {
      onSuccess: () => {
        navigate('/dashboard/tasks')
      }
    })
  }
  
  // Handle task deletion
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task?.title}"?`)) {
      deleteTask(id, {
        onSuccess: () => {
          navigate('/dashboard/tasks')
        }
      })
    }
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
  if (error || !task) {
    return (
      <div className="card bg-danger-50 border-danger-200">
        <p className="text-danger-700">Failed to load task details. Please try again.</p>
        <button 
          onClick={() => navigate('/dashboard/tasks')}
          className="btn btn-secondary mt-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Tasks
        </button>
      </div>
    )
  }
  
  /* Mock notes data removed - now using backend data
      {
        id: 2,
        author: 'Mike Wilson',
        text: 'Sent pre-demo materials to lead',
        created_at: '2026-02-14T16:45:00Z'
      }
    ]
  } */
  
  const priorityStyles = {
    high: 'bg-danger-100 text-danger-700',
    medium: 'bg-warning-100 text-warning-700',
    low: 'bg-slate-100 text-slate-700',
  }
  
  const statusStyles = {
    pending: 'bg-slate-100 text-slate-700',
    in_progress: 'bg-primary-100 text-primary-700',
    completed: 'bg-success-100 text-success-700',
    overdue: 'bg-danger-100 text-danger-700',
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />
      case 'in_progress':
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }
  
  const getDaysUntil = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    return `In ${diffDays} days`
  }
  
  /* Old mock handlers removed - now using backend hooks
  const handleComplete = () => {
    setIsCompleting(true)
    setTimeout(() => {
      setIsCompleting(false)
      navigate('/dashboard/tasks')
    }, 1000)
  }
  
  const handleDelete = () => {
    setTimeout(() => {
      setShowDeleteModal(false)
      navigate('/dashboard/tasks')
    }, 500)
  }
  */
  
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/tasks')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Tasks</span>
      </button>
      
      {/* Task Header Card */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">{task.title}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`badge ${priorityStyles[task.priority]} capitalize`}>
                    {task.priority} Priority
                  </span>
                  <span className={`flex items-center gap-1 badge ${statusStyles[task.status]}`}>
                    {getStatusIcon(task.status)}
                    {task.status === 'pending' ? 'Pending' : 
                     task.status === 'in_progress' ? 'In Progress' : 
                     task.status === 'completed' ? 'Completed' : 'Overdue'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Due Date</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(task.due_date).toLocaleDateString()}
                  </p>
                  <p className={`text-xs ${
                    task.status === 'overdue' ? 'text-danger-600' : 
                    getDaysUntil(task.due_date).includes('today') ? 'text-warning-600' :
                    'text-slate-500'
                  }`}>
                    {getDaysUntil(task.due_date)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Assigned To</p>
                  <p className="text-sm font-medium text-slate-900">{assignedToName}</p>
                  {assignedToEmail && (
                    <p className="text-xs text-slate-500">{assignedToEmail}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Created</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(task.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-500">by {createdByName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Last Updated</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(task.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {task.status !== 'completed' && (
              <button
                onClick={handleComplete}
                disabled={isCompleting}
                className="btn btn-primary"
              >
                {isCompleting ? (
                  <>
                    <Clock className="w-5 h-5 mr-2 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Mark Complete
                  </>
                )}
              </button>
            )}
            <button 
              onClick={() => navigate(`/dashboard/tasks/${id}/edit`)}
              className="btn btn-outline"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit Task
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-outline text-danger-600 border-danger-300 hover:bg-danger-50"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Description & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Description */}
          <div className="card">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              Task Description
            </h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {task.description}
              </p>
            </div>
          </div>
          
          {/* Notes Section */}
          <div className="card">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary-600" />
              Notes & Updates
            </h2>
            
            {/* Add Note Form */}
            <div className="mb-6 p-4 bg-slate-50 rounded-xl">
              <textarea
                placeholder="Add a note or update..."
                className="input w-full min-h-[100px] resize-none mb-3"
              />
              <button className="btn btn-primary btn-sm">
                <Send className="w-4 h-4 mr-2" />
                Add Note
              </button>
            </div>
            
            {/* Notes List */}
            <div className="space-y-4">
              {Array.isArray(task.notes) && task.notes.length > 0 ? (
                task.notes.map((note) => (
                  <div key={note.id} className="flex gap-3 pb-4 border-b border-slate-200 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-900">{note.author}</span>
                        <span className="text-xs text-slate-500">
                          {new Date(note.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700">{note.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No notes yet.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column - Lead & Campaign Info */}
        <div className="space-y-6">
          {/* Lead Reference */}
          {task.lead && (
            <div className="card">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary-600" />
                Lead Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Name</p>
                  <button
                    onClick={() => navigate(`/dashboard/leads/${task.lead_id || task.lead.id}`)}
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 group"
                  >
                    {leadName}
                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                
                {task.lead.title && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Position</p>
                    <p className="text-sm text-slate-900">{task.lead.title}</p>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Company</p>
                    <p className="text-sm text-slate-900">{leadCompany}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  {task.lead.email && (
                    <div className="text-sm">
                      <span className="text-slate-500">Email:</span>
                      <a href={`mailto:${task.lead.email}`} className="ml-2 text-primary-600 hover:text-primary-700">
                        {task.lead.email}
                      </a>
                    </div>
                  )}
                  {task.lead.phone && (
                    <div className="text-sm">
                      <span className="text-slate-500">Phone:</span>
                      <a href={`tel:${task.lead.phone}`} className="ml-2 text-primary-600 hover:text-primary-700">
                        {task.lead.phone}
                      </a>
                    </div>
                  )}
                  {task.lead.status && (
                    <div>
                      <span className="badge bg-success-100 text-success-700 capitalize">
                        {task.lead.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Campaign Reference */}
          {task.campaign && (
            <div className="card">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                Campaign
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Campaign Name</p>
                  <button
                    onClick={() => navigate(`/dashboard/campaigns/${task.campaign_id || task.campaign.id}`)}
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2 group"
                  >
                    {task.campaign.name}
                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                
                {task.campaign.type && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Type</p>
                    <p className="text-sm text-slate-900">{task.campaign.type}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-danger-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-danger-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Delete Task</h3>
                <p className="text-sm text-slate-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-slate-700 mb-6">
              Are you sure you want to delete this task? All associated data will be permanently removed.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 btn bg-danger-600 hover:bg-danger-700 text-white"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
