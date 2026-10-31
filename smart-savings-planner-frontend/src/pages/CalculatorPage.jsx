import React, { useState, useEffect } from 'react';
import { 
  FiActivity, FiDollarSign, FiTrendingUp, FiZap, 
  FiRefreshCw, FiAlertTriangle, FiCheckCircle, FiInfo, 
  FiTarget, FiPieChart, FiBarChart2, FiTrash2, FiClock, FiArrowRight 
} from 'react-icons/fi';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { getIncome, getExpenses } from '../services/api';

const DEFAULT_INCOME = 50000;
const DEFAULT_EXPENSES = 30800;

export default function CalculatorPage() {
  // Primary Calculator Form State
  const [incomeInput, setIncomeInput] = useState('50000');
  const [expenseInput, setExpenseInput] = useState('30800');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Computed Results State
  const [results, setResults] = useState({
    income: 50000,
    expenses: 30800,
    savings: 19200,
    savingsRate: 38.4,
    annualSavings: 230400
  });

  // What-If Simulator State
  const [simIncome, setSimIncome] = useState(50000);
  const [simExpenses, setSimExpenses] = useState(28000);
  const [additionalSavings, setAdditionalSavings] = useState(2800);

  // Target Goal Calculator State
  const [targetAmount, setTargetAmount] = useState('100000');
  const [targetMonthsRequired, setTargetMonthsRequired] = useState(6);

  // Calculation History State
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('finplanner_calc_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, date: '14-Aug-2026', income: 50000, expenses: 30800, savings: 19200, rate: 38.4 }
    ];
  });

  // Fetch live income & expenses from existing API/state
  useEffect(() => {
    const loadLiveData = async () => {
      let liveInc = 50000;
      let liveExp = 30800;

      try {
        const incRes = await getIncome();
        if (incRes.data && incRes.data.length > 0) {
          liveInc = incRes.data.reduce((acc, c) => acc + Number(c.amount || 0), 0);
        }
      } catch (e) {}

      try {
        const expRes = await getExpenses();
        if (expRes.data && expRes.data.length > 0) {
          liveExp = expRes.data.reduce((acc, c) => acc + Number(c.amount || 0), 0);
        }
      } catch (e) {}

      setIncomeInput(String(liveInc));
      setExpenseInput(String(liveExp));
      computeAndSet(liveInc, liveExp, false);
    };

    loadLiveData();
  }, []);

  // Compute metrics and update results
  const computeAndSet = (incVal, expVal, saveToHistory = true) => {
    const inc = Number(incVal) || 0;
    const exp = Number(expVal) || 0;

    if (inc < 0 || exp < 0) {
      setErrorMsg('Income and Expenses cannot be negative numbers.');
      return false;
    }
    setErrorMsg('');

    const sav = inc - exp;
    const rate = inc > 0 ? Number(((sav / inc) * 100).toFixed(1)) : 0;
    const annual = sav * 12;

    const newResults = {
      income: inc,
      expenses: exp,
      savings: sav,
      savingsRate: rate,
      annualSavings: annual
    };
    setResults(newResults);

    // Update Simulator baselines
    setSimIncome(inc);
    setSimExpenses(exp > 28000 ? 28000 : Math.max(0, exp - 2000));
    setAdditionalSavings(Math.max(0, (exp - (exp > 28000 ? 28000 : Math.max(0, exp - 2000)))));

    // Recalculate Target Months
    const tgt = Number(targetAmount) || 100000;
    if (sav > 0) {
      setTargetMonthsRequired(Math.ceil(tgt / sav));
    } else {
      setTargetMonthsRequired(0);
    }

    if (saveToHistory) {
      const nowStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const newEntry = {
        id: Date.now(),
        date: nowStr,
        income: inc,
        expenses: exp,
        savings: sav,
        rate: rate
      };
      const updatedHistory = [newEntry, ...history.slice(0, 9)];
      setHistory(updatedHistory);
      localStorage.setItem('finplanner_calc_history', JSON.stringify(updatedHistory));
    }

    return true;
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!incomeInput && incomeInput !== '0') {
      setErrorMsg('Please enter a valid Monthly Income.');
      return;
    }
    if (!expenseInput && expenseInput !== '0') {
      setErrorMsg('Please enter valid Monthly Expenses.');
      return;
    }
    computeAndSet(incomeInput, expenseInput, true);
  };

  const handleReset = () => {
    setIncomeInput('50000');
    setExpenseInput('30800');
    computeAndSet(50000, 30800, false);
  };

  const handleTargetChange = (val) => {
    setTargetAmount(val);
    const tgt = Number(val) || 0;
    if (results.savings > 0 && tgt > 0) {
      setTargetMonthsRequired(Math.ceil(tgt / results.savings));
    } else {
      setTargetMonthsRequired(0);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('finplanner_calc_history');
  };

  // Determine Savings Status
  const getStatus = () => {
    const { income, expenses, savingsRate } = results;
    if (expenses > income) {
      return {
        type: 'danger',
        title: 'Warning',
        message: 'Your expenses are higher than your income. Review subscriptions and immediate cash outflow.',
        icon: FiAlertTriangle
      };
    }
    if (savingsRate >= 20) {
      return {
        type: 'success',
        title: 'Excellent Savings',
        message: 'You are maintaining a healthy savings rate exceeding the recommended 20% benchmark.',
        icon: FiCheckCircle
      };
    }
    if (savingsRate >= 10) {
      return {
        type: 'info',
        title: 'Good Savings',
        message: 'Consider increasing your monthly savings towards long-term goal milestones.',
        icon: FiInfo
      };
    }
    return {
      type: 'warning',
      title: 'Needs Improvement',
      message: 'Review your expenses and look for opportunities to save more each month.',
      icon: FiZap
    };
  };

  const status = getStatus();

  // Recharts Bar Data
  const chartData = [
    { name: 'Income', amount: results.income, color: '#3b82f6' },
    { name: 'Expenses', amount: results.expenses, color: '#ef4444' },
    { name: 'Savings', amount: Math.max(0, results.savings), color: '#10b981' }
  ];

  // What-if calculation
  const currentSimSavings = Math.max(0, simIncome - simExpenses);
  const simDifference = currentSimSavings - results.savings;

  return (
    <div className="container-fluid px-1 py-2">
      {/* Page Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary text-white p-2 rounded-3 d-flex align-items-center justify-content-center">
            <FiActivity size={22} />
          </div>
          <div>
            <h2 className="fw-extrabold text-light mb-0">Savings & Financial Calculator</h2>
            <p className="small mb-0" style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>
              Calculate your savings, savings rate and understand your monthly financial position.
            </p>
          </div>
        </div>
      </div>

      {/* Calculator Input Form & Interactive Controls */}
      <div className="row g-4 mb-4">
        <div className="col-lg-5">
          <div className="finplanner-card p-4 h-100" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.12)' }}>
            <h5 className="fw-bold text-light mb-3 d-flex align-items-center gap-2">
              <FiDollarSign className="text-primary" /> Financial Inputs
            </h5>

            {errorMsg && (
              <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 small border-0 mb-3">
                <FiAlertTriangle size={18} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCalculate}>
              <div className="mb-3">
                <label className="form-label small fw-bold mb-1" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>Monthly Income (₹)</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary fw-bold" style={{ color: '#38bdf8' }}>₹</span>
                  <input
                    type="number"
                    step="any"
                    className="form-control bg-dark text-light border-secondary fs-5 fw-bold"
                    placeholder="50000"
                    value={incomeInput}
                    onChange={(e) => setIncomeInput(e.target.value)}
                    style={{ backgroundColor: '#0f172a', borderColor: '#475569', color: '#ffffff' }}
                    required
                  />
                </div>
                <small style={{ color: '#cbd5e1', fontSize: '0.825rem' }}>Current cash inflow from Salary & Freelance</small>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold mb-1" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>Monthly Expenses (₹)</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary fw-bold" style={{ color: '#f87171' }}>₹</span>
                  <input
                    type="number"
                    step="any"
                    className="form-control bg-dark text-light border-secondary fs-5 fw-bold"
                    placeholder="30800"
                    value={expenseInput}
                    onChange={(e) => setExpenseInput(e.target.value)}
                    style={{ backgroundColor: '#0f172a', borderColor: '#475569', color: '#ffffff' }}
                    required
                  />
                </div>
                <small style={{ color: '#cbd5e1', fontSize: '0.825rem' }}>Total categorized monthly spending</small>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary w-50 py-2.5 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow">
                  <FiActivity /> Calculate
                </button>
                <button type="button" className="btn btn-outline-secondary text-white w-50 py-2.5 rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: '#1e293b', borderColor: '#475569' }} onClick={handleReset}>
                  <FiRefreshCw /> Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Live Formula Computation Breakdown */}
        <div className="col-lg-7">
          <div className="finplanner-card p-4 h-100 d-flex flex-column justify-content-between" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div>
              <h5 className="fw-bold text-light mb-3 d-flex align-items-center gap-2">
                <FiZap className="text-warning" /> Automatic Formula Breakdown
              </h5>
              
              <div className="p-3 rounded border mb-3" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}>
                <small className="fw-bold text-uppercase tracking-wider d-block mb-1" style={{ color: '#e2e8f0' }}>Monthly Savings Formula</small>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <code className="fs-6" style={{ color: '#38bdf8', fontWeight: 600 }}>Monthly Savings = Total Income - Total Expenses</code>
                  <span className="fw-extrabold fs-5" style={{ color: '#4ade80' }}>
                    ₹{Number(results.income).toLocaleString()} - ₹{Number(results.expenses).toLocaleString()} = ₹{Number(results.savings).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded border mb-3" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}>
                <small className="fw-bold text-uppercase tracking-wider d-block mb-1" style={{ color: '#e2e8f0' }}>Savings Rate Formula</small>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <code className="fs-6" style={{ color: '#38bdf8', fontWeight: 600 }}>Savings Rate = (Monthly Savings / Total Income) × 100</code>
                  <span className="fw-extrabold fs-5" style={{ color: '#38bdf8' }}>
                    (₹{Number(results.savings).toLocaleString()} / ₹{Number(results.income).toLocaleString()}) × 100 = {results.savingsRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Savings Status Alert Box */}
            <div className={`p-3 rounded border ${
              status.type === 'danger' ? 'bg-danger-subtle border-danger text-danger' :
              status.type === 'success' ? 'bg-success-subtle border-success text-success' :
              status.type === 'info' ? 'bg-info-subtle border-info text-info' : 'bg-warning-subtle border-warning text-warning'
            }`}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <status.icon size={20} />
                <h6 className="fw-extrabold mb-0">{status.title}</h6>
              </div>
              <p className="small mb-0 opacity-90">{status.message}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Result Cards (4 Cards Grid matching Dashboard style) */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <motion.div whileHover={{ y: -4 }} className="finplanner-card p-3 p-xl-4 h-100" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.12)' }}>
            <small className="fw-semibold text-uppercase tracking-wider" style={{ color: '#e2e8f0' }}>Total Income</small>
            <h3 className="fw-extrabold text-primary mt-2 mb-0">₹{Number(results.income).toLocaleString()}</h3>
            <small style={{ color: '#cbd5e1' }}>Monthly Cash Inflow</small>
          </motion.div>
        </div>

        <div className="col-6 col-md-3">
          <motion.div whileHover={{ y: -4 }} className="finplanner-card p-3 p-xl-4 h-100" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.12)' }}>
            <small className="fw-semibold text-uppercase tracking-wider" style={{ color: '#e2e8f0' }}>Total Expenses</small>
            <h3 className="fw-extrabold text-danger mt-2 mb-0">₹{Number(results.expenses).toLocaleString()}</h3>
            <small style={{ color: '#cbd5e1' }}>Categorized Outflow</small>
          </motion.div>
        </div>

        <div className="col-6 col-md-3">
          <motion.div whileHover={{ y: -4 }} className="finplanner-card p-3 p-xl-4 h-100 border-success" style={{ backgroundColor: '#0b0f19' }}>
            <small className="fw-semibold text-uppercase tracking-wider" style={{ color: '#e2e8f0' }}>Monthly Savings</small>
            <h3 className="fw-extrabold text-success mt-2 mb-0">₹{Number(results.savings).toLocaleString()}</h3>
            <small className="text-success fw-bold">Net Retained Cash</small>
          </motion.div>
        </div>

        <div className="col-6 col-md-3">
          <motion.div whileHover={{ y: -4 }} className="finplanner-card p-3 p-xl-4 h-100 border-info" style={{ backgroundColor: '#0b0f19' }}>
            <small className="fw-semibold text-uppercase tracking-wider" style={{ color: '#e2e8f0' }}>Savings Rate</small>
            <h3 className="fw-extrabold text-info mt-2 mb-0">{results.savingsRate}%</h3>
            <span className="badge bg-success-subtle text-success border border-success mt-1" style={{ fontSize: '0.7rem' }}>
              Target: ≥ 20%
            </span>
          </motion.div>
        </div>
      </div>

      {/* Visual Chart & Annual Projection Grid */}
      <div className="row g-4 mb-4">
        {/* Recharts Visual Comparison Chart */}
        <div className="col-lg-6">
          <div className="finplanner-card p-4 h-100" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.12)' }}>
            <h5 className="fw-bold text-light mb-3 d-flex align-items-center gap-2">
              <FiBarChart2 className="text-primary" /> Income vs Expenses vs Savings
            </h5>
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
                  <Tooltip 
                    formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Amount']} 
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', borderColor: 'rgba(255,255,255,0.1)' }}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Annual Projection & Target Goal Calculator */}
        <div className="col-lg-6">
          <div className="finplanner-card p-4 h-100 d-flex flex-column justify-content-between" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.12)' }}>
            <div>
              <h5 className="fw-bold text-light mb-3 d-flex align-items-center gap-2">
                <FiTrendingUp className="text-success" /> Annual Projection & Goal Calculator
              </h5>
              
              <div className="p-3 rounded border mb-3" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}>
                <small className="fw-bold text-uppercase tracking-wider d-block mb-1" style={{ color: '#e2e8f0' }}>Projected Annual Savings</small>
                <div className="d-flex align-items-baseline gap-2">
                  <h3 className="fw-extrabold text-success mb-0">₹{Number(results.annualSavings).toLocaleString()}</h3>
                  <small style={{ color: '#cbd5e1' }}>/ year (Monthly Savings × 12)</small>
                </div>
              </div>

              <div className="p-3 rounded border" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}>
                <label className="form-label small fw-bold mb-1" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>Target Savings Milestone (₹)</label>
                <div className="input-group mb-2">
                  <span className="input-group-text bg-dark border-secondary fw-bold" style={{ color: '#fbbf24' }}>₹</span>
                  <input
                    type="number"
                    className="form-control bg-dark text-light border-secondary fw-bold"
                    placeholder="100000"
                    value={targetAmount}
                    onChange={(e) => handleTargetChange(e.target.value)}
                    style={{ backgroundColor: '#0f172a', borderColor: '#475569', color: '#ffffff' }}
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <small style={{ color: '#e2e8f0', fontWeight: 600 }}>Required Months:</small>
                  <span className="badge bg-primary-subtle text-primary border border-primary px-3 py-1 fw-bold fs-6">
                    {results.savings > 0 ? `${targetMonthsRequired} Months` : 'N/A (Savings ≤ 0)'}
                  </span>
                </div>
              </div>
            </div>

            <small className="text-end mt-3" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Formula: <code>Math.ceil(Target Amount / Monthly Savings)</code>
            </small>
          </div>
        </div>
      </div>

      {/* What-If Savings Simulator Section */}
      <div className="finplanner-card p-4 mb-4 border-primary" style={{ backgroundColor: '#0b0f19' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2 text-warning">
            <FiZap size={22} />
            <h5 className="fw-bold mb-0 text-light">What-If Savings Simulator</h5>
          </div>
          <span className="badge bg-warning-subtle text-warning border border-warning px-3 py-1 fw-bold">
            Interactive Forecast
          </span>
        </div>
        <p className="small mb-4" style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>
          Adjust hypothetical income and expense values to preview immediate savings optimization impact.
        </p>

        <div className="row g-4 align-items-center">
          <div className="col-md-4">
            <label className="form-label small fw-bold mb-1" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>
              Simulated Monthly Income: <span style={{ color: '#38bdf8' }}>₹{Number(simIncome).toLocaleString()}</span>
            </label>
            <input
              type="range"
              className="form-range"
              min="10000"
              max="150000"
              step="1000"
              value={simIncome}
              onChange={(e) => setSimIncome(Number(e.target.value))}
              style={{ accentColor: '#38bdf8', cursor: 'pointer', height: '8px' }}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label small fw-bold mb-1" style={{ color: '#f8fafc', fontSize: '0.95rem' }}>
              Simulated Monthly Expenses: <span style={{ color: '#f87171' }}>₹{Number(simExpenses).toLocaleString()}</span>
            </label>
            <input
              type="range"
              className="form-range"
              min="5000"
              max="100000"
              step="500"
              value={simExpenses}
              onChange={(e) => setSimExpenses(Number(e.target.value))}
              style={{ accentColor: '#f87171', cursor: 'pointer', height: '8px' }}
            />
          </div>

          <div className="col-md-4">
            <div className="p-3 rounded border border-warning text-center shadow" style={{ backgroundColor: '#0f172a' }}>
              <small className="fw-semibold d-block mb-1" style={{ color: '#e2e8f0' }}>Simulated Monthly Savings</small>
              <h3 className="fw-extrabold text-warning mt-1 mb-0">₹{Number(currentSimSavings).toLocaleString()}</h3>
              <div className="mt-1">
                <span className={`badge ${simDifference >= 0 ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger border border-danger'}`}>
                  {simDifference >= 0 ? `+₹${simDifference.toLocaleString()}/mo Additional Savings` : `-₹${Math.abs(simDifference).toLocaleString()}/mo Reduced Savings`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calculation History Table */}
      <div className="finplanner-card p-4" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <FiClock className="text-primary" />
            <h5 className="fw-bold text-light mb-0">Calculation History</h5>
          </div>
          {history.length > 0 && (
            <button className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold d-flex align-items-center gap-1" onClick={clearHistory}>
              <FiTrash2 size={14} /> Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-4" style={{ color: '#cbd5e1' }}>
            <p className="mb-0">No calculation history recorded yet. Perform a calculation above to save entries.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
              <thead>
                <tr className="border-secondary" style={{ color: '#e2e8f0' }}>
                  <th style={{ color: '#f8fafc' }}>Date</th>
                  <th style={{ color: '#f8fafc' }}>Monthly Income</th>
                  <th style={{ color: '#f8fafc' }}>Monthly Expenses</th>
                  <th style={{ color: '#f8fafc' }}>Monthly Savings</th>
                  <th style={{ color: '#f8fafc' }}>Savings Rate (%)</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={row.id}>
                    <td className="small fw-semibold" style={{ color: '#38bdf8' }}>{row.date}</td>
                    <td className="fw-bold text-primary">₹{Number(row.income).toLocaleString()}</td>
                    <td className="fw-bold text-danger">₹{Number(row.expenses).toLocaleString()}</td>
                    <td className="fw-extrabold text-success">₹{Number(row.savings).toLocaleString()}</td>
                    <td>
                      <span className="badge bg-info-subtle text-info border border-info">
                        {row.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
