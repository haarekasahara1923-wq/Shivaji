'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

const PRESET_SCHOOLS = [
  {
    key: 'mjf',
    name: 'MJF Convent School',
    icon: '🏫',
    address: 'MJF Convent School, City (State)',
    email: 'info@mjfconvent.school',
  },
  {
    key: 'shivaji',
    name: 'Chhatrapati Shivaji Higher Secondary School',
    icon: '🏛️',
    address: 'Chhatrapati Shivaji HSS, City (State)',
    email: 'info@shivajihss.school',
  },
]

export default function SchoolSignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [step, setStep] = useState(1) // 1 = school info, 2 = admin info
  const [limitReached, setLimitReached] = useState(false)
  const [selectedSchoolKey, setSelectedSchoolKey] = useState<'mjf' | 'shivaji' | ''>('mjf')

  const [form, setForm] = useState({
    schoolName: 'MJF Convent School',
    schoolAddress: 'MJF Convent School, City (State)',
    schoolPhone: '',
    schoolEmail: 'info@mjfconvent.school',
    directorName: '',
    directorPhone: '',
    directorEmail: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSelectPreset = (preset: typeof PRESET_SCHOOLS[0]) => {
    setSelectedSchoolKey(preset.key as any)
    setForm(f => ({
      ...f,
      schoolName: preset.name,
      schoolAddress: f.schoolAddress || preset.address,
      schoolEmail: f.schoolEmail || preset.email,
    }))
    setLimitReached(false)
    setError('')
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.schoolName.trim()) { setError('School name is required'); return }
    if (!form.directorName.trim()) { setError('Director name is required'); return }
    if (!form.schoolAddress.trim()) { setError('School address is required'); return }
    setError('')
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) { setError('Email and password are required'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/school-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolKey: selectedSchoolKey,
          schoolName: form.schoolName,
          schoolAddress: form.schoolAddress,
          schoolPhone: form.schoolPhone,
          schoolEmail: form.schoolEmail,
          directorName: form.directorName,
          directorPhone: form.directorPhone,
          directorEmail: form.directorEmail || form.email,
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        if (data.limitReached) {
          setLimitReached(true)
          setLoading(false)
          return
        }
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }

      localStorage.setItem('school_erp_token', data.accessToken)
      localStorage.setItem('school_erp_user', JSON.stringify(data.user))
      localStorage.setItem('school_erp_tenant', JSON.stringify(data.tenant))
      localStorage.setItem('school_erp_refresh', data.refreshToken)
      if (selectedSchoolKey) {
        localStorage.setItem('selected_school', selectedSchoolKey)
      }

      router.push('/dashboard')
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    background: '#172014',
    border: '1px solid rgba(26,92,56,0.3)',
    borderRadius: '10px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600' as const,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '6px',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1208', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Inter', sans-serif" }}>

      {/* LIMIT REACHED BAN POPUP */}
      {limitReached && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.92)',
          backdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            maxWidth: '500px', width: '100%',
            background: 'linear-gradient(135deg, #1a0000, #0d0000)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '24px',
            padding: '36px 30px',
            textAlign: 'center',
            boxShadow: '0 40px 80px rgba(239,68,68,0.2)',
          }}>
            <div style={{ fontSize: '50px', marginBottom: '16px' }}>🏫</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#f87171', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '10px' }}>Platform Multi-Tenant Notice</div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'white', marginBottom: '14px', lineHeight: 1.3 }}>
              Select Allowed School
            </h2>
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', textAlign: 'left' }}>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', margin: 0 }}>
                Is platform par sirf <strong style={{ color: '#4ade80' }}>2 schools</strong> allow hain:
              </p>
              <ul style={{ margin: '8px 0 0 18px', padding: 0, color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: '1.7' }}>
                <li><strong>MJF Convent School</strong></li>
                <li><strong>Chhatrapati Shivaji Higher Secondary School</strong></li>
              </ul>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '10px 0 0 0' }}>
                Aap in dono me se kisi bhi school ka Super Admin credentials set karne ke liye neeche select karein.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  handleSelectPreset(PRESET_SCHOOLS[0])
                  setLimitReached(false)
                }}
                style={{
                  padding: '12px 16px', background: 'rgba(26,92,56,0.3)', border: '1px solid #1a5c38',
                  borderRadius: '10px', color: 'white', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                }}
              >
                🏫 Set MJF Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSelectPreset(PRESET_SCHOOLS[1])
                  setLimitReached(false)
                }}
                style={{
                  padding: '12px 16px', background: 'rgba(249,115,22,0.2)', border: '1px solid #f97316',
                  borderRadius: '10px', color: 'white', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                }}
              >
                🏛️ Set Shivaji Admin
              </button>
              <Link href="/login" style={{
                display: 'inline-block', padding: '12px 20px',
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: 'white', borderRadius: '10px', textDecoration: 'none',
                fontSize: '12px', fontWeight: '700',
              }}>🔑 Go to Login</Link>
            </div>
          </div>
        </div>
      )}

      {/* Background gradients */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '10%', left: '15%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(26,92,56,0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '15%', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '520px', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #1a5c38, #f97316)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 14px', boxShadow: '0 8px 32px rgba(26,92,56,0.4)' }}>🏫</div>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#f97316', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>School Management System</div>
          <h1 style={{ fontSize: '24px', fontWeight: '900', color: 'white', lineHeight: 1.2, marginBottom: '8px' }}>
            School Super Admin Setup
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>
            Dono branches (MJF & Shivaji) ke Super Admin credentials setup karein
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center', justifyContent: 'center' }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: step >= s ? 'linear-gradient(135deg, #1a5c38, #f97316)' : 'rgba(255,255,255,0.08)',
                border: `2px solid ${step >= s ? '#f97316' : 'rgba(255,255,255,0.15)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: '700', color: step >= s ? 'white' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.3s',
              }}>
                {step > s ? '✓' : s}
              </div>
              <span style={{ fontSize: '12px', color: step >= s ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)', fontWeight: '600' }}>
                {s === 1 ? 'School Selection' : 'Login Credentials'}
              </span>
              {s < 2 && <div style={{ width: '40px', height: '1px', background: step > s ? '#f97316' : 'rgba(255,255,255,0.1)' }} />}
            </div>
          ))}
        </div>

        <div style={{ background: '#111a0e', border: '1px solid rgba(26,92,56,0.3)', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>

          {step === 1 && (
            <form onSubmit={handleNext}>
              {/* Branch quick selector */}
              <div style={{ marginBottom: '18px' }}>
                <label style={labelStyle}>Select School Branch *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {PRESET_SCHOOLS.map(school => {
                    const isSelected = selectedSchoolKey === school.key
                    return (
                      <button
                        key={school.key}
                        type="button"
                        onClick={() => handleSelectPreset(school)}
                        style={{
                          padding: '14px 10px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #f97316' : '2px solid rgba(26,92,56,0.3)',
                          background: isSelected
                            ? 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(26,92,56,0.3))'
                            : 'rgba(255,255,255,0.03)',
                          color: isSelected ? 'white' : 'rgba(255,255,255,0.5)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          textAlign: 'center',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 4px 20px rgba(249,115,22,0.25)' : 'none',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>{school.icon}</span>
                        <span style={{ fontSize: '11px', fontWeight: '700', lineHeight: '1.3' }}>{school.name}</span>
                        {isSelected && (
                          <span style={{ fontSize: '10px', color: '#f97316', fontWeight: '800' }}>✓ SELECTED</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>School / Institution Name *</label>
                <input
                  type="text" required value={form.schoolName}
                  onChange={e => set('schoolName', e.target.value)}
                  placeholder="e.g., MJF Convent School"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Director / Principal Name *</label>
                <input
                  type="text" required value={form.directorName}
                  onChange={e => set('directorName', e.target.value)}
                  placeholder="Full name of director / principal"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Contact Number *</label>
                <input
                  type="tel" required value={form.directorPhone}
                  onChange={e => set('directorPhone', e.target.value)}
                  placeholder="Director's mobile number"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>School Address *</label>
                <textarea
                  required value={form.schoolAddress}
                  onChange={e => set('schoolAddress', e.target.value)}
                  placeholder="Full address of the school"
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical' as const }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={labelStyle}>School Phone (Optional)</label>
                  <input
                    type="tel" value={form.schoolPhone}
                    onChange={e => set('schoolPhone', e.target.value)}
                    placeholder="School phone"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>School Email (Optional)</label>
                  <input
                    type="email" value={form.schoolEmail}
                    onChange={e => set('schoolEmail', e.target.value)}
                    placeholder="school@example.com"
                    style={inputStyle}
                  />
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '10px', marginBottom: '14px', fontSize: '13px', color: '#fca5a5' }}>⚠️ {error}</div>
              )}

              <button type="submit" style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 20px rgba(249,115,22,0.35)' }}>
                Continue to Admin Setup →
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div style={{ padding: '12px 14px', background: 'rgba(26,92,56,0.2)', border: '1px solid rgba(45,138,87,0.35)', borderRadius: '10px', marginBottom: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' }}>
                🔐 Setup Super Admin login for <strong style={{ color: '#f97316' }}>{form.schoolName}</strong>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Admin Email *</label>
                <input
                  type="email" required value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="admin@school.com"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'} required value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="Minimum 6 characters"
                    style={{ ...inputStyle, paddingRight: '48px' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '4px', top: 0, bottom: 0, width: '42px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirm ? 'text' : 'password'} required value={form.confirmPassword}
                    onChange={e => set('confirmPassword', e.target.value)}
                    placeholder="Re-enter password"
                    style={{ ...inputStyle, paddingRight: '48px' }}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: 'absolute', right: '4px', top: 0, bottom: 0, width: '42px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '10px', marginBottom: '14px', fontSize: '13px', color: '#fca5a5' }}>⚠️ {error}</div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => { setStep(1); setError('') }}
                  style={{ flex: 1, padding: '13px', background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  style={{ flex: 2, padding: '13px', background: loading ? 'rgba(26,92,56,0.5)' : 'linear-gradient(135deg, #1a5c38, #f97316)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 20px rgba(249,115,22,0.35)' }}>
                  {loading ? '🔄 Setting up School...' : '🚀 Save & Login to Dashboard'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            Already have credentials?{' '}
            <Link href="/login" style={{ color: '#f97316', fontWeight: '700', textDecoration: 'none' }}>Sign in here →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}