import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiCpu, FiPieChart, FiBookmark, FiShield, FiArrowRight, FiCheckCircle, FiActivity, FiZap } from 'react-icons/fi';

export default function LandingPage() {
  return (
    <div className="landing-wrapper">
      {/* Hero Section */}
      <section className="ai-hero-section py-5 text-center position-relative">
        <div className="container position-relative z-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge ai-hero-badge text-info px-4 py-2 rounded-pill mb-4 fw-semibold fs-6">
              <FiZap className="me-1 text-warning" /> Next-Gen Fintech & AI Intelligence Engine
            </span>

            <h1 className="display-3 fw-extrabold text-light mb-4">
              AI-Powered Financial Intelligence & <span className="gradient-title">Market Prediction</span>
            </h1>

            <p className="lead text-muted max-w-2xl mx-auto mb-4" style={{ maxWidth: '780px', fontSize: '1.2rem' }}>
              FinVerse leverages Machine Learning algorithms, quantitative time-series regression models, and automated technical indicators to empower investors with data-backed predictions and portfolio analytics.
            </p>

            <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
              <Link to="/login" className="btn btn-primary btn-lg px-4 py-3 rounded-pill fw-bold d-flex align-items-center gap-2 shadow-lg">
                Login <FiArrowRight />
              </Link>
              <Link to="/dashboard" className="btn btn-outline-secondary btn-lg px-4 py-3 rounded-pill fw-semibold text-light">
                Explore Live Dashboard
              </Link>
            </div>
          </motion.div>

          {/* Quick Metrics Bar */}
          <div className="row g-3 justify-content-center max-w-4xl mx-auto mt-4">
            <div className="col-6 col-md-3">
              <div className="finverse-card p-3 text-center">
                <h4 className="fw-bold text-primary mb-0">89.4%</h4>
                <small className="text-muted">AI Model Accuracy</small>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="finverse-card p-3 text-center">
                <h4 className="fw-bold text-success mb-0">10+</h4>
                <small className="text-muted">Tracked Assets & Indices</small>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="finverse-card p-3 text-center">
                <h4 className="fw-bold text-warning mb-0">3 Models</h4>
                <small className="text-muted">Random Forest & Linear</small>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="finverse-card p-3 text-center">
                <h4 className="fw-bold text-info mb-0">Real-Time</h4>
                <small className="text-muted">REST API Telemetry</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-5 bg-secondary-subtle">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-primary fw-bold text-uppercase tracking-wider small">Core Platform Capabilities</span>
            <h2 className="fw-bold text-light mt-1">Engineered for Intelligent Investing</h2>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <motion.div whileHover={{ y: -6 }} className="finverse-card p-4 h-100">
                <div className="bg-primary text-white p-3 rounded-3 d-inline-block mb-3">
                  <FiCpu size={24} />
                </div>
                <h5 className="fw-bold text-light mb-2">Predictive AI Engine</h5>
                <p className="text-muted small">
                  Random Forest and Linear Regression models analyze 60-day historical prices and technical moving averages to project future price curves.
                </p>
              </motion.div>
            </div>

            <div className="col-md-6 col-lg-3">
              <motion.div whileHover={{ y: -6 }} className="finverse-card p-4 h-100">
                <div className="bg-success text-white p-3 rounded-3 d-inline-block mb-3">
                  <FiActivity size={24} />
                </div>
                <h5 className="fw-bold text-light mb-2">Market Trend Signals</h5>
                <p className="text-muted small">
                  Automated evaluation of Bullish 🟢, Neutral 🟡, and Bearish 🔴 technical signals across NIFTY 50, SENSEX, NASDAQ, and equities.
                </p>
              </motion.div>
            </div>

            <div className="col-md-6 col-lg-3">
              <motion.div whileHover={{ y: -6 }} className="finverse-card p-4 h-100">
                <div className="bg-warning text-white p-3 rounded-3 d-inline-block mb-3">
                  <FiPieChart size={24} />
                </div>
                <h5 className="fw-bold text-light mb-2">Virtual Portfolio</h5>
                <p className="text-muted small">
                  Track holdings, quantity, purchase costs, current market valuation, and real-time gain/loss ratios with interactive pie charts.
                </p>
              </motion.div>
            </div>

            <div className="col-md-6 col-lg-3">
              <motion.div whileHover={{ y: -6 }} className="finverse-card p-4 h-100">
                <div className="bg-info text-white p-3 rounded-3 d-inline-block mb-3">
                  <FiBookmark size={24} />
                </div>
                <h5 className="fw-bold text-light mb-2">Watchlist & Price Alerts</h5>
                <p className="text-muted small">
                  Set threshold triggers for target asset values and monitor watchlist fluctuations with custom notification alerts.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Machine Learning Pipeline Section */}
      <section className="py-5 container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <span className="text-primary fw-bold text-uppercase small">Machine Learning Microservice</span>
            <h2 className="fw-bold text-light mb-3">How the FinVerse AI Prediction Pipeline Works</h2>
            <p className="text-muted mb-4">
              FinVerse separates ML computations into a dedicated Python microservice running Scikit-Learn. When an asset prediction is requested, historical market telemetry is sanitized and passed to the model.
            </p>

            <ul className="list-unstyled d-flex flex-column gap-3 text-light">
              <li className="d-flex align-items-center gap-3">
                <FiCheckCircle className="text-primary fs-5" />
                <span>Feature extraction: 5-day & 20-day Simple Moving Averages, Volatility Index.</span>
              </li>
              <li className="d-flex align-items-center gap-3">
                <FiCheckCircle className="text-primary fs-5" />
                <span>Model training: Random Forest Regressor & Linear Regression fitting.</span>
              </li>
              <li className="d-flex align-items-center gap-3">
                <FiCheckCircle className="text-primary fs-5" />
                <span>Confidence calculation: Derived via R² score and variance fitting metrics.</span>
              </li>
              <li className="d-flex align-items-center gap-3">
                <FiCheckCircle className="text-primary fs-5" />
                <span>REST Communication: Spring Boot coordinates Flask API requests and persists results in MySQL.</span>
              </li>
            </ul>
          </div>

          <div className="col-lg-6">
            <div className="finverse-card p-4 prediction-glow">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-light mb-0">Live AI Execution Sample</h6>
                <span className="badge bg-success-subtle text-success">STATUS: OK (200)</span>
              </div>
              <pre className="bg-dark p-3 rounded text-info small border border-secondary mb-0" style={{ fontFamily: 'var(--font-mono)' }}>
{`{
  "symbol": "RELIANCE",
  "current_price": 2980.40,
  "predicted_price": 3045.20,
  "price_change_percent": +2.17%,
  "confidence_score": 89.50,
  "model_name": "Random Forest Regression",
  "trend_direction": "BULLISH",
  "prediction_horizon_days": 7
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Workflow */}
      <section className="py-5 bg-secondary-subtle">
        <div className="container text-center">
          <h2 className="fw-bold text-light mb-5">Four Easy Steps to Financial Intelligence</h2>

          <div className="row g-4">
            <div className="col-md-3">
              <div className="finverse-card p-4">
                <div className="fs-3 fw-bold text-primary mb-2">01</div>
                <h6 className="fw-bold text-light">Create Profile</h6>
                <p className="text-muted small mb-0">Register account and select risk profile preference.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="finverse-card p-4">
                <div className="fs-3 fw-bold text-primary mb-2">02</div>
                <h6 className="fw-bold text-light">Explore Assets</h6>
                <p className="text-muted small mb-0">Search NIFTY 50, NASDAQ, equities, and indices.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="finverse-card p-4">
                <div className="fs-3 fw-bold text-primary mb-2">03</div>
                <h6 className="fw-bold text-light">Run AI Models</h6>
                <p className="text-muted small mb-0">Execute ML prediction pipeline for 7, 30, or 90 days.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="finverse-card p-4">
                <div className="fs-3 fw-bold text-primary mb-2">04</div>
                <h6 className="fw-bold text-light">Track Portfolio</h6>
                <p className="text-muted small mb-0">Build virtual portfolio and monitor price alerts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
