import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe, Stripe as StripeInstance } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { X, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  title: string;
  amount: number;
}

interface Props {
  invoice: Invoice;
  token: string;
  onClose: () => void;
  onPaid: () => void;
}

// ─── Inner checkout form (must live inside <Elements>) ────────────────────────
function CheckoutForm({ amount, onPaid }: { amount: number; onPaid: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    });

    if (stripeError) {
      setError(stripeError.message || 'Zahlung fehlgeschlagen. Bitte erneut versuchen.');
      setProcessing(false);
    } else if (paymentIntent?.status === 'succeeded') {
      setSucceeded(true);
      setTimeout(onPaid, 1800);
    }
  };

  if (succeeded) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <CheckCircle2 size={56} color="#10b981" style={{ marginBottom: 16 }} />
        <h3 style={{ fontSize: 22, marginBottom: 8 }}>Zahlung erfolgreich!</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
          CHF {amount.toFixed(2)} wurden erfolgreich abgebucht.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PaymentElement
        options={{
          layout: 'tabs',
          wallets: { applePay: 'auto', googlePay: 'auto' },
        }}
      />

      {error && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 10,
          color: '#ef4444',
          fontSize: 14,
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
        <ShieldCheck size={14} />
        <span>Sichere Zahlung über Stripe. Ihre Kartendaten werden verschlüsselt gespeichert.</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        style={{
          background: processing ? 'rgba(0,242,255,0.5)' : 'var(--primary)',
          color: '#000',
          border: 'none',
          borderRadius: 12,
          padding: '14px 24px',
          fontSize: 16,
          fontWeight: 800,
          cursor: processing ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transition: 'all 0.2s',
        }}
      >
        {processing ? (
          <><Loader2 size={18} className="animate-spin" /> Verarbeitung...</>
        ) : (
          `CHF ${amount.toFixed(2)} bezahlen`
        )}
      </button>
    </form>
  );
}

// ─── Outer modal ──────────────────────────────────────────────────────────────
export default function StripePaymentModal({ invoice, token, onClose, onPaid }: Props) {
  const [clientSecret, setClientSecret] = useState('');
  const [stripePromise, setStripePromise] = useState<Promise<StripeInstance | null> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const init = useCallback(async () => {
    try {
      // Load Stripe publishable key
      const pubKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;
      if (!pubKey || pubKey.includes('REPLACE')) {
        setLoadError('Stripe ist noch nicht konfiguriert. Bitte kontaktieren Sie den Support.');
        setLoading(false);
        return;
      }

      // Create PaymentIntent on server
      const res = await fetch('/api/stripe/payment-intent', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice_id: invoice.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server-Fehler');

      setClientSecret(data.client_secret);
      setStripePromise(loadStripe(pubKey));
    } catch (err: any) {
      setLoadError(err.message || 'Fehler beim Laden der Zahlungsseite.');
    } finally {
      setLoading(false);
    }
  }, [invoice.id, token]);

  useEffect(() => { init(); }, [init]);

  const appearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#00f2ff',
      colorBackground: '#0d0d0f',
      colorText: '#f1f5f9',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      borderRadius: '10px',
    },
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
        backdropFilter: 'blur(12px)', zIndex: 3000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#08080a', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 28, padding: 40, width: '100%', maxWidth: 480,
          maxHeight: '90vh', overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Rechnung bezahlen</h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
              {invoice.invoice_number} · {invoice.title}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
            <X size={22} />
          </button>
        </div>

        {/* Amount badge */}
        <div style={{
          background: 'rgba(0,242,255,0.06)', border: '1px solid rgba(0,242,255,0.15)',
          borderRadius: 14, padding: '16px 20px', marginBottom: 28,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Zu zahlen</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: 'var(--primary)' }}>
            CHF {parseFloat(String(invoice.amount)).toFixed(2)}
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
            <p style={{ marginTop: 16, color: 'var(--text-muted)', fontSize: 14 }}>Zahlungsseite wird geladen...</p>
          </div>
        ) : loadError ? (
          <div style={{ color: '#ef4444', textAlign: 'center', padding: '20px 0', fontSize: 14 }}>{loadError}</div>
        ) : clientSecret && stripePromise ? (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret, appearance, locale: 'de' }}
          >
            <CheckoutForm amount={parseFloat(String(invoice.amount))} onPaid={onPaid} />
          </Elements>
        ) : null}
      </div>
    </div>
  );
}
