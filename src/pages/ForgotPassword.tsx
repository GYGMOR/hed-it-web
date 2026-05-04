import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
      } else {
        setError(data.error || 'Fehler beim Senden der E-Mail');
      }
    } catch (err) {
      setError('Verbindung zum Server fehlgeschlagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-login">
      <div className="container" style={{ maxWidth: '450px', padding: '120px 20px' }}>
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', textDecoration: 'none' }}>
            <ChevronLeft size={16} /> Zurück zum Login
          </Link>

          <div className="text-center" style={{ marginBottom: '32px' }}>
            <h2 className="premium-gradient" style={{ fontSize: '32px', marginBottom: '12px' }}>Passwort vergessen?</h2>
            <p style={{ color: 'var(--text-muted)' }}>Kein Problem. Wir senden Ihnen einen Link zum Zurücksetzen.</p>
          </div>

          {isSuccess ? (
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                Falls ein Konto mit dieser E-Mail existiert, haben wir Ihnen Anweisungen zum Zurücksetzen gesendet.
              </p>
              <Link to="/login" className="btn btn-primary w-full">Zum Login</Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className="error-box">{error}</div>}
              
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

              <button className="btn btn-primary w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Link anfordern'} <ArrowRight size={20} />
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

export default ForgotPassword;
