import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, Minus, Plus, Send, Download, Loader2 } from 'lucide-react';

/* ── Data ── */
const CLIENT_TYPES = [
  { id: 'business', label: 'Unternehmen / KMU', desc: 'Firma, Einzelunternehmen, GmbH, AG, etc.', discount: 0, badge: 'Standardpreise' },
  { id: 'association', label: 'Verein / Organisation', desc: 'Verein, Stiftung, Genossenschaft, NGO.', discount: 0.25, badge: '-25%' },
  { id: 'private', label: 'Privatperson', desc: 'Persönliches Projekt, Portfolio, Blog.', discount: 0.50, badge: '-50%' },
];

const WEBSITE_TYPES = [
  { id: 'lp', label: 'Landing Page', desc: '1–3 Seiten · Fokus auf 1 Aktion (Termin, Anfrage, Verkauf).', price: 1500 },
  { id: 'corp', label: 'Unternehmenswebseite', desc: '5–15 Seiten · Über uns, Leistungen, Referenzen, Kontakt, etc.', price: 3500 },
  { id: 'app', label: 'Web-Applikation', desc: 'Massgeschneidert: Portal, Buchung, internes Tool, etc.', price: 8000, prefix: 'ab ' },
  { id: 'shop', label: 'E-Commerce / Webshop', desc: 'Inkl. Produkte, Warenkorb, Zahlung, Bestellverwaltung.', price: 12000 },
];

const EXTRAS = [
  { id: 'logo', label: 'Logo-Design', desc: 'Professionelles Logo inkl. verschiedenen Formaten.', price: 800 },
  { id: 'texts', label: 'Professionelle Texte', desc: 'Packende, zielgruppengerechte Texterstellung.', price: 400 },
  { id: 'photos', label: 'Professionelle Fotos', desc: 'Fotoshooting vor Ort inkl. Bildbearbeitung.', price: 900 },
  { id: 'drone', label: 'Drohnenaufnahmen', desc: 'Beeindruckende Luftaufnahmen (Foto/Video).', price: 650 },
  { id: 'cms', label: 'CMS — Inhalte selbst pflegen', desc: 'Sie ändern Texte, Bilder, News selbst.', price: 1400 },
  { id: 'anim', label: 'Custom-Animationen', desc: 'Bewegtbild, Scroll-Effekte, individuelle Hover-Zustände.', price: 350 },
  { id: 'seo', label: 'SEO Pro — sichtbar bei Google', desc: 'Keyword-Recherche, On-Page-SEO, Schema.org, Sitemap.', price: 800 },
  { id: 'api', label: 'API-Anbindung an Drittsystem', desc: 'CRM, Buchhaltung, Newsletter-Tool, etc.', price: 1500 },
  { id: 'cookie', label: 'Cookie-Banner & DSGVO/revDSG', desc: 'Konformes Consent-Tool inkl. Datenschutzerklärung.', price: 150 },
  { id: 'legal', label: 'Impressum & Datenschutz erstellen', desc: 'Rechtssichere Erstellung der Rechtstexte (Schweiz & EU).', price: 250 },
];

const HOSTING = [
  { id: 'none', label: 'Kein Hosting', desc: 'Sie hosten selbst.', price: 0, unit: '/ Jahr' },
  { id: 'managed', label: 'Hosting', desc: 'Inkl. Node.js, Backup, SSL, CH-Domain, E-Mail Adressen', price: 189, unit: '/ Jahr' },
];

const MAINTENANCE = [
  { id: 'none', label: 'Kein Wartungsvertrag', desc: 'Updates auf Anfrage.', price: 0, unit: '/ Mt.' },
  { id: 'basic', label: 'Basic', desc: 'Kleine Anpassungen (15 Minuten / Mt.), Verfügbarkeitsmonitoring', price: 49, unit: '/ Mt.' },
  { id: 'pro', label: 'Pro', desc: 'Anpassungen (2h / Mt.), Performance- und Verfügbarkeitsmonitoring, Reaktionszeit 4h', price: 210, unit: '/ Mt.' },
];

const chf = (n: number) => n.toLocaleString('de-CH');

