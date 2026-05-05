import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  Globe, 
  Download,
  X,
  PenTool,
  Loader2,
  TrendingUp,
  ShieldCheck,
  Mail,
  HardDrive
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

interface Contract {
  id: string;
  contract_number?: string;
  name?: string;
  title?: string;
  status: 'active' | 'expired' | 'pending';
  date: string;
  monthly_value?: string | number;
  payment_cycle?: string;
  source: 'contract' | 'file';
  path?: string;
  type?: string;
}

const ALL_UPGRADES = [
  { id: 'seo', name: 'SEO Paket Pro', monthly: 120.00, setup: 0, desc: 'Optimierung für Top-Rankings bei Google.', icon: <TrendingUp size={24} /> },
  { id: 'newsletter', name: 'Newsletter System', monthly: 49.00, setup: 490.00, desc: 'E-Mail Marketing System inkl. Vorlagen.', icon: <Mail size={24} /> },
  { id: 'security', name: 'Extended Security', monthly: 29.00, setup: 0, desc: 'WAF & DDoS Schutz mit 24/7 Überwachung.', icon: <ShieldCheck size={24} /> },
  { id: 'cloud', name: 'Cloud Speicher 1TB', monthly: 15.00, setup: 0, desc: 'Sicheres Cloud-Backup für Ihre Firmendaten.', icon: <HardDrive size={24} /> },
];

