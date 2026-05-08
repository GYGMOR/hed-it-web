import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Globe, Cloud, Shield, Search, Server, Smartphone,
  CheckCircle2, ArrowRight, Rocket, Zap, Check
} from 'lucide-react';

const services = [
  {
    icon: <Globe size={28} />,
    color: 'var(--primary)',
    glow: 'rgba(0,242,255,0.12)',
    title: 'Webentwicklung',
    sub: 'React · Next.js · TypeScript',
    desc: 'Massgeschneiderte Webseiten und Web-Apps die performen. Von der Landing Page bis zum komplexen Portal — immer mit sauberem Code und echten Ergebnissen.',
    features: ['Landing Pages & Corporate Sites', 'Web-Applikationen & Portale', 'E-Commerce & Webshops', 'Progressive Web Apps (PWA)'],
    from: 'ab CHF 1\'500',
  },
  {
    icon: <Cloud size={28} />,
    color: 'var(--secondary)',
    glow: 'rgba(139,92,246,0.12)',
    title: 'Cloud & Hosting',
    sub: 'Hetzner · Microsoft 365',
    desc: 'Skalierbare Infrastruktur auf Schweizer und deutschen Servern. Wir richten ein, überwachen und halten Ihre Cloud am Laufen — damit Sie es nicht müssen.',
    features: ['Managed Hosting auf Hetzner', 'Microsoft 365 Migration & Setup', 'SSL, Backups, Monitoring', 'Domain & E-Mail Management'],
    from: 'ab CHF 189 / Jahr',
  },
  {
    icon: <Search size={28} />,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.12)',
    title: 'SEO & Sichtbarkeit',
    sub: 'Google · Core Web Vitals',
    desc: 'Was nützt die schönste Webseite, wenn niemand sie findet? Wir sorgen dafür, dass Sie bei Google gefunden werden — technisch und inhaltlich.',
    features: ['Technical SEO & On-Page', 'Keyword-Recherche & Strategie', 'Core Web Vitals Optimierung', 'Monatliche Reports'],
    from: 'ab CHF 800',
  },
  {
    icon: <Shield size={28} />,
    color: '#10b981',
    glow: 'rgba(16,185,129,0.12)',
    title: 'IT-Security',
    sub: 'Audit · Monitoring · Schutz',
    desc: 'Cyberangriffe treffen auch KMUs. Wir analysieren Ihre digitalen Assets, schliessen Lücken und setzen Monitoring auf — bevor etwas passiert.',
    features: ['Security-Audits & Pentesting', 'Firewall & Zugriffsschutz', '24/7 Monitoring & Alerting', 'DSGVO / revDSG Compliance'],
    from: 'auf Anfrage',
  },
  {
    icon: <Server size={28} />,
    color: '#e879f9',
    glow: 'rgba(232,121,249,0.12)',
    title: 'IT-Beratung & Support',
    sub: 'Strategie · Umsetzung · Betreuung',
    desc: 'Persönliche IT-Beratung ohne Agentur-Overhead. Sie bekommen direkte Antworten, einen klaren Plan und jemanden der auch nach dem Projekt erreichbar ist.',
    features: ['IT-Strategie & Roadmap', 'Software-Auswahl & Implementierung', 'Mitarbeiterschulungen', 'Laufender Support per Ticket'],
    from: 'ab CHF 150 / Std.',
  },
  {
    icon: <Smartphone size={28} />,
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.12)',
    title: 'Mobile & Apps',
    sub: 'React Native · iOS · Android',
    desc: 'Mobile first ist kein Trend mehr — es ist Standard. Wir entwickeln Apps für iOS und Android, die sich anfühlen wie native Anwendungen.',
    features: ['React Native Cross-Platform', 'App Store Submission & Setup', 'Push Notifications', 'API-Integration & Backend'],
    from: 'ab CHF 8\'000',
  },
];

const packages = [
  {
    name: 'Starter',
    desc: 'Für Selbständige und kleine Unternehmen',
    price: '1\'500',
    color: 'var(--primary)',
    items: ['Landing Page (1–3 Seiten)', 'Responsives Design', 'Kontaktformular', 'SSL-Zertifikat', 'Google-ready (Basis SEO)'],
    cta: 'Starter wählen',
    highlight: false,
  },
  {
    name: 'Business',
    desc: 'Für wachsende KMUs mit mehr Ansprüchen',
    price: '3\'500',
    color: 'var(--secondary)',
    items: ['Unternehmenswebseite (5–15 Seiten)', 'CMS — Inhalte selbst pflegen', 'SEO Pro', 'Hosting CHF 189/Jahr', 'Wartung Basic 49/Mt.'],
    cta: 'Business wählen',
    highlight: true,
  },
  {
    name: 'Enterprise',
    desc: 'Für komplexe Projekte und Web-Applikationen',
    price: '8\'000',
    color: '#10b981',
    items: ['Web-App / Portal massgeschneidert', 'API-Anbindung an Drittsysteme', 'Custom Design & Animationen', 'Dedicated Support', 'Reaktionszeit < 4 Stunden'],
    cta: 'Anfragen',
    highlight: false,
  },
];

