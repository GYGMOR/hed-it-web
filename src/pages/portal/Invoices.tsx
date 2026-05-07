import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Plus,
  X,
  Trash2
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

interface Invoice {
  id: string;
  invoice_number: string;
  status: 'paid' | 'open' | 'overdue' | 'sent';
  amount: number;
  due_date: string;
  created_at: string;
  title: string;
}

interface PaymentCard {
  number: string;
  expiry: string;
  holder: string;
}

const Invoices = () => {
  const { token, user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [savedCard, setSavedCard] = useState<PaymentCard | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvc: '', holder: '' });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  const CARD_STORAGE_KEY = `hed_payment_card_${user?.id || 'unknown'}`;

  // Load saved card from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CARD_STORAGE_KEY);
      if (stored) {
        setSavedCard(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved card', e);
    }
  }, [CARD_STORAGE_KEY]);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/portal/invoices', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setInvoices(data.data || []);
    } catch (err) {
      console.error('Failed to fetch invoices');
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const formatCardNumber = (value: string) => {
    const nums = value.replace(/\D/g, '').substring(0, 16);
    return nums.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const nums = value.replace(/\D/g, '').substring(0, 4);
    if (nums.length >= 3) return nums.substring(0, 2) + '/' + nums.substring(2);
    return nums;
  };

  const validateCard = () => {
    const errors: Record<string, string> = {};
    const rawNumber = cardForm.number.replace(/\s/g, '');
    
    if (rawNumber.length < 13 || rawNumber.length > 16) {
      errors.number = 'Kartennummer muss 13-16 Ziffern haben';
    }
    if (!cardForm.expiry || cardForm.expiry.length < 5) {
      errors.expiry = 'Gültiges Format: MM/YY';
    }
    if (!cardForm.cvc || cardForm.cvc.length < 3) {
      errors.cvc = 'CVC muss 3-4 Ziffern haben';
    }
    if (!cardForm.holder.trim()) {
      errors.holder = 'Name ist erforderlich';
    }
    
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCard = () => {
    if (!validateCard()) return;
    
    const rawNumber = cardForm.number.replace(/\s/g, '');
    const card: PaymentCard = {
      number: rawNumber.substring(rawNumber.length - 4),
      expiry: cardForm.expiry,
      holder: cardForm.holder.trim()
    };
    
    localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(card));
    setSavedCard(card);
    setShowCardModal(false);
    setCardForm({ number: '', expiry: '', cvc: '', holder: '' });
    setCardErrors({});
  };

  const handleRemoveCard = () => {
    localStorage.removeItem(CARD_STORAGE_KEY);
    setSavedCard(null);
  };

  const getCardBrand = (last4: string) => {
    // Simple heuristic for demo
    return 'Kreditkarte';
  };

  return (
    <div className="portal-invoices">
      <header className="section-header">
        <div>
          <h1 className="premium-gradient">Rechnungen & Zahlungen</h1>
          <p>Verfolgen Sie Ihre Zahlungen und laden Sie Belege herunter.</p>
        </div>
      </header>

      <div className="invoices-table-container">
        <table className="invoices-table">
          <thead>
            <tr>
              <th>Nummer</th>
              <th>Datum</th>
              <th>Fällig am</th>
              <th>Betrag</th>
              <th>Status</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="inv-num"><FileText size={16} /> {inv.invoice_number || `RE-${inv.id.substring(0,4).toUpperCase()}`}</td>
                <td>{new Date(inv.created_at).toLocaleDateString()}</td>
                <td>{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '-'}</td>
                <td className="inv-amount">{parseFloat(String(inv.amount || 0)).toFixed(2)} chf</td>
                <td>
                  <span className={`status-pill ${inv.status}`}>
                    {inv.status === 'paid' ? <CheckCircle2 size={14} /> : inv.status === 'overdue' ? <AlertCircle size={14} /> : <Clock size={14} />}
                    {inv.status === 'open' || inv.status === 'sent' ? 'Offen' : inv.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button 
                      className="btn-icon-small" 
                      title="Rechnung PDF"
                      onClick={() => window.open(`/api/invoices/${inv.id}/pdf`, '_blank')}
                    >
                      <Download size={16} />
                    </button>
                    {(inv.status === 'open' || inv.status === 'sent') && (
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '6px 12px', fontSize: 11, height: 'auto' }}
                        onClick={() => alert('Demo-Zahlung wird gestartet (TWINT / Apple Pay)...')}
                      >
                        Bezahlen
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="empty-state">Keine Rechnungen gefunden.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="billing-settings mt-12">
        <div className="section-title">
          <h3>Zahlungsmethode</h3>
        </div>
        
        {savedCard ? (
          <div className="payment-card">
            <div className="card-info">
              <div className="card-icon"><CreditCard size={24} /></div>
              <div>
                <p className="card-type">{getCardBrand(savedCard.number)} ({savedCard.holder})</p>
                <p className="card-num">•••• •••• •••• {savedCard.number}</p>
                <p className="card-expiry">Gültig bis: {savedCard.expiry}</p>
              </div>
            </div>
            <div className="card-actions">
              <button className="btn btn-outline" onClick={() => { setShowCardModal(true); setCardForm({ number: '', expiry: '', cvc: '', holder: '' }); }}>Ändern</button>
              <button className="btn-icon-remove" onClick={handleRemoveCard} title="Entfernen"><Trash2 size={18} /></button>
            </div>
          </div>
        ) : (
          <div className="payment-card empty-payment">
            <div className="card-info">
              <div className="card-icon empty"><CreditCard size={24} /></div>
              <div>
                <p className="card-type">Keine Zahlungsmethode hinterlegt</p>
                <p className="card-num-hint">Hinterlegen Sie eine Kreditkarte für automatische Zahlungen.</p>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => setShowCardModal(true)}>
              <Plus size={18} /> Hinzufügen
            </button>
          </div>
        )}
      </div>

      {/* Card Modal */}
      <AnimatePresence>
        {showCardModal && (
          <div className="modal-overlay" onClick={() => setShowCardModal(false)}>
            <motion.div 
              className="modal-content card-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Zahlungsmethode hinzufügen</h3>
                <button className="close-btn" onClick={() => setShowCardModal(false)}><X size={20} /></button>
              </div>

              <div className="card-form">
                <div className="form-group">
                  <label>Karteninhaber</label>
                  <input 
                    type="text" 
                    placeholder="Max Mustermann"
                    value={cardForm.holder}
                    onChange={(e) => setCardForm({ ...cardForm, holder: e.target.value })}
                    className={cardErrors.holder ? 'error' : ''}
                  />
                  {cardErrors.holder && <span className="field-error">{cardErrors.holder}</span>}
                </div>

                <div className="form-group">
                  <label>Kartennummer</label>
                  <input 
                    type="text" 
                    placeholder="1234 5678 9012 3456"
                    value={cardForm.number}
                    onChange={(e) => setCardForm({ ...cardForm, number: formatCardNumber(e.target.value) })}
                    maxLength={19}
                    className={cardErrors.number ? 'error' : ''}
                  />
                  {cardErrors.number && <span className="field-error">{cardErrors.number}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ablaufdatum</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      value={cardForm.expiry}
                      onChange={(e) => setCardForm({ ...cardForm, expiry: formatExpiry(e.target.value) })}
                      maxLength={5}
                      className={cardErrors.expiry ? 'error' : ''}
                    />
                    {cardErrors.expiry && <span className="field-error">{cardErrors.expiry}</span>}
                  </div>
                  <div className="form-group">
                    <label>CVC</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      value={cardForm.cvc}
                      onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value.replace(/\D/g, '').substring(0, 4) })}
                      maxLength={4}
                      className={cardErrors.cvc ? 'error' : ''}
                    />
                    {cardErrors.cvc && <span className="field-error">{cardErrors.cvc}</span>}
                  </div>
                </div>

                <div className="secure-note">
                  <CheckCircle2 size={14} />
                  <span>Ihre Daten werden sicher gespeichert.</span>
                </div>

                <button className="btn btn-primary w-full" onClick={handleSaveCard} style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
                  Karte speichern
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .portal-invoices { display: flex; flex-direction: column; gap: 40px; }
        .section-header h1 { font-size: 32px; margin-bottom: 8px; }
        .section-header p { color: var(--text-muted); }

        .invoices-table-container { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; overflow: hidden; }
        .invoices-table { width: 100%; border-collapse: collapse; text-align: left; }
        .invoices-table th { padding: 20px 24px; background: rgba(255,255,255,0.02); font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
        .invoices-table td { padding: 20px 24px; border-bottom: 1px solid var(--border); font-size: 14px; }
        .invoices-table tr:last-child td { border-bottom: none; }
        
        .inv-num { font-weight: 700; display: flex; align-items: center; gap: 10px; color: var(--primary); }
        .inv-amount { font-weight: 800; }
        
        .status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 100px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
        .status-pill.paid { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-pill.unpaid { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .status-pill.overdue { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .empty-state { text-align: center; color: var(--text-muted); padding: 60px !important; }

        .payment-card { display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 24px; transition: all 0.3s; }
        .payment-card:hover { border-color: rgba(255,255,255,0.15); }
        .empty-payment { border-style: dashed; }
        .card-info { display: flex; align-items: center; gap: 20px; }
        .card-icon { width: 56px; height: 56px; background: rgba(0,242,255,0.08); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .card-icon.empty { background: rgba(255,255,255,0.03); color: var(--text-muted); }
        .card-type { font-weight: 700; margin: 0; }
        .card-num { font-size: 15px; color: var(--text-main); margin: 4px 0 0; font-family: monospace; letter-spacing: 2px; }
        .card-num-hint { font-size: 13px; color: var(--text-muted); margin: 4px 0 0; }
        .card-expiry { font-size: 12px; color: var(--text-muted); margin: 2px 0 0; }
        .card-actions { display: flex; gap: 12px; align-items: center; }
        .btn-icon-remove { width: 40px; height: 40px; border-radius: 10px; border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.08); color: #ef4444; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; }
        .btn-icon-remove:hover { background: rgba(239,68,68,0.2); border-color: #ef4444; }

        .btn-icon-small { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: none; color: var(--text-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; }
        .btn-icon-small:hover { color: var(--primary); border-color: var(--primary); }

        /* Card Modal */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-content { background: #08080a; border: 1px solid var(--border); border-radius: 32px; padding: 40px; max-width: 500px; width: 100%; position: relative; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .modal-header h3 { margin: 0; font-size: 24px; }
        .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; transition: color 0.3s; }
        .close-btn:hover { color: white; }

        .card-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
        .form-group input { background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; color: white; font-size: 16px; font-family: var(--font-body); outline: none; transition: all 0.3s; }
        .form-group input:focus { border-color: var(--primary); background: rgba(0,242,255,0.03); }
        .form-group input.error { border-color: #ef4444; background: rgba(239,68,68,0.05); }
        .form-group input::placeholder { color: rgba(255,255,255,0.2); }
        .field-error { font-size: 12px; color: #ef4444; font-weight: 600; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .secure-note { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #10b981; font-weight: 600; padding: 12px 16px; background: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.15); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Invoices;
