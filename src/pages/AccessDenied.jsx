import { useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react'

export default function AccessDenied() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-danger-100 flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-danger-600" />
          </div>

          {/* Content */}
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Access Denied
          </h1>
          <p className="text-slate-600 mb-6">
            You don't have permission to access this page. This area is restricted to administrators only.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Dashboard
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              If you believe this is a mistake, please contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
