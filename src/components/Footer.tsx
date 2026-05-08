import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe, MapPin } from 'lucide-react';
import logoLight from '../assets/logos/logo-light.png';
import logoDark from '../assets/logos/logo-dark.png';

interface FooterProps {
  theme: 'dark' | 'light';
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  const logoSrc = theme === 'light' ? logoLight : logoDark;

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" style={{ display: 'inline-block', marginBottom: 16 }}>
            <img src={logoSrc} alt="hed-it Logo" style={{ height: 36, width: 'auto' }} />
          </Link>
          <p className="footer-desc">
            Spezialisiert auf High-End Webentwicklung, Cloud-Migrationen und moderne Infrastruktur-Systeme in der Schweiz.
          </p>
        </div>

        <div className="footer-links">
          <h4>Rechtliches</h4>
          <ul className="footer-list">
            <li><Link to="/impressum" className="nav-link" style={{ fontSize: '12px' }}>Impressum</Link></li>
            <li><Link to="/privacy" className="nav-link" style={{ fontSize: '12px' }}>Datenschutz</Link></li>
            <li><Link to="/agb" className="nav-link" style={{ fontSize: '12px' }}>AGB</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Kontakt</h4>
          <ul className="footer-list">
            <li>
              <a href="mailto:info@hed-it.ch" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                <Mail size={15} /> info@hed-it.ch
              </a>
            </li>
            <li>
              <a href="https://hed-it.ch" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                <Globe size={15} /> www.hed-it.ch
              </a>
            </li>
            <li>
              <a href="https://maps.google.com/?q=Baar+Kanton+Zug+Schweiz" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                <MapPin size={15} /> Baar, Kanton Zug, Schweiz
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} hed-it. All Rights Reserved. Engineered for Performance.</p>
        <div className="footer-legal-links">
          <Link to="/support">Support-Portal</Link>
          <Link to="/calculator">Kalkulator</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
