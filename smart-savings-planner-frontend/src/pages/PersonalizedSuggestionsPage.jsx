import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiZap, FiAlertTriangle, FiCheckCircle, FiInfo, FiTrendingUp, FiTarget, 
  FiDollarSign, FiPieChart, FiSliders, FiArrowUpRight, FiClock, FiFileText, 
  FiRefreshCw, FiDownload, FiX, FiActivity, FiShield, FiAward, FiCheck
} from 'react-icons/fi';
import confetti from 'canvas-confetti';
import HealthScoreGauge from '../components/HealthScoreGauge';
import TelemetryModal from '../components/TelemetryModal';
import { getDashboardData } from '../services/api';

export default function PersonalizedSuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [healthScore, setHealthScore] = useState(88);
  const [savingsRate, setSavingsRate] = useState(38.4);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [expenseRatio, setExpenseRatio] = useState(61.6);
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Interactive Simulator state
  const [simIncome, setSimIncome] = useState(50000);
  const [simExpenses, setSimExpenses] = useState(30800);
  const [simInvestments, setSimInvestments] = useState(15000);
  const [riskTolerance, setRiskTolerance] = useState('Moderate');

  // Interactive Action Modal State
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Output file modal state
  const [showOutputFileModal, setShowOutputFileModal] = useState(false);
  const [outputFileContent, setOutputFileContent] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const res = await getDashboardData();
      if (res.data) {
        if (res.data.suggestions && res.data.suggestions.length > 0) {
          setSuggestions(res.data.suggestions);
        } else {
          setDefaultSuggestions();
        }
        setHealthScore(res.data.financialHealthScore || 88);
        setSavingsRate(res.data.savingsRatePercent || 38.4);
      }
    } catch (err) {
      setDefaultSuggestions();
    } finally {
      setIsRefreshing(false);
    }
  };

  const setDefaultSuggestions = () => {
    setSuggestions([
      {
        id: 1,
        type: 'SUCCESS',
        category: 'Savings Discipline',
        filterKey: 'SAVINGS',
        title: 'Healthy Savings Margin (38.4%)',
        message: 'Your monthly savings rate exceeds the 20% benchmark. Maintain this baseline to fund high-priority goal milestones.',
        impact: '+₹19,200 / Month Capital Growth',
        actionText: 'Lock in Monthly Transfer',
        details: 'Automating a monthly recurring transfer of ₹19,200 directly into a high-yield liquid asset ensures consistent wealth compounding.'
      },
      {
        id: 2,
        type: 'WARNING',
        category: 'Expense Management',
        filterKey: 'EXPENSE',
        title: 'Bills & Utilities Exceed 45% Outflow',
        message: 'Housing rent and utility bills account for ₹14,800. Review subscription bills and discretionary utility usage to optimize savings.',
        impact: 'Potential ₹2,500/mo Recaptured Savings',
        actionText: 'Audit Utility Ledger',
        details: 'Trimming unused recurring digital subscriptions and optimizing peak electricity hours can recapture up to ₹2,500 monthly.'
      },
      {
        id: 3,
        type: 'INFO',
        category: 'Goal Acceleration',
        filterKey: 'GOAL',
        title: 'Accelerate Emergency Reserve Milestone',
        message: 'Your Emergency Reserve Fund is currently at 60% completion. Increasing monthly contribution by ₹3,000 achieves 100% target by November.',
        impact: 'Milestone Completed 30 Days Early',
        actionText: 'Increase Goal Contribution',
        details: 'Adding ₹3,000 monthly boosts your goal velocity by 25%, fully shielding your household against unexpected liquidity events 30 days earlier.'
      },
      {
        id: 4,
        type: 'INFO',
        category: 'Asset Allocation',
        filterKey: 'INVESTMENT',
        title: 'Rebalance Equities & Fixed Deposits',
        message: 'Portfolio allocation is 40% Mutual Funds, 33% Equities, 20% Fixed Deposits, 7% Gold. Consider Systematic Investment Plan (SIP) indexing.',
        impact: 'Optimized Risk-Adjusted Returns',
        actionText: 'Execute SIP Rebalance',
        details: 'Rebalancing 10% of idle cash into low-cost NIFTY 50 Index SIP funds lowers cash drag while maintaining moderate risk alignment.'
      }
    ]);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    const file = new Blob([outputFileContent || "FINPLANNER EXECUTION REPORT"], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "output.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleApplyAction = (rec) => {
    setSelectedRecommendation(rec);
  };

  const handleConfirmAction = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setToastMessage(`Successfully applied "${selectedRecommendation?.title}" to your financial profile!`);
    setSelectedRecommendation(null);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Compute live simulated metrics
  const simSavings = Math.max(0, simIncome - simExpenses);
  const simSavingsRate = simIncome > 0 ? (simSavings / simIncome * 100.0) : 0;
  const simAnnualSavings = simSavings * 12;
  const riskMultiplier = riskTolerance === 'Aggressive' ? 1.15 : riskTolerance === 'Conservative' ? 0.9 : 1.0;
  const simScore = Math.min(98, Math.max(30, Math.round(((simSavingsRate * 1.5) + ((100 - (simExpenses / simIncome * 100)) * 0.4)) * riskMultiplier)));

  const filteredSuggestions = suggestions.filter(s => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'SAVINGS') return s.filterKey === 'SAVINGS' || s.category.includes('Savings');
    if (activeFilter === 'EXPENSE') return s.filterKey === 'EXPENSE' || s.category.includes('Expense');
    if (activeFilter === 'GOAL') return s.filterKey === 'GOAL' || s.category.includes('Goal');
    if (activeFilter === 'INVESTMENT') return s.filterKey === 'INVESTMENT' || s.category.includes('Asset') || s.category.includes('Investment');
    return true;
  });

  return (
    <div className="container-fluid px-1 py-2">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="alert alert-success border-success bg-dark text-success p-3 mb-4 rounded-3 d-flex align-items-center justify-content-between shadow-lg">
          <div className="d-flex align-items-center gap-2">
            <FiCheckCircle size={20} />
            <strong className="small">{toastMessage}</strong>
          </div>
          <button className="btn-close btn-close-white" onClick={() => setToastMessage('')}></button>
        </div>
      )}

      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 pb-2 border-bottom border-secondary">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <div className="p-2 bg-warning bg-opacity-25 rounded-circle text-warning border border-warning">
              <FiZap size={22} />
            </div>
            <h2 className="fw-extrabold text-white mb-0" style={{ color: '#ffffff', letterSpacing: '-0.02em' }}>
              Interactive AI Advisory & Insights Studio
            </h2>
          </div>
          <p className="fw-medium mb-0" style={{ color: '#e2e8f0', fontSize: '0.94rem' }}>
            Autonomous algorithmic cash flow telemetry, expense optimization, and strategic portfolio recommendations
          </p>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            className="btn btn-outline-warning btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-2"
            onClick={handleOpenOutputFile}
          >
            <FiFileText size={16} /> View Output File
          </button>
          <button
            className="btn p-0 border-0 bg-transparent text-start"
            onClick={() => setShowTelemetryModal(true)}
            title="Click to open Live AI Telemetry & Microservice Monitor"
          >
            <span className="badge bg-success bg-opacity-20 text-success border border-success px-3 py-2 rounded-pill fw-bold d-inline-flex align-items-center gap-1.5" style={{ cursor: 'pointer' }}>
              <span className="spinner-grow spinner-grow-sm text-success" style={{ width: '0.55rem', height: '0.55rem' }}></span>
              <FiActivity size={14} /> AI Microservice Online 🟢
            </span>
          </button>
        </div>
      </div>

      {/* Interactive Hero Gauge & Component Weights */}
      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <HealthScoreGauge score={healthScore} />
        </div>

        <div className="col-lg-8">
          <div className="finplanner-card p-4 h-100 d-flex flex-column justify-content-between" style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary">
                <h5 className="fw-bold text-white mb-0 d-flex align-items-center gap-2" style={{ color: '#ffffff' }}>
                  <FiShield className="text-primary" size={20} /> Financial Index Component Breakdown
                </h5>
                <span className="badge bg-primary-subtle text-primary border border-primary px-3 py-1.5 fw-bold">
                  Automated Algorithmic Model
                </span>
              </div>

              {/* Ultra-Clear High-Contrast Component Breakdown Grid */}
              <div className="row g-3 mb-3">
                <div className="col-6 col-sm-3">
                  <div className="p-3 bg-dark rounded-3 border border-secondary text-center h-100 d-flex flex-column justify-content-center">
                    <span className="fw-bold text-white d-block mb-1" style={{ color: '#ffffff', fontSize: '0.85rem' }}>Savings Margin</span>
                    <span className="fw-extrabold text-success fs-5">40% Weight</span>
                    <span className="fw-bold text-info d-block mt-1" style={{ color: '#38bdf8', fontSize: '0.78rem' }}>Rate: {savingsRate}%</span>
                  </div>
                </div>

                <div className="col-6 col-sm-3">
                  <div className="p-3 bg-dark rounded-3 border border-secondary text-center h-100 d-flex flex-column justify-content-center">
                    <span className="fw-bold text-white d-block mb-1" style={{ color: '#ffffff', fontSize: '0.85rem' }}>Expense Control</span>
                    <span className="fw-extrabold text-warning fs-5">25% Weight</span>
                    <span className="fw-bold text-warning d-block mt-1" style={{ color: '#fbbf24', fontSize: '0.78rem' }}>Ratio: {expenseRatio}%</span>
                  </div>
                </div>

                <div className="col-6 col-sm-3">
                  <div className="p-3 bg-dark rounded-3 border border-secondary text-center h-100 d-flex flex-column justify-content-center">
                    <span className="fw-bold text-white d-block mb-1" style={{ color: '#ffffff', fontSize: '0.85rem' }}>Goal Velocity</span>
                    <span className="fw-extrabold text-info fs-5">20% Weight</span>
                    <span className="fw-bold text-white d-block mt-1" style={{ color: '#ffffff', fontSize: '0.78rem' }}>3 Active Goals</span>
                  </div>
                </div>

                <div className="col-6 col-sm-3">
                  <div className="p-3 bg-dark rounded-3 border border-secondary text-center h-100 d-flex flex-column justify-content-center">
                    <span className="fw-bold text-white d-block mb-1" style={{ color: '#ffffff', fontSize: '0.85rem' }}>Asset Allocation</span>
                    <span className="fw-extrabold fs-5" style={{ color: '#c084fc' }}>15% Weight</span>
                    <span className="fw-bold text-white d-block mt-1" style={{ color: '#ffffff', fontSize: '0.78rem' }}>4 Asset Classes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prominent High-Contrast Educational Disclaimer */}
            <div className="p-3 rounded-3 border d-flex align-items-center gap-3 shadow-sm" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#f59e0b', color: '#fbbf24' }}>
              <FiInfo size={26} className="flex-shrink-0 text-warning" />
              <div style={{ fontSize: '0.88rem', lineHeight: '1.5' }}>
                <strong className="text-white d-block" style={{ color: '#ffffff' }}>EDUCATIONAL DISCLAIMER:</strong>
                <span className="fw-semibold text-white" style={{ color: '#fef08a' }}>
                  FinPlanner AI Insights are computed algorithmically for personal budget optimization and Viva demonstration. Recommendations do not constitute regulated investment advice.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            className={`btn btn-sm rounded-pill px-3.5 py-1.5 fw-bold ${activeFilter === 'ALL' ? 'btn-primary shadow' : 'btn-outline-secondary text-white'}`}
            onClick={() => setActiveFilter('ALL')}
          >
            All Recommendations ({suggestions.length})
          </button>
          <button
            className={`btn btn-sm rounded-pill px-3.5 py-1.5 fw-bold ${activeFilter === 'SAVINGS' ? 'btn-success shadow' : 'btn-outline-secondary text-white'}`}
            onClick={() => setActiveFilter('SAVINGS')}
          >
            <FiDollarSign className="me-1" /> Savings Discipline
          </button>
          <button
            className={`btn btn-sm rounded-pill px-3.5 py-1.5 fw-bold ${activeFilter === 'EXPENSE' ? 'btn-warning shadow' : 'btn-outline-secondary text-white'}`}
            onClick={() => setActiveFilter('EXPENSE')}
          >
            <FiAlertTriangle className="me-1" /> Expense Controls
          </button>
          <button
            className={`btn btn-sm rounded-pill px-3.5 py-1.5 fw-bold ${activeFilter === 'GOAL' ? 'btn-info shadow' : 'btn-outline-secondary text-white'}`}
            onClick={() => setActiveFilter('GOAL')}
          >
            <FiTarget className="me-1" /> Goal Velocity
          </button>
          <button
            className={`btn btn-sm rounded-pill px-3.5 py-1.5 fw-bold ${activeFilter === 'INVESTMENT' ? 'btn-secondary shadow' : 'btn-outline-secondary text-white'}`}
            onClick={() => setActiveFilter('INVESTMENT')}
          >
            <FiPieChart className="me-1" /> Asset Allocation
          </button>
        </div>

        <span className="small text-white fw-bold" style={{ color: '#ffffff' }}>
          Showing {filteredSuggestions.length} active AI insight(s)
        </span>
      </div>

      {/* Interactive Recommendation Cards Grid */}
      <div className="row g-4 mb-5">
        <AnimatePresence>
          {filteredSuggestions.map((s) => {
            const isWarn = s.type === 'WARNING';
            const isSucc = s.type === 'SUCCESS';
            return (
              <motion.div
                key={s.id || s.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="col-md-6"
              >
                <div className={`finora-card p-4 h-100 d-flex flex-column justify-content-between ${isWarn ? 'border-warning' : isSucc ? 'border-success' : 'border-primary'}`} style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)' }}>
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className={`badge ${isWarn ? 'bg-warning-subtle text-warning border border-warning' : isSucc ? 'badge-ontrack' : 'bg-primary-subtle text-primary border border-primary'}`}>
                        {s.category}
                      </span>
                      {isWarn ? <FiAlertTriangle className="text-warning" size={22} /> : <FiCheckCircle className="text-success" size={22} />}
                    </div>

                    <h4 className="fw-extrabold text-white mb-2" style={{ color: '#ffffff' }}>{s.title}</h4>
                    <p className="fw-medium text-white mb-3" style={{ color: '#f1f5f9', fontSize: '0.94rem', lineHeight: '1.6' }}>{s.message}</p>

                    {s.impact && (
                      <div className="p-2.5 px-3 bg-dark rounded-3 border border-secondary d-inline-block mb-3">
                        <span className="small fw-bold text-success">🎯 Projected Impact: {s.impact}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-top border-secondary d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <span className="badge bg-primary bg-opacity-25 text-info border border-info border-opacity-50 d-inline-flex align-items-center gap-1.5 px-2.5 py-1.5 fw-bold" style={{ fontSize: '0.78rem' }}>
                      <FiClock /> Real-Time Telemetry 🟢
                    </span>
                    <button
                      className={`btn btn-sm rounded-pill px-3.5 py-1.5 fw-bold d-flex align-items-center gap-1 ${isWarn ? 'btn-outline-warning' : 'btn-outline-primary'}`}
                      onClick={() => handleApplyAction(s)}
                    >
                      {s.actionText || 'Apply Recommendation'} <FiArrowUpRight />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Interactive What-If Financial Strategy Simulator Studio */}
      <div className="finplanner-card p-4 p-md-5 border-info mb-5" style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)' }}>
        <div className="d-flex justify-content-between align-items-start align-items-md-center flex-column flex-md-row gap-2 mb-3">
          <div>
            <div className="d-flex align-items-center gap-2 text-info mb-1">
              <FiSliders size={24} />
              <h4 className="fw-bold text-white mb-0" style={{ color: '#ffffff' }}>What-If Financial Strategy Simulator Studio</h4>
            </div>
            <p className="text-white-50 small mb-0" style={{ color: '#e2e8f0' }}>Adjust cash flow parameters to test real-time strategy shifts and annual capital projections.</p>
          </div>
          <span className="badge bg-info-subtle text-info border border-info px-3 py-2 rounded-pill fw-bold">
            ⚡ Real-Time Index Calculation
          </span>
        </div>

        <div className="row g-4 align-items-center">
          <div className="col-lg-8">
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label text-white small fw-semibold" style={{ color: '#ffffff' }}>Monthly Inflow / Income (₹)</label>
                <span className="fw-bold text-primary fs-5">₹{simIncome.toLocaleString()}</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="20000"
                max="200000"
                step="5000"
                value={simIncome}
                onChange={(e) => setSimIncome(Number(e.target.value))}
              />
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label text-white small fw-semibold" style={{ color: '#ffffff' }}>Monthly Outflow / Expenses (₹)</label>
                <span className="fw-bold text-danger fs-5">₹{simExpenses.toLocaleString()}</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="10000"
                max="120000"
                step="2000"
                value={simExpenses}
                onChange={(e) => setSimExpenses(Number(e.target.value))}
              />
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label text-white small fw-semibold" style={{ color: '#ffffff' }}>Monthly SIP / Investment Target (₹)</label>
                <span className="fw-bold text-success fs-5">₹{simInvestments.toLocaleString()}</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="2000"
                max="50000"
                step="1000"
                value={simInvestments}
                onChange={(e) => setSimInvestments(Number(e.target.value))}
              />
            </div>

            <div className="d-flex align-items-center gap-3">
              <label className="form-label text-white small fw-semibold mb-0" style={{ color: '#ffffff' }}>Strategy Risk Profile:</label>
              <select
                className="form-select bg-dark text-white border-secondary w-auto btn-sm fw-bold"
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(e.target.value)}
              >
                <option value="Conservative">Conservative (Capital Safety)</option>
                <option value="Moderate">Moderate (Balanced Compound)</option>
                <option value="Aggressive">Aggressive (Wealth Maximizer)</option>
              </select>
            </div>
          </div>

          <div className="col-lg-4 text-center">
            <div className="p-4 bg-dark rounded-3 border border-info h-100 d-flex flex-column justify-content-center">
              <span className="text-white small d-block mb-1" style={{ color: '#ffffff' }}>Simulated Financial Health Index</span>
              <h1 className="fw-extrabold text-white display-3 mb-0" style={{ color: '#ffffff' }}>{simScore}</h1>
              <span className="small fw-bold text-info d-block mt-1">/ 100 Health Score</span>
              
              <hr className="border-secondary my-3" />
              
              <div className="text-start small">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-white" style={{ color: '#e2e8f0' }}>Net Monthly Savings:</span>
                  <strong className="text-success">₹{simSavings.toLocaleString()}</strong>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-white" style={{ color: '#e2e8f0' }}>Savings Rate %:</span>
                  <strong className="text-info">{simSavingsRate.toFixed(1)}%</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-white" style={{ color: '#e2e8f0' }}>Projected 1-Yr Net Capital:</span>
                  <strong className="text-warning">₹{simAnnualSavings.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Apply Recommendation Modal */}
      {selectedRecommendation && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white border-primary shadow-lg">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold text-primary d-flex align-items-center gap-2">
                  <FiAward /> Apply AI Recommendation
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedRecommendation(null)}></button>
              </div>
              <div className="modal-body">
                <h6 className="fw-bold text-white mb-2" style={{ color: '#ffffff' }}>{selectedRecommendation.title}</h6>
                <p className="text-white-50 small mb-3" style={{ color: '#e2e8f0' }}>{selectedRecommendation.message}</p>
                
                <div className="p-3 bg-black rounded border border-secondary mb-3">
                  <span className="text-info small d-block mb-1 fw-bold">Implementation Blueprint:</span>
                  <p className="small text-white mb-0" style={{ color: '#ffffff' }}>{selectedRecommendation.details || selectedRecommendation.message}</p>
                </div>

                <div className="p-2 px-3 bg-success-subtle text-success border border-success rounded d-flex align-items-center gap-2">
                  <FiTrendingUp />
                  <span className="small fw-bold">Projected Outcome: {selectedRecommendation.impact}</span>
                </div>
              </div>
              <div className="modal-footer border-secondary">
                <button type="button" className="btn btn-outline-secondary text-white rounded-pill px-3" onClick={() => setSelectedRecommendation(null)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary rounded-pill px-4 fw-bold" onClick={handleConfirmAction}>
                  <FiCheck className="me-1" /> Confirm & Apply Strategy
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
            <div className="modal-content bg-dark text-white border-warning">
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
                <button type="button" className="btn btn-outline-secondary text-white rounded-pill px-3" onClick={() => setShowOutputFileModal(false)}>
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

      {/* AI Telemetry Status Modal */}
      <TelemetryModal isOpen={showTelemetryModal} onClose={() => setShowTelemetryModal(false)} />
    </div>
  );
}
