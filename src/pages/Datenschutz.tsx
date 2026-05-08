import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginTop: 40 }}>
    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--text-main)' }}>{title}</h3>
    <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 15 }}>{children}</div>
  </div>
);

const Datenschutz = () => (
  <div>
    <section className="hero">
      <div className="container">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hero-title text-center">
          Datenschutzerklärung
        </motion.h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 8 }}>
          Gemäss nDSG (Schweiz) und DSGVO (EU/EWR)
        </p>
      </div>
    </section>

    <section className="section section-dark">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="glass-card" style={{ padding: '56px 60px', lineHeight: 1.8 }}>

          <Section title="1. Verantwortliche Stelle">
            <p><strong style={{ color: 'var(--text-main)' }}>hed-it</strong><br />
            Joel Hediger<br />
            Baar, Kanton Zug, Schweiz<br />
            E-Mail: <a href="mailto:info@hed-it.ch" style={{ color: 'var(--primary)' }}>info@hed-it.ch</a></p>
          </Section>

          <Section title="2. Grundsätze der Datenverarbeitung">
            <p>hed-it verarbeitet personenbezogene Daten nur soweit dies gesetzlich erlaubt ist oder Sie eingewilligt haben. Wir halten uns an die Grundsätze des schweizerischen Datenschutzgesetzes (nDSG, in Kraft seit 1. September 2023) sowie, soweit anwendbar, der Europäischen Datenschutz-Grundverordnung (DSGVO, EU 2016/679).</p>
          </Section>

          <Section title="3. Welche Daten wir erheben">
            <p><strong style={{ color: 'var(--text-main)' }}>a) Beim Besuch der Website (Server-Logs)</strong><br />
            Bei jedem Zugriff auf unsere Website werden automatisch folgende Daten erfasst und temporär in Server-Logfiles gespeichert:</p>
            <ul style={{ marginTop: 8, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>IP-Adresse (anonymisiert)</li>
              <li>Datum und Uhrzeit des Zugriffs</li>
              <li>Aufgerufene URL</li>
              <li>Browser-Typ und -Version</li>
              <li>Betriebssystem</li>
              <li>Referrer-URL</li>
            </ul>
            <p style={{ marginTop: 12 }}>Diese Daten werden ausschliesslich zur Sicherstellung des technischen Betriebs verwendet und nach 30 Tagen gelöscht. Eine Zusammenführung mit anderen Daten findet nicht statt.</p>

            <p style={{ marginTop: 16 }}><strong style={{ color: 'var(--text-main)' }}>b) Beim Kontaktformular</strong><br />
            Wenn Sie das Kontaktformular nutzen, erheben wir: Vorname, Nachname, E-Mail-Adresse, Telefonnummer (optional) sowie den Inhalt Ihrer Nachricht. Diese Daten verwenden wir ausschliesslich zur Beantwortung Ihrer Anfrage.</p>

            <p style={{ marginTop: 16 }}><strong style={{ color: 'var(--text-main)' }}>c) Beim Kundenportal</strong><br />
            Für registrierte Kunden erheben und verarbeiten wir: Name, E-Mail-Adresse, Unternehmen, Rechnungs- und Vertragsdaten sowie Support-Ticket-Inhalte. Dies dient der Vertragserfüllung und Leistungserbringung.</p>
          </Section>

          <Section title="4. Zweck und Rechtsgrundlage der Verarbeitung">
            <p>Wir verarbeiten Ihre Daten zu folgenden Zwecken:</p>
            <ul style={{ marginTop: 8, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><strong style={{ color: 'var(--text-main)' }}>Vertragserfüllung</strong> — Bereitstellung unserer IT-Dienstleistungen, Rechnungsstellung, Vertragsverwaltung (Art. 6 Abs. 1 lit. b DSGVO / Art. 31 Abs. 2 lit. a nDSG)</li>
              <li><strong style={{ color: 'var(--text-main)' }}>Berechtigtes Interesse</strong> — Sicherheit und Stabilität unserer Systeme, Betrugsverhinderung (Art. 6 Abs. 1 lit. f DSGVO / Art. 31 Abs. 1 nDSG)</li>
              <li><strong style={{ color: 'var(--text-main)' }}>Einwilligung</strong> — Marketing-E-Mails und Newsletter (nur mit ausdrücklicher Zustimmung) (Art. 6 Abs. 1 lit. a DSGVO)</li>
              <li><strong style={{ color: 'var(--text-main)' }}>Gesetzliche Pflicht</strong> — Aufbewahrung von Buchungs- und Rechnungsdaten gemäss OR Art. 958f (10 Jahre)</li>
            </ul>
          </Section>

          <Section title="5. Datenweitergabe an Dritte">
            <p>Wir geben Ihre Daten nicht ohne Ihre ausdrückliche Einwilligung an Dritte weiter, ausser wenn:</p>
            <ul style={{ marginTop: 8, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>es zur Vertragserfüllung notwendig ist (z.B. Zahlungsdienstleister Stripe für Onlinezahlungen)</li>
              <li>eine gesetzliche Verpflichtung besteht</li>
              <li>es zur Wahrung berechtigter Interessen erforderlich ist</li>
            </ul>
            <p style={{ marginTop: 12 }}>Eingesetzte Auftragsverarbeiter: <strong style={{ color: 'var(--text-main)' }}>Stripe, Inc.</strong> (Zahlungsabwicklung, USA/Irland — Standardvertragsklauseln gemäss Art. 46 DSGVO) · <strong style={{ color: 'var(--text-main)' }}>Hetzner Online GmbH</strong> (Hosting, Deutschland)</p>
          </Section>

          <Section title="6. Hosting und Datenübertragung">
            <p>Unsere Website und das Kundenportal werden auf Servern der Hetzner Online GmbH in Deutschland gehostet. Deutschland ist als EU-Mitglied angemessen im Sinne der DSGVO. Für Schweizer Kunden gilt die Übermittlung in die EU als angemessen gemäss Art. 16 nDSG.</p>
          </Section>

          <Section title="7. Cookies">
            <p>Unsere Website verwendet ausschliesslich technisch notwendige Cookies (Session-Cookies für das Kundenportal / JWT-Authentifizierung). Diese Cookies werden gelöscht, sobald Sie Ihren Browser schliessen oder sich abmelden.</p>
            <p style={{ marginTop: 12 }}>Wir verwenden <strong style={{ color: 'var(--text-main)' }}>keine</strong> Tracking-, Werbe- oder Analyse-Cookies. Es wird kein Google Analytics oder ähnliches eingesetzt.</p>
          </Section>

          <Section title="8. Speicherdauer">
            <p>Wir speichern Ihre Daten nur so lange wie gesetzlich erforderlich oder für den jeweiligen Zweck notwendig:</p>
            <ul style={{ marginTop: 8, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Server-Logfiles: 30 Tage</li>
              <li>Kontaktformular-Anfragen: 2 Jahre nach Abschluss der Korrespondenz</li>
              <li>Rechnungs- und Vertragsdaten: 10 Jahre (gesetzliche Aufbewahrungspflicht OR Art. 958f)</li>
              <li>Kundenkonto-Daten: bis zur Löschung des Kontos auf Ihre Anfrage hin</li>
            </ul>
          </Section>

          <Section title="9. Ihre Rechte">
            <p>Sie haben folgende Rechte bezüglich Ihrer Daten:</p>
            <ul style={{ marginTop: 8, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><strong style={{ color: 'var(--text-main)' }}>Auskunft</strong> — Sie können jederzeit Auskunft über die bei uns gespeicherten Daten verlangen (Art. 25 nDSG / Art. 15 DSGVO)</li>
              <li><strong style={{ color: 'var(--text-main)' }}>Berichtigung</strong> — Sie können die Berichtigung unrichtiger Daten verlangen (Art. 16 DSGVO)</li>
              <li><strong style={{ color: 'var(--text-main)' }}>Löschung</strong> — Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzliche Aufbewahrungspflicht besteht (Art. 17 DSGVO)</li>
              <li><strong style={{ color: 'var(--text-main)' }}>Einschränkung</strong> — Sie können die Einschränkung der Verarbeitung verlangen (Art. 18 DSGVO)</li>
              <li><strong style={{ color: 'var(--text-main)' }}>Datenportabilität</strong> — Sie haben das Recht, Ihre Daten in einem strukturierten, maschinenlesbaren Format zu erhalten (Art. 20 DSGVO)</li>
              <li><strong style={{ color: 'var(--text-main)' }}>Widerspruch</strong> — Sie können der Verarbeitung auf Basis berechtigter Interessen widersprechen (Art. 21 DSGVO)</li>
              <li><strong style={{ color: 'var(--text-main)' }}>Widerruf der Einwilligung</strong> — Einwilligungen können jederzeit ohne Angabe von Gründen widerrufen werden</li>
            </ul>
            <p style={{ marginTop: 16 }}>Zur Ausübung Ihrer Rechte wenden Sie sich an: <a href="mailto:info@hed-it.ch" style={{ color: 'var(--primary)' }}>info@hed-it.ch</a></p>
          </Section>

          <Section title="10. Beschwerderecht">
            <p>Sie haben das Recht, bei der zuständigen Aufsichtsbehörde Beschwerde einzureichen:</p>
            <p style={{ marginTop: 8 }}>
              <strong style={{ color: 'var(--text-main)' }}>Schweiz:</strong> Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB)<br />
              <a href="https://www.edoeb.admin.ch" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>www.edoeb.admin.ch</a>
            </p>
            <p style={{ marginTop: 8 }}>
              <strong style={{ color: 'var(--text-main)' }}>EU/EWR:</strong> Zuständige Datenschutzaufsichtsbehörde Ihres Wohnsitzlandes
            </p>
          </Section>

          <Section title="11. Datensicherheit">
            <p>Wir verwenden SSL/TLS-Verschlüsselung für alle Datenübertragungen. Passwörter werden ausschliesslich als verschlüsselte Hash-Werte gespeichert. Zugang zu personenbezogenen Daten haben nur berechtigte Mitarbeitende und wird protokolliert.</p>
          </Section>

          <div style={{ marginTop: 48, padding: '20px 24px', background: 'rgba(0,242,255,0.05)', border: '1px solid rgba(0,242,255,0.15)', borderRadius: 12, fontSize: 13, color: 'var(--text-muted)' }}>
            Stand: {new Date().toLocaleDateString('de-CH', { year: 'numeric', month: 'long' })} · Bei Fragen zum Datenschutz: <a href="mailto:info@hed-it.ch" style={{ color: 'var(--primary)' }}>info@hed-it.ch</a>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Datenschutz;