const process = [
  { num: '01', title: 'Beratung', desc: 'Kostenloses Erstgespräch — wir analysieren Ihre Anforderungen und Ziele ohne Druck.', color: 'var(--primary)' },
  { num: '02', title: 'Konzept & Offerte', desc: 'Detaillierter Projektplan mit klaren Meilensteinen und transparenten Festpreisen.', color: 'var(--secondary)' },
  { num: '03', title: 'Entwicklung', desc: 'Agile Umsetzung mit regelmässigen Updates — Sie sehen den Fortschritt in Echtzeit.', color: '#10b981' },
  { num: '04', title: 'Launch & Support', desc: 'Professioneller Deployment, Übergabe mit Dokumentation und langfristiger Betreuung.', color: '#f59e0b' },
];

const Services = () => (
  <div className="page-services">

    {/* Hero */}
    <section className="hero" style={{ paddingBottom: 40 }}>
      <div className="container text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="hero-tag">Alles aus einer Hand</span>
          <h1 className="hero-title" style={{ marginTop: 16 }}>Unsere <span className="premium-gradient">Dienstleistungen</span></h1>
          <p className="hero-desc" style={{ margin: '0 auto' }}>Von der ersten Idee bis zum laufenden Betrieb — digitale Exzellenz für Schweizer Unternehmen.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
            <Link to="/calculator" className="btn btn-primary" style={{ textDecoration: 'none' }}><Rocket size={18} /> Projekt kalkulieren</Link>
            <Link to="/contact" className="btn btn-outline" style={{ textDecoration: 'none' }}>Kostenlos beraten lassen</Link>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Services Grid */}
    <section className="section section-dark">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {services.map((s, i) => (
            <motion.div key={i}
              className="glass-card"
              style={{ padding: 28, borderTop: `3px solid ${s.color}`, position: 'relative', overflow: 'hidden' }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}>
              {/* Glow */}
              <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, background: s.glow, borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

              <div style={{ width: 52, height: 52, borderRadius: 14, background: s.glow, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: 16 }}>
                {s.icon}
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{s.sub}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: 'var(--text-main)' }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 20 }}>{s.desc}</p>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {s.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                    <CheckCircle2 size={14} color={s.color} style={{ flexShrink: 0 }} /> {f}
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.from}</span>
                <Link to="/calculator" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}
                  onMouseEnter={e => (e.currentTarget.style.color = s.color)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                  Kalkulieren <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Pricing Packages */}
    <section className="section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="hero-tag">Preispakete</span>
          <h2 style={{ fontSize: 40, marginTop: 16, marginBottom: 12 }}>Transparent. Festpreis. Klar.</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto' }}>Alle Preise sind Festpreise — keine versteckten Stunden, keine Nachforderungen.</p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, alignItems: 'start' }}>
          {packages.map((p, i) => (
            <motion.div key={i}
              className="glass-card"
              style={{ padding: 32, position: 'relative', border: p.highlight ? `2px solid ${p.color}` : '1px solid var(--border)', boxShadow: p.highlight ? `0 0 40px ${p.color}20` : 'none' }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}>
              {p.highlight && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: p.color, color: '#000', fontSize: 11, fontWeight: 800, borderRadius: 100, padding: '4px 16px', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
                  EMPFOHLEN
                </div>
              )}
              <div style={{ fontSize: 13, fontWeight: 700, color: p.color, marginBottom: 6 }}>{p.name}</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>CHF {p.price}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24, marginTop: 4 }}>{p.desc}</div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {p.items.map((item, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    <Check size={14} color={p.color} style={{ flexShrink: 0, marginTop: 1 }} /> {item}
                  </li>
                ))}
              </ul>

              <Link to="/calculator"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 14, background: p.highlight ? p.color : 'transparent', color: p.highlight ? '#000' : p.color, border: `1.5px solid ${p.color}`, transition: 'all 0.2s' }}>
                {p.cta} <ArrowRight size={15} />
              </Link>
            </motion.div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 24 }}>
          Alle Preise in CHF · exkl. MWST · individuelle Konfiguration im <Link to="/calculator" style={{ color: 'var(--primary)' }}>Kalkulator</Link>
        </p>
      </div>
    </section>

    {/* Process Timeline */}
    <section className="section section-dark">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="hero-tag">Unser Prozess</span>
          <h2 style={{ fontSize: 40, marginTop: 16, marginBottom: 12 }}>So arbeiten wir</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>Transparent, strukturiert und immer mit Ihnen im Dialog.</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {process.map((step, i) => (
            <motion.div key={i} className="glass-card"
              style={{ padding: 28, position: 'relative', overflow: 'hidden' }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}>
              <div style={{ fontSize: 64, fontWeight: 900, color: step.color, opacity: 0.07, position: 'absolute', top: -8, right: 12, lineHeight: 1, userSelect: 'none' }}>{step.num}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: step.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Schritt {step.num}</div>
              <h3 style={{ fontSize: 18, marginBottom: 10, fontWeight: 700 }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section" style={{ textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: 580 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Zap size={32} color="var(--primary)" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 38, marginBottom: 12 }}>Bereit loszulegen?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Kostenloses Erstgespräch — kein Druck, keine Agentur-Overhead, nur echte Beratung.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/calculator" className="btn btn-primary" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: 15 }}>
              <Rocket size={18} /> Projekt kalkulieren
            </Link>
            <Link to="/contact" className="btn btn-outline" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: 15 }}>
              Kontakt aufnehmen
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  </div>
);

export default Services;
