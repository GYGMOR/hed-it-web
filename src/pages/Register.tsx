import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, User, ArrowRight, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          firstName, 
          lastName, 
          botVerificationChecked: true 
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.error || 'Registrierung fehlgeschlagen');
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
            <h2 className="premium-gradient" style={{ marginBottom: '12px' }}>Vielen Dank!</h2>
            <p style={{ color: 'var(--text-muted)' }}>Deine Registrierung ist eingegangen. Wir prüfen dein Konto und schalten dich in der Regel innerhalb von 24-48 Stunden frei.</p>
            <p style={{ color: 'var(--text-muted)', marginTop: '16px', fontSize: '14px' }}>Du erhältst eine Bestätigung per E-Mail, sobald du loslegen kannst.</p>
            <Link to="/login" className="btn btn-primary w-full" style={{ marginTop: '24px' }}>Zurück zum Login</Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-login">
      <div className="container" style={{ maxWidth: '500px', padding: '80px 20px' }}>
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center" style={{ marginBottom: '32px' }}>
            <h2 className="premium-gradient" style={{ fontSize: '32px', marginBottom: '12px' }}>Konto erstellen</h2>
            <p style={{ color: 'var(--text-muted)' }}>Werden Sie Teil unserer digitalen Welt.</p>
          </div>

          {error && (
            <motion.div 
              className="error-box"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleRegisterSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label><User size={16} /> Vorname</label>
                <input 
                  type="text" 
                  placeholder="Max" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label><User size={16} /> Nachname</label>
                <input 
                  type="text" 
                  placeholder="Mustermann" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label><Mail size={16} /> E-Mail Adresse</label>
              <input 
                type="email" 
                placeholder="name@firma.ch" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label><Lock size={16} /> Passwort</label>
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

            <button className="btn btn-primary w-full" disabled={isLoading} style={{ marginTop: '12px' }}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Jetzt registrieren'} <ArrowRight size={20} />
            </button>
          </form>

          <div className="text-center mt-6">
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              Bereits ein Konto? <Link to="/login" style={{ color: 'var(--primary)' }}>Hier anmelden</Link>
            </p>
          </div>
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
        .input-group { margin-bottom: 20px; }
        .input-group label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; }
        .input-group input { 
          width: 100%; 
          background: rgba(255,255,255,0.03); 
          border: 1px solid var(--border); 
          border-radius: 12px; 
          padding: 12px 16px; 
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

export default Register;
