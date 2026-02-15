import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, User, Eye, EyeOff, Loader2, Shield, Briefcase, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { useRoles } from '@/hooks/useRoles'
import { useAuthStore } from '@/store/authStore'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role_id: z.string().min(1, 'Role is required'),
  staff_type_id: z.string().min(1, 'Staff type is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})

export default function Register() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { register: registerUser, isRegisterLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Redirect if not admin
  useEffect(() => {
    const isAdmin = user?.role_id === 1 || 
                    user?.role?.name === 'super_admin' || 
                    user?.role?.name === 'Admin'
    
    if (user && !isAdmin) {
      toast.error('Only administrators can create new users')
      navigate('/dashboard')
    }
  }, [user, navigate])
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  })
  
  // Fetch roles using custom hook
  const { data: rolesData } = useRoles()
  const roles = rolesData?.data || []
  
  // TODO: Create useStaffTypes hook when backend endpoint is available
  const staffTypes = [
    { id: 1, name: 'Sales' },
    { id: 2, name: 'Support' },
    { id: 3, name: 'Marketing' },
  ]
  
  const onSubmit = (data) => {
    registerUser(data, {
      onSuccess: () => {
        navigate('/dashboard/users')
      }
    })
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-soft p-8 lg:p-10 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-ai-600 rounded-2xl mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create New User</h2>
          <p className="text-slate-600">Add a new team member to your CRM</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="label-text">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="name"
                type="text"
                {...register('name')}
                className={`input pl-10 ${errors.name ? 'input-error' : ''}`}
                placeholder="John Doe"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-danger-600">{errors.name.message}</p>
            )}
          </div>
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="label-text">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                placeholder="john@company.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-danger-600">{errors.email.message}</p>
            )}
          </div>
          
          {/* Role and Staff Type - Two Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role Selection */}
            <div>
              <label htmlFor="role_id" className="label-text">
                Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  id="role_id"
                  {...register('role_id')}
                  className={`input pl-10 ${errors.role_id ? 'input-error' : ''}`}
                >
                  <option value="">Select role...</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.role_id && (
                <p className="mt-1 text-sm text-danger-600">{errors.role_id.message}</p>
              )}
            </div>
            
            {/* Staff Type Selection */}
            <div>
              <label htmlFor="staff_type_id" className="label-text">
                Staff Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  id="staff_type_id"
                  {...register('staff_type_id')}
                  className={`input pl-10 ${errors.staff_type_id ? 'input-error' : ''}`}
                >
                  <option value="">Select type...</option>
                  {staffTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.staff_type_id && (
                <p className="mt-1 text-sm text-danger-600">{errors.staff_type_id.message}</p>
              )}
            </div>
          </div>
          
          {/* Password Fields - Two Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="label-text">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-danger-600">{errors.password.message}</p>
              )}
            </div>
            
            {/* Confirm Password Field */}
            <div>
              <label htmlFor="password_confirmation" className="label-text">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password_confirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('password_confirmation')}
                  className={`input pl-10 pr-10 ${errors.password_confirmation ? 'input-error' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="mt-1 text-sm text-danger-600">{errors.password_confirmation.message}</p>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/users')}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRegisterLoading}
              className="btn btn-primary flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
            >
              {isRegisterLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
        
        {/* Back to Users Link */}
        <div className="mt-6 text-center">
          <Link 
            to="/dashboard/users" 
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            ← Back to Users List
          </Link>
        </div>
      </div>
    </div>
  )
}