const Contracts = () => {
  const { token } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedUpgradeId, setSelectedUpgradeId] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/portal/contracts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setContracts(data.data);
    } catch (err) {
      console.error('Failed to fetch contracts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleUpgrade = async () => {
    const upgrade = ALL_UPGRADES.find(u => u.id === selectedUpgradeId);
    if (!upgrade) return;

    setIsSigning(true);
    try {
      const response = await fetch('/api/portal/contracts/upgrade', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          serviceId: upgrade.id,
          serviceName: upgrade.name,
          price: `${upgrade.setup > 0 ? upgrade.setup + ' einmalig + ' : ''}${upgrade.monthly} / Monat`,
          type: upgrade.monthly > 0 ? 'monthly' : 'onetime'
        })
      });
      
      if (response.ok) {
        setShowUpgradeModal(false);
        setSelectedUpgradeId(null);
        alert('Upgrade erfolgreich gebucht! Wir haben ein Ticket für die Einrichtung erstellt.');
      }
    } catch (err) {
      alert('Fehler bei der Buchung.');
    } finally {
      setIsSigning(false);
    }
  };

  const availableUpgrades = ALL_UPGRADES.filter(up => 
    !contracts.some(c => c && (c.name || c.title || '').toLowerCase().includes((up.name || '').toLowerCase().split(' ')[0].toLowerCase()))
  );

  const selectedUpgrade = ALL_UPGRADES.find(u => u.id === selectedUpgradeId);

  return (
    <div className="portal-contracts">
      <header className="section-header">
        <div>
          <h1 className="premium-gradient">Ihre Verträge</h1>
          <p>Verwalten Sie Ihre Abonnements und erweitern Sie Ihre digitale Präsenz.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowUpgradeModal(true)}>
          <Plus size={20} /> Service hinzufügen
        </button>
      </header>

      {loading ? (
        <div className="loading-state">
          <Loader2 className="animate-spin" size={40} />
          <p>Verträge werden geladen...</p>
        </div>
      ) : contracts.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} opacity={0.3} />
          <h3>Keine Verträge gefunden</h3>
          <p>Sie haben aktuell keine aktiven Dienstleistungsverträge.</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setShowUpgradeModal(true)}>Service anfragen</button>
        </div>
      ) : (
        <div className="contracts-grid">
          {contracts.map((contract) => (
            <motion.div 
              key={contract.id} 
              className="contract-card"
              whileHover={{ translateY: -4 }}
            >
              <div className="contract-header">
                <div className="contract-icon" style={{ backgroundColor: contract.source === 'file' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 242, 255, 0.1)', color: contract.source === 'file' ? '#ef4444' : 'var(--primary)' }}>
                  <FileText size={24} />
                </div>
                <span className={`status-badge ${contract.status}`}>{contract.source === 'file' ? 'Dokument' : contract.status}</span>
              </div>
              <div className="contract-body">
                <h3 style={{ fontSize: 18 }}>{contract.name || contract.title}</h3>
                <p className="contract-num">{contract.source === 'file' ? 'Hochgeladenes Dokument' : (contract.contract_number || 'CON-' + contract.id.substring(0, 8).toUpperCase())}</p>
                
                <div className="contract-info">
                  <div className="info-row">
                    <Calendar size={14} />
                    <span>Datum: {new Date(contract.date).toLocaleDateString('de-CH')}</span>
                  </div>
                  {contract.source === 'contract' && (
                    <div className="info-row">
                      <Globe size={14} />
                      <span>Abrechnung: {contract.payment_cycle || 'Monatlich'}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="contract-footer">
                <div className="price-tag">
                  {contract.source === 'contract' ? (
                    <>
                      <span className="price">{Number(contract.monthly_value || 0).toFixed(2)} chf</span>
                      <span className="freq">/Monat</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>PDF Dokument</span>
                  )}
                </div>
                <button 
                  className="btn-icon"
                  onClick={() => {
                    if (contract.source === 'file' && contract.path) {
                      window.open(contract.path, '_blank');
                    } else {
                      // Original logic for generated contract PDFs if exists
                      alert('Vertrags-PDF wird generiert...');
                    }
                  }}
                >
                  <Download size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && availableUpgrades.length > 0 && (
        <section className="suggested-upgrades">
          <h2 style={{ fontSize: 24, marginBottom: 24 }}>Empfohlene Upgrades</h2>
          <div className="upgrades-horizontal">
            {availableUpgrades.slice(0, 3).map(up => (
              <div key={up.id} className="mini-upgrade-card" onClick={() => { setSelectedUpgradeId(up.id); setShowUpgradeModal(true); }}>
                <div className="mini-icon">{up.icon}</div>
                <div className="mini-content">
                  <h4>{up.name}</h4>
                  <p>{up.monthly} CHF / Monat</p>
                </div>
                <Plus size={18} />
              </div>
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {showUpgradeModal && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-content upgrade-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="modal-header">
                <h3>Zusatz-Service buchen</h3>
                <button className="close-btn" onClick={() => { setShowUpgradeModal(false); setSelectedUpgradeId(null); }}><X size={20} /></button>
              </div>

              {!selectedUpgradeId ? (
                <div className="upgrade-options">
                  <p>Wählen Sie eine Erweiterung für Ihr Projekt:</p>
                  {ALL_UPGRADES.map((up) => (
                    <div 
                      key={up.id} 
                      className={`upgrade-item ${contracts.some(c => c && (c.title || c.name || '').includes(up.name)) ? 'disabled' : ''}`}
                      onClick={() => setSelectedUpgradeId(up.id)}
                    >
                      <div className="up-icon-box">{up.icon}</div>
                      <div className="up-info">
                        <h4>{up.name}</h4>
                        <p>{up.desc}</p>
                      </div>
                      <div className="up-price">
                        {up.setup > 0 && <span className="setup">{up.setup} CHF einmalig</span>}
                        <span className="monthly">{up.monthly} CHF / Monat</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="upgrade-confirm">
                  <div className="confirm-header">
                    <CheckCircle2 size={48} color="var(--primary)" />
                    <h4 style={{ fontSize: 24 }}>Vertragsanpassung bestätigen</h4>
                    <p style={{ marginTop: 12 }}>
                      Sie buchen den Service <strong>"{selectedUpgrade?.name}"</strong>.
                      {selectedUpgrade?.setup ? ` Einmalige Einrichtungskosten: ${selectedUpgrade.setup} CHF.` : ''} 
                      Die monatlichen Kosten erhöhen sich um <strong>{selectedUpgrade?.monthly} CHF</strong>.
                    </p>
                  </div>
                  
                  <div className="signature-area">
                    <p className="label">Digitale Bestätigung</p>
                    <div className="signature-pad" onClick={handleUpgrade}>
                      {isSigning ? (
                        <Loader2 className="animate-spin" size={32} />
                      ) : (
                        <>
                          <PenTool size={32} />
                          <p>Klicken Sie zum Bestätigen & Signieren</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button className="btn btn-outline" onClick={() => setSelectedUpgradeId(null)} disabled={isSigning}>Zurück</button>
                    <button className="btn btn-primary" onClick={handleUpgrade} disabled={isSigning}>
                      {isSigning ? 'Verarbeitung...' : 'Kostenpflichtig buchen'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .portal-contracts { display: flex; flex-direction: column; gap: 40px; }
        .section-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .section-header h1 { font-size: 32px; margin-bottom: 8px; }
        .section-header p { color: var(--text-muted); }

        .loading-state, .empty-state { padding: 80px; text-align: center; background: var(--bg-card); border-radius: 32px; border: 1px dashed var(--border); }
        .loading-state p { margin-top: 16px; color: var(--text-muted); }
        .empty-state h3 { margin: 16px 0 8px; font-size: 24px; }
        .empty-state p { color: var(--text-muted); }

        .contracts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; }
        .contract-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; padding: 32px; display: flex; flex-direction: column; gap: 24px; }
        
        .contract-header { display: flex; justify-content: space-between; align-items: center; }
        .contract-icon { width: 48px; height: 48px; background: rgba(0, 242, 255, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .status-badge { padding: 4px 10px; border-radius: 100px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
        .status-badge.active { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

        .contract-body h3 { font-size: 20px; margin: 0; }
        .contract-num { font-size: 13px; color: var(--text-muted); margin: 4px 0 0; }
        .contract-info { margin-top: 20px; display: flex; flex-direction: column; gap: 12px; }
        .info-row { display: flex; align-items: center; gap: 12px; font-size: 14px; color: var(--text-muted); }

        .contract-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid var(--border); }
        .price { font-size: 20px; font-weight: 900; color: white; }
        .freq { font-size: 12px; color: var(--text-muted); margin-left: 4px; }

        .suggested-upgrades { margin-top: 20px; }
        .upgrades-horizontal { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .mini-upgrade-card { background: var(--bg-card); border: 1px solid var(--border); padding: 20px; border-radius: 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; transition: all 0.3s; }
        .mini-upgrade-card:hover { border-color: var(--primary); transform: translateX(5px); }
        .mini-icon { color: var(--primary); }
        .mini-content h4 { margin: 0; font-size: 16px; }
        .mini-content p { margin: 2px 0 0; font-size: 13px; color: var(--text-muted); }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-content { background: #08080a; border: 1px solid var(--border); border-radius: 32px; padding: 40px; max-width: 650px; width: 100%; position: relative; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .modal-header h3 { margin: 0; font-size: 24px; }
        .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; }

        .upgrade-item { display: flex; gap: 20px; padding: 20px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 16px; cursor: pointer; transition: all 0.3s; }
        .upgrade-item:hover:not(.disabled) { border-color: var(--primary); background: rgba(0,242,255,0.05); }
        .upgrade-item.disabled { opacity: 0.5; cursor: not-allowed; }
        .up-icon-box { color: var(--primary); }
        .up-info { flex: 1; }
        .up-info h4 { margin: 0; font-size: 18px; }
        .up-info p { margin: 4px 0 0; font-size: 14px; color: var(--text-muted); line-height: 1.5; }
        .up-price { text-align: right; display: flex; flex-direction: column; justify-content: center; }
        .up-price .setup { font-size: 11px; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 4px; }
        .up-price .monthly { font-weight: 900; color: var(--primary); white-space: nowrap; }

        .upgrade-confirm { text-align: center; }
        .confirm-header { margin-bottom: 40px; }
        .confirm-header p { line-height: 1.8; color: var(--text-muted); }

        .signature-area { margin-bottom: 40px; text-align: left; }
        .signature-area .label { font-size: 13px; font-weight: 700; color: var(--text-muted); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .signature-pad { background: rgba(0,0,0,0.4); border: 2px dashed var(--border); border-radius: 20px; height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: var(--text-muted); cursor: pointer; transition: all 0.3s; }
        .signature-pad:hover { border-color: var(--primary); color: var(--primary); background: rgba(0,242,255,0.03); }

        .modal-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .btn-icon { width: 44px; height: 44px; border-radius: 12px; border: 1px solid var(--border); background: none; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default Contracts;
