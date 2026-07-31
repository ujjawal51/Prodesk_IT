import React from 'react';
import { User, Lock, CheckCircle2, Check } from 'lucide-react';

const steps = [
  { id: 1, label: 'Personal Info', Icon: User },
  { id: 2, label: 'Account Details', Icon: Lock },
  { id: 3, label: 'Review & Submit', Icon: CheckCircle2 },
];

export default function ProgressBar({ step }) {
  const pct = (step / steps.length) * 100;

  return (
    <div className="progress-container">
      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="steps-list">
        {steps.map(({ id, label, Icon }) => {
          const done = step > id;
          const active = step === id;

          return (
            <div key={id} className={`step-node ${active ? 'active' : ''} ${done ? 'completed' : ''}`}>
              <div className="step-badge">
                {done ? <Check size={18} strokeWidth={3} /> : <Icon size={18} />}
              </div>
              <span className="step-label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
