import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Check, User } from 'lucide-react'

/**
 * SearchableSelect Component
 * A reusable dropdown with search functionality and styled options
 * 
 * @param {Object} props
 * @param {Array} options - Array of options. Can be:
 *                          - Objects: [{id, name, email, avatar}]
 *                          - Simple values: ['active', 'pending'] 
 *                          - Value-label pairs: [{value: 'active', label: 'Active'}]
 * @param {string|number} value - Selected value (option.id, option.value, or simple value)
 * @param {Function} onChange - Callback when selection changes
 * @param {string} placeholder - Placeholder text
 * @param {string} label - Label for the select
 * @param {boolean} required - Whether field is required
 * @param {string} emptyText - Text shown when no option selected
 * @param {string} noResultsText - Text shown when search has no results
 * @param {boolean} showAvatar - Whether to show avatar circles
 * @param {Function} renderOption - Custom render function for options
 * @param {boolean} disabled - Whether the select is disabled
 * @param {boolean} allowEmpty - Whether to show empty/clear option
 */
export default function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  required = false,
  emptyText = 'No selection',
  noResultsText = 'No results found',
  showAvatar = false,
  renderOption,
  disabled = false,
  allowEmpty = true,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  // Normalize options to consistent format
  const normalizedOptions = options.map(opt => {
    // If it's already an object with id
    if (typeof opt === 'object' && opt !== null) {
      if (opt.id !== undefined) {
        return { ...opt, value: opt.id, label: opt.name || opt.label || opt.id }
      }
      // If it's a value-label pair
      if (opt.value !== undefined) {
        return { ...opt, id: opt.value, label: opt.label || opt.value }
      }
    }
    // If it's a simple string/number
    return { 
      id: opt, 
      value: opt, 
      label: typeof opt === 'string' ? opt.charAt(0).toUpperCase() + opt.slice(1) : opt,
      name: typeof opt === 'string' ? opt.charAt(0).toUpperCase() + opt.slice(1) : opt
    }
  })

  // Get selected option
  const selectedOption = normalizedOptions.find(opt => 
    opt.value === value || opt.id === value
  )

  // Filter options based on search
  const filteredOptions = normalizedOptions.filter(option => {
    const searchLower = searchQuery.toLowerCase()
    return (
      option.label?.toString().toLowerCase().includes(searchLower) ||
      option.name?.toString().toLowerCase().includes(searchLower) ||
      option.email?.toLowerCase().includes(searchLower) ||
      option.value?.toString().toLowerCase().includes(searchLower)
    )
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Focus search input when dropdown opens
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (option) => {
    onChange(option?.value || option?.id || '')
    setIsOpen(false)
    setSearchQuery('')
  }

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  // Get avatar color based on name
  const getAvatarColor = (name) => {
    const colors = [
      'bg-purple-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500',
    ]
    const index = name?.charCodeAt(0) % colors.length || 0
    return colors[index]
  }

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Default render function for options
  const defaultRenderOption = (option) => (
    <div className="flex items-center gap-3">
      {showAvatar && (
        <div className={`w-8 h-8 rounded-full ${getAvatarColor(option.label || option.name)} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
          {getInitials(option.label || option.name)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-900 truncate">
          {option.label || option.name}
        </div>
        {option.email && (
          <div className="text-xs text-slate-500 truncate">
            {option.email}
          </div>
        )}
      </div>
    </div>
  )

  const renderOptionContent = renderOption || defaultRenderOption

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="label-text mb-2">
          {label} {required && <span className="text-danger-600">*</span>}
        </label>
      )}
      
      <div ref={dropdownRef}>
        {/* Select Button */}
        <button
          type="button"
          onClick={toggleDropdown}
          disabled={disabled}
          className={`
            w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl
            flex items-center justify-between gap-3
            hover:border-primary-500 focus:border-primary-500 focus:ring-4 focus:ring-primary-100
            transition-all duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isOpen ? 'border-primary-500 ring-4 ring-primary-100' : ''}
          `}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {selectedOption ? (
              <>
                {showAvatar && (
                  <div className={`w-8 h-8 rounded-full ${getAvatarColor(selectedOption.label || selectedOption.name)} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
                    {getInitials(selectedOption.label || selectedOption.name)}
                  </div>
                )}
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">
                    {selectedOption.label || selectedOption.name}
                  </div>
                  {selectedOption.email && (
                    <div className="text-xs text-slate-500 truncate">
                      {selectedOption.email}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {showAvatar && (
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                )}
                <span className="text-sm text-slate-500">{placeholder}</span>
              </>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-80 overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-slate-200 sticky top-0 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>
            </div>

            {/* Options List */}
            <div className="overflow-y-auto max-h-64 custom-scrollbar">
              {/* Empty option */}
              {allowEmpty && (
                <button
                  type="button"
                  onClick={() => handleSelect(null)}
                  className={`
                    w-full px-4 py-3 flex items-center justify-between
                    hover:bg-slate-50 transition-colors
                    ${!value ? 'bg-primary-50' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {showAvatar && (
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                    <span className="text-sm text-slate-600">{emptyText}</span>
                  </div>
                  {!value && (
                    <Check className="w-5 h-5 text-primary-600" />
                  )}
                </button>
              )}

              {/* Filtered options */}
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.id || option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`
                      w-full px-4 py-3 flex items-center justify-between
                      hover:bg-slate-50 transition-colors
                      ${(value === option.id || value === option.value) ? 'bg-primary-50' : ''}
                    `}
                  >
                    <div className="flex-1 min-w-0">
                      {renderOptionContent(option)}
                    </div>
                    {(value === option.id || value === option.value) && (
                      <Check className="w-5 h-5 text-primary-600 flex-shrink-0 ml-2" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  {noResultsText}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
