import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ num, title, children }: { num: string; title: string; children: React.ReactNode }) => (
  <div style={{ marginTop: 40 }}>
    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--text-main)' }}>{num}. {title}</h3>
    <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 15 }}>{children}</div>
  </div>
);

const AGB = () => (
  <div>
    <section className="hero">
      <div className="container">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hero-title text-center">
          Allgemeine Geschäftsbedingungen
        </motion.h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: 8 }}>
          Gültig ab 1. Januar 2025 · Schweizer Recht
        </p>
      </div>
    </section>

    <section className="section section-dark">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="glass-card" style={{ padding: '56px 60px', lineHeight: 1.8 }}>

          <Section num="1" title="Geltungsbereich und Vertragspartner">
            <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen</p>
            <p style={{ marginTop: 12, paddingLeft: 16, borderLeft: '3px solid var(--primary)' }}>
              <strong style={{ color: 'var(--text-main)' }}>hed-it</strong><br />
              Joel Hediger<br />
              Baar, Kanton Zug, Schweiz<br />
              E-Mail: <a href="mailto:info@hed-it.ch" style={{ color: 'var(--primary)' }}>info@hed-it.ch</a>
            </p>
            <p style={{ marginTop: 12 }}>und den Kunden (natürliche oder juristische Personen), die IT-Dienstleistungen, Webentwicklung, Cloud-Lösungen oder sonstige Leistungen von hed-it beziehen.</p>
            <p style={{ marginTop: 12 }}>Abweichende, entgegenstehende oder ergänzende AGB des Kunden werden nicht Vertragsbestandteil, es sei denn, hed-it stimmt ihrer Geltung ausdrücklich schriftlich zu.</p>
          </Section>

          <Section num="2" title="Leistungen">
            <p>hed-it erbringt IT-Dienstleistungen, insbesondere:</p>
            <ul style={{ marginTop: 8, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Konzeption, Design und Entwicklung von Websites und Web-Applikationen</li>
              <li>Cloud-Migration und Infrastruktur-Setup (Hetzner, Microsoft 365)</li>
              <li>IT-Support, Wartung und Monitoring</li>
              <li>Beratungsleistungen im IT-Bereich</li>
              <li>Hosting und Betrieb von Web-Applikationen</li>
            </ul>
            <p style={{ marginTop: 12 }}>Der genaue Leistungsumfang ergibt sich aus dem individuellen Angebot bzw. der Offerte. hed-it kann Teilleistungen an qualifizierte Subunternehmer delegieren, bleibt aber gegenüber dem Kunden verantwortlich.</p>
          </Section>

          <Section num="3" title="Angebote und Vertragsabschluss">
            <p>Offerten und Angebote von hed-it sind freibleibend und unverbindlich, sofern nicht ausdrücklich anders angegeben. Eine Offerte gilt für 30 Tage ab Ausstellungsdatum, sofern keine andere Frist angegeben ist.</p>
            <p style={{ marginTop: 12 }}>Der Vertrag kommt zustande durch:</p>
            <ul style={{ marginTop: 8, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>schriftliche oder elektronische Auftragsbestätigung durch hed-it, oder</li>
              <li>digitale Unterzeichnung der Offerte durch den Kunden, oder</li>
              <li>Aufnahme der Leistungserbringung durch hed-it nach Auftrag des Kunden</li>
            </ul>
          </Section>

          <Section num="4" title="Preise und Zahlungsbedingungen">
            <p>Alle Preise verstehen sich in Schweizer Franken (CHF) zuzüglich der gesetzlichen Mehrwertsteuer, sofern nicht ausdrücklich als Bruttopreise ausgewiesen.</p>
            <p style={{ marginTop: 12 }}><strong style={{ color: 'var(--text-main)' }}>Zahlungsfristen:</strong></p>
            <ul style={{ marginTop: 8, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Rechnungen sind innert 30 Tagen ab Rechnungsdatum ohne Abzug zu begleichen</li>
              <li>Bei Projekten über CHF 5'000 kann hed-it eine Anzahlung von bis zu 50% verlangen</li>
              <li>Bei Zahlungsverzug werden Verzugszinsen von 5% p.a. in Rechnung gestellt</li>
            </ul>
            <p style={{ marginTop: 12 }}>Einmalige Leistungen werden nach Abschluss, wiederkehrende Leistungen (Hosting, Wartung) werden monatlich oder jährlich im Voraus in Rechnung gestellt.</p>
          </Section>

          <Section num="5" title="Lieferung, Abnahme und Mängelrüge">
            <p>Lieferzeitpunkte und -fristen gelten als verbindlich, wenn sie schriftlich als solche bezeichnet wurden. hed-it ist berechtigt, Teillieferungen vorzunehmen.</p>
            <p style={{ marginTop: 12 }}>Nach Ablieferung hat der Kunde 10 Werktage Zeit, das Werk zu prüfen und allfällige Mängel schriftlich zu rügen (Mängelrüge). Offensichtliche Mängel, die bei sorgfältiger Prüfung erkennbar sind, müssen sofort, spätestens 5 Werktage nach Lieferung gerügt werden. Verspätete Rügen sind ausgeschlossen.</p>
            <p style={{ marginTop: 12 }}>Das Werk gilt als abgenommen, wenn der Kunde es produktiv nutzt oder die Rügefrist ungenutzt verstreicht.</p>
          </Section>

          <Section num="6" title="Mitwirkungspflichten des Kunden">
            <p>Der Kunde stellt hed-it rechtzeitig alle benötigten Unterlagen, Zugangsdaten, Inhalte und Informationen zur Verfügung. Verzögerungen durch fehlende Mitwirkung des Kunden verlängern vereinbarte Fristen entsprechend; allfällige Mehrkosten gehen zu Lasten des Kunden.</p>
          </Section>

          <Section num="7" title="Geistiges Eigentum und Nutzungsrechte">
            <p>Mit vollständiger Bezahlung des vereinbarten Entgelts überträgt hed-it dem Kunden ein nicht-exklusives, zeitlich unbefristetes Nutzungsrecht an den speziell für ihn erstellten Werken.</p>
            <p style={{ marginTop: 12 }}>Folgendes verbleibt im Eigentum von hed-it oder Dritten:</p>
            <ul style={{ marginTop: 8, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>Wiederverwendbare Code-Bibliotheken, Frameworks und Templates</li>
              <li>Intern entwickelte Tools und Prozesse</li>
              <li>Open-Source-Komponenten (unterliegen eigenen Lizenzen)</li>
            </ul>
            <p style={{ marginTop: 12 }}>Der Kunde gewährleistet, dass von ihm bereitgestellte Inhalte (Texte, Bilder, Logos) frei von Rechten Dritter sind und hält hed-it von diesbezüglichen Ansprüchen schadlos.</p>
          </Section>

          <Section num="8" title="Gewährleistung">
            <p>hed-it gewährleistet, dass erbrachte Leistungen der vereinbarten Spezifikation entsprechen. Die Gewährleistungsfrist beträgt 12 Monate ab Abnahme. Nicht als Mängel gelten Beeinträchtigungen durch unsachgemässe Nutzung, Änderungen durch den Kunden, oder durch Software Dritter verursachte Probleme.</p>
            <p style={{ marginTop: 12 }}>Die Gewährleistung beschränkt sich auf Nachbesserung. Schlägt die Nachbesserung zweimal fehl, kann der Kunde Preisminderung oder Rücktritt verlangen.</p>
          </Section>

          <Section num="9" title="Haftungsbeschränkung">
            <p>hed-it haftet für direkte Schäden, die aus einer schuldhaften Verletzung wesentlicher Vertragspflichten entstehen, auf den vertragstypisch vorhersehbaren Schaden begrenzt auf den Rechnungswert der jeweiligen Leistung.</p>
            <p style={{ marginTop: 12 }}>Jegliche Haftung für:</p>
            <ul style={{ marginTop: 8, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <li>indirekte Schäden, Folgeschäden, entgangenen Gewinn</li>
              <li>Datenverlust (der Kunde ist für regelmässige Backups verantwortlich)</li>
              <li>Schäden durch höhere Gewalt, Hackerangriffe trotz angemessener Sicherheitsmassnahmen</li>
              <li>Schäden durch fehlerhafte Drittprodukte oder Open-Source-Software</li>
            </ul>
            <p style={{ marginTop: 12 }}>ist ausgeschlossen, soweit dies gesetzlich zulässig ist. Die vorstehende Haftungsbeschränkung gilt nicht bei Vorsatz oder grober Fahrlässigkeit.</p>
          </Section>

          <Section num="10" title="Vertragsdauer und Kündigung">
            <p><strong style={{ color: 'var(--text-main)' }}>Projektverträge</strong> enden mit Abnahme der vereinbarten Leistung.</p>
            <p style={{ marginTop: 12 }}><strong style={{ color: 'var(--text-main)' }}>Dauerverträge</strong> (Hosting, Wartung, Support) laufen auf die vereinbarte Laufzeit, danach verlängern sie sich automatisch um die gleiche Dauer, sofern nicht mit einer Frist von 30 Tagen vor Ende der Laufzeit schriftlich gekündigt wird.</p>
            <p style={{ marginTop: 12 }}>Ausserordentliche Kündigung aus wichtigem Grund ist für beide Parteien jederzeit möglich. Als wichtiger Grund gilt insbesondere: Zahlungsverzug von mehr als 60 Tagen, schwerwiegende Vertragsverletzung, Insolvenz einer Partei.</p>
          </Section>

          <Section num="11" title="Vertraulichkeit">
            <p>Beide Parteien verpflichten sich, vertrauliche Informationen der jeweils anderen Partei — insbesondere Geschäftsgeheimnisse, technische Daten und Kundendaten — vertraulich zu behandeln und nicht an Dritte weiterzugeben. Diese Verpflichtung gilt über das Vertragsende hinaus.</p>
          </Section>

          <Section num="12" title="Datenschutz">
            <p>Die Verarbeitung personenbezogener Daten erfolgt gemäss unserer Datenschutzerklärung und dem schweizerischen nDSG sowie der DSGVO. Beide Parteien verpflichten sich zur Einhaltung der anwendbaren Datenschutzgesetze.</p>
          </Section>

          <Section num="13" title="Anwendbares Recht und Gerichtsstand">
            <p>Diese AGB sowie alle zwischen den Parteien geschlossenen Verträge unterliegen ausschliesslich <strong style={{ color: 'var(--text-main)' }}>schweizerischem Recht</strong> unter Ausschluss der Bestimmungen des internationalen Privatrechts und des UN-Kaufrechts (CISG).</p>
            <p style={{ marginTop: 12 }}>Als ausschliesslicher Gerichtsstand wird <strong style={{ color: 'var(--text-main)' }}>Baar, Kanton Zug, Schweiz</strong> vereinbart. hed-it ist berechtigt, den Kunden auch an dessen Wohnsitz- oder Geschäftssitz zu belangen.</p>
          </Section>

          <Section num="14" title="Salvatorische Klausel und Änderungen">
            <p>Sollten einzelne Bestimmungen dieser AGB unwirksam oder undurchführbar sein oder werden, bleiben die übrigen Bestimmungen davon unberührt. An die Stelle der unwirksamen Bestimmung tritt eine wirksame Bestimmung, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am nächsten kommt.</p>
            <p style={{ marginTop: 12 }}>hed-it behält sich das Recht vor, diese AGB jederzeit zu ändern. Änderungen werden dem Kunden mit einer Frist von 30 Tagen schriftlich oder per E-Mail mitgeteilt. Widerspricht der Kunde nicht innerhalb von 14 Tagen, gelten die geänderten AGB als angenommen.</p>
          </Section>

          <div style={{ marginTop: 48, padding: '20px 24px', background: 'rgba(0,242,255,0.05)', border: '1px solid rgba(0,242,255,0.15)', borderRadius: 12, fontSize: 13, color: 'var(--text-muted)' }}>
            Stand: {new Date().toLocaleDateString('de-CH', { year: 'numeric', month: 'long' })} · Gerichtsstand: Baar, Kanton Zug, Schweiz · Anwendbares Recht: Schweizer OR/ZGB
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default AGB;