const Calculator = () => {
  const [client, setClient] = useState('business');
  const [site, setSite] = useState('lp');
  const [langs, setLangs] = useState(1);
  const [extras, setExtras] = useState<Set<string>>(new Set());
  const [hosting, setHosting] = useState('managed');
  const [maintenance, setMaintenance] = useState('basic');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const toggleExtra = (id: string) => {
    const s = new Set(extras);
    s.has(id) ? s.delete(id) : s.add(id);
    setExtras(s);
  };

  const price = useMemo(() => {
    const discount = CLIENT_TYPES.find(c => c.id === client)?.discount || 0;
    const base = WEBSITE_TYPES.find(w => w.id === site)?.price || 0;
    const langExtra = Math.max(0, langs - 1) * 600;
    const extrasTotal = Array.from(extras).reduce((s, id) => s + (EXTRAS.find(e => e.id === id)?.price || 0), 0);
    const hostingPrice = HOSTING.find(h => h.id === hosting)?.price || 0;
    const maintPrice = MAINTENANCE.find(m => m.id === maintenance)?.price || 0;
    const sub = (base + langExtra + extrasTotal) * (1 - discount);
    return { sub: Math.round(sub), hosting: hostingPrice, maintenance: maintPrice, discount };
  }, [client, site, langs, extras, hosting, maintenance]);

  const lineItems = useMemo(() => {
    const items: { label: string; price: number }[] = [];
    const w = WEBSITE_TYPES.find(w => w.id === site);
    const discount = CLIENT_TYPES.find(c => c.id === client)?.discount || 0;
    if (w) items.push({ label: w.label, price: Math.round(w.price * (1 - discount)) });
    if (langs > 1) items.push({ label: `${langs - 1} weitere Sprache${langs > 2 ? 'n' : ''}`, price: Math.round((langs - 1) * 600 * (1 - discount)) });
    extras.forEach(id => {
      const e = EXTRAS.find(e => e.id === id);
      if (e) items.push({ label: e.label, price: Math.round(e.price * (1 - discount)) });
    });
    return items;
  }, [client, site, langs, extras]);

  const downloadPDF = () => {
    const pw = window.open('', '_blank', 'width=900,height=750');
    if (!pw) { alert('Bitte Popup-Blocker deaktivieren.'); return; }

    const today = new Date();
    const ref = `KAL-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const validUntil = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const fmt2 = (n: number) => n.toLocaleString('de-CH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const clientLabel = CLIENT_TYPES.find(c => c.id === client)?.label || '';
    const discountInfo = price.discount > 0
      ? `<div style="color:#16a34a;font-weight:600;font-size:12px;margin-top:6px">${Math.round(price.discount * 100)}% Rabatt (${clientLabel})</div>`
      : '';

    const itemsHtml = lineItems.map(li => `
      <tr>
        <td>
          <div style="font-weight:600;color:#1e293b">${li.label}</div>
          <div style="font-size:10px;color:#0891b2;font-weight:700;margin-top:2px;text-transform:uppercase">EINMALIG</div>
        </td>
        <td style="text-align:right;color:#1e293b">1</td>
        <td style="text-align:right;color:#1e293b">CHF ${fmt2(li.price)}</td>
        <td style="text-align:right;font-weight:700;color:#1e293b">CHF ${fmt2(li.price)}</td>
      </tr>`).join('');

    const recurringRows = [
      price.hosting > 0 ? `
        <tr>
          <td>
            <div style="font-weight:600;color:#1e293b">Hosting</div>
            <div style="font-size:11px;color:#64748b;margin-top:2px">Inkl. Node.js, Backup, SSL, CH-Domain, E-Mail</div>
            <div style="font-size:10px;color:#0891b2;font-weight:700;margin-top:3px;text-transform:uppercase">JÄHRLICH</div>
          </td>
          <td style="text-align:right;color:#1e293b">1</td>
          <td style="text-align:right;color:#1e293b">CHF ${fmt2(price.hosting)} / Jahr</td>
          <td style="text-align:right;font-weight:700;color:#1e293b">CHF ${fmt2(price.hosting)} / Jahr</td>
        </tr>` : '',
      price.maintenance > 0 ? `
        <tr>
          <td>
            <div style="font-weight:600;color:#1e293b">${MAINTENANCE.find(m => m.id === maintenance)?.label || 'Wartung'}</div>
            <div style="font-size:11px;color:#64748b;margin-top:2px">${MAINTENANCE.find(m => m.id === maintenance)?.desc || ''}</div>
            <div style="font-size:10px;color:#0891b2;font-weight:700;margin-top:3px;text-transform:uppercase">MONATLICH</div>
          </td>
          <td style="text-align:right;color:#1e293b">1</td>
          <td style="text-align:right;color:#1e293b">CHF ${fmt2(price.maintenance)} / Mt.</td>
          <td style="text-align:right;font-weight:700;color:#1e293b">CHF ${fmt2(price.maintenance)} / Mt.</td>
        </tr>` : '',
    ].filter(Boolean).join('');

    const hasRecurring = price.hosting > 0 || price.maintenance > 0;

    pw.document.write(`<!DOCTYPE html>
<html><head>
  <title>OFFERTE ${ref}</title>
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
    .section-sep td{padding:8px 12px;background:#f0f9ff;font-size:10px;font-weight:700;color:#0891b2;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #bae6fd}
    .totals{border-top:2px solid #e2e8f0;padding-top:20px;max-width:300px;margin-left:auto;margin-bottom:32px}
    .t-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#64748b}
    .t-grand{display:flex;justify-content:space-between;padding:14px 0 0;margin-top:8px;border-top:2px solid #0f172a;font-size:18px;font-weight:800}
    .t-grand span:last-child{color:#0891b2}
    .notes{padding:16px;background:#f8fafc;border-radius:8px;font-size:13px;color:#475569;margin-bottom:32px}
    .notes b{color:#1e293b;display:block;margin-bottom:6px}
    .footer{padding-top:20px;border-top:1px solid #e2e8f0;font-size:10px;color:#94a3b8;text-align:center;line-height:1.8;margin-top:60px}
    .print-bar{position:fixed;top:0;left:0;right:0;background:#0f172a;padding:10px 24px;display:flex;justify-content:space-between;align-items:center;z-index:999}
    .print-bar span{color:#94a3b8;font-size:13px}
    .print-btn{background:#06b6d4;color:#fff;border:none;border-radius:8px;padding:8px 20px;font-size:13px;font-weight:700;cursor:pointer}
    body{padding-top:56px}
    @media print{.print-bar{display:none}body{padding-top:0;padding:20px 30px}}
  </style>
</head><body>
  <div class="print-bar">
    <span>OFFERTE ${ref} · ${today.toLocaleDateString('de-CH')}</span>
    <button class="print-btn" onclick="window.print()">&#128438; Als PDF speichern / Drucken</button>
  </div>
  <div class="header">
    <div>
      <div class="logo">HED<span>-IT</span></div>
      <div class="logo-sub">Web & Marketing Solutions</div>
      <div class="logo-contact">info@hed-it.ch · www.hed-it.ch</div>
    </div>
    <div>
      <div class="doc-title">OFFERTE</div>
      <div class="doc-num">Ref. ${ref}</div>
      <div class="doc-num">${today.toLocaleDateString('de-CH')}</div>
    </div>
  </div>
  <div class="info-grid">
    <div>
      <div class="label">Empfänger</div>
      <div style="font-weight:700;font-size:16px">${name || 'Interessent'}</div>
      ${email ? `<div style="font-size:14px;color:#475569;margin-top:4px">${email}</div>` : ''}
      ${phone ? `<div style="font-size:14px;color:#475569;margin-top:2px">${phone}</div>` : ''}
      ${discountInfo}
    </div>
    <div>
      <div class="label">Details</div>
      <div class="meta"><span class="meta-l">Datum:</span><span class="meta-v">${today.toLocaleDateString('de-CH')}</span></div>
      <div class="meta"><span class="meta-l">Gültig bis:</span><span class="meta-v">${validUntil.toLocaleDateString('de-CH')}</span></div>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:50%">Beschreibung</th><th>Menge</th><th>Einzelpreis</th><th>Gesamt</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
      ${hasRecurring ? `<tr class="section-sep"><td colspan="4">Wiederkehrende Leistungen</td></tr>` : ''}
      ${recurringRows}
    </tbody>
  </table>
  <div class="totals">
    <div class="t-grand"><span>Einmalig (CHF):</span><span>CHF ${fmt2(price.sub)}</span></div>
    ${price.hosting > 0 ? `<div class="t-row" style="margin-top:12px"><span>+ Hosting:</span><span>CHF ${fmt2(price.hosting)} / Jahr</span></div>` : ''}
    ${price.maintenance > 0 ? `<div class="t-row"><span>+ Wartung:</span><span>CHF ${fmt2(price.maintenance)} / Mt.</span></div>` : ''}
  </div>
  <div class="notes"><b>Festpreis-Garantie</b>Was hier steht, gilt. Keine versteckten Stunden, keine Nachforderungen. Alle Preise in CHF inkl. MwSt (8.1%). Erstgespräch immer kostenlos.</div>
  <div class="footer">
    HED-IT Joel Hediger · Web & Marketing Solutions<br>
    info@hed-it.ch · www.hed-it.ch · +41 41 562 34 16<br>
    Alle Preise in CHF · Festpreisgarantie · Gerichtsstand: Schweiz
  </div>
</body></html>`);
    pw.document.close();
  };

  const submit = async () => {
    if (!name || !email) { formRef.current?.scrollIntoView({ behavior: 'smooth' }); return; }
    setSending(true);
    await fetch('/api/public/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: 'Kalkulator-Anfrage',
        details: `Name: ${name}\nE-Mail: ${email}${phone ? `\nTelefon: ${phone}` : ''}\n\nWebsite-Typ: ${WEBSITE_TYPES.find(w => w.id === site)?.label}\nSprachen: ${langs}\nTotal: CHF ${chf(price.sub)}\nHosting: CHF ${chf(price.hosting)}/Jahr\nWartung: CHF ${chf(price.maintenance)}/Mt.`,
      }),
    }).catch(() => {});
    setSending(false); setSent(true);
  };

  /* ── Shared step header ── */
  const Step = ({ num, title }: { num: string; title: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
      <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,242,255,0.12)', border: '1.5px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: 'var(--primary)', flexShrink: 0 }}>{num}</span>
      <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>{title}</h3>
    </div>
  );

  /* ── Radio row ── */
  const Radio = ({ checked, onClick, label, desc, right }: { checked: boolean; onClick: () => void; label: string; desc: string; right?: React.ReactNode }) => (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 14, border: `1.5px solid ${checked ? 'var(--primary)' : 'var(--border)'}`, background: checked ? 'rgba(0,242,255,0.04)' : 'var(--bg-card)', cursor: 'pointer', transition: 'all 0.2s', marginBottom: 10 }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${checked ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
        {checked && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-main)' }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  );

  /* ── Checkbox ── */
  const Checkbox = ({ checked, onClick, label, desc, price: p }: { checked: boolean; onClick: () => void; label: string; desc: string; price: number }) => (
    <div onClick={onClick} style={{ padding: '16px 18px', borderRadius: 14, border: `1.5px solid ${checked ? 'var(--primary)' : 'var(--border)'}`, background: checked ? 'rgba(0,242,255,0.04)' : 'var(--bg-card)', cursor: 'pointer', transition: 'all 0.2s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${checked ? 'var(--primary)' : 'var(--border)'}`, background: checked ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.15s' }}>
            {checked && <Check size={11} color="#000" strokeWidth={3} />}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-main)' }}>{label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>{desc}</div>
          </div>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>+ CHF {chf(p)}</span>
      </div>
    </div>
  );

  return (
    <div>
      {/* Hero */}
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="hero-tag">Kostenlos & unverbindlich</span>
            <h1 className="hero-title" style={{ marginTop: 16 }}>Ihr <span className="premium-gradient">Festpreis-Kalkulator</span></h1>
            <p className="hero-desc" style={{ margin: '0 auto' }}>Konfigurieren Sie Ihr Projekt — Preis wird live berechnet. Keine versteckten Kosten, Festpreisgarantie.</p>
          </motion.div>
        </div>
      </section>

      <section className="section section-dark" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="calc-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>

            {/* ── Left: Steps ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

              {/* Step 01 */}
              <motion.div className="glass-card" style={{ padding: 28 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <Step num="01" title="Sind Sie..." />
                {CLIENT_TYPES.map(c => (
                  <Radio key={c.id} checked={client === c.id} onClick={() => setClient(c.id)} label={c.label} desc={c.desc}
                    right={<span style={{ fontSize: 13, fontWeight: 700, color: c.discount > 0 ? '#10b981' : 'var(--text-muted)' }}>{c.badge}</span>} />
                ))}
              </motion.div>

              {/* Step 02 */}
              <motion.div className="glass-card" style={{ padding: 28 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Step num="02" title="Welche Art von Webseite?" />
                {WEBSITE_TYPES.map(w => (
                  <Radio key={w.id} checked={site === w.id} onClick={() => setSite(w.id)} label={w.label} desc={w.desc}
                    right={<span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{w.prefix || ''}CHF {chf(w.price)}</span>} />
                ))}
              </motion.div>

              {/* Step 03 */}
              <motion.div className="glass-card" style={{ padding: 28 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Step num="03" title="Wie viele Sprachen?" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1.5px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                    <button onClick={() => setLangs(Math.max(1, langs - 1))} style={{ width: 44, height: 44, background: 'var(--bg-card)', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={16} /></button>
                    <span style={{ width: 56, textAlign: 'center', fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>{langs}</span>
                    <button onClick={() => setLangs(Math.min(6, langs + 1))} style={{ width: 44, height: 44, background: 'var(--bg-card)', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={16} /></button>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Erste Sprache inklusive · jede weitere <strong style={{ color: 'var(--primary)' }}>+ CHF 600</strong></span>
                </div>
              </motion.div>

              {/* Step 04 */}
              <motion.div className="glass-card" style={{ padding: 28 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Step num="04" title="Zusatzleistungen" />
                <div className="extras-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
                  {EXTRAS.map(e => (
                    <Checkbox key={e.id} checked={extras.has(e.id)} onClick={() => toggleExtra(e.id)} label={e.label} desc={e.desc} price={e.price} />
                  ))}
                </div>
              </motion.div>

              {/* Step 05 */}
              <motion.div className="glass-card" style={{ padding: 28 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <Step num="05" title="Hosting" />
                {HOSTING.map(h => (
                  <Radio key={h.id} checked={hosting === h.id} onClick={() => setHosting(h.id)} label={h.label} desc={h.desc}
                    right={<span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>CHF {chf(h.price)} {h.unit}</span>} />
                ))}
              </motion.div>

              {/* Step 06 */}
              <motion.div className="glass-card" style={{ padding: 28 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Step num="06" title="Wartung" />
                {MAINTENANCE.map(m => (
                  <Radio key={m.id} checked={maintenance === m.id} onClick={() => setMaintenance(m.id)} label={m.label} desc={m.desc}
                    right={<span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>CHF {chf(m.price)} {m.unit}</span>} />
                ))}
              </motion.div>

              {/* Contact Form */}
              <motion.div ref={formRef} className="glass-card" style={{ padding: 28 }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <Step num="07" title="Ihre Kontaktdaten" />
                <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Vor- und Nachname *" style={{ padding: '12px 16px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: 14 }} />
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Telefon (optional)" style={{ padding: '12px 16px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: 14 }} />
                </div>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-Mail Adresse *" type="email" style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-main)', fontSize: 14, boxSizing: 'border-box', marginBottom: 16 }} />
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={submit} disabled={sending || sent} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', gap: 8, display: 'flex', alignItems: 'center' }}>
                    {sent ? <><Check size={16} /> Anfrage gesendet!</> : sending ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Sendet...</> : <><Send size={16} /> Festpreis-Angebot anfordern</>}
                  </button>
                  <button onClick={downloadPDF} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Download size={16} /> PDF
                  </button>
                </div>
                {sent && <p style={{ fontSize: 13, color: '#10b981', marginTop: 12, textAlign: 'center' }}>Wir melden uns innerhalb von 24 Stunden mit Ihrem Festpreis-Angebot.</p>}
              </motion.div>
            </div>

            {/* ── Right: Sticky Price Panel ── */}
            <div className="calc-sticky" style={{ position: 'sticky', top: 100 }}>
              <motion.div className="glass-card" style={{ padding: 28 }} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{ height: 2, flex: 1, background: 'var(--primary)' }} />
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.5, color: 'var(--primary)', textTransform: 'uppercase' }}>IHR FESTPREIS</span>
                </div>

                <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--text-main)', lineHeight: 1, margin: '8px 0 4px' }}>
                  CHF {chf(price.sub)}
                </div>

                {price.hosting > 0 && (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>+ CHF {chf(price.hosting)} / Jahr Hosting</div>
                )}
                {price.maintenance > 0 && (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>+ CHF {chf(price.maintenance)} / Monat Wartung</div>
                )}

                {price.discount > 0 && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 8, padding: '4px 10px', marginBottom: 16 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>{Math.round(price.discount * 100)}% Rabatt inklusive</span>
                  </div>
                )}

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 4, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {lineItems.map((li, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)' }}>
                      <span style={{ flex: 1, marginRight: 8 }}>{li.label}</span>
                      <span style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>CHF {chf(li.price)}</span>
                    </div>
                  ))}
                  {lineItems.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>Keine Positionen</div>}
                </div>

                <button onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 20, display: 'flex', gap: 8 }}>
                  <Send size={15} /> Festpreis-Angebot anfordern
                </button>

                <a href="tel:+41415623416" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10, padding: '12px', borderRadius: 10, border: '1px solid var(--border)', color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'all 0.2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--text-muted)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}>
                  +41 41 562 34 16
                </a>

                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 16, lineHeight: 1.6 }}>
                  Festpreis-Garantie: Was hier steht, gilt. Keine versteckten Stunden, keine Nachforderungen. Erstgespräch immer kostenlos.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 960px) {
          .calc-two-col { grid-template-columns: 1fr !important; }
          .calc-sticky { position: static !important; top: 0 !important; order: -1; }
        }
        @media (max-width: 600px) {
          .extras-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Calculator;
