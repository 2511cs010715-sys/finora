import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiUser, FiMail, FiLock, FiShield, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [riskPreference, setRiskPreference] = useState('Moderate');
  const [investmentHorizon, setInvestmentHorizon] = useState('Medium Term (1-3 yrs)');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);

    const result = await register({
      name,
      email,
      password,
      riskPreference,
      investmentHorizon
    });

    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '85vh' }}>
      <div className="finverse-card p-4 p-md-5" style={{ maxWidth: '480px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="bg-primary text-white p-3 rounded-circle d-inline-flex mb-3">
            <FiTrendingUp size={28} />
          </div>
          <h3 className="fw-bold text-light mb-1">Create FinVerse Account</h3>
          <p className="text-muted small">Join AI-powered financial intelligence & portfolio engine</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small border-0 mb-3">
            <FiAlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-muted small fw-semibold">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-dark text-muted border-secondary">
                <FiUser />
              </span>
              <input
                type="text"
                className="form-control bg-dark text-light border-secondary"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-muted small fw-semibold">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-dark text-muted border-secondary">
                <FiMail />
              </span>
              <input
                type="email"
                className="form-control bg-dark text-light border-secondary"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="form-label text-muted small fw-semibold">Password</label>
              <input
                type="password"
                className="form-control bg-dark text-light border-secondary"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label text-muted small fw-semibold">Confirm Password</label>
              <input
                type="password"
                className="form-control bg-dark text-light border-secondary"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
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

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 rounded-pill fw-bold mb-3"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register & Create Account'}
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="text-muted small">Already have an account? </span>
          <Link to="/login" className="text-primary fw-semibold text-decoration-none small">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
