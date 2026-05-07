import React, { useState, useEffect, useMemo } from 'react';
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
  HardDrive,
  Building2,
  Users,
  User,
  Calculator,
  Send,
  ExternalLink,
  FileSignature
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';

interface Contract {
  id: string;
  contract_number?: string;
  name?: string;
  title?: string;
  status: 'active' | 'expired' | 'pending' | 'pending_signature';
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

type ClientType = 'business' | 'association' | 'private';

const CLIENT_TYPES = [
  { id: 'business', name: 'Unternehmen', icon: <Building2 />, desc: 'B2B / B2C', discount: 0 },
  { id: 'association', name: 'Verein', icon: <Users />, desc: 'Vereine & NPOs (-50%)', discount: 0.5 },
  { id: 'private', name: 'Privatperson', icon: <User />, desc: 'Privat (-70%)', discount: 0.7 },
];

const PROJECT_TYPES = [
  { id: 'lp', name: 'Landing Page', price: 1500, desc: 'Einseitige Webseite' },
  { id: 'corp', name: 'Unternehmenswebseite', price: 3500, desc: 'Mehrseitige Website' },
  { id: 'shop', name: 'Webshop', price: 8000, desc: 'Online-Shop mit Zahlungsabwicklung' },
  { id: 'app', name: 'Web Applikation', price: 12000, desc: 'Massgeschneiderte Web-App' },
  { id: 'mobile', name: 'Mobile App', price: 15000, desc: 'Native iOS/Android App' },
];

const DESIGN_LEVELS = [
  { id: 'template', name: 'Template Basiert', price: 0, desc: 'Bewährte Vorlagen' },
  { id: 'custom', name: 'Individuelles Design', price: 2000, desc: 'Design nach Ihren Wünschen' },
  { id: 'premium', name: 'Premium / 3D', price: 4500, desc: 'Hochwertige Animationen' },
];

const CALC_FEATURES = [
  { id: 'cms', name: 'CMS Integration', price: 1600, desc: 'Inhalte selbst bearbeiten' },
  { id: 'seo', name: 'SEO Optimierung', price: 1200, desc: 'Bessere Sichtbarkeit bei Google' },
  { id: 'lang', name: 'Mehrsprachigkeit', price: 2100, desc: 'Website in mehreren Sprachen' },
  { id: 'stats', name: 'Erweiterte Analyse', price: 800, desc: 'Detaillierte Besucherstatistiken' },
  { id: 'news', name: 'Newsletter Setup', price: 1200, desc: 'E-Mail Marketing Integration' },
];

const Contracts = () => {
  const { token } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedUpgradeId, setSelectedUpgradeId] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  // Calculator state
  const [calcClientType, setCalcClientType] = useState<ClientType>('business');
  const [calcProjectType, setCalcProjectType] = useState<string>('lp');
  const [calcDesignLevel, setCalcDesignLevel] = useState<string>('template');
  const [calcFeatures, setCalcFeatures] = useState<Set<string>>(new Set());
  const [calcSubmitting, setCalcSubmitting] = useState(false);
  const [calcSuccess, setCalcSuccess] = useState(false);

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
      
