import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X, Check } from 'lucide-react';

const COOKIE_KEY = 'hedit_cookie_consent';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => { localStorage.setItem(COOKIE_KEY, 'accepted'); setVisible(false); };
  const decline = () => { localStorage.setItem(COOKIE_KEY, 'declined'); setVisible(false); };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: 24,
      right: 24,
      zIndex: 9999,
      maxWidth: 520,
      background: 'var(--bg-section)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      padding: '24px 28px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      animation: 'slide-up 0.4s ease',
    }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(0,242,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Cookie size={20} color="var(--primary)" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 6px', color: 'var(--text-main)' }}>Nur technisch notwendige Cookies</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            Wir verwenden ausschliesslich technisch notwendige Cookies für den Betrieb dieser Website. Kein Tracking, kein Google Analytics.{' '}
            <Link to="/privacy" style={{ color: 'var(--primary)' }}>Datenschutzerklärung</Link>
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <button onClick={accept} className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 16px', fontSize: 13 }}>
          <Check size={15} /> Akzeptieren
        </button>
        <button onClick={decline} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 16px', fontSize: 13, background: 'none', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-muted)', cursor: 'pointer', transition: 'border-color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text-muted)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
          <X size={15} /> Ablehnen
        </button>
      </div>
      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default CookieBanner;
