import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => (
  <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ textAlign: 'center', maxWidth: 560 }}
    >
      {/* Glitch 404 */}
      <div style={{ position: 'relative', marginBottom: 32 }}>
        <div style={{
          fontSize: 160,
          fontWeight: 900,
          lineHeight: 1,
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          userSelect: 'none',
          letterSpacing: -4,
        }}>
          404
        </div>
        {/* Shadow / glitch layer */}
        <div style={{
          position: 'absolute',
          top: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 160,
          fontWeight: 900,
          lineHeight: 1,
          color: 'var(--secondary)',
          opacity: 0.08,
          letterSpacing: -4,
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          404
        </div>
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, color: 'var(--text-main)' }}>
        Seite nicht gefunden
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
        Die gesuchte Seite existiert nicht oder wurde verschoben. Kein Problem — von hier aus finden Sie den Weg zurück.
      </p>

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Home size={18} /> Zur Startseite
        </Link>
        <button onClick={() => window.history.back()} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ArrowLeft size={18} /> Zurück
        </button>
      </div>

      <div style={{ marginTop: 56, display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          { label: 'Dienstleistungen', to: '/services' },
          { label: 'Kalkulator', to: '/calculator' },
          { label: 'Kontakt', to: '/contact' },
          { label: 'Support', to: '/support' },
        ].map(l => (
          <Link key={l.to} to={l.to} style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
            <Search size={13} /> {l.label}
          </Link>
        ))}
      </div>
    </motion.div>
  </div>
);

export default NotFound;
