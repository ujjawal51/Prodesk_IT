import React from 'react';
import { User, Calendar, AlertCircle } from 'lucide-react';

export default function StepOne({ register, errors }) {
  return (
    <div className="step-content">
      <div className="step-header">
        <h2>
          <User size={22} /> Personal Details
        </h2>
        <p>Enter your basic personal information to begin.</p>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label" htmlFor="firstName">First Name</label>
          <div className="input-wrapper">
            <User size={18} className="input-icon" />
            <input
              id="firstName"
              type="text"
              placeholder="First name"
              className={`input-field ${errors.firstName ? 'has-error' : ''}`}
              {...register('firstName')}
            />
          </div>
          {errors.firstName && (
            <span className="error-message">
              <AlertCircle size={14} /> {errors.firstName.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="lastName">Last Name</label>
          <div className="input-wrapper">
            <User size={18} className="input-icon" />
            <input
              id="lastName"
              type="text"
              placeholder="Last name"
              className={`input-field ${errors.lastName ? 'has-error' : ''}`}
              {...register('lastName')}
            />
          </div>
          {errors.lastName && (
            <span className="error-message">
              <AlertCircle size={14} /> {errors.lastName.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="dob">Date of Birth</label>
          <div className="input-wrapper">
            <Calendar size={18} className="input-icon" />
            <input
              id="dob"
              type="date"
              className={`input-field ${errors.dob ? 'has-error' : ''}`}
              {...register('dob')}
            />
          </div>
          {errors.dob && (
            <span className="error-message">
              <AlertCircle size={14} /> {errors.dob.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
