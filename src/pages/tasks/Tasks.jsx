import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter,
  CheckSquare,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Users,
  Target,
  Loader2
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useTasks, useCompleteTask, useDeleteTask } from '@/hooks/useTasks'
import toast from 'react-hot-toast'

export default function Tasks() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [assignedFilter, setAssignedFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [activeView, setActiveView] = useState('all')
  
  // Fetch tasks from backend with React Query
  const { data: tasksData, isLoading, error } = useTasks({
    search: searchQuery,
    priority: priorityFilter !== 'all' ? priorityFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    assigned_to: assignedFilter !== 'all' ? assignedFilter : undefined,
  })
  const { mutate: completeTask } = useCompleteTask()
  const { mutate: deleteTask } = useDeleteTask()
  
  // Extract tasks from response - Laravel may return {tasks: [...]} or {data: [...]}
  const allTasks = tasksData?.tasks || tasksData?.data || []
  
  // Extract unique users for filter
  const users = [...new Set(allTasks.map(t => t.assigned_user?.name).filter(Boolean))]
  
  // Handle task completion with instant UI sync
  const handleCompleteTask = (taskId, e) => {
    e.stopPropagation()
    completeTask(taskId)
  }
  
  // Handle task deletion
  const handleDeleteTask = (taskId, taskTitle, e) => {
    e.stopPropagation()
    if (window.confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
      deleteTask(taskId)
    }
  }
  
  // Priority badge styles
  const priorityStyles = {
    high: 'bg-danger-100 text-danger-700',
    medium: 'bg-warning-100 text-warning-700',
    low: 'bg-slate-100 text-slate-700',
  }
  
  // Status badge styles
  const statusStyles = {
    pending: 'bg-slate-100 text-slate-700',
    in_progress: 'bg-primary-100 text-primary-700',
    completed: 'bg-success-100 text-success-700',
    overdue: 'bg-danger-100 text-danger-700',
  }
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckSquare className="w-4 h-4" />
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />
      case 'in_progress':
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }
  
  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed',
      overdue: 'Overdue'
    }
    return labels[status] || status
  }
  
  const isOverdue = (dueDate, status) => {
    if (status === 'completed') return false
    const today = new Date()
    const due = new Date(dueDate)
    return due < today
  }
  
  // Update status to overdue if past due date
  const tasksWithStatus = allTasks.map(task => ({
    ...task,
    status: isOverdue(task.due_date, task.status) ? 'overdue' : task.status
  }))
  
  // Apply view filter
  let viewFilteredTasks = tasksWithStatus
  if (activeView === 'my') {
    viewFilteredTasks = tasksWithStatus.filter(t => t.assigned_to === user?.name)
  } else if (activeView === 'overdue') {
    viewFilteredTasks = tasksWithStatus.filter(t => t.status === 'overdue')
  }
  
  // Apply other filters
  const filteredTasks = viewFilteredTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.lead_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    const matchesAssigned = assignedFilter === 'all' || task.assigned_to === assignedFilter
    return matchesSearch && matchesPriority && matchesStatus && matchesAssigned
  })
  
  // Calculate stats
  const totalTasks = tasksWithStatus.length
  const myTasks = tasksWithStatus.filter(t => t.assigned_to === user?.name).length
  const overdueTasks = tasksWithStatus.filter(t => t.status === 'overdue').length
  const completedTasks = tasksWithStatus.filter(t => t.status === 'completed').length
  
  const getDaysUntil = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    return `${diffDays} days left`
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="body-text text-slate-600 mt-2">Manage your tasks and assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/dashboard/tasks/create')}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Task
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">All Tasks</p>
              <p className="text-2xl font-bold text-slate-900">{totalTasks}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">My Tasks</p>
              <p className="text-2xl font-bold text-slate-900">{myTasks}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success-100 flex items-center justify-center">
              <User className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Overdue</p>
              <p className="text-2xl font-bold text-slate-900">{overdueTasks}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-danger-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-danger-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-slate-900">{completedTasks}</p>
              <p className="text-xs text-success-600 mt-1">
                {((completedTasks / totalTasks) * 100).toFixed(0)}% completion rate
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-success-100 flex items-center justify-center">
              <Target className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* View Tabs */}
      <div className="card">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveView('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'all'
                ? 'bg-primary-100 text-primary-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Tasks
            <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs">{totalTasks}</span>
          </button>
          <button
            onClick={() => setActiveView('my')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'my'
                ? 'bg-primary-100 text-primary-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            My Tasks
            <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs">{myTasks}</span>
          </button>
          <button
            onClick={() => setActiveView('overdue')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'overdue'
                ? 'bg-primary-100 text-primary-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertCircle className="w-4 h-4 inline mr-2" />
            Overdue Tasks
            <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs">{overdueTasks}</span>
          </button>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks or leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>
        
        {/* Filter Options */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-200">
            {/* Priority Filter */}
            <div>
              <label className="label-text mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="label-text mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            
            {/* Assigned User Filter */}
            <div>
              <label className="label-text mb-2">Assigned To</label>
              <select
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
                className="input w-full"
              >
                <option value="all">All Users</option>
                {users.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* Tasks Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Title</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Lead</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Campaign</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Due Date</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Priority</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Assigned To</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* Loading State */}
              {isLoading && (
                <tr>
                  <td colSpan="8" className="p-8 text-center">
                    <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
                  </td>
                </tr>
              )}
              
              {/* Error State */}
              {error && (
                <tr>
                  <td colSpan="8" className="p-8">
                    <div className="text-center text-danger-700">
                      Failed to load tasks. Please try again.
                    </div>
                  </td>
                </tr>
              )}
              
              {/* Data Rows */}
              {!isLoading && !error && filteredTasks.map((task) => (
                <tr 
                  key={task.id}
                  onClick={() => navigate(`/dashboard/tasks/${task.id}`)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{task.title}</div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{task.lead?.name || task.lead_name}</div>
                      <div className="text-xs text-slate-500">{task.lead?.company || task.lead_company}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-700">{task.campaign?.name || task.campaign || '-'}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-slate-900">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(task.due_date).toLocaleDateString()}
                      </div>
                      <div className={`text-xs mt-1 ${
                        task.status === 'overdue' ? 'text-danger-600' : 
                        getDaysUntil(task.due_date).includes('today') ? 'text-warning-600' :
                        'text-slate-500'
                      }`}>
                        {getDaysUntil(task.due_date)}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`badge ${priorityStyles[task.priority]} capitalize`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="text-sm text-slate-700">{task.assigned_user?.name || task.assigned_to || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1 badge ${statusStyles[task.status]}`}>
                      {getStatusIcon(task.status)}
                      {getStatusLabel(task.status)}
                    </span>
                  </td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {task.status !== 'completed' && (
                        <button
                          onClick={(e) => handleCompleteTask(task.id, e)}
                          className="btn btn-sm btn-success"
                          title="Mark as complete"
                        >
                          <CheckSquare className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => handleDeleteTask(task.id, task.title, e)}
                        className="btn btn-sm btn-outline text-danger-600 hover:bg-danger-50"
                        title="Delete task"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <CheckSquare className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No tasks found</h3>
            <p className="text-slate-600">
              {searchQuery || priorityFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'No tasks available'}
            </p>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {filteredTasks.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {filteredTasks.length} of {viewFilteredTasks.length} tasks
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm" disabled>Previous</button>
            <button className="btn btn-outline btn-sm">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}