      const data = await response.json();
      if (response.ok) {
        setShowUpgradeModal(false);
        setSelectedUpgradeId(null);
        alert(data.message || 'Erfolgreich gebucht!');
        fetchContracts(); // Refresh contracts list
      }
    } catch (err) {
      alert('Fehler bei der Buchung.');
    } finally {
      setIsSigning(false);
    }
  };

  const [detailContract, setDetailContract] = useState<any>(null);
  const [cancellationSent, setCancellationSent] = useState(false);
  const [signingContract, setSigningContract] = useState<any>(null);
  const signatureCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: any) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSignContract = async () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas || !signingContract) return;
    const signatureData = canvas.toDataURL('image/png');

    try {
      const res = await fetch(`/api/portal/contracts/${signingContract.id}/sign`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ signatureData })
      });
      const data = await res.json();
      if (data.success) {
        alert('Vertrag erfolgreich signiert! Die erste Rechnung wurde erstellt.');
        setSigningContract(null);
        fetchContracts();
      }
    } catch (err) {
      alert('Fehler beim Signieren.');
    }
  };

  const handleCancelContract = async (contract: any) => {
    try {
      const res = await fetch('/api/portal/tickets', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Vertragskündigung: ${contract.name || contract.title}`,
          description: `Ich möchte den Vertrag "${contract.name || contract.title}" (${contract.contract_number || contract.id?.substring(0,8)}) kündigen.`,
          priority: 'medium',
          type: 'cancellation',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCancellationSent(true);
        setTimeout(() => { setCancellationSent(false); setDetailContract(null); }, 3000);
      }
    } catch (err) {
      alert('Fehler beim Senden der Kündigung.');
    }
  };

  const downloadPdf = async (id: string) => {
    try {
      const res = await fetch(`/api/portal/contracts/${id}/pdf`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Vertrag_${id.substring(0,8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Fehler beim Laden des PDFs.');
    }
  };

  const availableUpgrades = ALL_UPGRADES.filter(up => 
    !contracts.some(c => c && (c.name || c.title || '').toLowerCase().includes((up.name || '').toLowerCase().split(' ')[0].toLowerCase()))
  );

  const selectedUpgrade = ALL_UPGRADES.find(u => u.id === selectedUpgradeId);

  // Check if a calculator item is already purchased
  const isItemOwned = (itemName: string) => {
    return contracts.some(c => {
      const cName = (c.name || c.title || '').toLowerCase();
      const check = itemName.toLowerCase();
      return cName.includes(check.split(' ')[0]) || check.includes(cName.split(' ')[0]);
    });
  };

  const toggleCalcFeature = (id: string) => {
    const f = CALC_FEATURES.find(f => f.id === id);
    if (f && isItemOwned(f.name)) return;
    const next = new Set(calcFeatures);
    if (next.has(id)) next.delete(id); else next.add(id);
    setCalcFeatures(next);
  };

  const calcTotals = useMemo(() => {
    const base = PROJECT_TYPES.find(p => p.id === calcProjectType)?.price || 0;
    const design = DESIGN_LEVELS.find(d => d.id === calcDesignLevel)?.price || 0;
    const feat = Array.from(calcFeatures).reduce((s, id) => s + (CALC_FEATURES.find(f => f.id === id)?.price || 0), 0);
    const subtotal = base + design + feat;
    const disc = CLIENT_TYPES.find(c => c.id === calcClientType)?.discount || 0;
    const discountAmt = subtotal * disc;
    return { subtotal, discountAmt, total: subtotal - discountAmt };
  }, [calcClientType, calcProjectType, calcDesignLevel, calcFeatures]);

  const handleCalcSubmit = async () => {
    setCalcSubmitting(true);
    try {
      const proj = PROJECT_TYPES.find(p => p.id === calcProjectType);
      const des = DESIGN_LEVELS.find(d => d.id === calcDesignLevel);
      const feats = Array.from(calcFeatures).map(id => CALC_FEATURES.find(f => f.id === id)?.name).filter(Boolean);
      const desc = `Projekttyp: ${proj?.name}\nDesign: ${des?.name}\nFeatures: ${feats.join(', ') || 'Keine'}\nTotal: ${calcTotals.total.toFixed(2)} CHF`;
      await fetch('/api/portal/contracts/upgrade', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId: 'calculator', serviceName: `Projekt: ${proj?.name}`, price: `${calcTotals.total.toFixed(2)} CHF`, type: 'onetime' })
      });
      setCalcSuccess(true);
      setTimeout(() => setCalcSuccess(false), 5000);
    } catch (err) { alert('Fehler beim Senden.'); }
    finally { setCalcSubmitting(false); }
  };

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
              onClick={() => setDetailContract(contract)}
              style={{ cursor: 'pointer' }}
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
              <div className="contract-footer" style={{ flexWrap: 'wrap', gap: '10px' }}>
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
                <div style={{ display: 'flex', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
                  {contract.source === 'file' ? (
                    <button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); window.open(contract.path, '_blank'); }}>
                      <ExternalLink size={14} /> Öffnen
                    </button>
                  ) : (
                    <>
                      {contract.status === 'pending_signature' ? (
                        <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); setSigningContract(contract); }} style={{ padding: '4px 12px', fontSize: 13 }}>
                          <FileSignature size={14} style={{ marginRight: 4 }} /> Signieren
                        </button>
                      ) : (
                        <button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); downloadPdf(contract.id); }}>
                          <Download size={14} style={{ marginRight: 4 }} /> PDF
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Contract Detail Modal */}
      <AnimatePresence>
        {detailContract && (
          <div className="modal-overlay" onClick={() => setDetailContract(null)}>
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: 520, width: '95%' }}
            >
              <div className="modal-header">
                <h3 style={{ fontSize: 20 }}>{detailContract.name || detailContract.title}</h3>
                <button className="close-btn" onClick={() => setDetailContract(null)}><X size={24} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '8px 0' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Vertragsnummer</span>
                    <span style={{ fontWeight: 700 }}>{detailContract.contract_number || 'CON-' + detailContract.id?.substring(0,8).toUpperCase()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Status</span>
                    <span className={`status-badge ${detailContract.status}`}>{detailContract.status}</span>
                  </div>
                  {detailContract.source === 'contract' && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Betrag</span>
                        <span style={{ fontWeight: 900, color: 'var(--primary)', fontSize: 18 }}>
                          {Number(detailContract.monthly_value || 0).toFixed(2)} CHF / Monat
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Abrechnungszyklus</span>
                        <span style={{ fontWeight: 600 }}>{detailContract.payment_cycle || 'Monatlich'}</span>
                      </div>
                    </>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Datum</span>
                    <span style={{ fontWeight: 600 }}>{new Date(detailContract.date).toLocaleDateString('de-CH')}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  {detailContract.source === 'file' ? (
                    <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => window.open(detailContract.path, '_blank')}>
                      <ExternalLink size={16} /> Dokument öffnen
                    </button>
                  ) : (
                    <>
                      {detailContract.status === 'pending_signature' ? (
                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setSigningContract(detailContract); setDetailContract(null); }}>
                          <FileSignature size={16} /> Jetzt signieren
                        </button>
                      ) : (
                        <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => downloadPdf(detailContract.id)}>
                          <Download size={16} /> PDF herunterladen
                        </button>
                      )}
                    </>
                  )}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                  {cancellationSent ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, color: '#10b981', fontWeight: 700, fontSize: 14 }}>
                      <CheckCircle2 size={18} /> Kündigungsanfrage wurde übermittelt.
                    </div>
                  ) : (
                    <button
                      className="btn btn-outline"
                      style={{ width: '100%', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', justifyContent: 'center' }}
                      onClick={() => handleCancelContract(detailContract)}
                    >
                      Vertrag kündigen / anpassen
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {signingContract && (
        <div className="modal-overlay" style={{ zIndex: 1000 }}>
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ maxWidth: 500, width: '95%' }}
          >
            <div className="modal-header">
              <h3 style={{ fontSize: 20 }}>Vertrag signieren</h3>
              <button className="close-btn" onClick={() => setSigningContract(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            <div className="modal-body" style={{ padding: '20px 0' }}>
              <p style={{ marginBottom: 15, fontSize: 14, color: 'var(--text-muted)' }}>
                Bitte unterschreiben Sie im Feld unten, um den Vertrag <strong>{signingContract.name || signingContract.title}</strong> rechtlich bindend zu akzeptieren.
              </p>
              
              <div style={{ border: '2px solid var(--border)', borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff' }}>
                <canvas 
                  ref={signatureCanvasRef}
                  width={460}
                  height={200}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  style={{ cursor: 'crosshair', display: 'block', width: '100%' }}
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                <button className="btn btn-text btn-sm" onClick={clearSignature}>Leeren</button>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-secondary" onClick={() => setSigningContract(null)}>Abbrechen</button>
                  <button className="btn btn-primary" onClick={handleSignContract}>Signatur bestätigen</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Only show upgrades & calculator if user has at least one contract (base package) */}
      {!loading && contracts.length > 0 && availableUpgrades.length > 0 && (
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

      {/* Service Calculator - only show if user has at least one contract */}
      {!loading && contracts.length > 0 && (
        <section className="portal-calculator">
          <div className="calc-header-row">
            <div>
              <h2 style={{ fontSize: 28, marginBottom: 8 }}><Calculator size={28} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 12 }} />Service-Kalkulator</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Berechnen Sie die Kosten für Ihr nächstes Projekt. Bereits gebuchte Services sind ausgegraut.</p>
            </div>
          </div>

          <div className="portal-calc-grid">
            <div className="portal-calc-main">
              {/* 1. Client Type */}
              <div className="pcalc-section">
                <h4 className="pcalc-step">1. Kundentyp</h4>
                <div className="pcalc-client-grid">
                  {CLIENT_TYPES.map(c => (
                    <div key={c.id} className={`pcalc-client-card ${calcClientType === c.id ? 'active' : ''}`} onClick={() => setCalcClientType(c.id as ClientType)}>
                      <div className="pcalc-client-icon">{c.icon}</div>
                      <h5>{c.name}</h5>
                      <p>{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Project Type */}
              <div className="pcalc-section">
                <h4 className="pcalc-step">2. Projekttyp</h4>
                <div className="pcalc-list">
                  {PROJECT_TYPES.map(p => {
                    const owned = isItemOwned(p.name);
                    return (
                      <div key={p.id} className={`pcalc-item ${calcProjectType === p.id ? 'active' : ''} ${owned ? 'owned' : ''}`} onClick={() => !owned && setCalcProjectType(p.id)}>
                        <div className="pcalc-radio"></div>
                        <div className="pcalc-item-info"><span className="pcalc-item-name">{p.name}</span><span className="pcalc-item-desc">{p.desc}</span></div>
                        <span className="pcalc-item-price">{owned ? 'Bereits gebucht' : `+ ${p.price.toLocaleString()} CHF`}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Design */}
              <div className="pcalc-section">
                <h4 className="pcalc-step">3. Design Komplexität</h4>
                <div className="pcalc-list">
                  {DESIGN_LEVELS.map(d => {
                    const owned = isItemOwned(d.name);
                    return (
                      <div key={d.id} className={`pcalc-item ${calcDesignLevel === d.id ? 'active' : ''} ${owned ? 'owned' : ''}`} onClick={() => !owned && setCalcDesignLevel(d.id)}>
                        <div className="pcalc-radio"></div>
                        <div className="pcalc-item-info"><span className="pcalc-item-name">{d.name}</span><span className="pcalc-item-desc">{d.desc}</span></div>
                        <span className="pcalc-item-price">{owned ? 'Bereits gebucht' : d.price === 0 ? 'Inklusive' : `+ ${d.price.toLocaleString()} CHF`}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Features */}
              <div className="pcalc-section">
                <h4 className="pcalc-step">4. Zusätzliche Features</h4>
                <div className="pcalc-list">
                  {CALC_FEATURES.map(f => {
                    const owned = isItemOwned(f.name);
                    return (
                      <div key={f.id} className={`pcalc-item checkbox ${calcFeatures.has(f.id) ? 'active' : ''} ${owned ? 'owned' : ''}`} onClick={() => toggleCalcFeature(f.id)}>
                        <div className="pcalc-check"></div>
                        <div className="pcalc-item-info"><span className="pcalc-item-name">{f.name}</span><span className="pcalc-item-desc">{f.desc}</span></div>
                        <span className="pcalc-item-price">{owned ? 'Bereits gebucht' : `+ ${f.price.toLocaleString()} CHF`}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <aside className="portal-calc-sidebar">
              <div className="pcalc-summary">
                <h3 style={{ marginBottom: 20 }}>Kostenschätzung</h3>
                <div className="pcalc-summary-rows">
                  <div className="pcalc-srow"><span>Basis & Design</span><span>{((PROJECT_TYPES.find(p => p.id === calcProjectType)?.price || 0) + (DESIGN_LEVELS.find(d => d.id === calcDesignLevel)?.price || 0)).toLocaleString()} CHF</span></div>
                  {calcFeatures.size > 0 && (
                    <div className="pcalc-srow"><span>Features</span><span>{Array.from(calcFeatures).reduce((s, id) => s + (CALC_FEATURES.find(f => f.id === id)?.price || 0), 0).toLocaleString()} CHF</span></div>
                  )}
                  {calcTotals.discountAmt > 0 && (
                    <div className="pcalc-srow discount"><span>Rabatt ({calcClientType === 'association' ? '50%' : '70%'})</span><span>- {calcTotals.discountAmt.toLocaleString()} CHF</span></div>
                  )}
                </div>
                <div className="pcalc-total">
                  <span className="pcalc-total-label">Geschätztes Total</span>
                  <span className="pcalc-total-value">{calcTotals.total.toLocaleString()} CHF</span>
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '16px 0' }}>Unverbindliche Schätzung. Finaler Preis je nach Anforderungen.</p>

                {calcSuccess ? (
                  <div className="pcalc-success"><CheckCircle2 size={20} /> Anfrage gesendet!</div>
                ) : (
                  <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleCalcSubmit} disabled={calcSubmitting}>
                    {calcSubmitting ? <><Loader2 className="animate-spin" size={18} /> Senden...</> : <><Send size={18} /> Anfrage senden</>}
                  </button>
                )}
              </div>
            </aside>
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

        /* Portal Calculator */
        .portal-calculator { margin-top: 40px; padding-top: 40px; border-top: 1px solid var(--border); }
        .calc-header-row { margin-bottom: 32px; }
        .portal-calc-grid { display: grid; grid-template-columns: 1fr; gap: 32px; }
        @media (min-width: 1024px) { .portal-calc-grid { grid-template-columns: 2fr 1fr; } }

        .pcalc-section { background: var(--bg-card); padding: 28px; border-radius: 20px; border: 1px solid var(--border); margin-bottom: 24px; }
        .pcalc-step { margin-bottom: 16px; font-size: 16px; color: var(--primary); }

        .pcalc-client-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .pcalc-client-card { padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 14px; text-align: center; cursor: pointer; transition: all 0.3s; }
        .pcalc-client-card:hover { border-color: var(--primary); background: rgba(0,242,255,0.04); }
        .pcalc-client-card.active { border-color: var(--primary); background: var(--primary); color: #000; }
        .pcalc-client-card.active p { color: rgba(0,0,0,0.7); }
        .pcalc-client-icon { display: flex; justify-content: center; margin-bottom: 8px; }
        .pcalc-client-card h5 { margin: 0 0 4px; font-size: 14px; }
        .pcalc-client-card p { font-size: 11px; color: var(--text-muted); margin: 0; }

        .pcalc-list { display: flex; flex-direction: column; gap: 8px; }
        .pcalc-item { display: flex; align-items: center; padding: 14px 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 10px; cursor: pointer; transition: all 0.2s; gap: 14px; }
        .pcalc-item:hover:not(.owned) { background: rgba(255,255,255,0.05); }
        .pcalc-item.active:not(.owned) { border-color: var(--primary); background: rgba(0,242,255,0.03); }
        .pcalc-item.owned { opacity: 0.4; cursor: not-allowed; position: relative; }

        .pcalc-radio { width: 14px; height: 14px; border: 2px solid var(--border); border-radius: 50%; flex-shrink: 0; position: relative; }
        .pcalc-item.active:not(.owned) .pcalc-radio { border-color: var(--primary); }
        .pcalc-item.active:not(.owned) .pcalc-radio::after { content: ''; position: absolute; top: 2px; left: 2px; width: 6px; height: 6px; background: var(--primary); border-radius: 50%; }

        .pcalc-check { width: 14px; height: 14px; border: 2px solid var(--border); border-radius: 3px; flex-shrink: 0; }
        .pcalc-item.active:not(.owned) .pcalc-check { border-color: var(--primary); background: var(--primary); }

        .pcalc-item-info { flex: 1; display: flex; flex-direction: column; }
        .pcalc-item-name { font-weight: 700; font-size: 14px; }
        .pcalc-item-desc { font-size: 11px; color: var(--text-muted); margin-top: 1px; }
        .pcalc-item-price { font-weight: 800; color: var(--primary); font-size: 13px; white-space: nowrap; }
        .pcalc-item.owned .pcalc-item-price { color: var(--text-muted); font-weight: 600; font-style: italic; }

        .portal-calc-sidebar { position: relative; }
        .pcalc-summary { position: sticky; top: 120px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; padding: 28px; }
        .pcalc-summary-rows { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        .pcalc-srow { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-muted); }
        .pcalc-srow.discount { color: #ff4d4d; font-weight: 700; }
        .pcalc-total { border-top: 1px solid var(--border); padding-top: 16px; display: flex; flex-direction: column; gap: 4px; }
        .pcalc-total-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); }
        .pcalc-total-value { font-size: 28px; font-weight: 900; color: var(--primary); }
        .pcalc-success { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 14px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; color: #10b981; font-weight: 700; font-size: 14px; }

        @media (max-width: 768px) { .pcalc-client-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default Contracts;
