import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, CheckCircle2, XCircle, Clock, PenTool, X,
  Loader2, ChevronRight, Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PortalDocumentPreview } from '../../components/PortalDocumentPreview';
import type { PortalDoc } from '../../components/PortalDocumentPreview';

interface Proposal {
  id: string;
  proposal_number: string;
  title: string;
  status: 'sent' | 'accepted' | 'rejected' | 'converted';
  total: number;
  subtotal: number;
  tax_total: number;
  discount_percent: number;
  company_name?: string;
  notes?: string;
  valid_until?: string;
  items: any[];
  created_at: string;
  signed_at?: string;
  _legacy?: boolean;
}

const STATUS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  sent:      { label: 'Ausstehend',  color: '#f59e0b', icon: <Clock size={14} /> },
  accepted:  { label: 'Akzeptiert', color: '#10b981', icon: <CheckCircle2 size={14} /> },
  rejected:  { label: 'Abgelehnt',  color: '#ef4444', icon: <XCircle size={14} /> },
  converted: { label: 'Signiert',   color: '#10b981', icon: <CheckCircle2 size={14} /> },
};

const INTERVAL: Record<string, string> = {
  one_time:  'Einmalig', monthly: 'Monatlich',
  quarterly: 'Quartalsweise', yearly: 'Jährlich',
};

