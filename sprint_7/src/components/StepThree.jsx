import React from 'react';
import { CheckCircle2, User, Lock, Edit3 } from 'lucide-react';

export default function StepThree({ data, onEdit }) {
  const fmtDate = (str) => {
    if (!str) return 'N/A';
    try {
      return new Date(str).toLocaleDateString();
    } catch {
      return str;
    }
  };

  return (
    <div className="step-content">
      <div className="step-header">
        <h2>
          <CheckCircle2 size={22} /> Review & Submit
        </h2>
        <p>Confirm your information before final submission.</p>
      </div>

      <div className="summary-container">
        <div className="summary-card">
          <div className="summary-card-header">
            <h3><User size={16} /> Personal Details</h3>
            <button type="button" className="edit-step-btn" onClick={() => onEdit(1)}>
              <Edit3 size={14} /> Edit
            </button>
          </div>
          <div className="summary-row">
            <span className="summary-key">Name:</span>
            <span className="summary-val">{data.firstName} {data.lastName}</span>
          </div>
          <div className="summary-row">
            <span className="summary-key">DOB:</span>
            <span className="summary-val">{fmtDate(data.dob)}</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-card-header">
            <h3><Lock size={16} /> Account Security</h3>
            <button type="button" className="edit-step-btn" onClick={() => onEdit(2)}>
              <Edit3 size={14} /> Edit
            </button>
          </div>
          <div className="summary-row">
            <span className="summary-key">Email:</span>
            <span className="summary-val">{data.email}</span>
          </div>
          <div className="summary-row">
            <span className="summary-key">Password:</span>
            <span className="summary-val">••••••••</span>
          </div>
        </div>
      </div>
    </div>
  );
}
