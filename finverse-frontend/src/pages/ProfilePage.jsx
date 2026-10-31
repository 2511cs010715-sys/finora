import React, { useState } from 'react';
import { FiUser, FiShield, FiMoon, FiSun, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || 'Demo Investor');
  const [riskPreference, setRiskPreference] = useState(user?.riskPreference || 'Moderate');
  const [investmentHorizon, setInvestmentHorizon] = useState('Medium Term (1-3 yrs)');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container py-4" style={{ maxWidth: '720px' }}>
      <div className="mb-4">
        <h2 className="fw-bold text-light mb-1">User Profile & Risk Settings</h2>
        <p className="text-muted small">Manage account details, investment horizon, and interface theme</p>
      </div>

      {saved && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 small border-0 mb-4">
          <FiCheck size={18} />
          <span>Profile preferences updated successfully!</span>
        </div>
      )}

      <div className="finverse-card p-4 mb-4">
        <h5 className="fw-bold text-light mb-3">Account Information</h5>
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label text-muted small fw-semibold">Full Name</label>
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-muted small fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control bg-dark text-muted border-secondary"
              value={user?.email || 'user@finverse.com'}
              disabled
            />
            <small className="text-muted">Email address cannot be changed.</small>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted small fw-semibold">Risk Preference Profile</label>
            <select
              className="form-select bg-dark text-light border-secondary"
              value={riskPreference}
              onChange={(e) => setRiskPreference(e.target.value)}
            >
              <option value="Conservative">Conservative (Capital Preservation)</option>
              <option value="Moderate">Moderate (Balanced Risk/Return)</option>
              <option value="Aggressive">Aggressive (High Capital Growth)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label text-muted small fw-semibold">Investment Horizon</label>
            <select
              className="form-select bg-dark text-light border-secondary"
              value={investmentHorizon}
              onChange={(e) => setInvestmentHorizon(e.target.value)}
            >
              <option value="Short Term (< 1 yr)">Short Term (&lt; 1 yr)</option>
              <option value="Medium Term (1-3 yrs)">Medium Term (1-3 yrs)</option>
              <option value="Long Term (> 3 yrs)">Long Term (&gt; 3 yrs)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold">
            Save Changes
          </button>
        </form>
      </div>

      <div className="finverse-card p-4">
        <h5 className="fw-bold text-light mb-3">Theme & Appearance</h5>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-bold text-light d-block">Interface Color Theme</span>
            <small className="text-muted">Toggle between Dark Fintech and Light mode</small>
          </div>
          <button className="btn btn-outline-secondary rounded-pill px-3 fw-semibold text-light" onClick={toggleTheme}>
            {theme === 'dark' ? <><FiSun className="me-1 text-warning" /> Light Mode</> : <><FiMoon className="me-1 text-primary" /> Dark Mode</>}
          </button>
        </div>
      </div>
    </div>
  );
}
