import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, Eye, EyeOff, Coins, AlertCircle, CheckCircle, User } from 'lucide-react'
import { emailService } from '../services/emailService'

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 1) return { score, label: 'Weak', color: '#ef4444' }
  if (score === 2) return { score, label: 'Fair', color: '#f59e0b' }
  if (score === 3) return { score, label: 'Good', color: '#3b82f6' }
  return { score: 4, label: 'Strong', color: '#22c55e' }
}

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { signUpWithEmail } = useAuth()

  const [fullName, setFullName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<boolean>(false)

  const strength = getPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!fullName.trim()) { setError('Please enter your full name.'); return }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) { setError('Please enter a valid email address.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }

    setLoading(true)
    try {
      const { error: authError } = await signUpWithEmail(email, password, fullName.trim())
      if (authError) {
        setError(authError.message || 'Registration failed. Please try again.')
      } else {
        emailService.sendWelcomeNotification(email, fullName.trim(), true);
        setSuccess(true)
      }
    } catch (e) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#0a0f1e' }}>
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 shadow-2xl text-center">
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full mx-auto"
              style={{ backgroundColor: '#16a34a22', border: '2px solid #22c55e' }}>
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Account Created!</h2>
            <p className="text-gray-400 text-sm mb-6">Please check your email to verify your account before signing in.</p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #d4af37, #f5d47a)' }}
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
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
            <h1 className="text-2xl font-bold" style={{ color: '#d4af37' }}>Create Account</h1>
            <p className="mt-1 text-sm text-gray-400">Join GOLDSILVERRATE today.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                  className="w-full rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  style={{ backgroundColor: '#0d1424', border: '1px solid rgba(255,255,255,0.12)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 2px #d4af3730' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
            </div>

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
                  className="w-full rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  style={{ backgroundColor: '#0d1424', border: '1px solid rgba(255,255,255,0.12)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 2px #d4af3730' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  className="w-full rounded-xl pl-9 pr-10 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  style={{ backgroundColor: '#0d1424', border: '1px solid rgba(255,255,255,0.12)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 2px #d4af3730' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength indicator */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{ backgroundColor: i <= strength.score ? strength.color : 'rgba(255,255,255,0.1)' }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strength.color }}>
                    Password strength: {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  className="w-full rounded-xl pl-9 pr-10 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  style={{ backgroundColor: '#0d1424', border: '1px solid rgba(255,255,255,0.12)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.boxShadow = '0 0 0 2px #d4af3730' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.boxShadow = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-black transition-all disabled:opacity-60 hover:opacity-90 mt-2"
              style={{ background: 'linear-gradient(135deg, #d4af37, #f5d47a)' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating Account…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold hover:opacity-80 transition-colors"
              style={{ color: '#d4af37' }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