export default function Offers() {
  const { token } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Proposal | null>(null);
  const [signing, setSigning] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [done, setDone] = useState<'signed' | 'rejected' | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<PortalDoc | null>(null);
  const [signError, setSignError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const openPreview = (p: Proposal) => {
    const items = typeof p.items === 'string' ? JSON.parse(p.items || '[]') : (p.items || []);
    setPreviewDoc({
      type: 'offer',
      id: p.id,
      number: p.proposal_number,
      title: p.title,
      company_name: p.company_name,
      status: p.status,
      total: parseFloat(String(p.total || 0)),
      subtotal: parseFloat(String(p.subtotal || 0)),
      tax_total: parseFloat(String(p.tax_total || 0)),
      discount_percent: p.discount_percent,
      items,
      created_at: p.created_at,
      valid_until: p.valid_until,
      notes: p.notes,
    });
  };

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portal/proposals', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setProposals(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch_(); }, []);

  // Canvas drawing
  const startDraw = (e: any) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX ?? e.touches[0].clientX) - rect.left;
    const y = (e.clientY ?? e.touches[0].clientY) - rect.top;
    ctx.beginPath(); ctx.moveTo(x, y);
    setIsDrawing(true);
  };
  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo((e.clientX ?? e.touches[0].clientX) - rect.left, (e.clientY ?? e.touches[0].clientY) - rect.top);
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2; ctx.stroke();
  };
  const stopDraw = () => setIsDrawing(false);
  const clearCanvas = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSign = async () => {
    if (!selected) return;
    const canvas = canvasRef.current;
    const signatureData = canvas?.toDataURL('image/png');
    setSigning(true);
    setSignError(null);
    try {
      const res = await fetch(`/api/portal/proposals/${selected.id}/sign`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ signatureData }),
      });
      const data = await res.json();
      if (data.success) {
        setDone('signed');
        setTimeout(() => { setDone(null); setSelected(null); fetch_(); }, 3000);
      } else {
        setSignError(data.error || 'Signierung fehlgeschlagen. Bitte erneut versuchen.');
      }
    } catch {
      setSignError('Netzwerkfehler. Bitte erneut versuchen.');
    } finally { setSigning(false); }
  };

  const handleReject = async () => {
    if (!selected) return;
    setRejecting(true);
    setSignError(null);
    try {
      const res = await fetch(`/api/portal/proposals/${selected.id}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Vom Kunden abgelehnt' }),
      });
      const data = await res.json();
      if (data.success) {
        setDone('rejected');
        setTimeout(() => { setDone(null); setSelected(null); fetch_(); }, 2500);
      } else {
        setSignError(data.error || 'Ablehnen fehlgeschlagen.');
      }
    } catch {
      setSignError('Netzwerkfehler. Bitte erneut versuchen.');
    } finally { setRejecting(false); }
  };

  return (
    <div className="portal-offers">
      <header className="section-header">
        <div>
          <h1 className="premium-gradient">Offerten</h1>
          <p>Überprüfen und unterzeichnen Sie Ihre Angebote.</p>
        </div>
      </header>

      {loading ? (
        <div className="loading-state">
          <Loader2 className="animate-spin" size={40} />
          <p>Offerten werden geladen...</p>
        </div>
      ) : proposals.length === 0 ? (
        <div className="empty-state">
          <FileText size={48} opacity={0.3} />
          <h3>Keine Offerten vorhanden</h3>
          <p>Sie haben noch keine Angebote erhalten.</p>
        </div>
      ) : (
        <div className="offers-grid">
          {proposals.map((p) => {
            const st = STATUS[p.status] || STATUS.sent;
            const items: any[] = typeof p.items === 'string' ? JSON.parse(p.items) : (p.items || []);
            const intervals = [...new Set(items.map((i: any) => i.billing_interval || 'one_time'))];
            return (
              <motion.div key={p.id} className="offer-card" whileHover={{ translateY: -4 }} onClick={() => setSelected(p)} style={{ cursor: 'pointer' }}>
                <div className="offer-card-header">
                  <div className="offer-icon"><FileText size={22} /></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: st.color }}>
                    {st.icon} {st.label}
                  </div>
                </div>
                <div className="offer-card-body">
                  <h3>{p.title}</h3>
                  <p className="offer-num">{p.proposal_number}</p>
                  <div className="offer-intervals">
                    {intervals.map(iv => (
                      <span key={iv} className={`interval-tag ${iv === 'one_time' ? '' : 'recurring'}`}>
                        {INTERVAL[iv] || iv}
                      </span>
                    ))}
                  </div>
                  {p.valid_until && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                      Gültig bis: {new Date(p.valid_until).toLocaleDateString('de-CH')}
                    </div>
                  )}
                </div>
                <div className="offer-card-footer">
                  <div>
                    <span className="offer-total">CHF {parseFloat(String(p.total || 0)).toLocaleString('de-CH', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); openPreview(p); }} title="Dokument anzeigen">
                      <Eye size={14} />
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); setSelected(p); }}>
                      Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Detail / Sign Modal */}
      <AnimatePresence>
        {selected && (
          <div className="modal-overlay" onClick={() => { if (!signing && !rejecting) setSelected(null); }}>
            <motion.div
              className="modal-content offer-detail-modal"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: 680, width: '95%' }}
            >
              {done === 'signed' ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <CheckCircle2 size={64} color="#10b981" style={{ marginBottom: 20 }} />
                  <h3 style={{ fontSize: 24, marginBottom: 8 }}>Offerte signiert!</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Vertrag & Rechnungen wurden automatisch erstellt.</p>
                </div>
              ) : done === 'rejected' ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <XCircle size={64} color="#ef4444" style={{ marginBottom: 20 }} />
                  <h3 style={{ fontSize: 24, marginBottom: 8 }}>Offerte abgelehnt.</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Wir werden uns mit Ihnen in Verbindung setzen.</p>
                </div>
              ) : (
                <>
                  <div className="modal-header">
                    <div>
                      <h3 style={{ fontSize: 20 }}>{selected.title}</h3>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>{selected.proposal_number}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openPreview(selected)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Eye size={14} /> Dokument
                      </button>
                      <button className="close-btn" onClick={() => setSelected(null)}><X size={22} /></button>
                    </div>
                  </div>

                  {/* Items by interval */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, margin: '20px 0' }}>
                    {(() => {
                      const items: any[] = typeof selected.items === 'string' ? JSON.parse(selected.items) : (selected.items || []);
                      const grouped: Record<string, any[]> = {};
                      items.forEach((i: any) => { const k = i.billing_interval || 'one_time'; if (!grouped[k]) grouped[k] = []; grouped[k].push(i); });
                      return Object.entries(grouped).map(([interval, grpItems]) => (
                        <div key={interval} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, overflow: 'hidden' }}>
                          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>{INTERVAL[interval] || interval}</span>
                            {interval !== 'one_time' && <span style={{ fontSize: 10, padding: '2px 8px', background: 'rgba(0,242,255,0.1)', color: 'var(--primary)', borderRadius: 20, fontWeight: 700 }}>WIEDERKEHREND</span>}
                          </div>
                          {grpItems.map((item: any, i: number) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: i < grpItems.length - 1 ? '1px solid var(--border)' : 'none' }}>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>{item.title}</div>
                                {item.description && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{item.description}</div>}
                              </div>
                              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                                <div style={{ fontWeight: 700, fontSize: 14 }}>CHF {parseFloat(item.total_price || 0).toLocaleString('de-CH', { minimumFractionDigits: 2 })}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.quantity}× CHF {parseFloat(item.unit_price || 0).toLocaleString('de-CH', { minimumFractionDigits: 2 })}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ));
                    })()}
                  </div>

                  {/* Total */}
                  <div style={{ background: 'rgba(0,242,255,0.06)', border: '1px solid rgba(0,242,255,0.15)', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>
                      <span>Zwischensumme</span><span>CHF {parseFloat(String(selected.subtotal || 0)).toLocaleString('de-CH', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                      <span>MwSt (8.1%)</span><span>CHF {parseFloat(String(selected.tax_total || 0)).toLocaleString('de-CH', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900 }}>
                      <span style={{ fontSize: 16 }}>Gesamtbetrag</span>
                      <span style={{ fontSize: 22, color: 'var(--primary)' }}>CHF {parseFloat(String(selected.total || 0)).toLocaleString('de-CH', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {selected.notes && (
                    <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                      <strong style={{ color: 'var(--text-main)' }}>Bemerkungen: </strong>{selected.notes}
                    </div>
                  )}

                  {/* Legacy invoice note */}
                  {selected._legacy && (
                    <div style={{ padding: '12px 16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, color: '#f59e0b', fontSize: 13, marginBottom: 16 }}>
                      Diese Offerte ist ein älteres Dokument. Für Fragen kontaktieren Sie uns bitte direkt.
                    </div>
                  )}

                  {/* Signature area (only for sent proposals, not legacy) */}
                  {selected.status === 'sent' && !selected._legacy && (
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                        Bitte unterschreiben Sie hier, um die Offerte zu akzeptieren. Es werden automatisch ein Vertrag und die entsprechenden Rechnungen erstellt.
                      </p>
                      <div style={{ border: '2px solid var(--border)', borderRadius: 12, overflow: 'hidden', background: '#fff', marginBottom: 16 }}>
                        <canvas ref={canvasRef} width={620} height={160}
                          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
                          style={{ display: 'block', width: '100%', cursor: 'crosshair' }}
                        />
                      </div>
                      {signError && (
                        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '10px 14px', color: '#dc2626', fontSize: 13 }}>
                          {signError}
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button className="btn btn-outline btn-sm" onClick={clearCanvas}>Leeren</button>
                          <button className="btn btn-outline btn-sm" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }} onClick={handleReject} disabled={rejecting}>
                            {rejecting ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} Ablehnen
                          </button>
                        </div>
                        <button className="btn btn-primary" onClick={handleSign} disabled={signing} style={{ gap: 8, display: 'flex', alignItems: 'center' }}>
                          {signing ? <><Loader2 size={16} className="animate-spin" /> Wird verarbeitet...</> : <><PenTool size={16} /> Akzeptieren & Signieren</>}
                        </button>
                      </div>
                    </div>
                  )}

                  {(selected.status === 'converted' || selected.status === 'accepted') && (
                    <div style={{ padding: '14px 16px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, color: '#10b981', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <CheckCircle2 size={18} /> Offerte wurde signiert — Vertrag & Rechnungen wurden erstellt.
                    </div>
                  )}
                  {selected.status === 'rejected' && (
                    <div style={{ padding: '14px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#ef4444', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <XCircle size={18} /> Offerte wurde abgelehnt.
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {previewDoc && <PortalDocumentPreview doc={previewDoc} onClose={() => setPreviewDoc(null)} />}

      <style>{`
        .portal-offers { display: flex; flex-direction: column; gap: 36px; }
        .section-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .section-header h1 { font-size: 32px; margin-bottom: 8px; }
        .section-header p { color: var(--text-muted); }
        .loading-state, .empty-state { padding: 80px; text-align: center; background: var(--bg-card); border-radius: 32px; border: 1px dashed var(--border); }
        .loading-state p { margin-top: 16px; color: var(--text-muted); }
        .empty-state h3 { margin: 16px 0 8px; font-size: 24px; }
        .empty-state p { color: var(--text-muted); }
        .offers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 28px; }
        .offer-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; padding: 28px; display: flex; flex-direction: column; gap: 20px; transition: all 0.3s; }
        .offer-card:hover { border-color: var(--primary); }
        .offer-card-header { display: flex; justify-content: space-between; align-items: center; }
        .offer-icon { width: 44px; height: 44px; background: rgba(0,242,255,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .offer-card-body h3 { font-size: 17px; margin: 0 0 4px; }
        .offer-num { font-size: 12px; color: var(--text-muted); margin: 0; }
        .offer-intervals { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
        .interval-tag { font-size: 10px; padding: 2px 10px; border-radius: 20px; font-weight: 700; background: rgba(100,100,100,0.1); color: var(--text-muted); }
        .interval-tag.recurring { background: rgba(0,242,255,0.1); color: var(--primary); }
        .offer-card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 16px; }
        .offer-total { font-size: 20px; font-weight: 900; color: white; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto; }
        .offer-detail-modal { background: #08080a; border: 1px solid var(--border); border-radius: 28px; padding: 36px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; }
      `}</style>
    </div>
  );
}
