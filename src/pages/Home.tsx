import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Cloud, Zap, Shield, Layout, Rocket, Star, Quote, Check, X, Minus, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ── Typing Effect Hook ── */
const useTyping = (words: string[], speed = 75) => {
  const [text, setText] = useState('');
  const [wi, setWi] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[wi];
    const delay = deleting ? 35 : text.length === word.length ? 2000 : speed;
    const t = setTimeout(() => {
      if (!deleting && text.length < word.length) setText(word.slice(0, text.length + 1));
      else if (!deleting && text.length === word.length) setDeleting(true);
      else if (deleting && text.length > 0) setText(word.slice(0, text.length - 1));
      else { setDeleting(false); setWi((wi + 1) % words.length); }
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, wi, words, speed]);
  return text;
};

/* ── Count-Up Hook ── */
const useCountUp = (target: number, duration = 1800) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let s = 0;
    const inc = target / (duration / 16);
    const id = setInterval(() => {
      s += inc;
      if (s >= target) { setCount(target); clearInterval(id); }
      else setCount(Math.floor(s));
    }, 16);
    return () => clearInterval(id);
  }, [started, target, duration]);
  return { count, ref };
};

/* ── FAQ Item ── */
const FAQ = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s', borderColor: open ? 'var(--primary)' : 'var(--border)' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: 15, fontWeight: 600, textAlign: 'left', gap: 16 }}>
        {q}
        <ChevronDown size={18} style={{ flexShrink: 0, color: 'var(--primary)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
      </button>
      {open && (
        <div style={{ padding: '0 24px 20px', color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.8 }}>{a}</div>
      )}
    </div>
  );
};

/* ── Stat Card ── */
const Stat = ({ target, suffix, label, color }: { target: number; suffix: string; label: string; color: string }) => {
  const { count, ref } = useCountUp(target);
  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '32px 24px' }}>
      <div style={{ fontSize: 52, fontWeight: 900, color, lineHeight: 1 }}>{count}{suffix}</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, fontWeight: 500 }}>{label}</div>
    </div>
  );
};

/* ── Tech Marquee items ── */
const TECHS = ['React', 'TypeScript', 'Next.js', 'Node.js', 'Docker', 'Hetzner Cloud', 'Microsoft 365', 'PostgreSQL', 'Vite', 'Tailwind', 'GitHub Actions', 'Caddy', 'Linux', 'REST APIs', 'JWT Auth', 'Stripe'];

