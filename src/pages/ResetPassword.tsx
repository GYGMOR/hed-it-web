import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein.');
      setIsLoading(false);
      return;
    }

    if (!token) {
      setError('Ungültiger Reset-Link.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.error || 'Fehler beim Zurücksetzen');
      }
    } catch (err) {
      setError('Verbindung zum Server fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="page-login">
        <div className="container" style={{ maxWidth: '450px', padding: '120px 20px' }}>
          <motion.div 
            className="login-card text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle2 size={64} color="#10b981" style={{ margin: '0 auto 24px' }} />
            <h2 className="premium-gradient" style={{ marginBottom: '12px' }}>Erfolg!</h2>
            <p style={{ color: 'var(--text-muted)' }}>Dein Passwort wurde geändert. Du wirst gleich zum Login weitergeleitet...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-login">
      <div className="container" style={{ maxWidth: '450px', padding: '120px 20px' }}>
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center" style={{ marginBottom: '32px' }}>
            <h2 className="premium-gradient" style={{ fontSize: '32px', marginBottom: '12px' }}>Neues Passwort</h2>
            <p style={{ color: 'var(--text-muted)' }}>Wählen Sie ein sicheres neues Passwort.</p>
          </div>

          {!token ? (
            <div className="error-box">Kein gültiger Token gefunden.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className="error-box">{error}</div>}
              
              <div className="input-group">
                <label><Lock size={16} /> Neues Passwort</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label><Lock size={16} /> Passwort bestätigen</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button className="btn btn-primary w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Passwort speichern'} <ArrowRight size={20} />
              </button>
            </form>
          )}
        </motion.div>
      </div>

      <style>{`
        .page-login { min-height: 90vh; display: flex; align-items: center; justify-content: center; }
        .login-card { 
          background: var(--bg-card); 
          border: 1px solid var(--border); 
          border-radius: 24px; 
          padding: 40px; 
          box-shadow: 0 40px 100px rgba(0,0,0,0.3);
        }
        .input-group { margin-bottom: 24px; }
        .input-group label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; }
        .input-group input { 
          width: 100%; 
          background: rgba(255,255,255,0.03); 
          border: 1px solid var(--border); 
          border-radius: 12px; 
          padding: 14px 18px; 
          color: white; 
          outline: none;
          transition: all 0.3s ease;
        }
        .input-group input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-glow); }
        .error-box { 
          background: rgba(239, 68, 68, 0.1); 
          border: 1px solid rgba(239, 68, 68, 0.2); 
          color: #ef4444; 
          padding: 12px; 
          border-radius: 8px; 
          font-size: 14px; 
          margin-bottom: 24px; 
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;
