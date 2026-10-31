import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bot, X, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, authError, setAuthError } = useAuth();
  const [isLoginTab, setIsLoginTab] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [localValidation, setLocalValidation] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalValidation('');
    if (authError) setAuthError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalValidation('');

    if (!formData.email || !formData.password) {
      setLocalValidation('Please fill in all required fields.');
      return;
    }

    if (!isLoginTab) {
      if (!formData.name) {
        setLocalValidation('Please enter your full name.');
        return;
      }
      if (formData.password.length < 6) {
        setLocalValidation('Password must be at least 6 characters long.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setLocalValidation('Passwords do not match.');
        return;
      }
    }

    setSubmitting(true);

    if (isLoginTab) {
      const res = await login(formData.email, formData.password);
      if (res?.success) {
        onClose();
      }
    } else {
      const res = await register(formData.name, formData.email, formData.password);
      if (res?.success) {
        onClose();
      }
    }

    setSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="auth-header">
          <div className="auth-logo-badge">
            <Bot size={28} />
          </div>
          <h2>{isLoginTab ? 'Welcome Back' : 'Create an Account'}</h2>
          <p className="auth-subtitle">
            {isLoginTab
              ? 'Sign in to access your chat history and personalized AI settings'
              : 'Sign up to start saving your intelligent AI conversations'}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLoginTab ? 'active' : ''}`}
            onClick={() => {
              setIsLoginTab(true);
              setLocalValidation('');
              if (authError) setAuthError(null);
            }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${!isLoginTab ? 'active' : ''}`}
            onClick={() => {
              setIsLoginTab(false);
              setLocalValidation('');
              if (authError) setAuthError(null);
            }}
          >
            Sign Up
          </button>
        </div>

        {(localValidation || authError) && (
          <div className="auth-error-banner">
            {localValidation || authError}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLoginTab && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g. Alex Turing"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {!isLoginTab && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={submitting}>
            {submitting ? (
              'Processing...'
            ) : (
              <>
                {isLoginTab ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-demo-hint">
          <Sparkles size={14} />
          <span>Quick Demo: You can register any name/email or test instantly!</span>
        </div>
      </div>
    </div>
  );
}
