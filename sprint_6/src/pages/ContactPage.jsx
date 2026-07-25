import { useState } from 'react'

const SUBJECTS = ['Order Inquiry', 'Product Information', 'Returns & Refunds', 'Technical Support', 'Other']
const initialForm = { name: '', email: '', subject: '', message: '' }

function check(form) {
  const errs = {}
  if (!form.name.trim()) errs.name = 'Name is required'
  if (!form.email.trim()) errs.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
  if (!form.subject) errs.subject = 'Please select a subject'
  if (!form.message.trim()) errs.message = 'Message is required'
  else if (form.message.trim().length < 20) errs.message = 'Message must be at least 20 characters'
  return errs
}

export default function ContactPage() {
  const [fields, setFields] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function change(e) {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function submit(e) {
    e.preventDefault()
    const errs = check(fields)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSubmitted(true)
    setFields(initialForm)
    setErrors({})
    console.log('[Analytics] User interacted with ShopZone — Contact form submitted')
  }

  return (
    <div className="page-wrapper">
      <div className="contact-page">
        <div className="container">
          <div className="contact-page__grid">

            <div>
              <h1 className="contact-page__title">Get in Touch</h1>
              <p className="contact-page__subtitle">
                Have a question about your order or need product support?
                Our team is here to help. Fill out the form and we'll get
                back to you within 24 hours.
              </p>

              <div className="contact-info-cards" role="list">
                {CONTACT_INFO.map(info => (
                  <div key={info.label} className="contact-info-card" role="listitem">
                    <div className="contact-info-card__icon" aria-hidden="true">
                      {info.icon}
                    </div>
                    <div>
                      <p className="contact-info-card__label">{info.label}</p>
                      <p className="contact-info-card__value">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="contact-form-card">
              <h2 className="form-title">Send us a Message</h2>

              {submitted && (
                <div className="form-success" role="status" aria-live="polite" id="contact-form-success">
                  <span aria-hidden="true">✓</span>
                  Your message has been sent! We'll respond within 24 hours.
                </div>
              )}

              <form onSubmit={submit} noValidate aria-label="Contact form" id="contact-form">
                <div className="form-grid">

                  <div className="form-field">
                    <label htmlFor="contact-name" className="form-label">
                      Full Name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                      placeholder="John Doe"
                      value={fields.name}
                      onChange={change}
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'err-name' : undefined}
                      maxLength={100}
                    />
                    {errors.name && (
                      <span id="err-name" className="form-error" role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-email" className="form-label">
                      Email Address <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                      placeholder="john@example.com"
                      value={fields.email}
                      onChange={change}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'err-email' : undefined}
                    />
                    {errors.email && (
                      <span id="err-email" className="form-error" role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="form-field form-field--full">
                    <label htmlFor="contact-subject" className="form-label">
                      Subject <span aria-hidden="true">*</span>
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      className={`form-input form-select ${errors.subject ? 'form-input--error' : ''}`}
                      value={fields.subject}
                      onChange={change}
                      aria-required="true"
                      aria-invalid={!!errors.subject}
                      aria-describedby={errors.subject ? 'err-subject' : undefined}
                    >
                      <option value="">Select a subject…</option>
                      {SUBJECTS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.subject && (
                      <span id="err-subject" className="form-error" role="alert">
                        {errors.subject}
                      </span>
                    )}
                  </div>

                  <div className="form-field form-field--full">
                    <label htmlFor="contact-message" className="form-label">
                      Message <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      className={`form-textarea ${errors.message ? 'form-input--error' : ''}`}
                      placeholder="Describe your question in detail…"
                      value={fields.message}
                      onChange={change}
                      aria-required="true"
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'err-message' : undefined}
                      maxLength={1000}
                    />
                    {errors.message && (
                      <span id="err-message" className="form-error" role="alert">
                        {errors.message}
                      </span>
                    )}
                  </div>

                </div>

                <button type="submit" className="btn btn--primary btn--full" style={{ marginTop: '16px' }} id="contact-submit-btn">
                  Send Message →
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

const CONTACT_INFO = [
  { icon: '📧', label: 'Email', value: 'support@shopzone.com' },
  { icon: '📞', label: 'Phone', value: '+1 (800) 555-0199' },
  { icon: '🕐', label: 'Hours', value: 'Mon – Fri, 9:00 AM – 6:00 PM IST' },
  { icon: '📍', label: 'Location', value: 'New Delhi, India' },
]
