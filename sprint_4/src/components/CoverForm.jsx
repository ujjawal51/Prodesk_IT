import { useState } from 'react';
import styles from './CoverForm.module.css';

const TONES = ['professional', 'enthusiastic', 'formal'];

export default function CoverForm({ onGenerate, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    skills: '',
    tone: 'professional',
  });
  const [errors, setErrors] = useState({});

  const updateField = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const chooseTone = (tone) => setFormData((prev) => ({ ...prev, tone }));

  function checkForm() {
    const newErrors = {};
    if (!formData.name.trim())    newErrors.name    = 'Name is required';
    if (!formData.role.trim())    newErrors.role    = 'Job role is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.skills.trim())  newErrors.skills  = 'At least one skill is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const submitForm = (e) => {
    e.preventDefault();
    if (!checkForm()) return;
    onGenerate(formData);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <path
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
        Your Details
      </div>

      <form onSubmit={submitForm} className={styles.form} noValidate>

        <Field
          id="name" label="Your Full Name" required
          placeholder="e.g. Ujjawal Tiwari"
          value={formData.name}
          onChange={updateField('name')}
          error={errors.name}
        />

        <Field
          id="role" label="Target Job Role" required
          placeholder="e.g. Frontend Developer"
          value={formData.role}
          onChange={updateField('role')}
          error={errors.role}
        />

        <Field
          id="company" label="Target Company" required
          placeholder="e.g. Google, Infosys"
          value={formData.company}
          onChange={updateField('company')}
          error={errors.company}
        />

        <div className={styles.fieldGroup}>
          <label htmlFor="skills" className={styles.label}>
            Key Skills <span className={styles.required}>*</span>
          </label>
          <textarea
            id="skills"
            className={`${styles.input} ${styles.textarea} ${errors.skills ? styles.invalid : ''}`}
            placeholder="e.g. React, Node.js, Python, Leadership"
            rows={3}
            value={formData.skills}
            onChange={updateField('skills')}
          />
          <span className={styles.hint}>Separate skills with commas</span>
          {errors.skills && <span className={styles.error}>{errors.skills}</span>}
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Letter Tone</label>
          <div className={styles.toneRow}>
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.toneBtn} ${formData.tone === t ? styles.toneActive : ''}`}
                onClick={() => chooseTone(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className={styles.generateBtn} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className={styles.btnSpinner} />
              Generating…
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Generate Cover Letter
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function Field({ id, label, placeholder, value, onChange, error, required }) {
  return (
    <div className={styles.fieldGroup}>
      <label htmlFor={id} className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <input
        id={id}
        type="text"
        className={`${styles.input} ${error ? styles.invalid : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={id === 'name' ? 'name' : 'off'}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
