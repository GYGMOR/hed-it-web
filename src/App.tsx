import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import Services from './pages/Services';
import Support from './pages/Support';
import References from './pages/References';
import Contact from './pages/Contact';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import AGB from './pages/AGB';
import Configurator from './pages/Configurator';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PortalLayout from './pages/portal/PortalLayout';
import Dashboard from './pages/portal/Dashboard';
import Contracts from './pages/portal/Contracts';
import Tickets from './pages/portal/Tickets';
import Invoices from './pages/portal/Invoices';
import Settings from './pages/portal/Settings';
import Offers from './pages/portal/Offers';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { MessageCircle } from 'lucide-react';

/* ── Scroll to Top ── */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

/* ── Scroll Progress Bar ── */
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9998, height: 3, background: 'transparent', pointerEvents: 'none' }}>
      <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--primary), var(--secondary))', transition: 'width 0.1s linear', borderRadius: '0 2px 2px 0' }} />
    </div>
  );
};

/* ── Floating Contact Button ── */
const FloatingContact = () => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!visible) return null;
  return (
    <Link
      to="/contact"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        bottom: 32,
        right: 28,
        zIndex: 9000,
        display: 'flex',
        alignItems: 'center',
        gap: hovered ? 10 : 0,
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        color: '#000',
        textDecoration: 'none',
        borderRadius: 100,
        padding: hovered ? '14px 22px' : '14px',
        boxShadow: '0 8px 32px rgba(0,242,255,0.35)',
        transition: 'all 0.3s ease',
        fontWeight: 700,
        fontSize: 14,
        overflow: 'hidden',
        maxWidth: hovered ? 200 : 52,
        whiteSpace: 'nowrap',
      }}
    >
      <MessageCircle size={22} style={{ flexShrink: 0 }} />
      <span style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.2s', overflow: 'hidden' }}>Kontakt</span>
    </Link>
  );
};

/* ── Main Content ── */
const MainContent = ({ theme, toggleTheme }: { theme: 'dark' | 'light'; toggleTheme: () => void }) => {
  const location = useLocation();
  const isPortal = location.pathname.startsWith('/portal');
  const isAuth = ['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <div className="app-wrapper">
      <ScrollProgress />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/configurator" element={<Configurator />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Portal */}
          <Route element={<ProtectedRoute />}>
            <Route element={<PortalLayout />}>
              <Route path="/portal" element={<Dashboard />} />
              <Route path="/portal/offers" element={<Offers />} />
              <Route path="/portal/contracts" element={<Contracts />} />
              <Route path="/portal/tickets" element={<Tickets />} />
              <Route path="/portal/invoices" element={<Invoices />} />
              <Route path="/portal/settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="/references" element={<References />} />
          <Route path="/support" element={<Support />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/privacy" element={<Datenschutz />} />
          <Route path="/agb" element={<AGB />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isPortal && <Footer theme={theme} />}
      {!isPortal && !isAuth && <FloatingContact />}
      {!isPortal && <CookieBanner />}
    </div>
  );
};

function App() {
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark');
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <MainContent theme={theme} toggleTheme={toggleTheme} />
      </Router>
    </AuthProvider>
  );
}

export default App;
