import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Ticket,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  User,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PortalLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard',    path: '/portal' },
    { icon: <ClipboardList size={20} />,  label: 'Offerten',      path: '/portal/offers' },
    { icon: <FileText size={20} />,       label: 'Verträge',      path: '/portal/contracts' },
    { icon: <CreditCard size={20} />,     label: 'Rechnungen',    path: '/portal/invoices' },
    { icon: <Ticket size={20} />,         label: 'Tickets',       path: '/portal/tickets' },
    { icon: <Settings size={20} />,       label: 'Einstellungen', path: '/portal/settings' },
  ];

  return (
    <div className="portal-container">
      {/* Sidebar — desktop */}
      <aside className="portal-sidebar">
        <div className="sidebar-header">
          <div className="user-info">
            <div className="user-avatar">
              <User size={24} />
            </div>
            <div className="user-details">
              <p className="user-name">{user?.firstName} {user?.lastName}</p>
              <p className="user-role">{user?.role === 'customer' ? 'Kunde' : 'Mitarbeiter'}</p>
            </div>
          </div>
        </div>

        <nav className="portal-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/portal'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
              <ChevronRight className="chevron" size={16} />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} />
            <span>Abmelden</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="portal-main">
        <div className="portal-content">
          <Outlet />
        </div>
      </main>

      {/* Bottom nav — mobile only */}
      <nav className="portal-bottom-nav">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/portal'}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <style>{`
        .portal-container {
          display: flex;
          min-height: 100vh;
          background: var(--bg-main);
          color: var(--text-main);
          padding-top: var(--nav-height);
          transition: all 0.4s ease;
        }

        /* ── Sidebar ── */
        .portal-sidebar {
          width: 280px;
          background: var(--bg-section);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: var(--nav-height);
          bottom: 0;
          left: 0;
          z-index: 10;
          transition: all 0.4s ease;
        }

        .sidebar-header { padding: 32px 24px; border-bottom: 1px solid var(--border); }
        .user-info { display: flex; align-items: center; gap: 12px; }
        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        .user-name { font-weight: 700; font-size: 15px; margin: 0; color: var(--text-main); }
        .user-role { font-size: 12px; color: var(--text-muted); margin: 2px 0 0; }

        .portal-nav { flex: 1; padding: 24px 12px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: var(--text-muted);
          text-decoration: none;
          transition: all 0.25s ease;
          position: relative;
          font-size: 14px;
        }
        .nav-item:hover { background: rgba(0,242,255,0.05); color: var(--text-main); }
        .nav-item.active { background: var(--primary-glow); color: var(--primary); font-weight: 600; }
        .nav-item .chevron { margin-left: auto; opacity: 0; transition: all 0.25s ease; }
        .nav-item.active .chevron { opacity: 1; }

        .sidebar-footer { padding: 24px; border-top: 1px solid var(--border); }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px;
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          border-radius: 12px;
          transition: background 0.25s;
          font-size: 14px;
        }
        .logout-btn:hover { background: rgba(239, 68, 68, 0.1); }

        .portal-main {
          flex: 1;
          margin-left: 280px;
          padding: 40px;
          background: var(--bg-main);
          transition: all 0.4s ease;
          min-height: 100vh;
        }
        .portal-content { max-width: 1200px; margin: 0 auto; }

        /* ── Mobile bottom nav ── */
        .portal-bottom-nav { display: none; }

        /* ── Tablet: collapse sidebar to icons ── */
        @media (max-width: 1024px) and (min-width: 769px) {
          .portal-sidebar { width: 80px; }
          .user-details, .nav-item span, .nav-item .chevron, .logout-btn span { display: none; }
          .portal-main { margin-left: 80px; }
          .sidebar-header, .sidebar-footer { padding: 20px 0; display: flex; justify-content: center; }
          .user-avatar { margin: 0 auto; }
        }

        /* ── Mobile: hide sidebar, show bottom nav ── */
        @media (max-width: 768px) {
          .portal-sidebar { display: none; }
          .portal-main { margin-left: 0; padding: 20px 16px 90px; }

          .portal-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 100;
            background: var(--bg-section);
            border-top: 1px solid var(--border);
            padding: 8px 0 max(8px, env(safe-area-inset-bottom));
          }

          .bottom-nav-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            padding: 6px 4px;
            color: var(--text-muted);
            text-decoration: none;
            font-size: 10px;
            font-weight: 500;
            transition: color 0.2s;
          }
          .bottom-nav-item.active { color: var(--primary); }
          .bottom-nav-item svg { flex-shrink: 0; }
        }
      `}</style>
    </div>
  );
};

export default PortalLayout;
