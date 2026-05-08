import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Activity,
  FileText,
  Ticket,
  CreditCard,
  ClipboardList,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ActivityItem {
  title: string;
  time: string;
  type: 'ticket' | 'invoice' | 'contract' | 'offer';
  date: string;
}

const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Vor ${mins} Minuten`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Vor ${hrs} Stunde${hrs > 1 ? 'n' : ''}`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Gestern';
  if (days < 7) return `Vor ${days} Tagen`;
  return new Date(dateStr).toLocaleDateString('de-CH');
};

const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [dashData, setDashData] = useState<any>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const headers = { 'Authorization': `Bearer ${token}` };

    const fetchAll = async () => {
      try {
        const [dashRes, invRes, ticketRes] = await Promise.all([
          fetch('/api/portal/dashboard', { headers }),
          fetch('/api/portal/invoices', { headers }),
          fetch('/api/portal/tickets', { headers }),
        ]);

        const [dashJson, invJson, ticketJson] = await Promise.all([
          dashRes.json(),
          invRes.json(),
          ticketRes.json(),
        ]);

        if (dashJson.success) setDashData(dashJson.data);

        const items: ActivityItem[] = [];

        if (invJson.success && Array.isArray(invJson.data)) {
          invJson.data.slice(0, 5).forEach((inv: any) => {
            const statusLabel = inv.status === 'paid' ? 'bezahlt' : inv.status === 'overdue' ? 'überfällig' : 'erstellt';
            items.push({
              title: `Rechnung ${inv.invoice_number} ${statusLabel}`,
              time: timeAgo(inv.created_at),
              type: 'invoice',
              date: inv.created_at,
            });
          });
        }

        if (ticketJson.success && Array.isArray(ticketJson.data)) {
          ticketJson.data.slice(0, 5).forEach((t: any) => {
            const statusLabel = t.status === 'closed' ? 'geschlossen' : t.status === 'in_progress' ? 'in Bearbeitung' : 'geöffnet';
            items.push({
              title: `Ticket #${t.ticket_number || t.id.slice(0, 6)} ${statusLabel}`,
              time: timeAgo(t.created_at),
              type: 'ticket',
              date: t.created_at,
            });
          });
        }

        items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setActivities(items.slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  const stats = [
    {
      label: 'Aktive Verträge',
      value: loading ? '–' : String(dashData?.activeContracts || 0),
      icon: <CheckCircle2 size={24} color="var(--primary)" />,
      trend: (dashData?.activeContracts || 0) > 0 ? `${dashData.activeContracts} aktiv` : 'Keine',
      path: '/portal/contracts',
    },
    {
      label: 'Offene Tickets',
      value: loading ? '–' : String(dashData?.openTickets || 0),
      icon: <Clock size={24} color="#f59e0b" />,
      trend: (dashData?.openTickets || 0) > 0 ? 'In Bearbeitung' : 'Alles erledigt',
      path: '/portal/tickets',
    },
    {
      label: 'Offene Rechnungen',
      value: loading ? '–' : String(dashData?.openInvoices || 0),
      icon: <AlertCircle size={24} color="#ef4444" />,
      trend: (dashData?.openInvoices || 0) > 0 ? 'Ausstehend' : 'Alles bezahlt',
      path: '/portal/invoices',
    },
  ];

  const quickLinks = [
    { icon: <ClipboardList size={20} />, label: 'Offerten',   path: '/portal/offers',    color: 'var(--primary)' },
    { icon: <FileText size={20} />,      label: 'Verträge',   path: '/portal/contracts', color: 'var(--secondary)' },
    { icon: <CreditCard size={20} />,    label: 'Rechnungen', path: '/portal/invoices',  color: '#10b981' },
    { icon: <Ticket size={20} />,        label: 'Tickets',    path: '/portal/tickets',   color: '#f59e0b' },
  ];

  const dotColor: Record<string, string> = {
    ticket:   'var(--primary)',
    invoice:  '#10b981',
    contract: 'var(--secondary)',
    offer:    '#f59e0b',
  };

  return (
    <div className="portal-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="premium-gradient">Guten Tag, {user?.firstName}!</h1>
        <p>Hier finden Sie eine Übersicht über Ihre digitalen Services und Anfragen.</p>
      </header>

      {/* KPI Stats */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(stat.path)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
              <span className="stat-trend">{stat.trend}</span>
            </div>
            <ArrowUpRight size={16} style={{ color: 'var(--text-muted)', marginLeft: 'auto', alignSelf: 'flex-start', opacity: 0.5 }} />
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {quickLinks.map((q, i) => (
          <motion.button
            key={i}
            onClick={() => navigate(q.path)}
            className="quick-link-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.07 }}
            whileHover={{ y: -3 }}
          >
            <div style={{ color: q.color, marginBottom: 8 }}>{q.icon}</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>{q.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Activity list */}
        <section className="dashboard-section main-section">
          <div className="section-header">
            <h3>Letzte Aktivitäten</h3>
            <button className="btn-text" onClick={() => navigate('/portal/tickets')}>
              Alle Tickets <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="activity-list">
            {loading ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 14, padding: '20px 0' }}>Wird geladen...</div>
            ) : activities.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 14, padding: '24px 0', textAlign: 'center' }}>
                Noch keine Aktivitäten vorhanden.
              </div>
            ) : (
              activities.map((act, i) => (
                <motion.div
                  key={i}
                  className="activity-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  <div className="activity-dot" style={{ background: dotColor[act.type], boxShadow: `0 0 8px ${dotColor[act.type]}55` }} />
                  <div className="activity-info">
                    <p className="activity-title">{act.title}</p>
                    <p className="activity-time">{act.time}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* System status */}
        <aside className="dashboard-section side-section">
          <div className="section-header">
            <h3>System-Status</h3>
            <Activity size={16} color="#10b981" />
          </div>
          <div className="status-card">
            {[
              { label: 'Webseite',              status: 'Online' },
              { label: 'E-Mail (M365)',          status: 'Online' },
              { label: 'Hosting-Infrastruktur', status: 'Optimal' },
            ].map((s, i) => (
              <div key={i} className="status-row">
                <span style={{ fontSize: 14 }}>{s.label}</span>
                <span className="badge success">{s.status}</span>
              </div>
            ))}
          </div>
          <div className="support-cta">
            <p>Probleme mit einem Service?</p>
            <button
              className="btn btn-outline w-full mt-2"
              style={{ padding: '10px' }}
              onClick={() => navigate('/portal/tickets?new=true')}
            >
              Support kontaktieren
            </button>
          </div>
        </aside>
      </div>

      <style>{`
        .portal-dashboard { display: flex; flex-direction: column; gap: 32px; }
        .dashboard-header h1 { font-size: 36px; margin-bottom: 8px; }
        .dashboard-header p { color: var(--text-muted); margin: 0; }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
        .stat-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          gap: 20px;
          align-items: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .stat-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
        .stat-icon { width: 52px; height: 52px; background: rgba(255,255,255,0.04); border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .stat-label { font-size: 12px; color: var(--text-muted); margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-value { font-size: 30px; font-weight: 800; margin: 4px 0; }
        .stat-trend { font-size: 12px; color: var(--primary); font-weight: 600; }

        .quick-link-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .quick-link-card:hover { border-color: var(--primary); box-shadow: 0 4px 20px rgba(0,242,255,0.1); }

        .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; }
        .dashboard-section { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; padding: 28px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
        .section-header h3 { font-size: 17px; margin: 0; font-weight: 700; }
        .btn-text { background: none; border: none; color: var(--primary); display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 13px; font-weight: 600; }

        .activity-list { display: flex; flex-direction: column; gap: 20px; }
        .activity-item { display: flex; gap: 16px; align-items: center; }
        .activity-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .activity-title { font-weight: 600; font-size: 14px; margin: 0; }
        .activity-time { font-size: 12px; color: var(--text-muted); margin: 2px 0 0; }

        .status-card { display: flex; flex-direction: column; gap: 14px; }
        .status-row { display: flex; justify-content: space-between; align-items: center; }
        .badge { padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
        .badge.success { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.2); }
        .support-cta { margin-top: 28px; padding-top: 24px; border-top: 1px solid var(--border); text-align: center; font-size: 13px; color: var(--text-muted); }

        @media (max-width: 992px) {
          .dashboard-grid { grid-template-columns: 1fr; }
          .quick-link-card-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .dashboard-header h1 { font-size: 26px; }
          .stats-grid { grid-template-columns: 1fr; }
          .dashboard-grid > div:nth-child(2) { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
