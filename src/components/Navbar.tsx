import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, User, ChevronDown, Menu, X, Calculator, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoLight from '../assets/logos/logo-light.png';
import logoDark from '../assets/logos/logo-dark.png';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const { token } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const logoSrc = theme === 'light' ? logoLight : logoDark;

  return (
    <>
      <nav className="navbar" style={{ boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.18)' : undefined }}>
        <div className="container nav-content">
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img
              src={logoSrc}
              alt="hed-it Logo"
              style={{ height: 38, width: 'auto', display: 'block' }}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}>Dienstleistungen</Link>
            <Link to="/references" className={`nav-link ${location.pathname === '/references' ? 'active' : ''}`}>Referenzen</Link>
            <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Kontakt</Link>

            <div className="dropdown">
              <button className="dropdown-trigger">
                Mehr <ChevronDown size={14} />
              </button>
              <div className="dropdown-menu">
                <Link to="/calculator" className={`dropdown-item ${location.pathname === '/calculator' ? 'active' : ''}`}>
                  <Calculator size={16} /> Kalkulator
                </Link>
                <Link to="/support" className={`dropdown-item ${location.pathname === '/support' ? 'active' : ''}`}>
                  <MessageSquare size={16} /> Support
                </Link>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button className="theme-toggle" onClick={toggleTheme} title="Theme wechseln">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="hidden lg-flex items-center gap-4">
              {token ? (
                <Link to="/portal" className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '14px', textDecoration: 'none', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <User size={18} /> Portal
                </Link>
              ) : (
                <Link to="/login" className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '14px', textDecoration: 'none' }}>
                  Login
                </Link>
              )}
              <Link to="/calculator" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px', textDecoration: 'none' }}>
                Projekt starten
              </Link>
            </div>

            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`drawer-overlay ${isMobileMenuOpen ? 'visible' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        {/* Logo in drawer */}
        <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--border)' }}>
          <img src={logoSrc} alt="hed-it Logo" style={{ height: 32, width: 'auto' }} />
        </div>

        <div className="mobile-nav-links">
          <Link to="/" className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/services" className={`mobile-nav-link ${location.pathname === '/services' ? 'active' : ''}`}>Dienstleistungen</Link>
          <Link to="/references" className={`mobile-nav-link ${location.pathname === '/references' ? 'active' : ''}`}>Referenzen</Link>
          <Link to="/contact" className={`mobile-nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Kontakt</Link>
          <Link to="/calculator" className={`mobile-nav-link ${location.pathname === '/calculator' ? 'active' : ''}`}>Kalkulator</Link>
          <Link to="/support" className={`mobile-nav-link ${location.pathname === '/support' ? 'active' : ''}`}>Support</Link>
        </div>

        <div className="mobile-footer">
          {token ? (
            <Link to="/portal" className="btn btn-primary w-full">Kundenportal</Link>
          ) : (
            <Link to="/login" className="btn btn-outline w-full">Login</Link>
          )}
          <Link to="/calculator" className="btn btn-primary w-full">Projekt starten</Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
