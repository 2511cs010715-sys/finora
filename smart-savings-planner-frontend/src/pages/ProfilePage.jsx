import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMoon, FiSun, FiCheck, FiDollarSign, FiLogOut, FiShield, FiSliders, FiHome, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || 'Investors');
  const [monthlyIncome, setMonthlyIncome] = useState(user?.monthlyIncome || 50000);
  const [financialGoalPref, setFinancialGoalPref] = useState(user?.financialGoalPref || 'Balanced Savings & Growth');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="container-fluid px-1 py-2">
      {/* Top Header Navigation Bar with Home Page Button */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-extrabold text-white mb-1" style={{ color: '#ffffff' }}>User Profile & Settings</h2>
          <p className="fw-medium mb-0" style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>
            Manage account details, monthly income target (₹), and financial strategy preferences
          </p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <Link to="/" className="btn btn-outline-info rounded-pill px-3.5 py-2 fw-bold d-inline-flex align-items-center gap-1.5 shadow-sm">
            <FiHome size={18} /> Welcome Home Page
          </Link>
          <Link to="/dashboard" className="btn btn-primary rounded-pill px-3.5 py-2 fw-bold d-inline-flex align-items-center gap-1.5 shadow-sm">
            🚀 Dashboard <FiArrowRight size={18} />
          </Link>
        </div>
      </div>

      {saved && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2.5 px-3 border-0 mb-4 shadow text-white" style={{ backgroundColor: '#059669' }}>
          <FiCheck size={20} />
          <span className="fw-bold">Profile preferences saved successfully!</span>
        </div>
      )}

      {/* Account Information Card */}
      <div className="finora-card p-4 mb-4" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255, 255, 255, 0.14)' }}>
        <div className="d-flex align-items-center gap-2 mb-4 border-bottom border-secondary pb-3">
          <FiUser size={24} className="text-primary" />
          <h4 className="fw-bold text-white mb-0" style={{ color: '#ffffff' }}>Account Information & Financial Profile</h4>
        </div>

        <form onSubmit={handleSave}>
          <div className="row g-3">
            <div className="col-md-6 mb-3">
              <label className="form-label text-white fw-bold small" style={{ color: '#f8fafc', fontSize: '0.92rem' }}>Full Name</label>
              <input
                type="text"
                className="form-control text-white border-secondary fw-bold"
                style={{ backgroundColor: '#0f172a', color: '#ffffff', fontSize: '0.95rem', borderColor: '#475569' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label text-white fw-bold small" style={{ color: '#f8fafc', fontSize: '0.92rem' }}>Email Address</label>
              <input
                type="email"
                className="form-control border-secondary fw-bold"
                style={{ backgroundColor: '#1e293b', color: '#38bdf8', fontSize: '0.95rem', borderColor: '#475569', opacity: 1 }}
                value={user?.email || 'varshinireddyseelam@gmail.com'}
                disabled
              />
              <small className="d-block mt-1 fw-medium" style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>
                Primary account identifier (Verified).
              </small>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label text-white fw-bold small" style={{ color: '#f8fafc', fontSize: '0.92rem' }}>Monthly Income Target (₹)</label>
              <input
                type="number"
                className="form-control text-white border-secondary fw-bold"
                style={{ backgroundColor: '#0f172a', color: '#ffffff', fontSize: '0.95rem', borderColor: '#475569' }}
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                required
              />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label text-white fw-bold small" style={{ color: '#f8fafc', fontSize: '0.92rem' }}>Financial Strategy Preference</label>
              <select
                className="form-select text-white border-secondary fw-bold"
                style={{ backgroundColor: '#0f172a', color: '#ffffff', fontSize: '0.95rem', borderColor: '#475569' }}
                value={financialGoalPref}
                onChange={(e) => setFinancialGoalPref(e.target.value)}
              >
                <option value="Balanced Savings & Growth" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                  Balanced Savings & Growth ⚖️
                </option>
                <option value="Aggressive Wealth Building" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                  Aggressive Wealth Building 🚀
                </option>
                <option value="Capital Preservation & Safety" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                  Capital Preservation & Safety 🛡️
                </option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary rounded-pill px-4 py-2.5 fw-bold shadow">
            Save Settings & Preferences
          </button>
        </form>
      </div>

      {/* Security & Logout Card */}
      <div className="finora-card p-4 border-danger" style={{ backgroundColor: '#0b0f19' }}>
        <div className="d-flex align-items-center gap-2 mb-2">
          <FiShield size={24} className="text-danger" />
          <h4 className="fw-bold text-danger mb-0">Account Security & Authentication Session</h4>
        </div>
        <p className="fw-medium mb-3" style={{ color: '#e2e8f0', fontSize: '0.92rem' }}>
          End your active session securely and clear authentication credentials from this device.
        </p>
        <button className="btn btn-danger rounded-pill px-4 py-2.5 fw-bold d-flex align-items-center gap-2 shadow" onClick={logout}>
          <FiLogOut size={18} /> Log Out of Account
        </button>
      </div>
    </div>
  );
}
