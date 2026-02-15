import { useState, useEffect } from 'react';
import { X, Phone, Mail, MessageSquare, Calendar, Clock, User, Building2, FileText, Zap } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { communicationService } from '../../services/communicationService';
import { useLeads } from '../../hooks/useLeads';
import SearchableSelect from '../common/SearchableSelect';
import toast from 'react-hot-toast';

export default function LogCommunicationModal({ 
  isOpen, 
  onClose, 
  campaignId, 
  leadId = null, 
  defaultType = 'call' 
}) {
  const queryClient = useQueryClient();
  const { data: leadsData } = useLeads(campaignId ? { campaign_id: campaignId } : {});
  const leads = leadsData?.leads || [];

  const [formData, setFormData] = useState({
    lead_id: leadId || '',
    campaign_id: campaignId || '',
    type: defaultType,
    direction: 'outbound',
    status: 'completed',
    subject: '',
    notes: '',
    duration: '',
    reference_id: '',
    scheduled_at: '',
  });

  const [isAIPowered, setIsAIPowered] = useState(false);

  useEffect(() => {
    if (leadId) {
      setFormData(prev => ({ ...prev, lead_id: leadId }));
    }
    if (campaignId) {
      setFormData(prev => ({ ...prev, campaign_id: campaignId }));
    }
  }, [leadId, campaignId]);

  // Reset form when modal opens with pre-selected type
  useEffect(() => {
    if (isOpen) {
      setFormData({
        lead_id: leadId || '',
        campaign_id: campaignId || '',
        type: defaultType,
        direction: 'outbound',
        status: 'completed',
        subject: '',
        notes: '',
        duration: '',
        reference_id: '',
        scheduled_at: '',
      });
      setIsAIPowered(false);
    }
  }, [isOpen, leadId, campaignId, defaultType]);

  const createMutation = useMutation({
    mutationFn: (data) => communicationService.createLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['communication-logs']);
      queryClient.invalidateQueries(['campaigns', campaignId]);
      queryClient.invalidateQueries(['leads']);
      toast.success('Communication logged successfully!');
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to log communication');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.lead_id) {
      toast.error('Please select a lead');
      return;
    }
    if (!formData.subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    // Prepare data
    const submitData = {
      ...formData,
      reference_id: isAIPowered ? `ai_${formData.type}_${Date.now()}` : formData.reference_id || null,
    };

    createMutation.mutate(submitData);
  };

  if (!isOpen) return null;

  const communicationTypes = [
    { value: 'call', label: 'Phone Call', icon: Phone },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'sms', label: 'SMS', icon: MessageSquare },
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { value: 'meeting', label: 'Meeting', icon: Calendar },
    { value: 'chat', label: 'Chat', icon: MessageSquare },
  ];

  const directionOptions = [
    { value: 'inbound', label: 'Inbound' },
    { value: 'outbound', label: 'Outbound' },
  ];

  const statusOptions = [
    { value: 'completed', label: 'Completed' },
    { value: 'missed', label: 'Missed' },
    { value: 'voicemail', label: 'Voicemail' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'failed', label: 'Failed' },
    { value: 'sent', label: 'Sent' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'opened', label: 'Opened' },
    { value: 'clicked', label: 'Clicked' },
  ];

  const getTypeIcon = (type) => {
    const typeData = communicationTypes.find(t => t.value === type);
    const Icon = typeData?.icon || MessageSquare;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Log Communication</h2>
              <p className="text-indigo-100 text-sm">Record interaction with lead</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-5">
            {/* Lead Selection */}
            <div>
              <SearchableSelect
                label={
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    Lead <span className="text-red-500">*</span>
                  </span>
                }
                options={leads}
                value={formData.lead_id}
                onChange={(value) => setFormData(prev => ({ ...prev, lead_id: value }))}
                showAvatar={false}
                allowEmpty={false}
                placeholder="Select a lead"
                renderOption={(lead) => (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                      {lead.name?.charAt(0) || 'L'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 truncate">{lead.name}</div>
                      {lead.company && (
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {lead.company}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              />
            </div>

            {/* Communication Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                {getTypeIcon(formData.type)}
                Communication Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {communicationTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                      className={`
                        flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all
                        ${formData.type === type.value
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direction and Status */}
            <div className="grid grid-cols-2 gap-4">
              <SearchableSelect
                label="Direction"
                options={directionOptions}
                value={formData.direction}
                onChange={(value) => setFormData(prev => ({ ...prev, direction: value }))}
                showAvatar={false}
                allowEmpty={false}
              />

              <SearchableSelect
                label="Status"
                options={statusOptions}
                value={formData.status}
                onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                showAvatar={false}
                allowEmpty={false}
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="input"
                placeholder="e.g., Follow-up call about product demo"
                required
              />
            </div>

            {/* Duration (for calls/meetings) */}
            {(formData.type === 'call' || formData.type === 'meeting') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="input"
                  placeholder="15"
                  min="0"
                />
              </div>
            )}

            {/* Scheduled Date (for scheduled communications) */}
            {formData.status === 'scheduled' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Scheduled Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduled_at: e.target.value }))}
                  className="input"
                />
              </div>
            )}

            {/* AI-Powered Toggle */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAIPowered}
                  onChange={(e) => setIsAIPowered(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex items-center gap-2 flex-1">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium text-slate-900">AI-Powered Communication</div>
                    <div className="text-xs text-slate-600">Mark this as an AI-assisted interaction</div>
                  </div>
                </div>
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="input min-h-[120px] resize-y"
                placeholder="Add detailed notes about this communication..."
                rows={4}
              />
            </div>

            {/* Reference ID (optional, for advanced users) */}
            {!isAIPowered && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reference ID (Optional)
                </label>
                <input
                  type="text"
                  value={formData.reference_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, reference_id: e.target.value }))}
                  className="input"
                  placeholder="External system reference ID"
                />
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            disabled={createMutation.isPending}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logging...
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                Log Communication
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
