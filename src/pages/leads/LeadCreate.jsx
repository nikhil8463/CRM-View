import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Tag
} from 'lucide-react';
import { leadService } from '../../services/leadService';
import { campaignService } from '../../services/campaignService';
import { useUsers } from '../../hooks/useUsers';
import { getInitials } from '../../utils/helpers';
import SearchableSelect from '../../components/common/SearchableSelect';

const LeadCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dropdownRef = useRef(null);
  const campaignDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    country: '',
    timezone: '',
    company: '',
    title: '',
    source: '',
    campaign_id: '',
    status: 'new',
    priority: 'medium',
    estimated_value: '',
    assigned_to: '',
    notes: '',
    tags: '',
    metadata: {},
    extra_data: {}
  });

  const [errors, setErrors] = useState({});
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCampaignDropdown, setShowCampaignDropdown] = useState(false);

  const { data: usersData } = useUsers();
  const users = usersData?.users || [];

  const { data: campaignsData } = useMutation({
    mutationFn: () => campaignService.getCampaigns({ per_page: 100 })
  });

  useEffect(() => {
    campaignService.getCampaigns({ per_page: 100 }).then(response => {
      // Store campaigns for dropdown
    });
  }, []);

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

  // Click outside handler for user dropdown
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

  const createMutation = useMutation({
    mutationFn: (data) => leadService.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
      navigate('/dashboard/leads');
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
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      source: formData.source,
      ...(formData.country && { country: formData.country }),
      ...(formData.timezone && { timezone: formData.timezone }),
      ...(formData.company && { company: formData.company }),
      ...(formData.title && { title: formData.title }),
      ...(formData.campaign_id && { campaign_id: parseInt(formData.campaign_id) }),
      ...(formData.status && { status: formData.status }),
      ...(formData.priority && { priority: formData.priority }),
      ...(formData.estimated_value && { estimated_value: parseFloat(formData.estimated_value) }),
      ...(formData.assigned_to && { assigned_to: parseInt(formData.assigned_to) }),
      ...(formData.notes && { notes: formData.notes }),
      ...(formData.tags && { tags: formData.tags.split(',').map(tag => tag.trim()) })
    };

    createMutation.mutate(submitData);
  };

  const selectedUser = users.find(u => u.id === parseInt(formData.assigned_to));
  const selectedCampaign = campaigns.find(c => c.id === parseInt(formData.campaign_id));

  const sourceOptions = [
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'email_campaign', label: 'Email Campaign' },
    { value: 'trade_show', label: 'Trade Show' },
    { value: 'cold_call', label: 'Cold Call' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'won', label: 'Won' },
    { value: 'lost', label: 'Lost' },
    { value: 'nurturing', label: 'Nurturing' },
    { value: 'no_answer', label: 'No Answer' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/leads')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Lead
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Add a new lead to your CRM
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
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={errors.last_name ? 'input-error' : 'input'}
                  placeholder="Enter last name"
                  required
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-500">{errors.last_name[0]}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
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
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email[0]}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone <span className="text-red-500">*</span>
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
                    required
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
              {/* Source */}
              <div>
                <SearchableSelect
                  label={
                    <>
                      Source <span className="text-red-500">*</span>
                    </>
                  }
                  options={sourceOptions}
                  value={formData.source}
                  onChange={(value) => setFormData(prev => ({ ...prev, source: value }))}
                  showAvatar={false}
                  allowEmpty={true}
                  emptyText="Select source"
                  required
                />
                {errors.source && (
                  <p className="mt-1 text-sm text-red-500">{errors.source[0]}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <SearchableSelect
                  label="Status"
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  showAvatar={false}
                  allowEmpty={false}
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
                  allowEmpty={false}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign To
                </label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="input w-full text-left flex items-center gap-3"
                  >
                    {selectedUser ? (
                      <>
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium text-sm flex-shrink-0">
                          {getInitials(selectedUser.name)}
                        </div>
                        <span className="text-gray-900 dark:text-white flex-1">
                          {selectedUser.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-500 flex-1">Select user</span>
                      </>
                    )}
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </button>
                  
                  {showUserDropdown && (
                    <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                      <div
                        onClick={() => {
                          setFormData(prev => ({ ...prev, assigned_to: '' }));
                          setShowUserDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3"
                      >
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-500">Unassigned</span>
                      </div>
                      {users.map(user => (
                        <div
                          key={user.id}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, assigned_to: user.id }));
                            setShowUserDropdown(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium text-sm">
                            {getInitials(user.name)}
                          </div>
                          <span className="text-gray-900 dark:text-white flex-1">{user.name}</span>
                          {formData.assigned_to === user.id && (
                            <Check className="w-5 h-5 text-primary-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Additional Information
            </h2>
            <div className="space-y-4">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="input pl-10"
                    placeholder="Enter tags separated by commas"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">Separate multiple tags with commas</p>
              </div>

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
              onClick={() => navigate('/dashboard/leads')}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {createMutation.isPending ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LeadCreate;
