'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, ChevronDown } from 'lucide-react'

const ADMIN_SUB_ROLES = [
  { key: 'ADMIN_OPERATION', label: 'Admin Operation', icon: '⚙️' },
  { key: 'ADMIN_LIBRARY', label: 'Admin Library', icon: '📚' },
  { key: 'ADMIN_SPORTS', label: 'Admin Sports', icon: '🏆' },
  { key: 'ADMIN_TRANSPORT', label: 'Admin Transport', icon: '🚌' },
]

const SCHOOLS = [
  { key: 'mjf', label: 'MJF Convent School', icon: '🏫', short: 'MJF' },
  { key: 'shivaji', label: 'Chhatrapati Shivaji Higher Secondary School', icon: '🏛️', short: 'Shivaji' },
]

function LoginForm() {
  const { user, login } = useAuth()
  const router = useRouter()
  const [role, setRole] = useState('SUPER_ADMIN')
  const [showAdminDropdown, setShowAdminDropdown] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedSchool, setSelectedSchool] = useState<string>('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selected_school')
      if (stored === 'mjf' || stored === 'shivaji') {
        setSelectedSchool(stored)
      }
    }
  }, [])

  useEffect(() => {
    if (user) redirectByRole(user.role)
  }, [user])

  const handleSelectSchool = (key: string) => {
    setSelectedSchool(key)
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected_school', key)
    }
  }

  const redirectByRole = (r: string) => {
    if (r === 'STUDENT') router.push('/portal/student')
    else if (r === 'PARENT') router.push('/portal/parent')
    else if (r === 'DRIVER') router.push('/portal/driver')
    else if (r === 'TEACHER' || r === 'STAFF') router.push('/portal/staff')
    else router.push('/dashboard')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const tenantId = undefined

    const result = await login(identifier, password, role, tenantId)
    setLoading(false)

    if (result.success) {
      const storedUser = localStorage.getItem('school_erp_user')
      if (storedUser) redirectByRole(JSON.parse(storedUser).role)
      else router.push('/dashboard')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  const topRoles = [
    { key: 'SUPER_ADMIN', label: 'Super Admin', icon: '👑' },
    { key: 'COACHING_ADMIN', label: 'Admin', icon: '🏫', hasDropdown: true },
    { key: 'TEACHER', label: 'Teacher', icon: '👩‍🏫' },
    { key: 'PARENT', label: 'Parent', icon: '👨‍👩‍👧' },
    { key: 'STUDENT', label: 'Student', icon: '👨‍🎓' },
  ]

  const selectedAdminSub = ADMIN_SUB_ROLES.find(r => r.key === role)
  const isAdminSubRole = !!selectedAdminSub
  const currentSchool = SCHOOLS.find(s => s.key === selectedSchool)

  return (
    <div style={{ minHeight: '100vh', background: '#0a1208', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(26,92,56,0.12) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, rgba(249,115,22,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative' }}>
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', overflow: 'hidden' }}>
            <img src="/logo.png" alt="School Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#f97316', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>School Management System</div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', color: 'white', lineHeight: 1.2 }}>
            {currentSchool ? currentSchool.label : 'School Portal Login'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', marginTop: '6px', fontSize: '13px' }}>Apne school dashboard mein sign in karein</p>
        </div>

        <div style={{ background: '#111a0e', border: '1px solid rgba(26,92,56,0.25)', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>

          {/* School Selector */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>Select Your School</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {SCHOOLS.map(school => {
                const isSelected = selectedSchool === school.key
                return (
                  <button
                    key={school.key}
                    type="button"
                    onClick={() => handleSelectSchool(school.key)}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #f97316' : '2px solid rgba(26,92,56,0.3)',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(26,92,56,0.2))'
                        : 'rgba(255,255,255,0.03)',
                      color: isSelected ? 'white' : 'rgba(255,255,255,0.45)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 4px 20px rgba(249,115,22,0.2)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{school.icon}</span>
                    <span style={{ fontSize: '11px', fontWeight: '700', lineHeight: '1.4', textAlign: 'center' }}>{school.label}</span>
                    {isSelected && (
                      <span style={{ fontSize: '10px', color: '#f97316', fontWeight: '800', letterSpacing: '1px' }}>✓ SELECTED</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Role Selector */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', background: '#172014', padding: '4px', borderRadius: '12px', marginBottom: '16px' }}>
            {topRoles.map(r => (
              <div key={r.key} style={{ flex: '1 1 auto', position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (r.hasDropdown) {
                      setShowAdminDropdown(!showAdminDropdown)
                    } else {
                      setRole(r.key)
                      setShowAdminDropdown(false)
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    background: (role === r.key || (r.hasDropdown && isAdminSubRole)) ? 'linear-gradient(135deg, #1a5c38, #0f3d26)' : 'transparent',
                    color: (role === r.key || (r.hasDropdown && isAdminSubRole)) ? 'white' : 'rgba(255,255,255,0.4)',
                    fontSize: '10px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <span style={{ fontSize: '14px' }}>{r.hasDropdown && isAdminSubRole ? selectedAdminSub!.icon : r.icon}</span>
                  {r.hasDropdown && isAdminSubRole ? selectedAdminSub!.label.replace('Admin ', '') : r.label}
                  {r.hasDropdown && <ChevronDown size={10} />}
                </button>

                {/* Admin sub-role dropdown */}
                {r.hasDropdown && showAdminDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 100, marginTop: '4px', background: '#1a2e18', border: '1px solid rgba(26,92,56,0.4)', borderRadius: '10px', padding: '4px', width: '160px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                    <button
                      type="button"
                      onClick={() => { setRole('COACHING_ADMIN'); setShowAdminDropdown(false) }}
                      style={{ width: '100%', padding: '8px 10px', background: role === 'COACHING_ADMIN' ? 'rgba(26,92,56,0.5)' : 'transparent', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}
                    >🏫 School Admin</button>
                    {ADMIN_SUB_ROLES.map(sub => (
                      <button
                        key={sub.key}
                        type="button"
                        onClick={() => { setRole(sub.key); setShowAdminDropdown(false) }}
                        style={{ width: '100%', padding: '8px 10px', background: role === sub.key ? 'rgba(26,92,56,0.5)' : 'transparent', border: 'none', borderRadius: '6px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}
                      >{sub.icon} {sub.label}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} onClick={() => setShowAdminDropdown(false)}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Email / Mobile No.</label>
              <input
                type="text"
                style={{ width: '100%', padding: '11px 14px', background: '#172014', border: '1px solid rgba(26,92,56,0.3)', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
                placeholder="your@email.com or 9876543210"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(255,255,255,0.5)' }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: '11px', color: '#f97316', fontWeight: '600', textDecoration: 'none' }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  style={{ width: '100%', padding: '11px 48px 11px 14px', background: '#172014', border: '1px solid rgba(26,92,56,0.3)', borderRadius: '10px', color: 'white', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '4px', top: 0, bottom: 0, width: '42px', background: 'transparent', border: 'none', cursor: 'pointer', color: showPassword ? '#4ade80' : 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '10px', marginBottom: '14px', fontSize: '13px', color: '#fca5a5' }}>⚠️ {error}</div>
            )}

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? '#1a5c38' : 'linear-gradient(135deg, #f97316, #1a5c38)', color: 'white', border: '1px solid rgba(249,115,22,0.4)', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(249,115,22,0.25)' }}>
              {loading ? <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Signing in...</> : '🔑 Sign In to Portal'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '14px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            New school registration?{' '}
            <Link href="/school-signup" style={{ color: '#f97316', fontWeight: '700', textDecoration: 'none' }}>Register school →</Link>
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.2)' }}>
            Need help?{' '}
            <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer" style={{ color: '#25d366', fontWeight: '600', textDecoration: 'none' }}>
              WhatsApp: +91 7879337770
            </a>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  )
}
