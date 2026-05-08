import React from 'react';
import { X, Printer } from 'lucide-react';

export type DocType = 'offer' | 'contract' | 'invoice';

export interface PortalDoc {
  type: DocType;
  id: string;
  number: string;
  title: string;
  company_name?: string;
  status: string;
  total: number;
  subtotal?: number;
  tax_total?: number;
  discount_percent?: number;
  items?: any[];
  created_at: string;
  valid_until?: string;
  due_date?: string;
  notes?: string;
}

const TYPE_LABELS: Record<DocType, string> = {
  offer: 'OFFERTE',
  contract: 'DIENSTLEISTUNGSVERTRAG',
  invoice: 'RECHNUNG',
};

const INTERVAL: Record<string, string> = {
  one_time: 'Einmalig', monthly: 'Monatlich', quarterly: 'Quartalsweise', yearly: 'Jährlich',
};

interface Props {
  doc: PortalDoc;
  onClose: () => void;
}

export const PortalDocumentPreview = ({ doc, onClose }: Props) => {
  const items: any[] = Array.isArray(doc.items)
    ? doc.items
    : typeof doc.items === 'string'
      ? (() => { try { return JSON.parse(doc.items as string); } catch { return []; } })()
      : [];

  const subtotal = doc.subtotal != null
    ? Number(doc.subtotal)
    : items.reduce((s: number, i: any) => s + (parseFloat(i.total_price) || 0), 0);

  const discountPct = doc.discount_percent || 0;
  const discountAmt = subtotal * (discountPct / 100);
  const total = doc.total || (subtotal - discountAmt);

  const fmt = (n: number) => n.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handlePrint = () => {
    const pw = window.open('', '_blank', 'width=900,height=750');
    if (!pw) { alert('Bitte Popup-Blocker deaktivieren.'); return; }

    const itemsHtml = items.map((item: any) => `
      <tr>
        <td>
          <div style="font-weight:600;color:#1e293b">${item.title || ''}</div>
          ${item.description ? `<div style="font-size:11px;color:#64748b;margin-top:2px">${item.description}</div>` : ''}
          ${item.billing_interval && item.billing_interval !== 'one_time'
            ? `<div style="font-size:10px;color:#0891b2;font-weight:700;margin-top:2px;text-transform:uppercase">${INTERVAL[item.billing_interval] || item.billing_interval}</div>`
            : ''}
        </td>
        <td style="text-align:right;color:#1e293b">${item.quantity}</td>
        <td style="text-align:right;color:#1e293b">CHF ${parseFloat(item.unit_price || 0).toLocaleString('de-CH', { minimumFractionDigits: 2 })}</td>
        <td style="text-align:right;font-weight:700;color:#1e293b">CHF ${parseFloat(item.total_price || 0).toLocaleString('de-CH', { minimumFractionDigits: 2 })}</td>
      </tr>`).join('');

    pw.document.write(`<!DOCTYPE html>
<html><head>
  <title>${TYPE_LABELS[doc.type]} ${doc.number}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;background:#fff;color:#1e293b;padding:48px 40px;max-width:800px;margin:0 auto}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:24px;border-bottom:3px solid #0f172a}
    .logo{font-size:28px;font-weight:900;color:#0f172a;letter-spacing:-1px}.logo span{color:#06b6d4}
    .logo-sub{font-size:11px;color:#64748b;margin-top:4px}
    .logo-contact{font-size:12px;color:#64748b;margin-top:6px}
    .doc-title{font-size:22px;font-weight:800;letter-spacing:2px;text-align:right}
    .doc-num{font-size:13px;color:#64748b;margin-top:4px;text-align:right}
    .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:40px}
    .label{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
    .meta{display:flex;gap:10px;margin-bottom:4px;font-size:13px}
    .meta-l{color:#64748b;min-width:80px}.meta-v{font-weight:600}
    table{width:100%;border-collapse:collapse;margin-bottom:32px}
    th{text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;padding:10px 12px;background:#f8fafc;border-bottom:2px solid #e2e8f0}
    th:not(:first-child){text-align:right}
    td{padding:14px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;vertical-align:top}
    td:not(:first-child){text-align:right}
    .totals{border-top:2px solid #e2e8f0;padding-top:20px;max-width:300px;margin-left:auto;margin-bottom:32px}
    .t-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#64748b}
    .t-grand{display:flex;justify-content:space-between;padding:14px 0 0;margin-top:8px;border-top:2px solid #0f172a;font-size:18px;font-weight:800}
    .t-grand span:last-child{color:#0891b2}
    .notes{padding:16px;background:#f8fafc;border-radius:8px;font-size:13px;color:#475569;margin-bottom:32px}
    .notes b{color:#1e293b;display:block;margin-bottom:6px}
    .footer{padding-top:20px;border-top:1px solid #e2e8f0;font-size:10px;color:#94a3b8;text-align:center;line-height:1.8;margin-top:60px}
    @media print{body{padding:20px 30px}}
  </style>
</head><body>
  <div class="header">
    <div>
      <div class="logo">HED<span>-IT</span></div>
      <div class="logo-sub">Web & Marketing Solutions</div>
      <div class="logo-contact">info@hed-it.ch · www.hed-it.ch</div>
    </div>
    <div>
      <div class="doc-title">${TYPE_LABELS[doc.type]}</div>
      <div class="doc-num">Nr. ${doc.number}</div>
      <div class="doc-num">${new Date(doc.created_at).toLocaleDateString('de-CH')}</div>
    </div>
  </div>
  <div class="info-grid">
    <div>
      <div class="label">Empfänger</div>
      <div style="font-weight:700;font-size:16px">${doc.company_name || 'Privatkunde'}</div>
      <div style="font-size:14px;color:#475569;margin-top:4px">${doc.title}</div>
    </div>
    <div>
      <div class="label">Details</div>
      <div class="meta"><span class="meta-l">Datum:</span><span class="meta-v">${new Date(doc.created_at).toLocaleDateString('de-CH')}</span></div>
      ${doc.valid_until ? `<div class="meta"><span class="meta-l">Gültig bis:</span><span class="meta-v">${new Date(doc.valid_until).toLocaleDateString('de-CH')}</span></div>` : ''}
      ${doc.due_date ? `<div class="meta"><span class="meta-l">Fällig am:</span><span class="meta-v">${new Date(doc.due_date).toLocaleDateString('de-CH')}</span></div>` : ''}
    </div>
  </div>
  ${items.length > 0 ? `
  <table>
    <thead><tr><th style="width:50%">Beschreibung</th><th>Menge</th><th>Einzelpreis</th><th>Gesamt</th></tr></thead>
    <tbody>${itemsHtml}</tbody>
  </table>` : `<div style="padding:24px;text-align:center;color:#94a3b8;border:1px dashed #e2e8f0;border-radius:8px;margin-bottom:32px;font-size:13px">Keine Positionen vorhanden</div>`}
  <div class="totals">
    ${discountPct > 0 ? `<div class="t-row" style="color:#16a34a;font-weight:600"><span>Rabatt (${discountPct}%):</span><span>−CHF ${fmt(discountAmt)}</span></div>` : ''}
    <div class="t-grand"><span>Gesamtbetrag (CHF):</span><span>CHF ${fmt(total)}</span></div>
  </div>
  ${doc.notes ? `<div class="notes"><b>Bemerkungen</b>${doc.notes}</div>` : ''}
  <div class="footer">
    HED-IT Joel Hediger · Web & Marketing Solutions<br>
    info@hed-it.ch · www.hed-it.ch<br>
    ${doc.type === 'invoice' ? 'IBAN: CH00 0000 0000 0000 0000 0 · Zahlbar netto innert 30 Tagen · Gerichtsstand: Schweiz' : 'Alle Preise in CHF · Nicht MWST-pflichtig · Gerichtsstand: Schweiz'}
  </div>
  <script>window.onload=()=>setTimeout(()=>window.print(),400)</script>
</body></html>`);
    pw.document.close();
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={onClose}
    >
      <div
        style={{ background: '#09090f', border: '1px solid rgba(0,242,255,0.12)', borderRadius: 24, width: '100%', maxWidth: 860, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Chrome */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#e2e8f0' }}>{TYPE_LABELS[doc.type]} · {doc.number}</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handlePrint}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'rgba(0,242,255,0.08)', border: '1px solid rgba(0,242,255,0.2)', borderRadius: 8, color: '#00f2ff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              <Printer size={14} /> Drucken / PDF
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 4 }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable paper */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, background: '#111' }}>
          <div style={{ background: '#fff', color: '#1e293b', borderRadius: 12, padding: '48px 40px', maxWidth: 780, margin: '0 auto', boxShadow: '0 4px 40px rgba(0,0,0,0.5)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, paddingBottom: 24, borderBottom: '3px solid #0f172a' }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: -1 }}>
                  HED<span style={{ color: '#06b6d4' }}>-IT</span>
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Web & Marketing Solutions</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 6 }}>info@hed-it.ch · www.hed-it.ch</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, color: '#0f172a' }}>{TYPE_LABELS[doc.type]}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Nr. {doc.number}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{new Date(doc.created_at).toLocaleDateString('de-CH')}</div>
              </div>
            </div>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 40 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Empfänger</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>{doc.company_name || 'Privatkunde'}</div>
                <div style={{ fontSize: 14, color: '#475569', marginTop: 4 }}>{doc.title}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Details</div>
                {([
                  ['Datum', new Date(doc.created_at).toLocaleDateString('de-CH')],
                  doc.valid_until ? ['Gültig bis', new Date(doc.valid_until).toLocaleDateString('de-CH')] : null,
                  doc.due_date ? ['Fällig am', new Date(doc.due_date).toLocaleDateString('de-CH')] : null,
                ] as ([string, string] | null)[]).filter((r): r is [string, string] => r != null).map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', gap: 10, marginBottom: 4, fontSize: 13 }}>
                    <span style={{ color: '#64748b', minWidth: 80 }}>{label}:</span>
                    <span style={{ fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Items table */}
            {items.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32 }}>
                <thead>
                  <tr>
                    {['Beschreibung', 'Menge', 'Einzelpreis', 'Gesamt'].map((h, i) => (
                      <th key={h} style={{ textAlign: i === 0 ? 'left' : 'right', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#94a3b8', padding: '10px 12px', background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, i: number) => (
                    <tr key={i}>
                      <td style={{ padding: '14px 12px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{item.title}</div>
                        {item.description && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{item.description}</div>}
                        {item.billing_interval && item.billing_interval !== 'one_time' && (
                          <div style={{ fontSize: 10, color: '#0891b2', fontWeight: 700, marginTop: 3, textTransform: 'uppercase' }}>
                            {INTERVAL[item.billing_interval] || item.billing_interval}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 12px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', fontSize: 13 }}>{item.quantity}</td>
                      <td style={{ padding: '14px 12px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', fontSize: 13 }}>
                        CHF {parseFloat(item.unit_price || 0).toLocaleString('de-CH', { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '14px 12px', borderBottom: '1px solid #f1f5f9', textAlign: 'right', fontSize: 13, fontWeight: 700 }}>
                        CHF {parseFloat(item.total_price || 0).toLocaleString('de-CH', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8', border: '1px dashed #e2e8f0', borderRadius: 8, marginBottom: 32, fontSize: 13 }}>
                Keine Positionen vorhanden
              </div>
            )}

            {/* Totals */}
            <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: 20, maxWidth: 300, marginLeft: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: '#64748b' }}>
                <span>Zwischensumme:</span><span>CHF {fmt(subtotal)}</span>
              </div>
              {discountPct > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
                  <span>Rabatt ({discountPct}%):</span><span>−CHF {fmt(discountAmt)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', marginTop: 8, borderTop: '2px solid #0f172a', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                <span>Gesamtbetrag:</span>
                <span style={{ color: '#0891b2' }}>CHF {fmt(total)}</span>
              </div>
            </div>

            {doc.notes && (
              <div style={{ marginTop: 32, padding: 16, background: '#f8fafc', borderRadius: 8, fontSize: 13, color: '#475569' }}>
                <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>Bemerkungen</div>
                {doc.notes}
              </div>
            )}

            {/* Footer */}
            <div style={{ marginTop: 60, paddingTop: 20, borderTop: '1px solid #e2e8f0', fontSize: 10, color: '#94a3b8', textAlign: 'center', lineHeight: 1.8 }}>
              HED-IT Joel Hediger · Web & Marketing Solutions<br />
              info@hed-it.ch · www.hed-it.ch<br />
              {doc.type === 'invoice'
                ? 'IBAN: CH00 0000 0000 0000 0000 0 · Zahlbar netto innert 30 Tagen · Gerichtsstand: Schweiz'
                : 'Alle Preise in CHF · Nicht MWST-pflichtig · Gerichtsstand: Schweiz'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
