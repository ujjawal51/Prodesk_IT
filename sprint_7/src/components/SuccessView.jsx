import React, { useEffect } from 'react';
import { CheckCircle2, RotateCcw, Code } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SuccessView({ data, onReset }) {
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  }, []);

  const payload = {
    ...data,
    password: '[PROTECTED]',
    confirmPassword: '[PROTECTED]',
  };

  return (
    <div className="success-card">
      <div className="success-icon-badge">
        <CheckCircle2 size={44} strokeWidth={2.5} />
      </div>

      <h2 className="success-title">Registration Complete</h2>
      <p className="success-desc">
        Check console (F12) for the logged form output.
      </p>

      <div className="payload-preview">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <Code size={14} /> Payload Output:
        </div>
        <pre>{JSON.stringify(payload, null, 2)}</pre>
      </div>

      <button type="button" className="btn-secondary" onClick={onReset}>
        <RotateCcw size={16} /> Reset Form
      </button>
    </div>
  );
}
