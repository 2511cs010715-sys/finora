import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiUser, FiMail, FiLock, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [financialGoalPref, setFinancialGoalPref] = useState('Balanced Savings & Growth');
  
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
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);

    const result = await register({
      name,
      email,
      password,
      monthlyIncome: monthlyIncome ? Number(monthlyIncome) : 50000,
      financialGoalPref
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
      <div className="finplanner-card auth-card-bg p-4 p-md-5" style={{ maxWidth: '480px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="bg-primary text-white p-3 rounded-circle d-inline-flex mb-3">
            <FiTrendingUp size={28} />
          </div>
          <h3 className="fw-bold text-light mb-1 text-uppercase fs-5" style={{ letterSpacing: '0.04em' }}>Create SMART SAVINGS AND INVESTMENT PLANNER Account</h3>
          <h6 className="fw-extrabold gradient-title mb-2 mt-1" style={{ fontSize: '0.95rem' }}>
            Plan Smart. Save More. Invest Better.
          </h6>
          <p className="text-muted small">Join smart personal financial planning & goal tracking platform</p>
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
                placeholder="Alex Mercer"
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
                placeholder="alex@example.com"
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
            <label className="form-label text-muted small fw-semibold">Monthly Income Target (₹)</label>
            <div className="input-group">
              <span className="input-group-text bg-dark text-muted border-secondary">
                <FiDollarSign />
              </span>
              <input
                type="number"
                step="any"
                className="form-control bg-dark text-light border-secondary"
                placeholder="50000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-muted small fw-semibold">Financial Strategy Preference</label>
            <select
              className="form-select bg-dark text-light border-secondary"
              value={financialGoalPref}
              onChange={(e) => setFinancialGoalPref(e.target.value)}
            >
              <option value="Balanced Savings & Growth">Balanced Savings & Growth (Default)</option>
              <option value="Aggressive Wealth Building">Aggressive Wealth Building</option>
              <option value="Capital Preservation & Safety">Capital Preservation & Safety</option>
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
