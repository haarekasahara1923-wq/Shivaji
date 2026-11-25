'use client'

import { ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('gyankosh_cart') || '[]')
      setCartCount(cart.length)
    } catch { setCartCount(0) }
  }

  useEffect(() => {
    updateCartCount()
    window.addEventListener('gyankosh_cart_updated', updateCartCount)
    return () => window.removeEventListener('gyankosh_cart_updated', updateCartCount)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,18,8,0.95)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)', padding: '0 24px',
      height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <div style={{
          width: '38px', height: '38px',
          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <img src="/logo.png" alt="School Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <span style={{ fontSize: '18px', fontWeight: '800', color: 'white' }}>School<span style={{ color: '#f97316' }}> ERP</span></span>
      </Link>

      <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link href="/#features" style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>Features</Link>
        <Link href="/#roles" style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500', textDecoration: 'none' }}>Portals</Link>
        <Link href="/gyankosh" style={{ color: '#f97316', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>Study Material</Link>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link href="/gyankosh/cart" style={{ position: 'relative', color: 'white', display: 'flex', alignItems: 'center' }}>
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: '-10px', right: '-10px',
              background: '#ef4444', color: 'white', fontSize: '10px',
              width: '18px', height: '18px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
            }}>{cartCount}</span>
          )}
        </Link>

        <div className="hide-mobile" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Login</Link>
          <Link href="/login" style={{ 
            padding: '8px 18px', fontSize: '13px', background: 'linear-gradient(135deg, #f97316, #ea580c)', 
            color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' 
          }}>Portal Login 🚀</Link>
        </div>

        <div className="show-mobile" style={{ display: 'none', alignItems: 'center' }}>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ 
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', 
              color: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer' 
          }}>
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 99,
          background: 'var(--surface)', borderBottom: '1px solid var(--border)',
          padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          <Link href="/#features" onClick={() => setMobileMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>Features</Link>
          <Link href="/#roles" onClick={() => setMobileMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>Portals</Link>
          <Link href="/gyankosh" onClick={() => setMobileMenuOpen(false)} style={{ color: '#f97316', textDecoration: 'none', fontWeight: 'bold' }}>Study Material</Link>
          <Link href="/login" onClick={() => setMobileMenuOpen(false)} style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
