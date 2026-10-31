import React from 'react';
import { FiFileText, FiDownload, FiCheckCircle, FiAward, FiTrendingDown, FiTrendingUp } from 'react-icons/fi';
import confetti from 'canvas-confetti';

export default function MonthlySummaryPage() {

  const handleDownloadReport = () => {
    confetti({ particleCount: 80, spread: 60 });
    const reportText = `==================================================
FINVERSE MONTHLY FINANCIAL PERFORMANCE REPORT
Generated: ${new Date().toLocaleDateString()}
==================================================

1. PORTFOLIO METRICS:
   - Total Capital Invested: ₹135,000.00
   - Current Portfolio Valuation: ₹154,280.00
   - Net Unrealized Gain: +₹19,280.00 (+14.28%)
   - Active Holdings: 3 Positions

2. ASSET PERFORMANCE HIGHLIGHTS:
   - Best Performing Asset: AAPL (+6.90% Return)
   - Worst Performing Asset: TSLA (-3.06% Pullback)
   - Benchmark Index Status: NIFTY 50 (+0.60% Bullish)

3. AI MODEL PREDICTION SUMMARY:
   - Model Executed: Random Forest Regression (100 Trees)
   - Overall Prediction Accuracy Score: 89.40%
   - Recommended Review: Rebalance sector exposure.

DISCLAIMER: AI-generated estimate. Not guaranteed financial advice.
==================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FinVerse_Monthly_Report_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-light mb-1">Monthly Financial Summary & Report</h2>
          <p className="text-muted small mb-0">Comprehensive performance audit and downloadable financial summary statement</p>
        </div>
        <button className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2" onClick={handleDownloadReport}>
          <FiDownload /> Download Financial Report
        </button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="finverse-card p-4 text-center">
            <small className="text-muted fw-semibold">Total Invested</small>
            <h3 className="fw-bold text-light mt-1 mb-0">₹135,000</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="finverse-card p-4 text-center">
            <small className="text-muted fw-semibold">Current Portfolio Value</small>
            <h3 className="fw-bold text-light mt-1 mb-0">₹154,280</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="finverse-card p-4 text-center">
            <small className="text-muted fw-semibold">Net Monthly Gain</small>
            <h3 className="fw-bold text-success mt-1 mb-0">+₹19,280 (+14.28%)</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="finverse-card p-4 text-center">
            <small className="text-muted fw-semibold">Active Positions</small>
            <h3 className="fw-bold text-info mt-1 mb-0">3 Positions</h3>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="finverse-card p-4 h-100 border-success">
            <div className="d-flex align-items-center gap-2 mb-2 text-success">
              <FiAward size={24} />
              <h5 className="fw-bold text-light mb-0">Best Performing Asset</h5>
            </div>
            <h4 className="fw-extrabold text-light mt-2">Apple Inc. (AAPL)</h4>
            <span className="badge bg-success-subtle text-success fs-6 border border-success mt-1">
              +6.90% Return Yield
            </span>
            <p className="text-muted small mt-2 mb-0">Strong momentum driven by quarterly hardware telemetry and AI product announcements.</p>
          </div>
        </div>

        <div className="col-md-6">
          <div className="finverse-card p-4 h-100 border-danger">
            <div className="d-flex align-items-center gap-2 mb-2 text-danger">
              <FiTrendingDown size={24} />
              <h5 className="fw-bold text-light mb-0">Worst Performing Asset</h5>
            </div>
            <h4 className="fw-extrabold text-light mt-2">Tesla Inc. (TSLA)</h4>
            <span className="badge bg-danger-subtle text-danger fs-6 border border-danger mt-1">
              -3.06% Pullback
            </span>
            <p className="text-muted small mt-2 mb-0">Short-term consolidation following automotive margin adjustments.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
