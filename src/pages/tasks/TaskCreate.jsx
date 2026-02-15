import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Users, ChevronDown, Check, Calendar, FileText, Flag } from 'lucide-react';
import { taskService } from '../../services/taskService';
import { leadService } from '../../services/leadService';
import { useUsers } from '../../hooks/useUsers';
import { getInitials } from '../../utils/helpers';
import SearchableSelect from '../../components/common/SearchableSelect';

const TaskCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dropdownRef = useRef(null);
  const leadDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);
  const priorityDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    lead_id: '', assigned_to: '', title: '', description: '', type: 'follow_up',
    priority: 'medium', status: 'pending', due_date: '', notes: ''
  });

  const [errors, setErrors] = useState({});
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLeadDropdown, setShowLeadDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const { data: usersData } = useUsers();
  const users = usersData?.users || [];
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await leadService.getLeads({ per_page: 100 });
        setLeads(response.leads || []);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };
    fetchLeads();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setShowUserDropdown(false);
      if (leadDropdownRef.current && !leadDropdownRef.current.contains(event.target)) setShowLeadDropdown(false);
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) setShowTypeDropdown(false);
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target)) setShowPriorityDropdown(false);
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) setShowStatusDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const createMutation = useMutation({
    mutationFn: (data) => taskService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      navigate('/dashboard/tasks');
    },
    onError: (error) => {
      if (error.response?.data?.errors) setErrors(error.response.data.errors);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      lead_id: parseInt(formData.lead_id), assigned_to: parseInt(formData.assigned_to), title: formData.title, type: formData.type,
      ...(formData.description && { description: formData.description }), ...(formData.priority && { priority: formData.priority }),
      ...(formData.status && { status: formData.status }), ...(formData.due_date && { due_date: formData.due_date }),
      ...(formData.notes && { notes: formData.notes })
    };
    createMutation.mutate(submitData);
  };

  const selectedUser = users.find(u => u.id === parseInt(formData.assigned_to));
  const selectedLead = leads.find(l => l.id === parseInt(formData.lead_id));

  const typeOptions = [
    { value: 'follow_up', label: 'Follow Up' }, { value: 'callback', label: 'Callback' },
    { value: 'meeting', label: 'Meeting' }, { value: 'email', label: 'Email' }, { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' }, { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }, { value: 'cancelled', label: 'Cancelled' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }, { value: 'urgent', label: 'Urgent' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/tasks')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Task</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add a new task to your CRM</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="card p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className={errors.title ? 'input-error' : 'input'} placeholder="Enter task title" required />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="input pl-10" placeholder="Add task description..." />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <SearchableSelect
                  label="Lead"
                  options={leads}
                  value={formData.lead_id}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, lead_id: value }))
                    if (errors.lead_id) setErrors(prev => ({ ...prev, lead_id: undefined }))
                  }}
                  placeholder="Select lead"
                  required={true}
                  showAvatar={false}
                  renderOption={(lead) => (
                    <div>
                      <div className="text-sm font-medium text-slate-900">{lead.name}</div>
                      {lead.company && <div className="text-xs text-slate-500">{lead.company}</div>}
                    </div>
                  )}
                />
                {errors.lead_id && <p className="mt-1 text-sm text-red-500">{errors.lead_id[0]}</p>}
              </div>

              <div>
                <SearchableSelect
                  label="Assign To"
                  options={users}
                  value={formData.assigned_to}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, assigned_to: value }))
                    if (errors.assigned_to) setErrors(prev => ({ ...prev, assigned_to: undefined }))
                  }}
                  placeholder="Select user"
                  required={true}
                  showAvatar={true}
                />
                {errors.assigned_to && <p className="mt-1 text-sm text-red-500">{errors.assigned_to[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type <span className="text-red-500">*</span></label>
                <div className="relative" ref={typeDropdownRef}>
                  <button type="button" onClick={() => setShowTypeDropdown(!showTypeDropdown)} className={`input w-full text-left flex items-center justify-between ${errors.type ? 'input-error' : ''}`}>
                    <span className="text-gray-900 dark:text-white">{typeOptions.find(t => t.value === formData.type)?.label || 'Select type'}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>
                  {showTypeDropdown && (
                    <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                      {typeOptions.map(option => (
                        <div key={option.value} onClick={() => { setFormData(prev => ({ ...prev, type: option.value })); setShowTypeDropdown(false); if (errors.type) setErrors(prev => ({ ...prev, type: undefined })); }} className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between">
                          <span className="text-gray-900 dark:text-white">{option.label}</span>
                          {formData.type === option.value && <Check className="w-5 h-5 text-primary-600" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                <div className="relative" ref={priorityDropdownRef}>
                  <button type="button" onClick={() => setShowPriorityDropdown(!showPriorityDropdown)} className="input w-full text-left flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white">{priorityOptions.find(p => p.value === formData.priority)?.label || 'Select priority'}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>
                  {showPriorityDropdown && (
                    <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                      {priorityOptions.map(option => (
                        <div key={option.value} onClick={() => { setFormData(prev => ({ ...prev, priority: option.value })); setShowPriorityDropdown(false); }} className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between">
                          <span className="text-gray-900 dark:text-white">{option.label}</span>
                          {formData.priority === option.value && <Check className="w-5 h-5 text-primary-600" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <div className="relative" ref={statusDropdownRef}>
                  <button type="button" onClick={() => setShowStatusDropdown(!showStatusDropdown)} className="input w-full text-left flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white">{statusOptions.find(s => s.value === formData.status)?.label || 'Select status'}</span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>
                  {showStatusDropdown && (
                    <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                      {statusOptions.map(option => (
                        <div key={option.value} onClick={() => { setFormData(prev => ({ ...prev, status: option.value })); setShowStatusDropdown(false); }} className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between">
                          <span className="text-gray-900 dark:text-white">{option.label}</span>
                          {formData.status === option.value && <Check className="w-5 h-5 text-primary-600" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className="input pl-10" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="input pl-10" placeholder="Add any additional notes..." />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={() => navigate('/dashboard/tasks')} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <Save className="w-5 h-5" />
              {createMutation.isPending ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskCreate;
