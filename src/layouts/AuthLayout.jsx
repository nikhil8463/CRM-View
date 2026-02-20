import { Outlet } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-ai-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-6 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-ai-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tech Verta</h1>
                <p className="text-xs text-gray-600">Intelligent Lead Management</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4">
              <h2 className="text-3xl font-display font-bold text-gray-900">
                Transform Your Sales with <span className="text-gradient">AI-Powered</span> Intelligence
              </h2>
              <p className="text-base text-gray-600">
                Automate lead scoring, optimize campaigns, and close deals faster with our enterprise-grade CRM platform powered by LangChain and Retell AI.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="bg-white rounded-lg p-3 shadow-soft">
                <div className="text-xl font-bold text-primary-600">98%</div>
                <div className="text-xs text-gray-600">Lead Accuracy</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-soft">
                <div className="text-xl font-bold text-ai-600">50%</div>
                <div className="text-xs text-gray-600">Time Saved</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-soft">
                <div className="text-xl font-bold text-success-600">3x</div>
                <div className="text-xs text-gray-600">Conversions</div>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-soft">
                <div className="text-xl font-bold text-warning-600">24/7</div>
                <div className="text-xs text-gray-600">AI Support</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
