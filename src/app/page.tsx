'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const SCHOOLS = {
  mjf: 'MJF Convent School',
  shivaji: 'Chhatrapati Shivaji Higher Secondary School',
}

type SchoolKey = keyof typeof SCHOOLS

const features = [
  { icon: '👨‍🎓', title: 'Student Management', desc: 'Admissions, profiles, class allocation with digital records & ID cards', color: '#f97316' },
  { icon: '💰', title: 'Fee Collection', desc: 'Installment plans, UPI/Cash/Bank receipts with automated reminders', color: '#ea580c' },
  { icon: '✅', title: 'Attendance System', desc: 'Daily class attendance, bulk marking & instant parent WhatsApp alerts', color: '#2d8a57' },
  { icon: '📝', title: 'Exams & Results', desc: 'MCQ + descriptive tests, auto evaluation, rank & digital report cards', color: '#1a5c38' },
  { icon: '👩‍🏫', title: 'Teacher Portal', desc: 'Staff profiles, homework assignment, attendance & salary management', color: '#f97316' },
  { icon: '🚌', title: 'Transport Management', desc: 'Vehicle tracking, route management & driver coordination', color: '#ea580c' },
  { icon: '📊', title: 'Live Analytics', desc: 'Real-time revenue, attendance & academic performance dashboards', color: '#2d8a57' },
  { icon: '💬', title: 'WhatsApp Automation', desc: 'Fee reminders, attendance alerts & school notices via WhatsApp', color: '#25d366' },
  { icon: '📚', title: 'Library Management', desc: 'Book inventory, issue/return tracking & student reading records', color: '#f97316' },
  { icon: '💼', title: 'Expense Tracking', desc: 'Rent, salary, utilities & operational expenses with P&L reports', color: '#1a5c38' },
  { icon: '🔔', title: 'Notices & Circulars', desc: 'Publish school notices, circulars & event announcements digitally', color: '#ea580c' },
  { icon: '🔒', title: 'Role-Based Access', desc: 'Admin, Teacher, Student, Parent & Driver — 5 dedicated portals', color: '#2d8a57' },
]

