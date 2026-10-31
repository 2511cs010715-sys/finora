import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiTrendingUp, FiPieChart, FiTarget, FiDollarSign, FiZap,
  FiArrowRight, FiCheckCircle, FiShield, FiClock, FiCpu, FiActivity
} from 'react-icons/fi';

export default function LandingPage() {
  return (
    <div className="landing-wrapper py-4">
      {/* Welcome Hero Section */}
      <section className="ai-hero-section py-5 text-center position-relative rounded-4 glass-panel mb-5 p-4 border border-secondary">
        <div className="container position-relative z-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge ai-hero-badge text-info px-4 py-2 rounded-pill mb-4 fw-bold fs-6 border border-info-subtle">
              <FiZap className="me-1 text-warning" /> Welcome to FINORA 2026 Financial Command Center
            </span>

            <h1 className="display-3 fw-extrabold gradient-title mb-4">
              Plan Smart. Save More. Invest Better.
            </h1>

            <p className="lead text-white-50 max-w-2xl mx-auto mb-4" style={{ maxWidth: '820px', fontSize: '1.25rem', color: '#cbd5e1' }}>
              Your intelligent, AI-powered personal financial command center for tracking cash flows, automated budget planning, milestone velocity, and real-time advisory.
            </p>

            <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
              <Link to="/dashboard" className="btn btn-primary btn-lg px-4 py-3 rounded-pill fw-bold d-flex align-items-center gap-2 shadow-lg active-sidebar-glow">
                🚀 Launch Dashboard <FiArrowRight size={20} />
              </Link>
              <Link to="/profile" className="btn btn-outline-warning btn-lg px-4 py-3 rounded-pill fw-bold text-white border-warning">
                ⚙️ User Profile & Settings
              </Link>
              <Link to="/twin" className="btn btn-outline-info btn-lg px-4 py-3 rounded-pill fw-semibold text-light border-info">
                🔮 12-Mo Future Twin
              </Link>
            </div>
          </motion.div>

          {/* Quick Telemetry Metrics Bar (Total Balance, Monthly Savings, Monthly Expenses, Goals Progress) */}
          <div className="row g-3 justify-content-center max-w-4xl mx-auto mt-4">
            {/* Card 1: Total Balance */}
            <div className="col-6 col-md-3">
              <Link to="/accounts" className="text-decoration-none">
                <div className="finora-card p-3 text-center border-primary h-100">
                  <div className="badge bg-primary-subtle text-primary mb-1">Liquid Balance</div>
                  <h3 className="fw-extrabold text-white mb-0" style={{ color: '#ffffff' }}>₹1,24,500</h3>
                  <small className="fw-bold text-white d-block mt-1" style={{ color: '#ffffff' }}>💰 Total Balance</small>
                  <small className="text-white-50 d-block mt-0.5" style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Current bank/cash</small>
                </div>
              </Link>
            </div>

            {/* Card 2: Monthly Savings */}
            <div className="col-6 col-md-3">
              <Link to="/dashboard" className="text-decoration-none">
                <div className="finora-card p-3 text-center border-success h-100">
                  <div className="badge bg-success-subtle text-success mb-1">Income − Expenses</div>
                  <h3 className="fw-extrabold text-white mb-0" style={{ color: '#ffffff' }}>+₹23,000</h3>
                  <small className="fw-bold text-white d-block mt-1" style={{ color: '#ffffff' }}>📈 Monthly Savings</small>
                  <small className="text-white-50 d-block mt-0.5" style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Net Surplus</small>
                </div>
              </Link>
            </div>

            {/* Card 3: Monthly Expenses */}
            <div className="col-6 col-md-3">
              <Link to="/expenses" className="text-decoration-none">
                <div className="finora-card p-3 text-center border-danger h-100">
                  <div className="badge bg-danger-subtle text-danger mb-1">Total Spent</div>
                  <h3 className="fw-extrabold text-white mb-0" style={{ color: '#ffffff' }}>₹42,000</h3>
                  <small className="fw-bold text-white d-block mt-1" style={{ color: '#ffffff' }}>💸 Monthly Expenses</small>
                  <small className="text-white-50 d-block mt-0.5" style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Spent this month</small>
                </div>
              </Link>
            </div>

            {/* Card 4: Goals Progress */}
            <div className="col-6 col-md-3">
              <Link to="/goals" className="text-decoration-none">
                <div className="finora-card p-3 text-center border-warning h-100">
                  <div className="badge bg-warning-subtle text-warning mb-1">Active Targets</div>
                  <h3 className="fw-extrabold text-white mb-0" style={{ color: '#ffffff' }}>68%</h3>
                  <small className="fw-bold text-white d-block mt-1" style={{ color: '#ffffff' }}>🎯 Goals Progress</small>
                  <small className="text-white-50 d-block mt-0.5" style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>Overall completed</small>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Ecosystem Modules Grid */}
      <section className="py-4">
        <div className="text-center mb-5">
          <span className="badge bg-warning-subtle text-warning border border-warning px-3 py-2 rounded-pill fw-bold text-uppercase tracking-wider mb-2 d-inline-flex align-items-center gap-1 fs-6">
            <FiZap /> Core Platform Modules
          </span>
          <h2 className="display-5 fw-extrabold mt-2 text-white" style={{ color: '#ffffff' }}>
            Next-Gen Personal Finance Command Center
          </h2>
        </div>

        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <Link to="/expenses" className="text-decoration-none">
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="finora-card p-4 h-100 text-start border-primary">
                <div className="bg-primary text-white p-3 rounded-3 d-inline-block mb-3 shadow">
                  <FiDollarSign size={24} />
                </div>
                <h5 className="fw-bold text-white mb-2" style={{ color: '#ffffff' }}>💳 Income & Expense Tracking</h5>
                <p className="text-white-50 small mb-3" style={{ color: '#cbd5e1' }}>
                  Log income streams alongside categorized expenses with live daily safe-to-spend limits.
                </p>
                <div className="small fw-bold text-primary d-flex align-items-center gap-1">
                  Open Cash Flow Tracker <FiArrowRight />
                </div>
              </motion.div>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/goals" className="text-decoration-none">
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="finora-card p-4 h-100 text-start border-success">
                <div className="bg-success text-white p-3 rounded-3 d-inline-block mb-3 shadow">
                  <FiTarget size={24} />
                </div>
                <h5 className="fw-bold text-white mb-2" style={{ color: '#ffffff' }}>🎯 Savings Goals & Targets</h5>
                <p className="text-white-50 small mb-3" style={{ color: '#cbd5e1' }}>
                  Set milestone targets for emergency reserves and high-value purchases with progress velocity bars.
                </p>
                <div className="small fw-bold text-success d-flex align-items-center gap-1">
                  Open Goal Tracker <FiArrowRight />
                </div>
              </motion.div>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/investments" className="text-decoration-none">
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="finora-card p-4 h-100 text-start border-warning">
                <div className="bg-warning text-white p-3 rounded-3 d-inline-block mb-3 shadow">
                  <FiPieChart size={24} />
                </div>
                <h5 className="fw-bold text-white mb-2" style={{ color: '#ffffff' }}>📈 Investment Portfolio</h5>
                <p className="text-white-50 small mb-3" style={{ color: '#cbd5e1' }}>
                  Monitor asset distribution across Mutual Funds, Stocks, Fixed Deposits, and Gold with interactive charts.
                </p>
                <div className="small fw-bold text-warning d-flex align-items-center gap-1">
                  View Investments <FiArrowRight />
                </div>
              </motion.div>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/suggestions" className="text-decoration-none">
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="finora-card p-4 h-100 text-start border-info">
                <div className="bg-info text-white p-3 rounded-3 d-inline-block mb-3 shadow">
                  <FiCpu size={24} />
                </div>
                <h5 className="fw-bold text-white mb-2" style={{ color: '#ffffff' }}>🤖 AI Strategic Advisory</h5>
                <p className="text-white-50 small mb-3" style={{ color: '#cbd5e1' }}>
                  Receive autonomous financial recommendations, expense spike alerts, and 6-month wealth projections.
                </p>
                <div className="small fw-bold text-info d-flex align-items-center gap-1">
                  Open AI Advisory <FiArrowRight />
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* Workflow Process */}
      <section className="py-5 text-center">
        <div className="mb-5">
          <span className="badge bg-primary-subtle text-primary border border-primary px-3 py-2 rounded-pill fw-bold text-uppercase tracking-wider mb-2 d-inline-block fs-6">
            Ecosystem Navigation
          </span>
          <h2 className="display-5 fw-extrabold text-white mt-1" style={{ color: '#ffffff' }}>
            Four Steps to Complete Wealth Control
          </h2>
        </div>

        <div className="row g-4">
          <div className="col-md-3">
            <Link to="/dashboard" className="text-decoration-none">
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="finora-card p-4 h-100 border-primary text-start">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fs-3 fw-bold text-primary">01</span>
                  <span className="badge bg-primary-subtle text-primary border border-primary">Dashboard</span>
                </div>
                <h6 className="fw-bold text-white mb-1" style={{ color: '#ffffff' }}>Command Overview</h6>
                <p className="text-white-50 small mb-3" style={{ color: '#cbd5e1' }}>Inspect Net Worth, Financial Health, and Cash Flow.</p>
                <div className="small fw-semibold text-primary d-flex align-items-center gap-1">
                  Go to Dashboard <FiArrowRight />
                </div>
              </motion.div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link to="/expenses" className="text-decoration-none">
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="finora-card p-4 h-100 border-success text-start">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fs-3 fw-bold text-success">02</span>
                  <span className="badge bg-success-subtle text-success border border-success">Transactions</span>
                </div>
                <h6 className="fw-bold text-white mb-1" style={{ color: '#ffffff' }}>Log Transactions</h6>
                <p className="text-white-50 small mb-3" style={{ color: '#cbd5e1' }}>Record income and categorize monthly spending.</p>
                <div className="small fw-semibold text-success d-flex align-items-center gap-1">
                  Manage Expenses <FiArrowRight />
                </div>
              </motion.div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link to="/twin" className="text-decoration-none">
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="finora-card p-4 h-100 border-info text-start">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fs-3 fw-bold text-info">03</span>
                  <span className="badge bg-info-subtle text-info border border-info">Predictions</span>
                </div>
                <h6 className="fw-bold text-white mb-1" style={{ color: '#ffffff' }}>Financial Twin</h6>
                <p className="text-white-50 small mb-3" style={{ color: '#cbd5e1' }}>Simulate 12-month future scenarios with interactive sliders.</p>
                <div className="small fw-semibold text-info d-flex align-items-center gap-1">
                  Open Future Twin <FiArrowRight />
                </div>
              </motion.div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link to="/suggestions" className="text-decoration-none">
              <motion.div whileHover={{ y: -8, scale: 1.02 }} className="finora-card p-4 h-100 border-warning text-start">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fs-3 fw-bold text-warning">04</span>
                  <span className="badge bg-warning-subtle text-warning border border-warning">AI Advisory</span>
                </div>
                <h6 className="fw-bold text-white mb-1" style={{ color: '#ffffff' }}>Get AI Insights</h6>
                <p className="text-white-50 small mb-3" style={{ color: '#cbd5e1' }}>Receive automated recommendations and report audits.</p>
                <div className="small fw-semibold text-warning d-flex align-items-center gap-1">
                  View AI Insights <FiArrowRight />
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

