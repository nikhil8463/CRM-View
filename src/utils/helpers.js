import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format number with commas
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Format currency
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Get initials from name
 */
export function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Truncate text
 */
export function truncate(text, length = 50) {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Get AI score color class
 */
export function getAIScoreColor(score) {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'danger'
}

/**
 * Get status badge color
 */
export function getStatusColor(status) {
  const statusMap = {
    active: 'success',
    inactive: 'danger',
    pending: 'warning',
    completed: 'success',
    new: 'primary',
    contacted: 'warning',
    qualified: 'success',
    lost: 'danger',
  }
  return statusMap[status.toLowerCase()] || 'primary'
}

/**
 * Download file
 */
export function downloadFile(data, filename, type = 'text/csv') {
  const blob = new Blob([data], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
