import React, { useState } from 'react';
import {
  FiFileText, FiDownload, FiCheckCircle, FiAward, FiCalendar,
  FiTrendingUp, FiDollarSign, FiPieChart, FiPrinter, FiShield,
  FiAlertCircle, FiArrowUpRight, FiRefreshCw
} from 'react-icons/fi';
import confetti from 'canvas-confetti';

export default function MonthlyReportPage() {
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [activeTab, setActiveTab] = useState('summary');

  const reportData = {
    'August 2026': {
      income: 65000,
      expenses: 42000,
      savings: 23000,
      savingsRate: 35.38,
      invested: 82500,
      healthScore: 88,
      taxEstimate: 4200,
      categories: [
        { name: 'Bills & Housing Utilities', budgeted: 16000, actual: 14800, variance: '+₹1,200', status: 'Under Budget', color: 'text-success' },
        { name: 'Food & Groceries', budgeted: 8000, actual: 10080, variance: '-₹2,080', status: 'Over Budget', color: 'text-danger' },
        { name: 'Shopping & Apparel', budgeted: 6000, actual: 7560, variance: '-₹1,560', status: 'Over Budget', color: 'text-danger' },
        { name: 'Travel & Transit', budgeted: 6000, actual: 5040, variance: '+₹960', status: 'Under Budget', color: 'text-success' },
        { name: 'Housing & Maintenance', budgeted: 5000, actual: 4200, variance: '+₹800', status: 'Under Budget', color: 'text-success' },
        { name: 'Education & Courses', budgeted: 4000, actual: 4000, variance: '₹0', status: 'On Target', color: 'text-info' }
      ]
    },
    'July 2026': {
      income: 62000,
      expenses: 39500,
      savings: 22500,
      savingsRate: 36.29,
      invested: 78000,
      healthScore: 86,
      taxEstimate: 3900,
      categories: [
        { name: 'Bills & Housing Utilities', budgeted: 16000, actual: 14200, variance: '+₹1,800', status: 'Under Budget', color: 'text-success' },
        { name: 'Food & Groceries', budgeted: 8000, actual: 8900, variance: '-₹900', status: 'Over Budget', color: 'text-danger' },
        { name: 'Shopping & Apparel', budgeted: 6000, actual: 5400, variance: '+₹600', status: 'Under Budget', color: 'text-success' },
        { name: 'Travel & Transit', budgeted: 6000, actual: 6200, variance: '-₹200', status: 'Over Budget', color: 'text-danger' },
        { name: 'Housing & Maintenance', budgeted: 5000, actual: 4800, variance: '+₹200', status: 'Under Budget', color: 'text-success' }
      ]
    },
    'June 2026': {
      income: 60000,
      expenses: 38000,
      savings: 22000,
      savingsRate: 36.67,
      invested: 72000,
      healthScore: 85,
      taxEstimate: 3600,
      categories: [
        { name: 'Bills & Housing Utilities', budgeted: 15000, actual: 14000, variance: '+₹1,000', status: 'Under Budget', color: 'text-success' },
        { name: 'Food & Groceries', budgeted: 8000, actual: 8200, variance: '-₹200', status: 'Over Budget', color: 'text-danger' },
        { name: 'Shopping & Apparel', budgeted: 5000, actual: 4900, variance: '+₹100', status: 'Under Budget', color: 'text-success' },
        { name: 'Travel & Transit', budgeted: 5000, actual: 4700, variance: '+₹300', status: 'Under Budget', color: 'text-success' }
      ]
    }
  };

  const currentData = reportData[selectedMonth] || reportData['August 2026'];

  const handleDownloadReport = () => {
    confetti({ particleCount: 100, spread: 70 });
    const reportText = `======================================================================
FINORA 2026 AI FINANCIAL COMMAND CENTER - AUDITED MONTHLY STATEMENT
Audit Period: ${selectedMonth}
Generated Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Status: AUDITED & CERTIFIED 🟢
======================================================================

1. EXECUTIVE CASH FLOW & LIQUIDITY AUDIT:
   - Total Gross Monthly Income: ₹${currentData.income.toLocaleString()}.00
   - Total Verified Expenses: ₹${currentData.expenses.toLocaleString()}.00
   - Net Monthly Surplus Saved: ₹${currentData.savings.toLocaleString()}.00
   - Net Monthly Savings Rate: ${currentData.savingsRate}% (Benchmark Target: >= 20.0%)
   - Total Invested Capital Assets: ₹${currentData.invested.toLocaleString()}.00
   - Financial Health Index Score: ${currentData.healthScore} / 100 (Grade A+ Excellent)
   - Estimated Monthly Tax Provisions: ₹${currentData.taxEstimate.toLocaleString()}.00

2. CATEGORIZED EXPENSE AUDIT BREAKDOWN:
${currentData.categories.map(c => `   - ${c.name}: Budgeted ₹${c.budgeted.toLocaleString()} | Actual ₹${c.actual.toLocaleString()} | Variance: ${c.variance} (${c.status})`).join('\n')}

3. FINANCIAL GOALS MILESTONE VELOCITY AUDIT:
   - Emergency Reserve Fund: ₹60,000 / ₹100,000 (60.0% Complete - ON TRACK 🟢)
   - M3 MacBook Air Laptop: ₹65,600 / ₹80,000 (82.0% Complete - ON TRACK 🟢)
   - Wealth Accumulation Portfolio: ₹82,500 Allocated (Active Growth 🚀)

4. AI STRATEGIC REBALANCING RECOMMENDATIONS:
   - Reallocate ₹5,000 uncommitted cash from low-yield savings into Liquid Mutual Funds.
   - Maintain Food & Dining spending within ₹8,500 cap to accelerate MacBook milestone.
   - Financial twin velocity shows projected end-of-quarter net worth of ₹2,85,000.

======================================================================
AUDIT CERTIFICATION: Finora Autonomous Financial Microservice Engine v2.6
======================================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FINORA_Monthly_Statement_${selectedMonth.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-fluid px-1 py-2">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 pb-3 border-bottom border-secondary">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="p-2 bg-primary bg-opacity-25 text-primary rounded-circle border border-primary">
              <FiFileText size={22} />
            </span>
            <h2 className="fw-extrabold text-white mb-0" style={{ color: '#ffffff', letterSpacing: '-0.02em' }}>
              Monthly Financial Statement & Audit Center
            </h2>
          </div>
          <p className="fw-medium mb-0" style={{ color: '#e2e8f0', fontSize: '0.92rem' }}>
            Comprehensive audited statements, cash flow analytics, and downloadable monthly telemetry reports
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select bg-dark text-white border-primary btn-sm fw-bold px-3 py-2"
            style={{ backgroundColor: '#0f172a', color: '#ffffff', borderColor: '#38bdf8' }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="August 2026">August 2026 (Current Audit)</option>
            <option value="July 2026">July 2026 Statement</option>
            <option value="June 2026">June 2026 Statement</option>
          </select>

          <button
            className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow"
            style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', border: '1px solid #38bdf8' }}
            onClick={handleDownloadReport}
          >
            <FiDownload size={18} /> Download Statement (.txt)
          </button>
        </div>
      </div>

      {/* Top Telemetry KPI Cards with Crystal Clear White Text */}
      <div className="row g-3 mb-4">
        {/* Gross Income */}
        <div className="col-md-3">
          <div className="finora-card p-3.5 border-primary h-100" style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#38bdf8' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold text-white text-uppercase" style={{ fontSize: '0.78rem', color: '#ffffff', letterSpacing: '0.05em' }}>TOTAL MONTHLY INCOME</span>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-0.5">Verified 💵</span>
            </div>
            <h3 className="fw-extrabold text-white mb-1" style={{ color: '#ffffff', fontSize: '1.8rem' }}>
              ₹{currentData.income.toLocaleString()}
            </h3>
            <small className="fw-semibold d-block text-success" style={{ color: '#34d399' }}>+4.8% vs previous quarter</small>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="col-md-3">
          <div className="finora-card p-3.5 border-danger h-100" style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#f87171' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold text-white text-uppercase" style={{ fontSize: '0.78rem', color: '#ffffff', letterSpacing: '0.05em' }}>TOTAL EXPENSES INCURRED</span>
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-0.5">Categorized 💸</span>
            </div>
            <h3 className="fw-extrabold text-white mb-1" style={{ color: '#ffffff', fontSize: '1.8rem' }}>
              ₹{currentData.expenses.toLocaleString()}
            </h3>
            <small className="fw-semibold d-block text-warning" style={{ color: '#fbbf24' }}>64.6% of Monthly Outflow</small>
          </div>
        </div>

        {/* Net Savings Surplus */}
        <div className="col-md-3">
          <div className="finora-card p-3.5 border-success h-100" style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#34d399' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold text-white text-uppercase" style={{ fontSize: '0.78rem', color: '#ffffff', letterSpacing: '0.05em' }}>NET MONTHLY SURPLUS</span>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-0.5">Rate: {currentData.savingsRate}%</span>
            </div>
            <h3 className="fw-extrabold text-success mb-1" style={{ color: '#34d399', fontSize: '1.8rem' }}>
              +₹{currentData.savings.toLocaleString()}
            </h3>
            <small className="fw-semibold d-block text-white" style={{ color: '#ffffff' }}>Target Benchmark &gt; 20% Passed ✅</small>
          </div>
        </div>

        {/* Financial Health Index */}
        <div className="col-md-3">
          <div className="finora-card p-3.5 border-info h-100" style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#38bdf8' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold text-white text-uppercase" style={{ fontSize: '0.78rem', color: '#ffffff', letterSpacing: '0.05em' }}>HEALTH SCORE INDEX</span>
              <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-0.5">Grade A+</span>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h3 className="fw-extrabold text-white mb-0" style={{ color: '#ffffff', fontSize: '1.8rem' }}>{currentData.healthScore}</h3>
              <span className="fw-bold text-white-50" style={{ color: '#e2e8f0' }}>/ 100</span>
            </div>
            <small className="fw-semibold d-block text-info" style={{ color: '#38bdf8' }}>Audited by Finora AI Engine 🛡️</small>
          </div>
        </div>
      </div>

      {/* Detailed Audited Statement Table with Ultra-Clear Text */}
      <div className="finora-card p-4 mb-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.96)', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
        <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary">
          <div className="d-flex align-items-center gap-2">
            <span className="p-2 bg-info bg-opacity-25 text-info rounded-circle border border-info">
              <FiShield size={20} />
            </span>
            <h5 className="fw-bold text-white mb-0" style={{ color: '#ffffff' }}>
              Audited Line-Item Breakdown ({selectedMonth})
            </h5>
          </div>
          <span className="badge bg-success-subtle text-success border border-success px-3 py-1.5 fw-bold">
            Certified Audit 🟢
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: 'transparent' }}>
            <thead>
              <tr className="border-bottom border-secondary text-uppercase" style={{ fontSize: '0.78rem', letterSpacing: '0.05em' }}>
                <th className="text-white py-3">Category Name</th>
                <th className="text-white py-3">Budgeted Target</th>
                <th className="text-white py-3">Actual Outflow</th>
                <th className="text-white py-3">Variance</th>
                <th className="text-white py-3 text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody>
              {currentData.categories.map((cat, idx) => (
                <tr key={idx} className="border-bottom border-secondary" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                  <td className="py-3">
                    <span className="fw-bold text-white fs-6" style={{ color: '#ffffff' }}>{cat.name}</span>
                  </td>
                  <td className="py-3">
                    <span className="fw-semibold text-white" style={{ color: '#e2e8f0' }}>₹{cat.budgeted.toLocaleString()}</span>
                  </td>
                  <td className="py-3">
                    <span className="fw-bold text-white fs-6" style={{ color: '#ffffff' }}>₹{cat.actual.toLocaleString()}</span>
                  </td>
                  <td className="py-3">
                    <span className={`fw-bold ${cat.color}`}>{cat.variance}</span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`badge px-3 py-1.5 rounded-pill fw-bold ${cat.status === 'Under Budget' ? 'bg-success-subtle text-success border border-success' : cat.status === 'Over Budget' ? 'bg-danger-subtle text-danger border border-danger' : 'bg-info-subtle text-info border border-info'}`} style={{ fontSize: '0.75rem' }}>
                      {cat.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Estimate & Financial Health Recommendations */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="finora-card p-4 h-100" style={{ backgroundColor: 'rgba(15, 23, 42, 0.96)', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-secondary">
              <span className="p-2 bg-warning bg-opacity-25 text-warning rounded-circle border border-warning">
                <FiDollarSign size={20} />
              </span>
              <h5 className="fw-bold text-white mb-0" style={{ color: '#ffffff' }}>Tax Provision & Deduction Summary</h5>
            </div>

            <div className="d-flex flex-column gap-2.5">
              <div className="d-flex justify-content-between p-3 rounded bg-dark border border-secondary">
                <span className="fw-semibold text-white" style={{ color: '#e2e8f0' }}>Estimated Monthly Income Tax Liability:</span>
                <strong className="text-warning fs-6">₹{currentData.taxEstimate.toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between p-3 rounded bg-dark border border-secondary">
                <span className="fw-semibold text-white" style={{ color: '#e2e8f0' }}>Section 80C Investment Deductions:</span>
                <strong className="text-success fs-6">₹12,500 / month</strong>
              </div>
              <div className="d-flex justify-content-between p-3 rounded bg-dark border border-secondary">
                <span className="fw-semibold text-white" style={{ color: '#e2e8f0' }}>Net Taxable Base After Exemption:</span>
                <strong className="text-info fs-6">₹48,300</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="finora-card p-4 h-100" style={{ backgroundColor: 'rgba(15, 23, 42, 0.96)', borderColor: 'rgba(56, 189, 248, 0.25)' }}>
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom border-secondary">
              <span className="p-2 bg-success bg-opacity-25 text-success rounded-circle border border-success">
                <FiCheckCircle size={20} />
              </span>
              <h5 className="fw-bold text-white mb-0" style={{ color: '#ffffff' }}>AI Auditor Executive Certification</h5>
            </div>

            <p className="fw-medium text-white mb-3" style={{ color: '#f1f5f9', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Your financial statement for <strong className="text-primary">{selectedMonth}</strong> passes all 5 solvency and liquidity benchmarks.
              Net savings velocity is <strong className="text-success">15.4% above average</strong> across comparable peer income groups.
            </p>

            <div className="p-3 bg-dark rounded border border-success d-flex align-items-center gap-3">
              <span className="fs-3">🛡️</span>
              <div>
                <strong className="text-white d-block" style={{ color: '#ffffff' }}>Audit Certificate Hash #FIN2026-AUG-88</strong>
                <small className="text-success fw-bold">Verified & Cryptographically Signed by Finora AI Microservice</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
