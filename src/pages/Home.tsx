import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Zap, Shield, Layout, Rocket, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const competence = [
    {
      icon: <Layout size={32} color="var(--primary)" />,
      title: "Web-Development",
      desc: "Massgeschneiderte Webseiten & Apps mit modernsten Frameworks wie React und Next.js.",
      color: "var(--primary)"
    },
    {
      icon: <Cloud size={32} color="var(--secondary)" />,
      title: "Cloud Migration",
      desc: "Nahtlose Umstellung Ihrer Infrastruktur auf Hetzner Cloud oder Microsoft 365.",
      color: "var(--secondary)"
    },
    {
      icon: <Shield size={32} color="#00ff88" />,
      title: "Cyber Security",
      desc: "Schutz Ihrer digitalen Assets durch modernste Sicherheits-Audits und Monitoring.",
      color: "#00ff88"
    }
  ];

  const testimonials = [
    {
      name: "Vierkorken GmbH",
      role: "Gastronomie & Weinhandel",
      logo: "/referenzen/vierkorken.png",
      text: "Joel hat unsere gesamte Webpräsenz von Grund auf neu aufgebaut. Die Seite läuft schnell, sieht professionell aus und unsere Kunden lieben sie.",
      stars: 5
    },
    {
      name: "Metallwerk Swiss",
      role: "Metallverarbeitung & Industrie",
      logo: "/referenzen/metallwerk-swiss.png",
      text: "Unkomplizierte Zusammenarbeit, schnelle Umsetzung und immer erreichbar. Unsere neue Webseite hat die Anfragen spürbar erhöht.",
      stars: 5
    },
    {
      name: "Bäckerei Bamann",
      role: "Traditionelle Bäckerei",
      logo: "/referenzen/bamann.png",
      text: "Einfach top. Joel hat genau verstanden was wir wollen und es perfekt umgesetzt. Sehr empfehlenswert!",
      stars: 5
    }
  ];

  return (
    <div className="page-home">
      {/* Hero */}
      <header className="hero">
        <div className="container hero-grid">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-tag">Schweizer IT-Partner</span>
            <h1 className="hero-title">
              Wir bauen die <br />
              <span className="premium-gradient">digitale Zukunft.</span>
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

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div style={{ position: 'relative' }}>
              <img src="/hero-visual.png" alt="IT Excellence" />
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
                zIndex: -1
              }} />
            </div>
          </motion.div>
        </div>
      </header>

      {/* Kernkompetenzen */}
      <section className="section section-dark">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ fontSize: '42px', marginBottom: '16px' }}>Unsere Kernkompetenzen</h2>
              <p style={{ color: 'var(--text-muted)', maxWidth: '600px' }}>
                Wir kombinieren strategisches Denken mit technischer Exzellenz, um Lösungen zu schaffen, die wirklich funktionieren.
              </p>
            </div>
            <Link to="/services" className="nav-link" style={{ fontWeight: 'bold' }}>Alle Dienstleistungen ansehen →</Link>
          </div>

          <div className="items-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
            {competence.map((c, i) => (
              <motion.div
                key={i}
                className="calc-item"
                style={{ padding: '48px', borderBottom: `4px solid ${c.color}` }}
                whileHover={{ translateY: -10 }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '32px'
                }}>
                  {c.icon}
                </div>
                <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>{c.title}</h3>
                <p className="item-desc" style={{ fontSize: '15px' }}>{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why hed-it */}
      <section className="section about-section">
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: '800px' }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="hero-tag" style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--secondary)', borderColor: 'rgba(124, 58, 237, 0.2)' }}>Hinter den Kulissen</span>
              <h2 className="about-title" style={{ fontSize: '62px', marginBottom: '40px', lineHeight: 1.1 }}>Echte Expertise <br />ist persönlich.</h2>
              <p className="about-desc" style={{ fontSize: '20px', lineHeight: '1.9', marginBottom: '48px', color: 'var(--text-muted)' }}>
                Als inhabergeführtes Unternehmen stehe ich mit meinem Namen für die Qualität jedes Projekts.
                Wir verstehen IT nicht als reinen Kostenfaktor, sondern als strategischen Wettbewerbsvorteil.
                Persönliche Betreuung auf Augenhöhe ist bei uns Standard.
              </p>
              <div className="flex flex-col gap-8">
                <div className="flex gap-12">
                  <div>
                    <h2 style={{ fontSize: '52px', color: 'var(--primary)', lineHeight: 1 }}>100%</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>Fokus auf Qualität</p>
                  </div>
                  <div>
                    <h2 style={{ fontSize: '52px', color: 'var(--secondary)', lineHeight: 1 }}>24/7</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>Support & Monitoring</p>
                  </div>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '20px' }}>
                  <li className="flex gap-4 items-center" style={{ fontSize: '17px', fontWeight: 600 }}><Zap size={22} color="var(--primary)" /> Zertifizierte Partner von Hetzner & Microsoft</li>
                  <li className="flex gap-4 items-center" style={{ fontSize: '17px', fontWeight: 600 }}><Zap size={22} color="var(--primary)" /> 100% Individualität statt Standard-Lösungen</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-dark">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: 'center', marginBottom: '64px' }}
          >
            <span className="hero-tag" style={{ background: 'rgba(0,242,255,0.08)', color: 'var(--primary)', borderColor: 'rgba(0,242,255,0.2)' }}>
              Kundenstimmen
            </span>
            <h2 style={{ fontSize: '42px', marginTop: '16px', marginBottom: '16px' }}>Was unsere Kunden sagen</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto' }}>
              Echte Projekte, echte Ergebnisse — von Unternehmen aus der ganzen Schweiz.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="calc-item"
                style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
              >
                {/* Quote icon */}
                <Quote size={28} style={{ color: 'var(--primary)', opacity: 0.4, position: 'absolute', top: 28, right: 28 }} />

                {/* Stars */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} size={16} fill="var(--primary)" color="var(--primary)" />
                  ))}
                </div>

                {/* Text */}
                <p style={{ fontSize: '15px', lineHeight: '1.8', color: 'var(--text-muted)', margin: 0, flex: 1 }}>
                  "{t.text}"
                </p>

                {/* Customer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    <img
                      src={t.logo}
                      alt={t.name}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-main)' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA under testimonials */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            style={{ textAlign: 'center', marginTop: '56px' }}
          >
            <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Bereit für Ihr eigenes Projekt?</p>
            <Link to="/calculator" className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '16px', padding: '14px 32px' }}>
              Jetzt kostenlos kalkulieren <Rocket size={18} style={{ marginLeft: 8 }} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