const roles = [
  { icon: '👑', title: 'School Admin', desc: 'Complete control — students, fees, reports, staff & settings' },
  { icon: '👩‍🏫', title: 'Teachers & Staff', desc: 'Attendance, homework, exam marking & class management' },
  { icon: '👨‍🎓', title: 'Students', desc: 'Results, attendance, notices, homework & fee status' },
  { icon: '👨‍👩‍👧', title: 'Parents', desc: "Ward's progress, attendance, fees & instant school notifications" },
  { icon: '🚌', title: 'Bus Driver', desc: 'Route updates, transport logs & pickup/drop management' },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<SchoolKey>('mjf')

  useEffect(() => {
    const stored = localStorage.getItem('selected_school') as SchoolKey | null
    if (stored && SCHOOLS[stored]) {
      setSelectedSchool(stored)
    }
  }, [])

  const handleSchoolSelect = (key: SchoolKey) => {
    setSelectedSchool(key)
    localStorage.setItem('selected_school', key)
    setDropdownOpen(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a1208', color: 'white', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .hero-glow { animation: float 6s ease-in-out infinite; }
        .live-dot { animation: pulse 2s ease-in-out infinite; }
        @media (max-width: 768px) { .hide-mobile { display: none !important; } .show-mobile { display: flex !important; } }
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
        .feature-card { transition: all 0.3s ease; }
        .feature-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(249,115,22,0.15); }
        .school-badge {
          background: linear-gradient(90deg, #f97316, #fbbf24, #ea580c, #f97316);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .dropdown-item:hover { background: rgba(249,115,22,0.15) !important; color: #f97316 !important; }
        .nav-link:hover { color: #f97316 !important; }
        .login-btn:hover { background: rgba(249,115,22,0.2) !important; border-color: rgba(249,115,22,0.5) !important; }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,18,8,0.95)', backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(45,138,87,0.2)',
        padding: '0 32px', height: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #1a5c38, #2d8a57)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 4px 16px rgba(26,92,56,0.4)' }}>🏫</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '900', color: 'white', letterSpacing: '-0.5px', lineHeight: 1.2 }}>School Management System</div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', fontWeight: '600', textTransform: 'uppercase' }}>School ERP Portal</div>
          </div>
        </div>

        {/* Nav Links */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          {[['Features', '#features'], ['Portals', '#roles'], ['Contact', '#contact']].map(([label, href]) => (
            <a key={label} href={href} className="nav-link" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: '500', textDecoration: 'none', transition: 'color 0.2s' }}>{label}</a>
          ))}
        </div>

        {/* Right: School Selector + Login */}
        <div className="hide-mobile" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* School Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 14px', fontSize: '13px', fontWeight: '600',
                background: 'rgba(26,92,56,0.15)', color: '#6ee7a0',
                borderRadius: '8px', border: '1px solid rgba(45,138,87,0.35)',
                cursor: 'pointer', whiteSpace: 'nowrap', maxWidth: '220px',
              }}
            >
              <span>🏫</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{SCHOOLS[selectedSchool]}</span>
              <span style={{ marginLeft: 'auto', fontSize: '10px' }}>{dropdownOpen ? '▲' : '▼'}</span>
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: '#0f1f0d', border: '1px solid rgba(45,138,87,0.35)',
                borderRadius: '12px', overflow: 'hidden',
                boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                minWidth: '260px', zIndex: 200,
              }}>
                {(Object.entries(SCHOOLS) as [SchoolKey, string][]).map(([key, name]) => (
                  <button
                    key={key}
                    className="dropdown-item"
                    onClick={() => handleSchoolSelect(key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      width: '100%', padding: '12px 16px', fontSize: '13px', fontWeight: '600',
                      background: selectedSchool === key ? 'rgba(249,115,22,0.12)' : 'transparent',
                      color: selectedSchool === key ? '#f97316' : 'rgba(255,255,255,0.75)',
                      border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    }}
                  >
                    <span>🏫</span>
                    <span>{name}</span>
                    {selectedSchool === key && <span style={{ marginLeft: 'auto', color: '#f97316' }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href="/login" className="login-btn" style={{ padding: '9px 22px', fontSize: '13px', fontWeight: '700', background: 'linear-gradient(135deg, #ea580c, #f97316)', color: 'white', borderRadius: '8px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(234,88,12,0.35)', transition: 'all 0.2s' }}>🔑 Login</Link>
        </div>

        {/* Mobile hamburger */}
        <button className="show-mobile" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'rgba(26,92,56,0.15)', border: '1px solid rgba(45,138,87,0.3)', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', color: 'white', fontSize: '18px' }}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: '68px', left: 0, right: 0, zIndex: 99, background: '#0d1a0c', borderBottom: '1px solid rgba(45,138,87,0.2)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[['Features', '#features'], ['Portals', '#roles'], ['Contact', '#contact']].map(([label, href]) => (
            <a key={label} href={href} onClick={() => setMobileMenuOpen(false)} style={{ color: 'white', fontSize: '16px', fontWeight: '600', textDecoration: 'none' }}>{label}</a>
          ))}
          <div style={{ height: '1px', background: 'rgba(45,138,87,0.2)' }} />
          {/* Mobile school selector */}
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Select School</div>
          {(Object.entries(SCHOOLS) as [SchoolKey, string][]).map(([key, name]) => (
            <button key={key} onClick={() => { handleSchoolSelect(key); setMobileMenuOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: selectedSchool === key ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.03)', color: selectedSchool === key ? '#f97316' : 'white', borderRadius: '10px', border: `1px solid ${selectedSchool === key ? 'rgba(249,115,22,0.3)' : 'rgba(45,138,87,0.2)'}`, cursor: 'pointer', fontWeight: '600', fontSize: '13px', textAlign: 'left' }}>
              <span>🏫</span><span>{name}</span>
              {selectedSchool === key && <span style={{ marginLeft: 'auto' }}>✓</span>}
            </button>
          ))}
          <div style={{ height: '1px', background: 'rgba(45,138,87,0.2)' }} />
          <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{ padding: '13px', textAlign: 'center', background: 'linear-gradient(135deg, #ea580c, #f97316)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>🔑 Login to Portal</Link>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div onClick={() => setDropdownOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
      )}

      {/* Hero Section */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 32px 80px', maxWidth: '1200px', margin: '0 auto', gap: '64px', flexWrap: 'wrap', position: 'relative' }}>
        {/* Background glows */}
        <div style={{ position: 'absolute', top: '15%', left: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(26,92,56,0.2) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(40px)' }} />

        {/* Left text */}
        <div style={{ flex: '1', minWidth: '300px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(26,92,56,0.15)', border: '1px solid rgba(45,138,87,0.4)', borderRadius: '50px', padding: '6px 16px', marginBottom: '28px' }}>
            <span className="live-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2d8a57', display: 'inline-block' }} />
            <span style={{ fontSize: '13px', color: '#6ee7a0', fontWeight: '600' }}>🏫 {SCHOOLS[selectedSchool]} — Management Portal</span>
          </div>

          <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 60px)', fontWeight: '900', lineHeight: '1.1', marginBottom: '12px', letterSpacing: '-1px' }}>
            Welcome to
          </h1>
          <h1 style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: '900', lineHeight: '1.15', marginBottom: '24px', letterSpacing: '-0.5px' }}>
            <span className="school-badge">{SCHOOLS[selectedSchool]}</span>
          </h1>
          <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: '700', color: 'rgba(255,255,255,0.75)', marginBottom: '24px' }}>
            School Management Portal
          </h2>

          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.5)', maxWidth: '500px', lineHeight: '1.8', marginBottom: '36px' }}>
            A complete digital management system for students, teachers, parents and administrators. Manage fees, attendance, exams, transport and more — all in one place.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link href="/login" style={{ padding: '14px 40px', fontSize: '15px', fontWeight: '700', background: 'linear-gradient(135deg, #ea580c, #f97316)', color: 'white', borderRadius: '12px', textDecoration: 'none', boxShadow: '0 8px 32px rgba(234,88,12,0.4)', border: '1px solid rgba(249,115,22,0.4)' }}>🔑 Login to Portal →</Link>
          </div>

          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {['Digital Records', 'Parent Alerts', 'Fee Management', 'Exam Portal'].map(t => (
              <span key={t} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: '#2d8a57' }}>✓</span> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Dashboard mockup */}
        <div className="hero-glow" style={{ flex: '1', minWidth: '300px', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(45,138,87,0.25)', borderRadius: '20px', padding: '28px', backdropFilter: 'blur(12px)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', maxWidth: '420px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #1a5c38, #2d8a57)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🏫</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.9)' }}>{SCHOOLS[selectedSchool]}</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>Admin Dashboard • Live</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
                {['#ef4444', '#f59e0b', '#10b981'].map(c => <div key={c} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c }} />)}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Total Students', value: '547', icon: '👨‍🎓', color: '#f97316' },
                { label: 'Fee Collected', value: '₹4.8L', icon: '💰', color: '#2d8a57' },
                { label: 'Present Today', value: '91%', icon: '✅', color: '#10b981' },
                { label: 'Pending Dues', value: '48', icon: '⚠️', color: '#ef4444' },
              ].map(card => (
                <div key={card.label} style={{ background: `linear-gradient(135deg, ${card.color}18, ${card.color}08)`, border: `1px solid ${card.color}30`, borderRadius: '12px', padding: '14px' }}>
                  <div style={{ fontSize: '20px', marginBottom: '6px' }}>{card.icon}</div>
                  <div style={{ fontSize: '18px', fontWeight: '800' }}>{card.value}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{card.label}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.3)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Activity</div>
            {[
              { msg: 'New admission — Priya Patil (Class 9A)', dot: '#10b981' },
              { msg: 'Fee collected — ₹18,500 via UPI', dot: '#f97316' },
              { msg: 'Attendance marked — Class 11B (94%)', dot: '#2d8a57' },
            ].map(item => (
              <div key={item.msg} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="live-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.dot, flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', flex: 1 }}>{item.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '96px 32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(26,92,56,0.1)', border: '1px solid rgba(45,138,87,0.3)', borderRadius: '50px', padding: '6px 16px', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', color: '#6ee7a0', fontWeight: '600' }}>All-in-One School ERP</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '900', letterSpacing: '-0.5px' }}>
            Everything your school needs{' '}
            <span style={{ background: 'linear-gradient(135deg, #f97316, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>in one place</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '14px', fontSize: '15px' }}>12+ powerful modules to automate every aspect of school management</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {features.map(f => (
            <div key={f.title} className="feature-card"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(45,138,87,0.12)', borderRadius: '16px', padding: '24px', cursor: 'default' }}>
              <div style={{ width: '48px', height: '48px', background: `${f.color}20`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.7' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Role Portals Section */}
      <section id="roles" style={{ padding: '80px 32px', background: 'rgba(26,92,56,0.04)', borderTop: '1px solid rgba(45,138,87,0.12)', borderBottom: '1px solid rgba(45,138,87,0.12)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 42px)', fontWeight: '900', marginBottom: '14px' }}>
              5 Dedicated{' '}
              <span style={{ background: 'linear-gradient(135deg, #f97316, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Role Portals</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>Each role gets a customized experience designed for their needs</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {roles.map(r => (
              <div key={r.title} className="feature-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(45,138,87,0.18)', borderRadius: '16px', padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{r.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>{r.title}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6' }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" style={{ padding: '96px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(30px)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏫</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '900', marginBottom: '16px', letterSpacing: '-0.5px' }}>
            <span style={{ background: 'linear-gradient(135deg, #f97316, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{SCHOOLS[selectedSchool]}</span>
          </h2>
          <h3 style={{ fontSize: 'clamp(20px, 2.5vw, 30px)', fontWeight: '700', color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>School Management Portal</h3>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', marginBottom: '36px', lineHeight: '1.7' }}>
            Access your school's complete management system. Students, fees, attendance, exams and communication — all from one secure portal.
          </p>

          <Link href="/login" style={{ display: 'inline-block', padding: '16px 52px', fontSize: '16px', fontWeight: '700', background: 'linear-gradient(135deg, #ea580c, #f97316)', color: 'white', borderRadius: '14px', textDecoration: 'none', boxShadow: '0 12px 40px rgba(234,88,12,0.4)' }}>
            🔑 Login to School Portal →
          </Link>
          <p style={{ marginTop: '20px', fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>
            Access is restricted to authorized staff, students and parents only.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'rgba(26,92,56,0.06)', borderTop: '1px solid rgba(45,138,87,0.15)', padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #1a5c38, #2d8a57)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏫</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: '900', fontSize: '17px', letterSpacing: '-0.5px' }}>School Management System</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>School ERP Portal</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {(Object.values(SCHOOLS) as string[]).map(name => (
            <span key={name} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', background: 'rgba(45,138,87,0.1)', border: '1px solid rgba(45,138,87,0.2)', borderRadius: '20px', padding: '4px 12px' }}>
              🏫 {name}
            </span>
          ))}
        </div>

        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', lineHeight: '1.8' }}>
          Developed for MJF Convent School & Chhatrapati Shivaji Higher Secondary School.<br />
          Powered by Next.js
        </p>
      </footer>
    </div>
  )
}
