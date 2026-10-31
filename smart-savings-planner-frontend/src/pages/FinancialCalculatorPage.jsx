import React, { useState } from 'react';
import { FiPercent, FiDollarSign, FiTrendingUp, FiTarget, FiPieChart } from 'react-icons/fi';

export default function FinancialCalculatorPage() {
  const [activeTab, setActiveTab] = useState('SIP');

  // 1. Investment / Return (SIP) Calculator State
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(5);

  // 2. Savings Calculator State
  const [initialSavings, setInitialSavings] = useState(10000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(3000);
  const [savingsMonths, setSavingsMonths] = useState(12);

  // 3. Goal Target Amount Calculator State
  const [targetGoalVal, setTargetGoalVal] = useState(100000);
  const [currentGoalVal, setCurrentGoalVal] = useState(20000);
  const [monthsLeft, setMonthsLeft] = useState(10);

  // SIP Calculation: M = P * ({[1 + i]^n - 1} / i) * (1 + i)
  const calculateSip = () => {
    const P = Number(sipMonthly);
    const i = Number(sipRate) / 12 / 100;
    const n = Number(sipYears) * 12;
    if (i === 0) return { totalInvested: P * n, estimatedReturns: 0, totalValue: P * n };

    const totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = P * n;
    const estimatedReturns = Math.max(0, totalValue - totalInvested);
    return {
      totalInvested: Math.round(totalInvested),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(totalValue)
    };
  };

  // Savings calculation
  const calculateSavings = () => {
    const init = Number(initialSavings);
    const dep = Number(monthlyDeposit);
    const mos = Number(savingsMonths);
    const total = init + (dep * mos);
    return { totalAccumulated: total, totalDeposits: dep * mos };
  };

  // Goal Required Monthly Savings calculation
  const calculateGoalRequired = () => {
    const target = Number(targetGoalVal);
    const current = Number(currentGoalVal);
    const remaining = Math.max(0, target - current);
    const months = Number(monthsLeft) > 0 ? Number(monthsLeft) : 1;
    const requiredPerMonth = Math.ceil(remaining / months);
    return { remaining, requiredPerMonth };
  };

  const sipRes = calculateSip();
  const savRes = calculateSavings();
  const goalRes = calculateGoalRequired();

  return (
    <div className="container-fluid px-1 py-2">
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 text-primary mb-1">
          <div className="p-2 bg-primary-subtle rounded-3 text-primary">
            <FiPercent size={24} />
          </div>
          <h2 className="fw-bold text-light mb-0">Financial Calculators</h2>
        </div>
        <p className="small mb-0" style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>
          Calculate future investment returns, savings growth velocity, and goal contribution targets.
        </p>
      </div>

      {/* Calculator Navigation Tabs */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        <button
          className={`btn btn-sm rounded-pill px-4 fw-bold ${activeTab === 'SIP' ? 'btn-primary' : 'btn-outline-secondary text-white'}`}
          style={activeTab !== 'SIP' ? { backgroundColor: '#1e293b', borderColor: '#475569' } : {}}
          onClick={() => setActiveTab('SIP')}
        >
          <FiTrendingUp className="me-1" /> Investment Return (SIP / Compounding)
        </button>
        <button
          className={`btn btn-sm rounded-pill px-4 fw-bold ${activeTab === 'SAVINGS' ? 'btn-success' : 'btn-outline-secondary text-white'}`}
          style={activeTab !== 'SAVINGS' ? { backgroundColor: '#1e293b', borderColor: '#475569' } : {}}
          onClick={() => setActiveTab('SAVINGS')}
        >
          <FiDollarSign className="me-1" /> Monthly Savings Accumulator
        </button>
        <button
          className={`btn btn-sm rounded-pill px-4 fw-bold ${activeTab === 'GOAL' ? 'btn-warning text-dark' : 'btn-outline-secondary text-white'}`}
          style={activeTab !== 'GOAL' ? { backgroundColor: '#1e293b', borderColor: '#475569' } : {}}
          onClick={() => setActiveTab('GOAL')}
        >
          <FiTarget className="me-1" /> Goal Target Amount Calculator
        </button>
      </div>

      {/* TAB 1: SIP & Investment Return Calculator */}
      {activeTab === 'SIP' && (
        <div className="finplanner-card p-4 p-md-5" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.12)' }}>
          <h4 className="fw-bold text-light mb-1">Investment & Return Calculator (SIP / FD / RD)</h4>
          <p className="small mb-4" style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>
            Project estimated wealth accumulation over time based on expected annual rate of return.
          </p>

          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-bold mb-0" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>
                    Monthly Investment Amount (₹)
                  </label>
                  <span className="fw-bold" style={{ fontSize: '1.25rem', color: '#60a5fa' }}>
                    ₹{Number(sipMonthly).toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="500"
                  max="100000"
                  step="500"
                  value={sipMonthly}
                  onChange={(e) => setSipMonthly(e.target.value)}
                  style={{ accentColor: '#3b82f6', cursor: 'pointer', height: '8px' }}
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-bold mb-0" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>
                    Expected Annual Return Rate (%)
                  </label>
                  <span className="fw-bold" style={{ fontSize: '1.25rem', color: '#38bdf8' }}>
                    {sipRate}%
                  </span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="1"
                  max="30"
                  step="0.5"
                  value={sipRate}
                  onChange={(e) => setSipRate(e.target.value)}
                  style={{ accentColor: '#0ea5e9', cursor: 'pointer', height: '8px' }}
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label small fw-bold mb-0" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>
                    Time Horizon (Years)
                  </label>
                  <span className="fw-bold" style={{ fontSize: '1.25rem', color: '#fbbf24' }}>
                    {sipYears} Years
                  </span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="1"
                  max="30"
                  step="1"
                  value={sipYears}
                  onChange={(e) => setSipYears(e.target.value)}
                  style={{ accentColor: '#f59e0b', cursor: 'pointer', height: '8px' }}
                />
              </div>
            </div>

            <div className="col-lg-5">
              <div className="p-4 rounded border text-center shadow" style={{ backgroundColor: '#0f172a', borderColor: '#3b82f6' }}>
                <small className="d-block mb-1" style={{ color: '#e2e8f0', fontWeight: 600 }}>Total Expected Corpus</small>
                <h2 className="display-5 mb-3" style={{ color: '#ffffff', fontWeight: 800 }}>
                  ₹{sipRes.totalValue.toLocaleString()}
                </h2>

                <div className="p-3 rounded text-start" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem' }}>Total Capital Invested:</span>
                    <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.95rem' }}>₹{sipRes.totalInvested.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '0.9rem' }}>Estimated Wealth Gain:</span>
                    <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.95rem' }}>+₹{sipRes.estimatedReturns.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Savings Accumulator */}
      {activeTab === 'SAVINGS' && (
        <div className="finplanner-card p-4 p-md-5" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.12)' }}>
          <h4 className="fw-bold text-light mb-1">Monthly Savings Growth Calculator</h4>
          <p className="small mb-4" style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>
            Calculate total savings accumulated over a specific duration.
          </p>

          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <div className="mb-3">
                <label className="form-label small fw-bold mb-1" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>
                  Initial Lump-sum Balance (₹)
                </label>
                <input
                  type="number"
                  className="form-control text-light fs-5 fw-bold"
                  style={{ backgroundColor: '#0f172a', borderColor: '#475569', color: '#ffffff' }}
                  value={initialSavings}
                  onChange={(e) => setInitialSavings(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold mb-1" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>
                  Monthly Savings Contribution (₹)
                </label>
                <input
                  type="number"
                  className="form-control text-light fs-5 fw-bold"
                  style={{ backgroundColor: '#0f172a', borderColor: '#475569', color: '#ffffff' }}
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold mb-1" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>
                  Duration (Months)
                </label>
                <input
                  type="number"
                  className="form-control text-light fs-5 fw-bold"
                  style={{ backgroundColor: '#0f172a', borderColor: '#475569', color: '#ffffff' }}
                  value={savingsMonths}
                  onChange={(e) => setSavingsMonths(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-5">
              <div className="p-4 rounded border text-center shadow" style={{ backgroundColor: '#0f172a', borderColor: '#22c55e' }}>
                <small className="d-block mb-1" style={{ color: '#e2e8f0', fontWeight: 600 }}>Total Accumulated Savings</small>
                <h2 className="display-5 mb-2" style={{ color: '#4ade80', fontWeight: 800 }}>
                  ₹{savRes.totalAccumulated.toLocaleString()}
                </h2>
                <small style={{ color: '#f1f5f9', fontWeight: 600 }}>Total Monthly Deposits: ₹{savRes.totalDeposits.toLocaleString()}</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Goal Target Amount Calculator */}
      {activeTab === 'GOAL' && (
        <div className="finplanner-card p-4 p-md-5" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.12)' }}>
          <h4 className="fw-bold text-light mb-1">Goal Target & Required Monthly Savings</h4>
          <p className="small mb-4" style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>
            Calculate exact monthly savings required to hit a goal milestone by target date.
          </p>

          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <div className="mb-3">
                <label className="form-label small fw-bold mb-1" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>
                  Target Goal Amount (₹)
                </label>
                <input
                  type="number"
                  className="form-control text-light fs-5 fw-bold"
                  style={{ backgroundColor: '#0f172a', borderColor: '#475569', color: '#ffffff' }}
                  value={targetGoalVal}
                  onChange={(e) => setTargetGoalVal(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold mb-1" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>
                  Current Saved Balance (₹)
                </label>
                <input
                  type="number"
                  className="form-control text-light fs-5 fw-bold"
                  style={{ backgroundColor: '#0f172a', borderColor: '#475569', color: '#ffffff' }}
                  value={currentGoalVal}
                  onChange={(e) => setCurrentGoalVal(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold mb-1" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>
                  Months Remaining to Target Date
                </label>
                <input
                  type="number"
                  className="form-control text-light fs-5 fw-bold"
                  style={{ backgroundColor: '#0f172a', borderColor: '#475569', color: '#ffffff' }}
                  value={monthsLeft}
                  onChange={(e) => setMonthsLeft(e.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-5">
              <div className="p-4 rounded border text-center shadow" style={{ backgroundColor: '#0f172a', borderColor: '#f59e0b' }}>
                <small className="d-block mb-1" style={{ color: '#e2e8f0', fontWeight: 600 }}>Required Monthly Savings</small>
                <h2 className="display-5 mb-2" style={{ color: '#fbbf24', fontWeight: 800 }}>
                  ₹{goalRes.requiredPerMonth.toLocaleString()} / mo
                </h2>
                <small style={{ color: '#f1f5f9', fontWeight: 600 }}>Remaining Balance Needed: ₹{goalRes.remaining.toLocaleString()}</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
