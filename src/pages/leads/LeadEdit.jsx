import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Save, 
  Users, 
  ChevronDown, 
  Check,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  FileText,
  Loader2
} from 'lucide-react';
import { leadService } from '../../services/leadService';
import { campaignService } from '../../services/campaignService';
import { useLead } from '../../hooks/useLeads';
import { useUsers } from '../../hooks/useUsers';
import { getInitials } from '../../utils/helpers';
import SearchableSelect from '../../components/common/SearchableSelect';

const LeadEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dropdownRef = useRef(null);
  const campaignDropdownRef = useRef(null);

  const { data: leadData, isLoading: isLoadingLead } = useLead(id);
  const lead = leadData?.lead;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: '',
    timezone: '',
    company: '',
    title: '',
    campaign_id: '',
    status: '',
    priority: '',
    estimated_value: '',
    assigned_to: '',
    notes: '',
    extra_data: {}
  });

  const [errors, setErrors] = useState({});
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCampaignDropdown, setShowCampaignDropdown] = useState(false);

  const { data: usersData } = useUsers();
  const users = usersData?.users || [];

  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await campaignService.getCampaigns({ per_page: 100 });
        setCampaigns(response.campaigns || []);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };
    fetchCampaigns();
  }, []);

  // Populate form when lead data loads
  useEffect(() => {
    if (lead) {
      // Parse the name into first_name and last_name if they don't exist
      let firstName = lead.first_name || '';
      let lastName = lead.last_name || '';
      
      // If first_name and last_name are empty but name exists, split the name
      if (!firstName && !lastName && lead.name) {
        const nameParts = lead.name.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }

      setFormData({
        first_name: firstName,
        last_name: lastName,
        email: lead.email || '',
        phone: lead.phone || '',
        country: lead.country || '',
        timezone: lead.timezone || '',
        company: lead.company || '',
        title: lead.title || '',
        campaign_id: lead.campaign_id || '',
        status: lead.status || '',
        priority: lead.priority || '',
        estimated_value: lead.estimated_value || '',
        assigned_to: lead.assigned_to || '',
        notes: lead.notes || '',
        extra_data: lead.extra_data || {}
      });
    }
  }, [lead]);

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
      if (campaignDropdownRef.current && !campaignDropdownRef.current.contains(event.target)) {
        setShowCampaignDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateMutation = useMutation({
    mutationFn: (data) => leadService.updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['lead', id]);
      queryClient.invalidateQueries(['leads']);
      navigate(`/dashboard/leads/${id}`);
    },
    onError: (error) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data for submission
    const submitData = {
      ...(formData.first_name && { first_name: formData.first_name }),
      ...(formData.last_name && { last_name: formData.last_name }),
      ...(formData.email && { email: formData.email }),
      ...(formData.phone && { phone: formData.phone }),
      ...(formData.country && { country: formData.country }),
      ...(formData.timezone && { timezone: formData.timezone }),
      ...(formData.company && { company: formData.company }),
      ...(formData.title && { title: formData.title }),
      ...(formData.campaign_id && { campaign_id: parseInt(formData.campaign_id) }),
      ...(formData.status && { status: formData.status }),
      ...(formData.priority && { priority: formData.priority }),
      ...(formData.estimated_value && { estimated_value: parseFloat(formData.estimated_value) }),
      assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
      ...(formData.notes !== undefined && { notes: formData.notes }),
      ...(formData.extra_data && { extra_data: formData.extra_data })
    };

    updateMutation.mutate(submitData);
  };

  const selectedUser = users.find(u => u.id === parseInt(formData.assigned_to));
  const selectedCampaign = campaigns.find(c => c.id === parseInt(formData.campaign_id));

  // Status options for edit (different from create)
  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'interested', label: 'Interested' },
    { value: 'callback_requested', label: 'Callback Requested' },
    { value: 'not_interested', label: 'Not Interested' },
    { value: 'converted', label: 'Converted' },
    { value: 'no_answer', label: 'No Answer' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  if (isLoadingLead) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Lead not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/dashboard/leads/${id}`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Lead
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Update lead information
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="card p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={errors.first_name ? 'input-error' : 'input'}
                  placeholder="Enter first name"
                  required
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.first_name[0]}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={errors.last_name ? 'input-error' : 'input'}
                  placeholder="Enter last name"
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.last_name[0]}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'input-error pl-10' : 'input pl-10'}
                    placeholder="email@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email[0]}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'input-error pl-10' : 'input pl-10'}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone[0]}</p>
                )}
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="Company name"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Title
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="e.g., Marketing Manager"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="e.g., United States"
                  />
                </div>
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="e.g., America/New_York"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Lead Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <SearchableSelect
                  label="Status"
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  showAvatar={false}
                  allowEmpty={true}
                  emptyText="Select status"
                />
              </div>

              {/* Priority */}
              <div>
                <SearchableSelect
                  label="Priority"
                  options={priorityOptions}
                  value={formData.priority}
                  onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                  showAvatar={false}
                  allowEmpty={true}
                  emptyText="Select priority"
                />
              </div>

              {/* Estimated Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estimated Value
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="estimated_value"
                    value={formData.estimated_value}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              {/* Campaign */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Campaign
                </label>
                <div className="relative" ref={campaignDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowCampaignDropdown(!showCampaignDropdown)}
                    className="input w-full text-left flex items-center justify-between"
                  >
                    <span className={selectedCampaign ? 'text-gray-900 dark:text-white' : 'text-gray-500'}>
                      {selectedCampaign ? selectedCampaign.name : 'Select campaign'}
                    </span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  {showCampaignDropdown && (
                    <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                      <div
                        onClick={() => {
                          setFormData(prev => ({ ...prev, campaign_id: '' }));
                          setShowCampaignDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-500"
                      >
                        None
                      </div>
                      {campaigns.map(campaign => (
                        <div
                          key={campaign.id}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, campaign_id: campaign.id }));
                            setShowCampaignDropdown(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between"
                        >
                          <span className="text-gray-900 dark:text-white">{campaign.name}</span>
                          {formData.campaign_id === campaign.id && (
                            <Check className="w-5 h-5 text-primary-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Assigned To */}
              <div className="md:col-span-2">
                <SearchableSelect
                  label="Assign To"
                  options={users}
                  value={formData.assigned_to}
                  onChange={(value) => setFormData(prev => ({ ...prev, assigned_to: value }))}
                  placeholder="Select user"
                  emptyText="Unassigned"
                  showAvatar={true}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Additional Information
            </h2>
            <div className="space-y-4">
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="input pl-10"
                    placeholder="Add any additional notes about this lead..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/leads/${id}`)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LeadEdit;
