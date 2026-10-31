import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FiCpu, FiSliders, FiTrendingUp, FiZap, FiCheckCircle } from 'react-icons/fi';
import CustomTooltip from '../components/Charts/CustomTooltip';

export default function FinancialTwinPage() {
  const [salaryAdj, setSalaryAdj] = useState(10); // % increase
  const [expenseAdj, setExpenseAdj] = useState(15); // % decrease
  const [investAdj, setInvestAdj] = useState(5000); // +₹5k investment

  // Base values
  const baseIncome = 65000;
  const baseExpense = 42000;

  // Adjusted values
  const adjIncome = Math.round(baseIncome * (1 + salaryAdj / 100));
  const adjExpense = Math.round(baseExpense * (1 - expenseAdj / 100));
  const monthlyNetSurplus = Math.max(0, adjIncome - adjExpense);

  const initialNetWorth = 248650;
  const month12Projected = initialNetWorth + (monthlyNetSurplus * 12) + (investAdj * 12 * 1.12);

  const twinTimeline = [
    { month: 'Current', Baseline: 248650, ProjectedTwin: 248650 },
    { month: 'Month 3', Baseline: 275000, ProjectedTwin: 295000 },
    { month: 'Month 6', Baseline: 310000, ProjectedTwin: 342000 },
    { month: 'Month 9', Baseline: 350000, ProjectedTwin: 391000 },
    { month: 'Month 12', Baseline: 390000, ProjectedTwin: Math.round(month12Projected) }
  ];

  return (
    <div className="container-fluid px-1 py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 text-primary mb-1">
            <div className="p-2 bg-primary-subtle text-primary rounded-3">
              <FiCpu size={24} />
            </div>
            <h2 className="fw-bold text-light mb-0">FINORA Financial Twin</h2>
          </div>
          <p className="small mb-0" style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>Interactive 12-Month Future Financial Simulation Engine</p>
        </div>

        <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill fw-bold fs-7">
          🟢 12-Month Projection Active
        </span>
      </div>

      {/* Hero Financial Twin Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="finora-card p-4" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.12)' }}>
            <small className="fw-bold d-block mb-1" style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Current Net Worth</small>
            <h2 className="display-6 mb-0" style={{ color: '#ffffff', fontWeight: 800 }}>₹2,48,650</h2>
            <small className="d-block mt-2" style={{ color: '#cbd5e1', fontWeight: 500 }}>Baseline financial status</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="finora-card p-4 border-primary" style={{ backgroundColor: '#0b0f19' }}>
            <small className="fw-bold d-block mb-1" style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>Simulated Monthly Net Surplus</small>
            <h2 className="display-6 mb-0" style={{ color: '#4ade80', fontWeight: 800 }}>₹{monthlyNetSurplus.toLocaleString()} / mo</h2>
            <small className="d-block mt-2" style={{ color: '#cbd5e1', fontWeight: 600 }}>Income: <strong style={{ color: '#38bdf8' }}>₹{adjIncome.toLocaleString()}</strong> | Expenses: <strong style={{ color: '#f87171' }}>₹{adjExpense.toLocaleString()}</strong></small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="finora-card p-4 border-info" style={{ backgroundColor: '#0b0f19' }}>
            <small className="fw-bold d-block mb-1" style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>12-Month Projected Net Worth</small>
            <h2 className="display-6 mb-0" style={{ color: '#38bdf8', fontWeight: 800 }}>₹{Math.round(month12Projected).toLocaleString()}</h2>
            <small className="d-block mt-2 fw-bold" style={{ color: '#4ade80' }}>+₹{Math.round(month12Projected - initialNetWorth).toLocaleString()} Projected Growth</small>
          </div>
        </div>
      </div>

      {/* Simulator Controls & Projection Chart */}
      <div className="row g-4 mb-4">
        <div className="col-lg-5">
          <div className="finora-card p-4 h-100" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div className="d-flex align-items-center gap-2 mb-3 text-warning">
              <FiSliders size={22} />
              <h5 className="fw-bold text-light mb-0">Scenario Parameters ("What if I...")</h5>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label small fw-bold mb-0" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>Increase Salary (%)</label>
                <span className="fw-bold" style={{ color: '#4ade80', fontSize: '1.1rem' }}>+{salaryAdj}% (₹{adjIncome.toLocaleString()})</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="0"
                max="30"
                step="1"
                value={salaryAdj}
                onChange={(e) => setSalaryAdj(Number(e.target.value))}
                style={{ accentColor: '#22c55e', cursor: 'pointer', height: '8px' }}
              />
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label small fw-bold mb-0" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>Reduce Monthly Expenses (%)</label>
                <span className="fw-bold" style={{ color: '#38bdf8', fontSize: '1.1rem' }}>-{expenseAdj}% (₹{adjExpense.toLocaleString()})</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="0"
                max="40"
                step="1"
                value={expenseAdj}
                onChange={(e) => setExpenseAdj(Number(e.target.value))}
                style={{ accentColor: '#0ea5e9', cursor: 'pointer', height: '8px' }}
              />
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label small fw-bold mb-0" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>Increase Monthly Investment (₹)</label>
                <span className="fw-bold" style={{ color: '#fbbf24', fontSize: '1.1rem' }}>+₹{investAdj.toLocaleString()}</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="0"
                max="25000"
                step="1000"
                value={investAdj}
                onChange={(e) => setInvestAdj(Number(e.target.value))}
                style={{ accentColor: '#f59e0b', cursor: 'pointer', height: '8px' }}
              />
            </div>

            <div className="p-3 rounded border text-center shadow" style={{ backgroundColor: '#0f172a', borderColor: '#3b82f6' }}>
              <span className="small d-block fw-bold" style={{ color: '#e2e8f0' }}>Simulation Result</span>
              <span className="fw-extrabold d-block my-1 fs-6" style={{ color: '#4ade80' }}>Goal completion achieved 3 months earlier!</span>
              <small style={{ color: '#cbd5e1', fontWeight: 600 }}>Compounding wealth velocity: 14.8% per annum</small>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="finora-card p-4 h-100" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.12)' }}>
            <h5 className="fw-bold text-light mb-1">12-Month Net Worth Trajectory (Baseline vs Twin Scenario)</h5>
            <p className="small mb-3" style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>Comparing standard trajectory against your active simulation</p>

            <div style={{ width: '100%', height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={twinTimeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="twinGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.45}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="ProjectedTwin" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#twinGrad)" name="Financial Twin Scenario" />
                  <Area type="monotone" dataKey="Baseline" stroke="#9ca3af" strokeWidth={2} strokeDasharray="4 4" fillOpacity={0} name="Standard Baseline" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