/* ── Main Component ── */
const Home = () => {
  const typedWord = useTyping(['Webseiten.', 'Cloud-Infra.', 'IT-Systeme.', 'Zukunft.']);

  const competence = [
    { icon: <Layout size={32} color="var(--primary)" />, title: 'Web-Development', desc: 'Massgeschneiderte Webseiten & Apps mit modernsten Frameworks wie React und Next.js.', color: 'var(--primary)' },
    { icon: <Cloud size={32} color="var(--secondary)" />, title: 'Cloud Migration', desc: 'Nahtlose Umstellung Ihrer Infrastruktur auf Hetzner Cloud oder Microsoft 365.', color: 'var(--secondary)' },
    { icon: <Shield size={32} color="#00ff88" />, title: 'Cyber Security', desc: 'Schutz Ihrer digitalen Assets durch modernste Sicherheits-Audits und Monitoring.', color: '#00ff88' },
  ];

  const compare = [
    { feature: 'Persönlicher Ansprechpartner', hedit: true, agentur: null, plattform: false },
    { feature: 'Schweizer Qualitätsstandards', hedit: true, agentur: null, plattform: false },
    { feature: 'Faire, transparente Preise', hedit: true, agentur: false, plattform: true },
    { feature: '100% Individuallösung', hedit: true, agentur: true, plattform: false },
    { feature: 'Reaktionszeit < 4 Stunden', hedit: true, agentur: false, plattform: null },
    { feature: 'Langzeit-Support inklusive', hedit: true, agentur: null, plattform: false },
    { feature: 'Kein Agentur-Overhead', hedit: true, agentur: false, plattform: null },
  ];

  const faqs = [
    { q: 'Was kostet eine professionelle Webseite?', a: 'Das hängt vom Umfang ab — eine Landing Page startet ab CHF 1\'500, komplexe Web-Applikationen ab CHF 5\'000. Nutzen Sie unseren Kalkulator für eine sofortige Schätzung. Alle Preise sind Festpreise, keine versteckten Kosten.' },
    { q: 'Wie lange dauert ein Webprojekt?', a: 'Eine einfache Webseite ist in 2–3 Wochen fertig. Grössere Projekte mit individuellen Funktionen dauern typischerweise 4–8 Wochen. Nach dem Erstgespräch erhalten Sie einen detaillierten Zeitplan.' },
    { q: 'Bieten Sie Hosting an?', a: 'Ja. Wir hosten auf Hetzner Cloud in Deutschland (ISO-zertifiziert, DSGVO-konform). Managed Hosting inklusive Updates, Monitoring und Backups ab CHF 29/Monat.' },
    { q: 'Was passiert nach dem Launch?', a: 'Wir übergeben alles mit Dokumentation und Zugangsdaten. Danach bieten wir Wartungsverträge, Support-Tickets über das Kundenportal und können jederzeit für Änderungen beauftragt werden.' },
    { q: 'Kann ich meine Webseite danach selbst bearbeiten?', a: 'Auf Wunsch integrieren wir ein CMS (z.B. Sanity, Strapi) — damit können Sie Texte, Bilder und Inhalte selbst ändern ohne Programmierkenntnisse. Wir schulen Sie in der Nutzung.' },
    { q: 'Arbeiten Sie auch für kleine Unternehmen und Startups?', a: 'Absolut. Viele unserer Kunden sind KMUs, Einzelunternehmer und Startups. Wir bieten skalierbare Lösungen — Sie zahlen genau für das was Sie brauchen, nicht mehr.' },
  ];

  const testimonials = [
    { name: 'Vierkorken GmbH', role: 'Gastronomie & Weinhandel', logo: '/referenzen/vierkorken.png', text: 'Joel hat unsere gesamte Webpräsenz von Grund auf neu aufgebaut. Die Seite läuft schnell, sieht professionell aus und unsere Kunden lieben sie.', stars: 5 },
    { name: 'Metallwerk Swiss', role: 'Metallverarbeitung & Industrie', logo: '/referenzen/metallwerk-swiss.png', text: 'Unkomplizierte Zusammenarbeit, schnelle Umsetzung und immer erreichbar. Unsere neue Webseite hat die Anfragen spürbar erhöht.', stars: 5 },
    { name: 'Bäckerei Bamann', role: 'Traditionelle Bäckerei', logo: '/referenzen/bamann.png', text: 'Einfach top. Joel hat genau verstanden was wir wollen und es perfekt umgesetzt. Sehr empfehlenswert!', stars: 5 },
  ];

  const CellIcon = ({ val }: { val: boolean | null }) => {
    if (val === true) return <Check size={18} color="#10b981" />;
    if (val === false) return <X size={18} color="#ef4444" />;
    return <Minus size={18} color="#94a3b8" />;
  };

  return (
    <div className="page-home">

      {/* ── Hero ── */}
      <header className="hero">
        <div className="container hero-grid">
          <motion.div className="hero-text" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            {/* Availability badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 100, padding: '6px 14px', marginBottom: 20 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 0 3px rgba(16,185,129,0.25)', animation: 'pulse-dot 2s infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>Aktuell verfügbar für neue Projekte</span>
            </div>

            <h1 className="hero-title">
              Wir bauen die <br />
              <span className="premium-gradient" style={{ minHeight: '1.2em', display: 'inline-block' }}>
                {typedWord}<span style={{ borderRight: '3px solid var(--primary)', marginLeft: 2, animation: 'blink 1s step-end infinite' }} />
              </span>
            </h1>
            <p className="hero-desc">
              Herausragende Webentwicklung, skalierbare Cloud-Lösungen und erstklassiger Support.
              Wir begleiten Sie von der ersten Idee bis zum stabilen Betrieb.
            </p>
            <div className="flex gap-4">
              <Link to="/calculator" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                Projekt kalkulieren <Rocket size={20} />
              </Link>
              <Link to="/services" className="btn btn-outline" style={{ textDecoration: 'none' }}>
                Unsere Expertise
              </Link>
            </div>
          </motion.div>

          <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            <div style={{ position: 'relative' }}>
              <img src="/hero-visual.png" alt="IT Excellence" />
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)', zIndex: -1 }} />
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── Animated Showcase / "Mini Videos" ── */}
      <section className="section" style={{ paddingTop: 40, paddingBottom: 40, overflow: 'hidden' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="hero-tag">Live · Showcase</span>
            <h2 style={{ fontSize: 38, marginTop: 16, marginBottom: 12 }}>Was wir für Sie bauen</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto' }}>Von der Idee zur fertigen Webseite — persönlich, lokal, schweizweit.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {[
              { label: 'Web-Entwicklung', tag: 'React · TypeScript', color: 'var(--primary)', lines: ['Startseite', 'Über uns', 'Leistungen', 'Kontakt'], accent: '#00f2ff' },
              { label: 'Cloud & Hosting', tag: 'Hetzner · M365', color: 'var(--secondary)', lines: ['SSL-Zertifikat', 'Auto-Backup', 'Monitoring', 'Support'], accent: '#8b5cf6' },
              { label: 'E-Commerce', tag: 'Shop · Zahlung', color: '#10b981', lines: ['Produkte', 'Warenkorb', 'Stripe', 'Bestellungen'], accent: '#10b981' },
            ].map((card, ci) => (
              <motion.div key={ci}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: ci * 0.12 }}
                style={{ background: 'var(--bg-card)', border: `1px solid var(--border)`, borderRadius: 20, overflow: 'hidden', position: 'relative' }}>
                {/* Browser chrome */}
                <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {['#ef4444','#f59e0b','#10b981'].map((c,i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                  <div style={{ flex: 1, height: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 6, marginLeft: 8 }} />
                </div>
                {/* Animated content */}
                <div style={{ padding: '24px 20px', minHeight: 180, position: 'relative' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: card.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>{card.tag}</div>
                  {card.lines.map((line, li) => (
                    <motion.div key={li}
                      initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                      transition={{ delay: ci * 0.1 + li * 0.08 + 0.3 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: card.accent, flexShrink: 0 }} />
                      <div style={{ height: 10, borderRadius: 4, background: `linear-gradient(90deg, ${card.accent}22, ${card.accent}08)`, flex: li % 2 === 0 ? 0.7 : 0.5 }} />
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{line}</span>
                    </motion.div>
                  ))}
                  {/* Floating badge */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: ci * 0.5 }}
                    style={{ position: 'absolute', bottom: 20, right: 16, background: card.accent, borderRadius: 100, padding: '6px 14px', fontSize: 11, fontWeight: 800, color: '#000', boxShadow: `0 4px 20px ${card.accent}44` }}>
                    {['✓ Live', '✓ Sicher', '✓ Fertig'][ci]}
                  </motion.div>
                </div>
                {/* Bottom bar */}
                <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>{card.label}</span>
                  <div style={{ fontSize: 11, color: card.color, fontWeight: 700, background: `${card.accent}15`, borderRadius: 6, padding: '3px 8px' }}>ab CHF {['1\'500','189 /J','8\'000'][ci]}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Floating badges row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 32 }}>
            {['✓ Aus einer Hand', '✓ Persönlich · Lokal', '✓ Festpreisgarantie', '✓ Schweizer Qualität', '✓ Schnelle Umsetzung'].map((b, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 100, padding: '8px 18px', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
                {b}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Marquee ── */}
      <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '18px 0', background: 'var(--bg-section)' }}>
        <div style={{ display: 'flex', animation: 'marquee 28s linear infinite', width: 'max-content', gap: 0 }}>
          {[...TECHS, ...TECHS].map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0 32px', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', opacity: 0.6 }} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats Counter ── */}
      <section style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            <Stat target={25} suffix="+" label="Projekte abgeschlossen" color="var(--primary)" />
            <Stat target={100} suffix="%" label="Kundenzufriedenheit" color="var(--secondary)" />
            <Stat target={24} suffix="/7" label="Support & Monitoring" color="#00ff88" />
            <Stat target={5} suffix="+" label="Jahre Erfahrung" color="#f59e0b" />
          </div>
        </div>
      </section>

      {/* ── Kernkompetenzen ── */}
      <section className="section section-dark">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, gap: 24, flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: 42, marginBottom: 16 }}>Unsere Kernkompetenzen</h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: 600 }}>Wir kombinieren strategisches Denken mit technischer Exzellenz, um Lösungen zu schaffen, die wirklich funktionieren.</p>
            </div>
            <Link to="/services" className="nav-link" style={{ fontWeight: 'bold' }}>Alle Dienstleistungen →</Link>
          </div>
          <div className="items-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
            {competence.map((c, i) => (
              <motion.div key={i} className="calc-item" style={{ padding: 48, borderBottom: `4px solid ${c.color}` }} whileHover={{ translateY: -10 }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>{c.icon}</div>
                <h3 style={{ fontSize: 24, marginBottom: 16 }}>{c.title}</h3>
                <p className="item-desc" style={{ fontSize: 15 }}>{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why hed-it ── */}
      <section className="section about-section">
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: 800 }}>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <span className="hero-tag" style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--secondary)', borderColor: 'rgba(124,58,237,0.2)' }}>Hinter den Kulissen</span>
              <h2 className="about-title" style={{ fontSize: 62, marginBottom: 40, lineHeight: 1.1 }}>Echte Expertise <br />ist persönlich.</h2>
              <p className="about-desc" style={{ fontSize: 20, lineHeight: 1.9, marginBottom: 48, color: 'var(--text-muted)' }}>
                Als inhabergeführtes Unternehmen stehe ich mit meinem Namen für die Qualität jedes Projekts. Wir verstehen IT nicht als reinen Kostenfaktor, sondern als strategischen Wettbewerbsvorteil. Persönliche Betreuung auf Augenhöhe ist bei uns Standard.
              </p>
              <div className="flex flex-col gap-8">
                <div className="flex gap-12">
                  <div><h2 style={{ fontSize: 52, color: 'var(--primary)', lineHeight: 1 }}>100%</h2><p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8 }}>Fokus auf Qualität</p></div>
                  <div><h2 style={{ fontSize: 52, color: 'var(--secondary)', lineHeight: 1 }}>24/7</h2><p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 8 }}>Support & Monitoring</p></div>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 24, marginTop: 20 }}>
                  <li className="flex gap-4 items-center" style={{ fontSize: 17, fontWeight: 600 }}><Zap size={22} color="var(--primary)" /> Zertifizierte Partner von Hetzner & Microsoft</li>
                  <li className="flex gap-4 items-center" style={{ fontSize: 17, fontWeight: 600 }}><Zap size={22} color="var(--primary)" /> 100% Individualität statt Standard-Lösungen</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="section section-dark">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="hero-tag" style={{ background: 'rgba(0,242,255,0.08)', color: 'var(--primary)', borderColor: 'rgba(0,242,255,0.2)' }}>Vergleich</span>
            <h2 style={{ fontSize: 42, marginTop: 16, marginBottom: 16 }}>hed-it vs. die Alternativen</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>Warum immer mehr Schweizer KMUs auf hed-it setzen.</p>
          </motion.div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 560 }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>Feature</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: 13, fontWeight: 800, color: 'var(--primary)', borderBottom: '2px solid var(--primary)', background: 'rgba(0,242,255,0.04)' }}>hed-it</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>Grosse Agentur</th>
                  <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border)' }}>Freelancer-Plattform</th>
                </tr>
              </thead>
              <tbody>
                {compare.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td style={{ padding: '14px 20px', fontSize: 14, color: 'var(--text-main)', borderBottom: '1px solid var(--border)' }}>{row.feature}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'center', borderBottom: '1px solid var(--border)', background: 'rgba(0,242,255,0.03)' }}><CellIcon val={row.hedit} /></td>
                    <td style={{ padding: '14px 20px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}><CellIcon val={row.agentur} /></td>
                    <td style={{ padding: '14px 20px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}><CellIcon val={row.plattform} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, textAlign: 'right' }}>
              <Minus size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> = je nach Anbieter
            </p>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section section-dark" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="hero-tag" style={{ background: 'rgba(0,242,255,0.08)', color: 'var(--primary)', borderColor: 'rgba(0,242,255,0.2)' }}>Kundenstimmen</span>
            <h2 style={{ fontSize: 42, marginTop: 16, marginBottom: 16 }}>Was unsere Kunden sagen</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto' }}>Echte Projekte, echte Ergebnisse — von Unternehmen aus der ganzen Schweiz.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 28 }}>
            {testimonials.map((t, i) => (
              <motion.div key={i} className="calc-item" style={{ padding: 36, display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <Quote size={28} style={{ color: 'var(--primary)', opacity: 0.35, position: 'absolute', top: 28, right: 28 }} />
                <div style={{ display: 'flex', gap: 4 }}>{Array.from({ length: t.stars }).map((_, s) => <Star key={s} size={16} fill="var(--primary)" color="var(--primary)" />)}</div>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-muted)', margin: 0, flex: 1 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={t.logo} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-main)' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: 740 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="hero-tag">FAQ</span>
            <h2 style={{ fontSize: 42, marginTop: 16, marginBottom: 16 }}>Häufige Fragen</h2>
            <p style={{ color: 'var(--text-muted)' }}>Alles was Sie wissen müssen — ehrlich und direkt.</p>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <FAQ q={f.q} a={f.a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="section section-dark" style={{ borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: 40, marginBottom: 16 }}>Bereit für Ihr Projekt?</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 16 }}>Kostenloses Erstgespräch — unverbindlich, direkt, ohne Agentur-Overhead.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/calculator" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: 16, padding: '14px 32px' }}>
                Jetzt kalkulieren <Rocket size={18} />
              </Link>
              <Link to="/contact" className="btn btn-outline" style={{ textDecoration: 'none', fontSize: 16, padding: '14px 32px' }}>
                Kontakt aufnehmen
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 3px rgba(16,185,129,0.25); }
          50% { box-shadow: 0 0 0 6px rgba(16,185,129,0.1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default Home;
