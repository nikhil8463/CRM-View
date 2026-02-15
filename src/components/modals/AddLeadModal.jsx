import { useState } from 'react'
import { X, User, Upload, FileSpreadsheet, Loader2, Mail, Phone, Building2, Briefcase, MapPin, Clock, DollarSign, FileText } from 'lucide-react'
import { useCreateLead, useImportLeads } from '@/hooks/useLeads'
import SearchableSelect from '@/components/common/SearchableSelect'

export default function AddLeadModal({ isOpen, onClose, campaignId = null }) {
  const [mode, setMode] = useState('single') // 'single' or 'bulk'
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    country: '',
    timezone: '',
    status: 'new',
    source: '',
    campaign_id: campaignId || '',
    estimated_value: '',
    notes: '',
  })
  const [file, setFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const { mutate: createLead, isPending: isCreating } = useCreateLead()
  const { mutate: importLeads, isPending: isImporting } = useImportLeads()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ]
      if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile)
      } else {
        alert('Please upload a valid Excel (.xlsx, .xls) or CSV file')
      }
    }
  }

  const handleSingleSubmit = (e) => {
    e.preventDefault()
    createLead(formData, {
      onSuccess: () => {
        onClose()
        resetForm()
      }
    })
  }

  const handleBulkSubmit = (e) => {
    e.preventDefault()
    if (!file) {
      alert('Please select a file to upload')
      return
    }

    const formDataObj = new FormData()
    formDataObj.append('file', file)
    if (campaignId) {
      formDataObj.append('campaign_id', campaignId)
    }

    importLeads(formDataObj, {
      onSuccess: () => {
        onClose()
        resetForm()
      },
      onError: () => {
        setUploadProgress(0)
      }
    })
  }

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      country: '',
      timezone: '',
      status: 'new',
      source: '',
      campaign_id: campaignId || '',
      estimated_value: '',
      notes: '',
    })
    setFile(null)
    setUploadProgress(0)
    setMode('single')
  }

  const handleDownloadTemplate = () => {
    // Create the link and trigger download
    const link = document.createElement('a')
    link.href = '/lead_import_template.csv'
    link.download = 'lead_import_template.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleClose = () => {
    if (!isCreating && !isImporting) {
      resetForm()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Add Lead</h2>
              <p className="text-sm text-slate-500 mt-1">
                Add a single lead or upload multiple leads from Excel/CSV
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              disabled={isCreating || isImporting}
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="p-6 border-b border-slate-200">
            <div className="flex gap-2">
              <button
                onClick={() => setMode('single')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  mode === 'single'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <User className="w-5 h-5" />
                Single Entry
              </button>
              <button
                onClick={() => setMode('bulk')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  mode === 'bulk'
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5" />
                Bulk Upload
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {mode === 'single' ? (
              <form onSubmit={handleSingleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        First Name <span className="text-danger-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                        className="input"
                        placeholder="Enter first name"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="Enter last name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email <span className="text-danger-600">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="input pl-10"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="input pl-10"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Company
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="input pl-10"
                          placeholder="Company name"
                        />
                      </div>
                    </div>

                    {/* Job Title */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Job Title
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          className="input pl-10"
                          placeholder="e.g., Marketing Manager"
                        />
                      </div>
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Country
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="input pl-10"
                          placeholder="e.g., United States"
                        />
                      </div>
                    </div>

                    {/* Timezone */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Timezone
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          name="timezone"
                          value={formData.timezone}
                          onChange={handleInputChange}
                          className="input pl-10"
                          placeholder="e.g., America/New_York"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lead Details */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Lead Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Status */}
                    <SearchableSelect
                      label="Status"
                      options={[
                        { value: 'new', label: 'New' },
                        { value: 'contacted', label: 'Contacted' },
                        { value: 'qualified', label: 'Qualified' },
                        { value: 'converted', label: 'Converted' },
                        { value: 'lost', label: 'Lost' },
                      ]}
                      value={formData.status}
                      onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                      showAvatar={false}
                      allowEmpty={false}
                    />

                    {/* Source */}
                    <SearchableSelect
                      label="Source"
                      options={[
                        { value: '', label: 'Select source' },
                        { value: 'website', label: 'Website' },
                        { value: 'linkedin', label: 'LinkedIn' },
                        { value: 'referral', label: 'Referral' },
                        { value: 'cold_call', label: 'Cold Call' },
                        { value: 'email', label: 'Email' },
                        { value: 'social_media', label: 'Social Media' },
                        { value: 'other', label: 'Other' },
                      ]}
                      value={formData.source}
                      onChange={(value) => setFormData(prev => ({ ...prev, source: value }))}
                      showAvatar={false}
                      allowEmpty={true}
                      emptyText="Select source"
                    />

                    {/* Estimated Value */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Estimated Value
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="number"
                          name="estimated_value"
                          value={formData.estimated_value}
                          onChange={handleInputChange}
                          className="input pl-10"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="input"
                    placeholder="Additional information about the lead..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn btn-outline flex-1"
                    disabled={isCreating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4 mr-2" />
                        Create Lead
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleBulkSubmit} className="space-y-6">
                {/* File Upload Area */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Upload Excel or CSV File
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      disabled={isImporting}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      {file ? (
                        <div>
                          <p className="text-sm font-medium text-slate-900">{file.name}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Excel (.xlsx, .xls) or CSV files
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Upload Progress */}
                {isImporting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Uploading...</span>
                      <span className="font-medium text-slate-900">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-600 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-primary-900 mb-2">
                    Excel/CSV Format Requirements:
                  </h4>
                  <ul className="text-xs text-primary-800 space-y-1">
                    <li>• <strong>Required columns:</strong> <code className="bg-white px-1 rounded">first_name</code>, <code className="bg-white px-1 rounded">last_name</code>, <code className="bg-white px-1 rounded">email</code>, <code className="bg-white px-1 rounded">phone</code></li>
                    <li>• <strong>Optional columns:</strong> company, title, source, country, timezone, status, priority, estimated_value, notes</li>
                    <li>• <strong>Source values:</strong> website, referral, social_media, email_campaign, trade_show, cold_call, other</li>
                    <li>• <strong>Status values:</strong> new, contacted, qualified, proposal, negotiation, won, lost, nurturing, no_answer</li>
                    <li>• <strong>Priority values:</strong> low, medium, high, urgent</li>
                    <li>• First row should contain column headers</li>
                    <li>• Maximum file size: 10 MB</li>
                  </ul>
                  <div className="flex gap-3 mt-3">
                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 hover:underline"
                    >
                      <FileSpreadsheet className="w-3 h-3" />
                      Download Sample Template
                    </button>
                    <a
                      href="/LEAD_IMPORT_GUIDE.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-600 hover:text-slate-700 font-medium flex items-center gap-1 hover:underline"
                    >
                      <FileText className="w-3 h-3" />
                      View Full Documentation
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn btn-outline flex-1"
                    disabled={isImporting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={isImporting || !file}
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Leads
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
