import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginTop: 40 }}>
    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--text-main)' }}>{title}</h3>
    <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 15 }}>{children}</div>
  </div>
);

const Impressum = () => (
  <div>
    <section className="hero">
      <div className="container">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hero-title text-center">
          Impressum
        </motion.h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 8 }}>Angaben gemäss Art. 3 lit. s nDSG</p>
      </div>
    </section>

    <section className="section section-dark">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="glass-card" style={{ padding: '56px 60px', lineHeight: 1.8 }}>

          <Section title="Unternehmensangaben">
            <p><strong style={{ color: 'var(--text-main)' }}>hed-it</strong><br />
            Joel Hediger<br />
            Baar, Kanton Zug<br />
            Schweiz</p>
            <p style={{ marginTop: 12 }}>
              <strong style={{ color: 'var(--text-main)' }}>E-Mail:</strong>{' '}
              <a href="mailto:info@hed-it.ch" style={{ color: 'var(--primary)' }}>info@hed-it.ch</a><br />
              <strong style={{ color: 'var(--text-main)' }}>Web:</strong>{' '}
              <a href="https://hed-it.ch" style={{ color: 'var(--primary)' }} target="_blank" rel="noopener noreferrer">www.hed-it.ch</a>
            </p>
          </Section>

          <Section title="Verantwortlich für den Inhalt">
            <p>Joel Hediger (Inhaber)<br />
            E-Mail: <a href="mailto:info@hed-it.ch" style={{ color: 'var(--primary)' }}>info@hed-it.ch</a></p>
          </Section>

          <Section title="Haftungsausschluss">
            <p><strong style={{ color: 'var(--text-main)' }}>Inhalt der Website</strong><br />
            hed-it übernimmt keinerlei Gewähr für die Aktualität, Korrektheit, Vollständigkeit oder Qualität der bereitgestellten Informationen. Haftungsansprüche gegen hed-it, die sich auf Schäden materieller oder ideeller Art beziehen, welche durch die Nutzung oder Nichtnutzung der dargebotenen Informationen verursacht wurden, sind grundsätzlich ausgeschlossen.</p>

            <p style={{ marginTop: 16 }}><strong style={{ color: 'var(--text-main)' }}>Externe Links</strong><br />
            Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstösse überprüft. Rechtswidrige Inhalte waren nicht erkennbar.</p>
          </Section>

          <Section title="Urheberrecht">
            <p>Die durch hed-it erstellten Inhalte und Werke auf diesen Seiten unterliegen dem schweizerischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.</p>
          </Section>

          <Section title="Anwendbares Recht und Gerichtsstand">
            <p>Es gilt ausschliesslich schweizerisches Recht. Gerichtsstand ist Baar, Kanton Zug, Schweiz.</p>
          </Section>

          <div style={{ marginTop: 48, padding: '20px 24px', background: 'rgba(0,242,255,0.05)', border: '1px solid rgba(0,242,255,0.15)', borderRadius: 12, fontSize: 13, color: 'var(--text-muted)' }}>
            Stand: {new Date().toLocaleDateString('de-CH', { year: 'numeric', month: 'long' })} · hed-it behält sich das Recht vor, diese Angaben jederzeit zu aktualisieren.
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Impressum;
