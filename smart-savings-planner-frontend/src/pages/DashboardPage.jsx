import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  FiTrendingUp, FiPieChart, FiTarget, FiDollarSign, FiZap, FiPlus,
  FiArrowUpRight, FiLogOut, FiBarChart2, FiCheckCircle, FiAlertTriangle,
  FiClock, FiSearch, FiRefreshCw, FiPercent, FiCreditCard, FiLock, FiCalendar, FiCpu,
  FiShield, FiActivity, FiAward, FiBell
} from 'react-icons/fi';

import IncomeVsExpenseChart from '../components/Charts/IncomeVsExpenseChart';
import SavingsTrendChart from '../components/Charts/SavingsTrendChart';
import ExpenseCategoryChart from '../components/Charts/ExpenseCategoryChart';
import InvestmentAllocationChart from '../components/Charts/InvestmentAllocationChart';
import GoalProgressChart from '../components/Charts/GoalProgressChart';
import PaymentMethodChart from '../components/Charts/PaymentMethodChart';
import NetWorthTrendChart from '../components/Charts/NetWorthTrendChart';
import InvestmentPerformanceChart from '../components/Charts/InvestmentPerformanceChart';
import CustomTooltip from '../components/Charts/CustomTooltip';

import { getDashboardData } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TelemetryModal from '../components/TelemetryModal';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardData();
        if (res.data) setData(res.data);
      } catch (err) {
        setData({
          totalIncome: 65000,
          totalExpenses: 42000,
          monthlySavings: 23000,
          savingsRatePercent: 35.40,
          totalInvestments: 82500,
          activeGoalsCount: 3,
          financialHealthScore: 88
        });
      }
    };
    fetchData();
  }, []);

  // Mini sparkline data for Net Worth Card
  const netWorthSparkline = [
    { m: 'M1', val: 230100 },
    { m: 'M2', val: 235400 },
    { m: 'M3', val: 241000 },
    { m: 'M4', val: 248650 }
  ];

  return (
    <div className="py-4">
      {/* 1. FINANCIAL OVERVIEW CARDS (Net Worth, Available Cash, Monthly Cash Flow) */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold text-light mb-0">FINANCIAL COMMAND OVERVIEW</h5>
        <button
          className="btn p-0 border-0 bg-transparent"
          onClick={() => setShowTelemetryModal(true)}
          title="Click to open Live AI Telemetry & Microservice Monitor"
        >
          <span className="badge bg-primary-subtle text-primary border border-primary px-3 py-1.5" style={{ cursor: 'pointer' }}>
            2026 Telemetry Active 🟢
          </span>
        </button>
      </div>

      {/* Row 1 Telemetry Cards (Net Worth, Financial Health Score, Avg Savings Rate, Milestone Velocity) */}
      <div className="row g-4 mb-4">
        {/* Card 1: Net Worth */}
        <div className="col-lg-3 col-md-6">
          <Link to="/accounts" className="text-decoration-none">
            <div className="finora-card p-3 px-3.5 h-100 d-flex flex-column justify-content-between border-primary" style={{ cursor: 'pointer' }}>
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle p-1">💎</span>
                    <span className="fw-bold text-white text-uppercase" style={{ fontSize: '0.82rem', letterSpacing: '0.05em', color: '#ffffff' }}>NET WORTH</span>
                  </div>
                  <span className="badge bg-success-subtle text-success fw-bold">+8.4% ↑</span>
                </div>
                <h3 className="fw-extrabold text-white mb-1" style={{ color: '#ffffff' }}>₹2,48,650</h3>
                <small className="text-success fw-semibold d-block mb-2">+₹18,500 this month</small>
              </div>
              <div style={{ width: '100%', height: 40 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={netWorthSparkline}>
                    <Area type="monotone" dataKey="val" stroke="#3b82f6" fill="rgba(59, 130, 246, 0.2)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Link>
        </div>

        {/* Card 2: Financial Health Score */}
        <div className="col-lg-3 col-md-6">
          <Link to="/suggestions" className="text-decoration-none">
            <div className="finora-card p-3 px-3.5 h-100 d-flex flex-column justify-content-between border-success" style={{ cursor: 'pointer' }}>
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success-subtle text-success border border-success-subtle p-1">🛡️</span>
                    <span className="fw-bold text-white text-uppercase" style={{ fontSize: '0.82rem', letterSpacing: '0.05em', color: '#ffffff' }}>FINANCIAL HEALTH SCORE</span>
                  </div>
                  <span className="badge bg-success text-dark fw-bold">Grade A+</span>
                </div>
                <div className="d-flex align-items-baseline gap-2 mb-1">
                  <h3 className="fw-extrabold text-white mb-0" style={{ color: '#ffffff' }}>88</h3>
                  <span className="text-white-50 fw-bold" style={{ color: '#e2e8f0' }}>/ 100</span>
                </div>
                <small className="text-white fw-semibold d-block mb-2" style={{ color: '#ffffff' }}>Excellent Stability 🛡️</small>
              </div>
              <div className="progress bg-secondary" style={{ height: '8px' }}>
                <div className="progress-bar bg-success" style={{ width: '88%' }}></div>
              </div>
            </div>
          </Link>
        </div>

        {/* Card 3: Avg Savings Rate */}
        <div className="col-lg-3 col-md-6">
          <Link to="/savings" className="text-decoration-none">
            <div className="finora-card p-3 px-3.5 h-100 d-flex flex-column justify-content-between border-info" style={{ cursor: 'pointer' }}>
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-info-subtle text-info border border-info-subtle p-1">📈</span>
                    <span className="fw-bold text-white text-uppercase" style={{ fontSize: '0.82rem', letterSpacing: '0.05em', color: '#ffffff' }}>AVG SAVINGS RATE</span>
                  </div>
                  <span className="badge bg-info-subtle text-info fw-bold">6-Mo Avg</span>
                </div>
                <h3 className="fw-extrabold text-white mb-1" style={{ color: '#ffffff' }}>38.4%</h3>
                <small className="text-white-50 d-block mb-2" style={{ color: '#e2e8f0' }}>Target: &gt;30.0% (Passed ✅)</small>
              </div>
              <div className="p-2 bg-dark rounded border border-secondary d-flex justify-content-between align-items-center">
                <span className="small text-white-50" style={{ color: '#cbd5e1' }}>Monthly Surplus:</span>
                <span className="fw-bold text-success">+₹24,960</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Card 4: Milestone Velocity */}
        <div className="col-lg-3 col-md-6">
          <Link to="/goals" className="text-decoration-none">
            <div className="finora-card p-3 px-3.5 h-100 d-flex flex-column justify-content-between border-warning" style={{ cursor: 'pointer' }}>
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-warning-subtle text-warning border border-warning-subtle p-1">🚀</span>
                    <span className="fw-bold text-white text-uppercase" style={{ fontSize: '0.82rem', letterSpacing: '0.05em', color: '#ffffff' }}>MILESTONE VELOCITY</span>
                  </div>
                  <span className="badge bg-warning-subtle text-warning fw-bold">1.4x Speed</span>
                </div>
                <h3 className="fw-extrabold text-white mb-1" style={{ color: '#ffffff' }}>1.4x Speed</h3>
                <small className="text-success fw-semibold d-block mb-2">2.4 Months Ahead of Goals 🚀</small>
              </div>
              <div className="p-2 bg-dark rounded border border-secondary d-flex justify-content-between align-items-center">
                <span className="small text-white-50" style={{ color: '#cbd5e1' }}>Active Goals:</span>
                <span className="fw-bold text-white" style={{ color: '#ffffff' }}>3 Goals On Track</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Row 2: Total Balance, Monthly Savings, Monthly Expenses, Goals Progress */}
      <div className="row g-4 mb-4">
        {/* Total Balance */}
        <div className="col-lg-3 col-md-6">
          <Link to="/accounts" className="text-decoration-none">
            <div className="finora-card p-3 px-3.5 h-100 border-primary" style={{ cursor: 'pointer' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold text-white text-uppercase" style={{ fontSize: '0.82rem', color: '#ffffff' }}>💰 TOTAL BALANCE</span>
                <span className="badge bg-primary-subtle text-primary">Liquid</span>
              </div>
              <h3 className="fw-extrabold text-white mb-1" style={{ color: '#ffffff' }}>₹1,24,500</h3>
              <small className="text-white-50" style={{ color: '#cbd5e1' }}>Current bank & cash balance</small>
            </div>
          </Link>
        </div>

        {/* Monthly Savings */}
        <div className="col-lg-3 col-md-6">
          <Link to="/income" className="text-decoration-none">
            <div className="finora-card p-3 px-3.5 h-100 border-success" style={{ cursor: 'pointer' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold text-white text-uppercase" style={{ fontSize: '0.82rem', color: '#ffffff' }}>📈 MONTHLY SAVINGS</span>
                <span className="badge bg-success-subtle text-success">Income − Expenses</span>
              </div>
              <h3 className="fw-extrabold text-success mb-1">+₹23,000</h3>
              <small className="text-white-50" style={{ color: '#cbd5e1' }}>Net monthly surplus saved</small>
            </div>
          </Link>
        </div>

        {/* Monthly Expenses */}
        <div className="col-lg-3 col-md-6">
          <Link to="/expenses" className="text-decoration-none">
            <div className="finora-card p-3 px-3.5 h-100 border-danger" style={{ cursor: 'pointer' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold text-white text-uppercase" style={{ fontSize: '0.82rem', color: '#ffffff' }}>💸 MONTHLY EXPENSES</span>
                <span className="badge bg-danger-subtle text-danger">Spent This Month</span>
              </div>
              <h3 className="fw-extrabold text-danger mb-1">₹42,000</h3>
              <small className="text-white-50" style={{ color: '#cbd5e1' }}>Total categorized spending</small>
            </div>
          </Link>
        </div>

        {/* Goals Progress */}
        <div className="col-lg-3 col-md-6">
          <Link to="/goals" className="text-decoration-none">
            <div className="finora-card p-3 px-3.5 h-100 border-warning" style={{ cursor: 'pointer' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold text-white text-uppercase" style={{ fontSize: '0.82rem', color: '#ffffff' }}>🎯 GOALS PROGRESS</span>
                <span className="badge bg-warning-subtle text-warning">Overall Target</span>
              </div>
              <h3 className="fw-extrabold text-warning mb-1">68%</h3>
              <small className="text-white-50" style={{ color: '#cbd5e1' }}>Overall percentage completed</small>
            </div>
          </Link>
        </div>
      </div>

      {/* 2. PERSONALIZED AI ADVISORY & STRATEGIC INSIGHTS */}
      <div className="finora-card p-4 border-primary mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2.5 bg-primary text-white rounded-circle shadow flex-shrink-0">
              <FiCpu size={26} />
            </div>
            <div>
              <h5 className="fw-bold text-white mb-0" style={{ color: '#ffffff' }}>PERSONALIZED AI ADVISORY & INSIGHTS</h5>
              <small className="text-white-50" style={{ color: '#e2e8f0' }}>Real-time autonomous recommendations synthesized by Finora AI Engine</small>
            </div>
          </div>
          <span className="badge bg-primary-subtle text-primary border border-primary px-3 py-1.5 fw-bold">
            Live AI Telemetry
          </span>
        </div>

        <div className="row g-3">
          {/* Advisory 1 */}
          <div className="col-md-4">
            <div className="p-3 bg-dark rounded-3 border border-secondary h-100">
              <div className="d-flex align-items-center gap-2 mb-2 text-warning">
                <FiZap size={20} />
                <strong className="text-white" style={{ color: '#ffffff' }}>💡 Savings Optimization</strong>
              </div>
              <p className="text-white-50 small mb-2" style={{ lineHeight: '1.5', color: '#cbd5e1' }}>
                Shift ₹5,000 idle bank cash into a High-Yield Liquid Fund to generate an additional <strong className="text-white" style={{ color: '#ffffff' }}>+₹3,500/year</strong> in risk-free yield.
              </p>
              <span className="badge bg-warning-subtle text-warning" style={{ fontSize: '0.7rem' }}>Actionable Step</span>
            </div>
          </div>

          {/* Advisory 2 */}
          <div className="col-md-4">
            <div className="p-3 bg-dark rounded-3 border border-secondary h-100">
              <div className="d-flex align-items-center gap-2 mb-2 text-danger">
                <FiAlertTriangle size={20} />
                <strong className="text-white" style={{ color: '#ffffff' }}>⚠️ Category Overspend Alert</strong>
              </div>
              <p className="text-white-50 small mb-2" style={{ lineHeight: '1.5', color: '#cbd5e1' }}>
                Food & Dining spending is <strong className="text-white" style={{ color: '#ffffff' }}>18% higher</strong> than last month. Capping weekend dining out will protect your M3 MacBook Air Goal target date.
              </p>
              <span className="badge bg-danger-subtle text-danger" style={{ fontSize: '0.7rem' }}>Budget Alert</span>
            </div>
          </div>

          {/* Advisory 3 */}
          <div className="col-md-4">
            <div className="p-3 bg-dark rounded-3 border border-secondary h-100">
              <div className="d-flex align-items-center gap-2 mb-2 text-success">
                <FiTrendingUp size={20} />
                <strong className="text-white" style={{ color: '#ffffff' }}>🔮 End-of-Month Projection</strong>
              </div>
              <p className="text-white-50 small mb-2" style={{ lineHeight: '1.5', color: '#cbd5e1' }}>
                Based on current velocity, your projected net balance by Oct 31 will reach <strong className="text-white" style={{ color: '#ffffff' }}>₹2,54,800 (+₹6,150 growth)</strong>.
              </p>
              <span className="badge bg-success-subtle text-success" style={{ fontSize: '0.7rem' }}>Positive Velocity</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 NOTIFICATION CENTER & LIVE ALERTS CARD */}
      <div className="finora-card p-4 border-info mb-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}>
        <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2.5 rounded-circle shadow flex-shrink-0 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(245, 158, 11, 0.25)', border: '1.5px solid #f59e0b', color: '#fbbf24', width: '48px', height: '48px' }}>
              <FiBell size={24} />
            </div>
            <div>
              <h5 className="fw-bold text-white mb-0" style={{ color: '#ffffff' }}>NOTIFICATION CENTER & RECENT ALERTS</h5>
              <small className="text-white-50" style={{ color: '#e2e8f0' }}>Live telemetry notifications, payment reminders, and milestone alerts</small>
            </div>
          </div>
          <Link to="/notifications" className="btn btn-outline-info btn-sm rounded-pill px-3 fw-bold">
            View All Notifications 🔔
          </Link>
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <div className="p-3 bg-dark rounded-3 border border-secondary h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="badge bg-info bg-opacity-25 text-info border border-info px-2 py-1 fw-bold">🎯 Goal Alert</span>
                  <small className="text-info fw-semibold">15m ago</small>
                </div>
                <h6 className="fw-bold text-white mb-1" style={{ color: '#ffffff' }}>Emergency Reserve Milestone</h6>
                <p className="text-white-50 small mb-2" style={{ color: '#cbd5e1' }}>Fund crossed 60% completion (+₹15,000 added).</p>
              </div>
              <Link to="/goals" className="small text-info fw-bold text-decoration-none">View Goal Target →</Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-3 bg-dark rounded-3 border border-secondary h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="badge bg-warning bg-opacity-25 text-warning border border-warning px-2 py-1 fw-bold">⏰ Reminder</span>
                  <small className="text-warning fw-semibold">2h ago</small>
                </div>
                <h6 className="fw-bold text-white mb-1" style={{ color: '#ffffff' }}>Housing Rent Due Soon</h6>
                <p className="text-white-50 small mb-2" style={{ color: '#cbd5e1' }}>Apartment Rent ₹12,000 due in 5 days.</p>
              </div>
              <Link to="/calendar" className="small text-warning fw-bold text-decoration-none">Open Calendar →</Link>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-3 bg-dark rounded-3 border border-secondary h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="badge bg-danger bg-opacity-25 text-danger border border-danger px-2 py-1 fw-bold">🤖 AI Risk Alert</span>
                  <small className="text-danger fw-semibold">4h ago</small>
                </div>
                <h6 className="fw-bold text-white mb-1" style={{ color: '#ffffff' }}>Shopping Expense Spike</h6>
                <p className="text-white-50 small mb-2" style={{ color: '#cbd5e1' }}>Weekly shopping spiked +28% (₹7,560 spent).</p>
              </div>
              <Link to="/suggestions" className="small text-danger fw-bold text-decoration-none">Inspect AI Risk →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MONEY FLOW & SPENDING RADAR */}
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <IncomeVsExpenseChart income={65000} expenses={42000} savings={23000} />
        </div>

        <div className="col-lg-5">
          <div className="finora-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-white mb-0" style={{ color: '#ffffff' }}>SPENDING RADAR</h5>
              <span className="badge bg-secondary-subtle text-light border border-secondary">Distribution</span>
            </div>

            <div className="d-flex flex-column gap-3">
              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-white fw-bold small" style={{ color: '#ffffff' }}>🍔 Food & Dining</span>
                  <span className="text-warning small fw-bold">24% (₹10,080)</span>
                </div>
                <div className="progress bg-secondary" style={{ height: '8px' }}>
                  <div className="progress-bar bg-warning" style={{ width: '24%' }}></div>
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-white fw-bold small" style={{ color: '#ffffff' }}>🛍️ Shopping & Apparel</span>
                  <span className="text-info small fw-bold">18% (₹7,560)</span>
                </div>
                <div className="progress bg-secondary" style={{ height: '8px' }}>
                  <div className="progress-bar bg-info" style={{ width: '18%' }}></div>
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-white fw-bold small" style={{ color: '#ffffff' }}>🚗 Travel & Transit</span>
                  <span className="text-success small fw-bold">12% (₹5,040)</span>
                </div>
                <div className="progress bg-secondary" style={{ height: '8px' }}>
                  <div className="progress-bar bg-success" style={{ width: '12%' }}></div>
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-white fw-bold small" style={{ color: '#ffffff' }}>💡 Housing & Utilities</span>
                  <span className="text-danger small fw-bold">10% (₹4,200)</span>
                </div>
                <div className="progress bg-secondary" style={{ height: '8px' }}>
                  <div className="progress-bar bg-danger" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. GOAL TRACKER (FINANCIAL GOALS) */}
      <div className="finora-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-white mb-0" style={{ color: '#ffffff' }}>🎯 GOAL TRACKER & FINANCIAL TARGETS</h5>
          <Link to="/goals" className="btn btn-outline-primary btn-sm rounded-pill">Manage Goals</Link>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="p-3 bg-dark rounded border border-secondary">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-bold text-light">💻 M3 MacBook Air Laptop</span>
                <span className="badge bg-success-subtle text-success fw-bold">82% Completed</span>
              </div>
              <div className="d-flex justify-content-between my-2">
                <span className="fw-extrabold text-success">₹65,600 / ₹80,000</span>
                <small className="text-muted">Target: Oct 2026</small>
              </div>
              <div className="progress bg-secondary" style={{ height: '10px' }}>
                <div className="progress-bar bg-success" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-3 bg-dark rounded border border-secondary">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-bold text-light">🛡️ Emergency Reserve Fund</span>
                <span className="badge bg-primary-subtle text-primary fw-bold">54% Completed</span>
              </div>
              <div className="d-flex justify-content-between my-2">
                <span className="fw-extrabold text-primary">₹54,000 / ₹1,00,000</span>
                <small className="text-muted">Target: Dec 2026</small>
              </div>
              <div className="progress bg-secondary" style={{ height: '10px' }}>
                <div className="progress-bar bg-primary" style={{ width: '54%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. MODERN CHARTS GRID */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <FiBarChart2 size={24} className="text-primary" />
        <h5 className="fw-bold text-light mb-0">ANALYTICAL VISUALIZATIONS</h5>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <NetWorthTrendChart />
        </div>
        <div className="col-lg-6">
          <InvestmentPerformanceChart />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <ExpenseCategoryChart />
        </div>
        <div className="col-lg-4">
          <InvestmentAllocationChart />
        </div>
        <div className="col-lg-4">
          <PaymentMethodChart />
        </div>
      </div>

      {/* AI Telemetry Monitor Modal */}
      <TelemetryModal isOpen={showTelemetryModal} onClose={() => setShowTelemetryModal(false)} />
    </div>
  );
}

