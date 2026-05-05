import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Key, 
  Smartphone, 
  CheckCircle2, 
  Loader2,
  Copy,
  ArrowRight,
  User,
  Building2,
  Mail,
  Globe,
  MapPin,
  Phone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user, token } = useAuth();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [setupStep, setSetupStep] = useState<'idle' | 'qr' | 'verify'>('idle');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: '',
    companyName: '',
    website: '',
    industry: '',
    address: ''
  });

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/portal/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setProfile({
          firstName: data.data.contact.first_name || user?.firstName || '',
          lastName: data.data.contact.last_name || user?.lastName || '',
          phone: data.data.contact.phone || '',
          companyName: data.data.company?.name || '',
          website: data.data.company?.website || '',
          industry: data.data.company?.industry || '',
          address: data.data.company?.address || ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile');
    }
  };

  const fetch2FAStatus = async () => {
    try {
      const response = await fetch('/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setIs2FAEnabled(data.user.two_factor_enabled);
      }
    } catch (err) {
      console.error('Failed to fetch user status');
    }
  };

  useEffect(() => {
    fetch2FAStatus();
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/portal/profile', {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(profile)
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Profil erfolgreich aktualisiert' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Fehler beim Aktualisieren' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSetup = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setQrCode(data.qrCodeUrl);
        setSecret(data.secret);
        setSetupStep('qr');
      } else {
        setMessage({ type: 'error', text: data.error || 'Setup fehlgeschlagen' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Setup fehlgeschlagen' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySetup = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: verificationCode })
      });
      const data = await response.json();
      if (data.success) {
        setIs2FAEnabled(true);
        setSetupStep('idle');
        setMessage({ type: 'success', text: '2FA erfolgreich aktiviert' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Ungültiger Code' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Verifizierung fehlgeschlagen' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="portal-settings">
      <header className="settings-header">
        <h1 className="premium-gradient">Einstellungen</h1>
        <p>Verwalten Sie Ihr Konto und Ihre Sicherheitseinstellungen.</p>
      </header>

      <div className="settings-grid">
        <section className="settings-section">
          <div className="section-title">
            <User size={20} />
            <h3>Profil & Firma</h3>
          </div>
          <form onSubmit={handleUpdateProfile} className="settings-form">
            <div className="form-row">
              <div className="form-group">
                <label><User size={14} /> Vorname</label>
                <input type="text" value={profile.firstName} onChange={(e) => setProfile({...profile, firstName: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Nachname</label>
                <input type="text" value={profile.lastName} onChange={(e) => setProfile({...profile, lastName: e.target.value})} />
              </div>
            </div>
            
            <div className="form-group">
              <label><Phone size={14} /> Telefon</label>
              <input type="text" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} placeholder="+41 79 000 00 00" />
            </div>

            <div className="form-group">
              <label><Building2 size={14} /> Firmenname</label>
              <input type="text" value={profile.companyName} onChange={(e) => setProfile({...profile, companyName: e.target.value})} placeholder="Muster GmbH" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><Globe size={14} /> Webseite</label>
                <input type="text" value={profile.website} onChange={(e) => setProfile({...profile, website: e.target.value})} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>Branche</label>
                <input type="text" value={profile.industry} onChange={(e) => setProfile({...profile, industry: e.target.value})} placeholder="IT / Bau / Gastro..." />
              </div>
            </div>

            <div className="form-group">
              <label><MapPin size={14} /> Adresse</label>
              <textarea rows={3} value={profile.address} onChange={(e) => setProfile({...profile, address: e.target.value})} placeholder="Strasse 123, 8000 Zürich" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ marginTop: '12px' }}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Profil speichern'}
            </button>
          </form>
        </section>

        <div className="settings-side">
          <section className="settings-section">
            <div className="section-title">
              <Key size={20} />
              <h3>Sicherheit</h3>
            </div>

            <div className="security-card">
              <div className="security-item">
                <div className="item-info">
                  <Shield size={24} className={is2FAEnabled ? 'text-success' : 'text-muted'} />
                  <div>
                    <p className="item-title">2FA</p>
                    <p className="item-desc">Authenticator App</p>
                  </div>
                </div>
                <div className="item-action">
                  {is2FAEnabled ? (
                    <span className="status-badge success"><CheckCircle2 size={14} /> Aktiv</span>
                  ) : (
                    <button className="btn btn-outline small" onClick={handleStartSetup}>Einrichten</button>
                  )}
                </div>
              </div>

              {setupStep !== 'idle' && (
                <motion.div 
                  className="setup-container"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  {setupStep === 'qr' ? (
                    <div className="qr-setup">
                      <p>Scannen Sie den QR-Code:</p>
                      <div className="qr-frame">
                        {qrCode && <img src={qrCode} alt="QR Code" />}
                      </div>
                      <div className="secret-box">
                        <code>{secret}</code>
                        <button className="copy-btn" onClick={() => navigator.clipboard.writeText(secret || '')}><Copy size={14} /></button>
                      </div>
                      <button className="btn btn-primary w-full mt-6" onClick={() => setSetupStep('verify')}>
                        Weiter <ArrowRight size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="verify-setup">
                      <p>6-stelliger Code:</p>
                      <div className="code-input">
                        <input 
                          type="text" 
                          maxLength={6}
                          placeholder="000000"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        />
                      </div>
                      <button className="btn btn-primary w-full mt-4" onClick={handleVerifySetup} disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Aktivieren'}
                      </button>
                      <button className="btn btn-text w-full mt-2" onClick={() => setSetupStep('qr')}>Zurück</button>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </section>

          <section className="settings-section mt-8">
            <div className="section-title">
              <Smartphone size={20} />
              <h3>Sitzungen</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Keine weiteren aktiven Sitzungen.</p>
          </section>
        </div>
      </div>

      {message && (
        <motion.div 
          className={`toast ${message.type}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setMessage(null)}
        >
          {message.text}
        </motion.div>
      )}

      <style>{`
        .portal-settings { display: flex; flex-direction: column; gap: 40px; }
        .settings-header h1 { font-size: 32px; margin-bottom: 8px; }
        .settings-header p { color: var(--text-muted); }

        .settings-grid { display: grid; gap: 32px; }
        @media (min-width: 1024px) { .settings-grid { grid-template-columns: 2fr 1.2fr; } }

        .settings-section { 
          background: var(--bg-card); 
          border: 1px solid var(--border); 
          border-radius: 24px; 
          padding: 32px; 
          height: fit-content;
        }
        .section-title { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; color: var(--primary); }
        .section-title h3 { font-size: 18px; margin: 0; color: var(--text-main); }

        .settings-form { display: flex; flex-direction: column; gap: 20px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 600; color: var(--text-muted); display: flex; align-items: center; gap: 6px; }
        .form-group input, .form-group textarea {
          background: var(--bg-section);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 16px;
          color: var(--text-main);
          font-family: inherit;
          font-size: 14px;
          transition: border-color 0.3s;
        }
        .form-group input:focus { border-color: var(--primary); outline: none; }

        .mt-8 { margin-top: 32px; }
        .w-full { width: 100%; }
        .mt-4 { margin-top: 16px; }
        .mt-6 { margin-top: 24px; }
        .mt-2 { margin-top: 8px; }
        .text-success { color: #10b981; }

        .security-card { display: flex; flex-direction: column; gap: 24px; }
        .security-item { display: flex; justify-content: space-between; align-items: center; }
        .item-info { display: flex; gap: 16px; align-items: center; }
        .item-title { font-weight: 700; margin: 0; color: var(--text-main); }
        .item-desc { font-size: 12px; color: var(--text-muted); margin: 2px 0 0; }
        
        .status-badge { display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; }
        .status-badge.success { background: rgba(16,185,129,0.1); color: #10b981; }

        .setup-container { margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border); }
        .qr-setup { text-align: center; }
        .qr-frame { background: white; padding: 16px; border-radius: 16px; display: inline-block; margin: 12px 0; }
        .qr-frame img { width: 160px; height: 160px; display: block; }
        
        .secret-box { 
          background: var(--bg-section); 
          padding: 10px; 
          border-radius: 10px; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          gap: 10px; 
          font-size: 12px;
          border: 1px solid var(--border);
        }
        .secret-box code { color: var(--primary); font-weight: 700; font-family: monospace; }
        .copy-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; transition: color 0.2s; }
        .copy-btn:hover { color: var(--primary); }

        .code-input input { 
          width: 100%; 
          background: var(--bg-section); 
          border: 1px solid var(--border); 
          border-radius: 12px; 
          padding: 12px; 
          text-align: center; 
          font-size: 20px; 
          letter-spacing: 4px;
          color: var(--text-main);
          outline: none;
        }

        .btn-text { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 13px; font-weight: 600; }
        .btn-text:hover { color: var(--text-main); }
        .btn.small { padding: 8px 16px; font-size: 12px; }

        .toast { 
          position: fixed; 
          bottom: 32px; 
          right: 32px; 
          padding: 14px 24px; 
          border-radius: 12px; 
          color: white; 
          z-index: 1000; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.3); 
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .toast.success { background: #10b981; }
        .toast.error { background: #ef4444; }
      `}</style>
    </div>
  );
};

export default Settings;
