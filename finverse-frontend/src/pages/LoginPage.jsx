import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiEye, FiEyeOff, FiLock, FiMail, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const fillDemoUser = () => {
    setEmail('user@finverse.com');
    setPassword('password123');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@finverse.com');
    setPassword('password123');
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="finverse-card p-4 p-md-5" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="bg-primary text-white p-3 rounded-circle d-inline-flex mb-3">
            <FiTrendingUp size={28} />
          </div>
          <h3 className="fw-bold text-light mb-1">Welcome Back to FinVerse</h3>
          <p className="text-muted small">Sign in to access AI market predictions and portfolio dashboard</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small border-0 mb-3">
            <FiAlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-muted small fw-semibold">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-dark text-muted border-secondary">
                <FiMail />
              </span>
              <input
                type="email"
                className="form-control bg-dark text-light border-secondary"
                placeholder="name@finverse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label text-muted small fw-semibold mb-0">Password</label>
              <a href="#forgot" className="small text-primary text-decoration-none" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to demo email."); }}>
                Forgot password?
              </a>
            </div>
            <div className="input-group">
              <span className="input-group-text bg-dark text-muted border-secondary">
                <FiLock />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control bg-dark text-light border-secondary border-end-0"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-dark text-muted border-secondary border-start-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 rounded-pill fw-bold mb-3 d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              'Sign In to FinVerse'
            )}
          </button>
        </form>

        {/* Demo Accounts Shortcut */}
        <div className="border-top border-secondary pt-3 mt-3 text-center">
          <small className="text-muted d-block mb-2">Quick Viva Demo Accounts:</small>
          <div className="d-flex gap-2 justify-content-center">
            <button className="btn btn-outline-secondary btn-sm px-3 rounded-pill" onClick={fillDemoUser}>
              Demo Investor
            </button>
            <button className="btn btn-outline-warning btn-sm px-3 rounded-pill" onClick={fillDemoAdmin}>
              Demo Admin
            </button>
          </div>
        </div>

        <div className="text-center mt-4 pt-2">
          <span className="text-muted small">Don't have an account? </span>
          <Link to="/register" className="text-primary fw-semibold text-decoration-none small">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
