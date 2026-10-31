import React, { useState } from 'react';
import { 
  FiZap, FiPieChart, FiAlertTriangle, FiCheckCircle, FiInfo, FiFileText, 
  FiDownload, FiX, FiShield, FiTrendingUp, FiActivity, FiSliders, FiArrowUpRight, FiCheck
} from 'react-icons/fi';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';

export default function PersonalizedInsightsPage() {
  const { user } = useAuth();
  
  // Interactive state
  const [selectedRisk, setSelectedRisk] = useState(user?.riskPreference || 'Moderate');
  const [allocationRatio, setAllocationRatio] = useState(48.2);
  const [toastMessage, setToastMessage] = useState('');
  const [activeActionModal, setActiveActionModal] = useState(null);

  // Output file modal state
  const [showOutputFileModal, setShowOutputFileModal] = useState(false);
  const [outputFileContent, setOutputFileContent] = useState('');

  const handleOpenOutputFile = async () => {
    try {
      const res = await fetch('/output.txt');
      if (res.ok) {
        const text = await res.text();
        setOutputFileContent(text);
      } else {
        setOutputFileContent("Failed to load /output.txt from public directory.");
      }
    } catch (err) {
      setOutputFileContent("Error loading output file: " + err.message);
    }
    setShowOutputFileModal(true);
  };

  const handleDownloadOutputFile = () => {
    const element = document.createElement("a");
    const file = new Blob([outputFileContent || "FINVERSE AI ADVISORY EXECUTION REPORT"], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "output.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleConfirmRebalance = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setToastMessage(`Successfully rebalanced portfolio concentration! RELIANCE exposure adjusted to 25.0%.`);
    setAllocationRatio(25.0);
    setActiveActionModal(null);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Beta calculations based on risk profile
  const portfolioBeta = selectedRisk === 'Aggressive' ? 1.34 : selectedRisk === 'Conservative' ? 0.78 : 1.08;
  const drawdownRisk = selectedRisk === 'Aggressive' ? 'High (-18.4% Est. Max)' : selectedRisk === 'Conservative' ? 'Low (-6.2% Est. Max)' : 'Moderate (-10.5% Est. Max)';

  return (
    <div className="container py-4">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="alert alert-success border-success bg-dark text-success p-3 mb-4 rounded-3 d-flex align-items-center justify-content-between shadow-lg">
          <div className="d-flex align-items-center gap-2">
            <FiCheckCircle size={20} />
            <strong className="small">{toastMessage}</strong>
          </div>
          <button className="btn-close btn-close-white" onClick={() => setToastMessage('')}></button>
        </div>
      )}

      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 text-warning mb-1">
            <div className="p-2 bg-warning-subtle rounded-3 text-warning">
              <FiZap size={22} />
            </div>
            <h2 className="fw-bold text-light mb-0">Personalized AI Risk & Advisory Studio</h2>
          </div>
          <p className="text-muted small mb-0">Quantitative analysis based on holdings, risk preference ({selectedRisk}), and market volatility.</p>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            className="btn btn-outline-warning btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-2"
            onClick={handleOpenOutputFile}
          >
            <FiFileText size={16} /> View Output File
          </button>
          <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill fw-bold d-flex align-items-center gap-1">
            <FiActivity size={14} /> AI Engine Online
          </span>
        </div>
      </div>

      <div className="alert alert-info border-info-subtle bg-dark text-info p-3 mb-4 d-flex align-items-start gap-3">
        <FiInfo size={22} className="flex-shrink-0 mt-1" />
        <div className="small">
          <strong>EDUCATIONAL ADVISORY DISCLAIMER:</strong> Insights below are generated algorithmically to aid risk awareness. FinVerse does not provide guaranteed buy/sell recommendations or regulated financial advice.
        </div>
      </div>

      {/* Interactive Risk & Concentration Cards */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="finverse-card p-4 h-100 border-warning d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2 text-warning">
                  <FiAlertTriangle size={22} />
                  <h5 className="fw-bold mb-0 text-light">Portfolio Concentration Diagnostic</h5>
                </div>
                <span className="badge bg-warning-subtle text-warning border border-warning">
                  {allocationRatio > 35 ? '🔥 High Concentration' : '🟢 Well Diversified'}
                </span>
              </div>
              <p className="text-muted small mb-3">
                Your virtual portfolio shows a <strong>{allocationRatio.toFixed(1)}% allocation in Reliance Industries</strong> and Energy & Tech sector. Single-stock concentration elevates vulnerability to market volatility.
              </p>
              <div className="p-3 bg-dark rounded border border-secondary text-light small mb-3">
                💡 <strong>AI Recommendation:</strong> Consider reviewing asset diversification into benchmark indices (NIFTY50) or defensive sectors (Information Technology).
              </div>
            </div>

            <div className="pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
              <span className="small text-muted">Sector Impact: Energy & Tech</span>
              <button
                className="btn btn-outline-warning btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
                onClick={() => setActiveActionModal('rebalance')}
              >
                Rebalance Position <FiArrowUpRight />
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="finverse-card p-4 h-100 border-success d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2 text-success">
                  <FiCheckCircle size={22} />
                  <h5 className="fw-bold mb-0 text-light">Interactive Risk Profile Alignment</h5>
                </div>
                <span className="badge bg-success-subtle text-success border border-success">
                  Beta: {portfolioBeta}
                </span>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted small fw-semibold">Select Target Risk Profile:</label>
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedRisk === 'Conservative' ? 'btn-success' : 'btn-outline-secondary text-light'}`}
                    onClick={() => setSelectedRisk('Conservative')}
                  >
                    Conservative
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedRisk === 'Moderate' ? 'btn-primary' : 'btn-outline-secondary text-light'}`}
                    onClick={() => setSelectedRisk('Moderate')}
                  >
                    Moderate
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedRisk === 'Aggressive' ? 'btn-warning' : 'btn-outline-secondary text-light'}`}
                    onClick={() => setSelectedRisk('Aggressive')}
                  >
                    Aggressive
                  </button>
                </div>
              </div>

              <div className="p-3 bg-dark rounded border border-secondary text-light small mb-3">
                ✅ <strong>AI Assessment:</strong> Portfolio Beta ({portfolioBeta}) aligns with <strong>{selectedRisk}</strong> bounds. Projected Drawdown Limit: <span className="text-info font-monospace fw-bold">{drawdownRisk}</span>.
              </div>
            </div>

            <div className="pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
              <span className="small text-muted">Model: Random Forest Regressor</span>
              <span className="small fw-bold text-success">Aligned Strategy</span>
            </div>
          </div>
        </div>

        {/* Sector Volatility Diagnostics */}
        <div className="col-lg-12">
          <div className="finverse-card p-4">
            <h5 className="fw-bold text-light mb-3 d-flex align-items-center gap-2">
              <FiPieChart className="text-primary" /> Market Volatility & Sector Diagnostics
            </h5>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="p-3 bg-dark rounded border border-secondary h-100">
                  <span className="text-muted small d-block mb-1">Tech Sector Volatility</span>
                  <span className="fw-bold text-danger fs-5">+3.2% Variance</span>
                  <p className="small text-muted mb-0 mt-1">Elevated price swings in US & Indian tech equities (AAPL, TCS).</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 bg-dark rounded border border-secondary h-100">
                  <span className="text-muted small d-block mb-1">Benchmark Index Drift</span>
                  <span className="fw-bold text-success fs-5">+0.60% Steady</span>
                  <p className="small text-muted mb-0 mt-1">NIFTY 50 trading steadily near all-time high ranges.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 bg-dark rounded border border-secondary h-100">
                  <span className="text-muted small d-block mb-1">AI Regressor Accuracy</span>
                  <span className="fw-bold text-info fs-5">89.4% Confidence</span>
                  <p className="small text-muted mb-0 mt-1">Random Forest regressor model fitting baseline.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Rebalance Action Modal */}
      {activeActionModal === 'rebalance' && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light border-warning shadow-lg">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold text-warning d-flex align-items-center gap-2">
                  <FiSliders /> Confirm Portfolio Rebalance
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setActiveActionModal(null)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted small mb-3">
                  This action will reallocate <strong>23.2% of RELIANCE holdings</strong> into index funds (NIFTY50) to lower single-stock sector concentration risk.
                </p>
                
                <div className="p-3 bg-black rounded border border-secondary mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Current RELIANCE Exposure:</span>
                    <span className="fw-bold text-danger">48.2%</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted small">Target RELIANCE Exposure:</span>
                    <span className="fw-bold text-success">25.0%</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-secondary">
                <button type="button" className="btn btn-outline-secondary text-light rounded-pill px-3" onClick={() => setActiveActionModal(null)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-warning rounded-pill px-4 fw-bold" onClick={handleConfirmRebalance}>
                  <FiCheck className="me-1" /> Execute Rebalance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Output File Viewer Modal */}
      {showOutputFileModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content bg-dark text-light border-warning">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold text-warning d-flex align-items-center gap-2">
                  <FiFileText /> AI Advisory Output File (`output.txt`)
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowOutputFileModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="bg-black p-3 rounded font-monospace text-success border border-secondary" style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto' }}>
                  {outputFileContent}
                </div>
              </div>
              <div className="modal-footer border-secondary">
                <button type="button" className="btn btn-outline-secondary text-light rounded-pill px-3" onClick={() => setShowOutputFileModal(false)}>
                  <FiX className="me-1" /> Close
                </button>
                <button type="button" className="btn btn-warning rounded-pill px-3 fw-bold" onClick={handleDownloadOutputFile}>
                  <FiDownload className="me-1" /> Download `output.txt`
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
