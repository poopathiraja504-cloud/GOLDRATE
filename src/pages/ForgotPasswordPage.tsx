import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Coins, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const { resetPasswordForEmail } = useAuth()

  const [email, setEmail] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      const { error: authError } = await resetPasswordForEmail(email)
      if (authError) {
        setError(authError.message || 'Failed to send reset email. Please try again.')
      } else {
        setSuccess(true)
      }
    } catch (e) {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#0a0f1e' }}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full"
              style={{ backgroundColor: '#d4af3722', border: '2px solid #d4af37' }}>
              <Coins size={32} style={{ color: '#d4af37' }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#d4af37' }}>Reset Password</h1>
            <p className="mt-1 text-sm text-center text-gray-400">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              <CheckCircle size={16} className="mt-0.5 shrink-0" />
              <span>Password reset email sent! Check your inbox.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={success}
                  className="w-full rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all disabled:opacity-50"
                  style={{ backgroundColor: '#0d1424', border: '1px solid rgba(255,255,255,0.12)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 2px #d4af3730' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-black transition-all disabled:opacity-60 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #d4af37, #f5d47a)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Sending…
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 flex justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
