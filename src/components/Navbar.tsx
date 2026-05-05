import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, User, ChevronDown, Menu, X, Info, Calculator, MessageSquare, Phone, LayoutGrid } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const { token } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on location change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="navbar">
        <div className="container nav-content">
          <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="logo-icon">H</div>
            <span>hed-it<span className="premium-gradient">.ch</span></span>
          </Link>
          
          <div className="nav-links">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}>Dienstleistungen</Link>
            
            <div className="dropdown">
              <button className="dropdown-trigger">
                Mehr <ChevronDown size={14} />
              </button>
              <div className="dropdown-menu">
                <Link to="/references" className={`dropdown-item ${location.pathname === '/references' ? 'active' : ''}`}>
                  <LayoutGrid size={16} /> Referenzen
                </Link>
                <Link to="/calculator" className={`dropdown-item ${location.pathname === '/calculator' ? 'active' : ''}`}>
                  <Calculator size={16} /> Kalkulator
                </Link>
                <Link to="/support" className={`dropdown-item ${location.pathname === '/support' ? 'active' : ''}`}>
                  <MessageSquare size={16} /> Support
                </Link>
                <Link to="/contact" className={`dropdown-item ${location.pathname === '/contact' ? 'active' : ''}`}>
                  <Phone size={16} /> Kontakt
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="hidden lg-flex items-center gap-4">
              {token ? (
                <Link to="/portal" className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '14px', textDecoration: 'none', display: 'flex', gap: '8px' }}>
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
        <div className="mobile-nav-links">
          <Link to="/" className={`mobile-nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/services" className={`mobile-nav-link ${location.pathname === '/services' ? 'active' : ''}`}>Dienstleistungen</Link>
          <Link to="/references" className={`mobile-nav-link ${location.pathname === '/references' ? 'active' : ''}`}>Referenzen</Link>
          <Link to="/calculator" className={`mobile-nav-link ${location.pathname === '/calculator' ? 'active' : ''}`}>Kalkulator</Link>
          <Link to="/support" className={`mobile-nav-link ${location.pathname === '/support' ? 'active' : ''}`}>Support</Link>
          <Link to="/contact" className={`mobile-nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Kontakt</Link>
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
