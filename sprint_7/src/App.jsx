import React, { useState, useEffect } from 'react';
import RegistrationWizard from './components/RegistrationWizard';
import { Sun, Moon, ShieldCheck } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand-badge">
          <div className="brand-icon">
            <ShieldCheck size={26} />
          </div>
          <div className="brand-title">
            <h1>ProDesk IT</h1>
            <p>Sprint 07 • Registration Wizard</p>
          </div>
        </div>

        <button type="button" className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <main>
        <RegistrationWizard />
      </main>

      <footer style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
        Sprint 07 • React Hook Form + Zod
      </footer>
    </div>
  );
}
