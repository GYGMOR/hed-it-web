import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import {
  CreditCard,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Eye,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import StripePaymentModal from '../../components/StripePaymentModal';
import { PortalDocumentPreview } from '../../components/PortalDocumentPreview';
import type { PortalDoc } from '../../components/PortalDocumentPreview';

interface Invoice {
  id: string;
  invoice_number: string;
  status: 'paid' | 'open' | 'overdue' | 'sent';
  amount: number;
  due_date: string;
  created_at: string;
  title: string;
}

const Invoices = () => {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [previewDoc, setPreviewDoc] = useState<PortalDoc | null>(null);

  const openInvoicePreview = (inv: Invoice) => {
    const invAny = inv as any;
    const items = Array.isArray(invAny.items)
      ? invAny.items
      : typeof invAny.items === 'string'
        ? (() => { try { return JSON.parse(invAny.items); } catch { return []; } })()
        : [];
    const amt = parseFloat(String(inv.amount || 0));
    setPreviewDoc({
      type: 'invoice',
      id: inv.id,
      number: inv.invoice_number || `RE-${inv.id.substring(0, 8).toUpperCase()}`,
      title: inv.title || 'Rechnung',
      company_name: invAny.company_name,
      status: inv.status,
      total: amt,
      subtotal: parseFloat((amt / 1.081).toFixed(2)),
      tax_total: parseFloat((amt - amt / 1.081).toFixed(2)),
      items,
      created_at: inv.created_at,
      due_date: inv.due_date,
    });
  };

  const downloadInvoicePdf = (inv: Invoice) => {
    try {
      const doc = new jsPDF();
      const W = 210;
      const H = 297;
      const invNum = inv.invoice_number || `RE-${inv.id.substring(0, 8).toUpperCase()}`;

      // Header
      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, W, 48, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text('HED-IT', 20, 22);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text('Web & Marketing Solutions', 20, 30);
      doc.text('info@hed-it.ch  ·  www.hed-it.ch', 20, 36);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.text('RECHNUNG', W - 20, 22, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text(`Nr: ${invNum}`, W - 20, 30, { align: 'right' });
      doc.text(`Datum: ${new Date(inv.created_at).toLocaleDateString('de-CH')}`, W - 20, 36, { align: 'right' });

      // Title
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(inv.title || 'Rechnung', 20, 62);

      // Details
      let y = 74;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('RECHNUNGSDETAILS', 20, y);
      y += 4;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(20, y, W - 20, y);
      y += 8;

      const statusLabel = inv.status === 'paid' ? 'Bezahlt' : inv.status === 'overdue' ? 'Überfällig' : 'Offen';
      const rows = [
        ['Rechnungsnummer', invNum],
        ['Rechnungsdatum', new Date(inv.created_at).toLocaleDateString('de-CH')],
        ['Fällig am', inv.due_date ? new Date(inv.due_date).toLocaleDateString('de-CH') : '-'],
        ['Status', statusLabel],
      ];
      rows.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(label + ':', 20, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        doc.text(String(value), 78, y);
        y += 9;
      });

      // Amount box
      y += 10;
      doc.setFillColor(248, 250, 252);
      doc.rect(20, y, W - 40, 36, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(inv.title || 'Dienstleistung', 26, y + 10);
      doc.setDrawColor(226, 232, 240);
      doc.line(26, y + 16, W - 26, y + 16);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Zwischensumme', 26, y + 24);
      doc.text('MwSt (8.1%)', 26, y + 30);
      const amount = parseFloat(String(inv.amount || 0));
      const tax = amount * 0.081;
      doc.setTextColor(30, 41, 59);
      doc.text(`CHF ${(amount - tax).toFixed(2)}`, W - 26, y + 24, { align: 'right' });
      doc.text(`CHF ${tax.toFixed(2)}`, W - 26, y + 30, { align: 'right' });

      y += 44;
      doc.setFillColor(30, 41, 59);
      doc.rect(20, y, W - 40, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('GESAMTBETRAG (CHF)', 26, y + 13);
      doc.setFontSize(14);
      doc.text(`CHF ${amount.toFixed(2)}`, W - 26, y + 13, { align: 'right' });

      // Payment info
      y += 30;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('ZAHLUNGSDETAILS', 20, y);
      y += 4;
      doc.setDrawColor(226, 232, 240);
      doc.line(20, y, W - 20, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text('Zahlbar an: HED-IT Joel Hediger', 20, y);
      y += 6;
      doc.text('IBAN: CH00 0000 0000 0000 0000 0', 20, y);
      y += 6;
      doc.text(`Verwendungszweck: ${invNum}`, 20, y);

      // Footer
      doc.setFillColor(30, 41, 59);
      doc.rect(0, H - 18, W, 18, 'F');
      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('HED-IT Joel Hediger  ·  Web & Marketing Solutions  ·  info@hed-it.ch  ·  www.hed-it.ch', W / 2, H - 10, { align: 'center' });
      doc.text('Zahlbar netto innert 30 Tagen  ·  Gerichtsstand: Schweiz', W / 2, H - 5, { align: 'center' });

      doc.save(`Rechnung_${invNum}.pdf`);
    } catch (err) {
      console.error('Invoice PDF error:', err);
      alert('Fehler beim Erstellen des PDFs.');
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/portal/invoices', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setInvoices(data.data || []);
    } catch (err) {
      console.error('Failed to fetch invoices');
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="portal-invoices">
      <header className="section-header">
        <div>
          <h1 className="premium-gradient">Rechnungen & Zahlungen</h1>
          <p>Verfolgen Sie Ihre Zahlungen und laden Sie Belege herunter.</p>
        </div>
      </header>

      <div className="invoices-table-container">
        <table className="invoices-table">
          <thead>
            <tr>
              <th>Nummer</th>
              <th>Datum</th>
              <th>Fällig am</th>
              <th>Betrag</th>
              <th>Status</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="inv-num"><FileText size={16} /> {inv.invoice_number || `RE-${inv.id.substring(0,4).toUpperCase()}`}</td>
                <td>{new Date(inv.created_at).toLocaleDateString()}</td>
                <td>{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '-'}</td>
                <td className="inv-amount">{parseFloat(String(inv.amount || 0)).toFixed(2)} chf</td>
                <td>
                  <span className={`status-pill ${inv.status}`}>
                    {inv.status === 'paid' ? <CheckCircle2 size={14} /> : inv.status === 'overdue' ? <AlertCircle size={14} /> : <Clock size={14} />}
                    {inv.status === 'open' || inv.status === 'sent' ? 'Offen' : inv.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn-icon-small"
                      title="Vorschau"
                      onClick={() => openInvoicePreview(inv)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="btn-icon-small"
                      title="Rechnung PDF"
                      onClick={() => downloadInvoicePdf(inv)}
                    >
                      <Download size={16} />
                    </button>
                    {(inv.status === 'open' || inv.status === 'sent') && (
                      <button
                        className="btn btn-primary"
                        style={{ padding: '6px 12px', fontSize: 11, height: 'auto' }}
                        onClick={() => setPayingInvoice(inv)}
                      >
                        Bezahlen
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="empty-state">Keine Rechnungen gefunden.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="billing-settings mt-12">
        <div className="section-title">
          <h3>Zahlungsmethode</h3>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(0,242,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CreditCard size={26} color="var(--primary)" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 16, margin: '0 0 4px' }}>Bezahlung über Stripe</p>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>
              Zahlungen werden sicher über Stripe abgewickelt. Klicken Sie bei einer offenen Rechnung auf <strong>«Bezahlen»</strong> um Karte, Apple Pay, Google Pay oder Klarna zu verwenden.
            </p>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 20 }}>🔒</div>
            <div>SSL verschlüsselt</div>
          </div>
        </div>
      </div>

      {payingInvoice && token && (
        <StripePaymentModal
          invoice={payingInvoice}
          token={token}
          onClose={() => setPayingInvoice(null)}
          onPaid={() => { setPayingInvoice(null); fetchInvoices(); }}
        />
      )}

      {previewDoc && <PortalDocumentPreview doc={previewDoc} onClose={() => setPreviewDoc(null)} />}

      <style>{`
        .portal-invoices { display: flex; flex-direction: column; gap: 40px; }
        .section-header h1 { font-size: 32px; margin-bottom: 8px; }
        .section-header p { color: var(--text-muted); }

        .invoices-table-container { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; overflow: hidden; }
        .invoices-table { width: 100%; border-collapse: collapse; text-align: left; }
        .invoices-table th { padding: 20px 24px; background: rgba(255,255,255,0.02); font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
        .invoices-table td { padding: 20px 24px; border-bottom: 1px solid var(--border); font-size: 14px; }
        .invoices-table tr:last-child td { border-bottom: none; }
        
        .inv-num { font-weight: 700; display: flex; align-items: center; gap: 10px; color: var(--primary); }
        .inv-amount { font-weight: 800; }
        
        .status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 100px; font-size: 11px; font-weight: 800; text-transform: uppercase; }
        .status-pill.paid { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-pill.unpaid { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .status-pill.overdue { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

        .empty-state { text-align: center; color: var(--text-muted); padding: 60px !important; }

        .payment-card { display: flex; justify-content: space-between; align-items: center; background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 24px; transition: all 0.3s; }
        .payment-card:hover { border-color: rgba(255,255,255,0.15); }
        .empty-payment { border-style: dashed; }
        .card-info { display: flex; align-items: center; gap: 20px; }
        .card-icon { width: 56px; height: 56px; background: rgba(0,242,255,0.08); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .card-icon.empty { background: rgba(255,255,255,0.03); color: var(--text-muted); }
        .card-type { font-weight: 700; margin: 0; }
        .card-num { font-size: 15px; color: var(--text-main); margin: 4px 0 0; font-family: monospace; letter-spacing: 2px; }
        .card-num-hint { font-size: 13px; color: var(--text-muted); margin: 4px 0 0; }
        .card-expiry { font-size: 12px; color: var(--text-muted); margin: 2px 0 0; }
        .card-actions { display: flex; gap: 12px; align-items: center; }
        .btn-icon-remove { width: 40px; height: 40px; border-radius: 10px; border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.08); color: #ef4444; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; }
        .btn-icon-remove:hover { background: rgba(239,68,68,0.2); border-color: #ef4444; }

        .btn-icon-small { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: none; color: var(--text-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; }
        .btn-icon-small:hover { color: var(--primary); border-color: var(--primary); }

        /* Card Modal */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-content { background: #08080a; border: 1px solid var(--border); border-radius: 32px; padding: 40px; max-width: 500px; width: 100%; position: relative; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .modal-header h3 { margin: 0; font-size: 24px; }
        .close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; transition: color 0.3s; }
        .close-btn:hover { color: white; }

        .card-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
        .form-group input { background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; color: white; font-size: 16px; font-family: var(--font-body); outline: none; transition: all 0.3s; }
        .form-group input:focus { border-color: var(--primary); background: rgba(0,242,255,0.03); }
        .form-group input.error { border-color: #ef4444; background: rgba(239,68,68,0.05); }
        .form-group input::placeholder { color: rgba(255,255,255,0.2); }
        .field-error { font-size: 12px; color: #ef4444; font-weight: 600; }

        .form-row { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }

        .secure-note { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #10b981; font-weight: 600; padding: 12px 16px; background: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.15); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Invoices;
