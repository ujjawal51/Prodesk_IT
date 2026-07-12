import { useState, useEffect } from 'react';
import styles from './OutputPanel.module.css';

const STEPS = [
  'Analyzing your profile',
  'Matching role requirements',
  'Crafting your letter',
];

function GeneratingState() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setActiveStep(1), 900),
      setTimeout(() => setActiveStep(2), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={styles.generating}>
      <div className={styles.spinnerRing}>
        <div className={styles.spinner} />
      </div>
      <h3 className={styles.genTitle}>Generating your letter…</h3>
      <p className={styles.genSub}>Gemini AI is crafting a personalized cover letter</p>
      <div className={styles.steps}>
        {STEPS.map((step, i) => (
          <div
            key={step}
            className={`${styles.step} ${
              i < activeStep ? styles.stepDone : i === activeStep ? styles.stepActive : ''
            }`}
          >
            <span className={styles.stepDot} />
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>
        <svg viewBox="0 0 24 24" width="44" height="44" fill="none">
          <path
            d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3>Your Cover Letter Appears Here</h3>
      <p>Fill in your details on the left and click <strong>Generate</strong>.</p>
      <div className={styles.featureTags}>
        <span>✨ AI-Generated</span>
        <span>📋 Copy Ready</span>
        <span>🎯 Personalized</span>
      </div>
    </div>
  );
}

export default function OutputPanel({ status, letterHtml, mode, onRegenerate }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const el = document.getElementById('letter-body');
    const text = el ? (el.innerText || el.textContent) : '';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const wordCount = () => {
    const el = document.getElementById('letter-body');
    if (!el) return 0;
    return (el.innerText || '').trim().split(/\s+/).filter(Boolean).length;
  };

  return (
    <div className={styles.panel}>
      {status === 'empty' && <EmptyState />}
      {status === 'generating' && <GeneratingState />}

      {status === 'result' && (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <div className={styles.leftRow}>
              <span className={styles.successBadge}>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Generated
              </span>
              <span className={styles.wordCount}>{wordCount()} words</span>
            </div>
            <div className={styles.actions}>
              <button className={styles.actionBtn} onClick={onRegenerate}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                  <polyline points="1 4 1 10 7 10" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3.51 15a9 9 0 102.13-9.36L1 10" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Regenerate
              </button>
              <button
                className={`${styles.actionBtn} ${styles.copyBtn} ${copied ? styles.copied : ''}`}
                onClick={handleCopy}
              >
                {copied ? (
                  <>✓ Copied!</>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
                      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div
            id="letter-body"
            className={styles.letterBody}
            dangerouslySetInnerHTML={{ __html: letterHtml }}
          />

          <div className={styles.modeIndicator}>{mode}</div>
        </div>
      )}
    </div>
  );
}
