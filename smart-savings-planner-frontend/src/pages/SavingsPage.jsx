import React, { useState, useEffect } from 'react';
import { FiZap, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import SavingsTrendChart from '../components/Charts/SavingsTrendChart';
import { getDashboardData } from '../services/api';

export default function SavingsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardData();
        if (res.data) setData(res.data);
      } catch (err) {
        setData({
          totalIncome: 50000,
          totalExpenses: 30800,
          monthlySavings: 19200,
          savingsRatePercent: 38.40
        });
      }
    };
    fetchData();
  }, []);

  const income = data?.totalIncome || 50000;
  const expenses = data?.totalExpenses || 30800;
  const savings = income - expenses;
  const rate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;

  return (
    <div className="container-fluid px-1 py-2">
      <div className="mb-4">
        <h2 className="fw-bold text-light mb-1">Monthly Savings Calculator & History</h2>
        <p className="text-muted small">Automated savings calculation: <code>Monthly Savings = Total Income - Total Expenses</code></p>
      </div>

      {/* Main Formula Result Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="finora-card p-4 text-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}>
            <small className="fw-bold text-uppercase d-block mb-1" style={{ color: '#38bdf8', letterSpacing: '0.04em' }}>Total Monthly Income</small>
            <h3 className="fw-extrabold text-white mt-1 mb-0" style={{ color: '#ffffff' }}>₹{income.toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="finora-card p-4 text-center" style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}>
            <small className="fw-bold text-uppercase d-block mb-1" style={{ color: '#f87171', letterSpacing: '0.04em' }}>Total Monthly Expenses</small>
            <h3 className="fw-extrabold text-white mt-1 mb-0" style={{ color: '#ffffff' }}>₹{expenses.toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="finora-card p-4 text-center border-success" style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}>
            <small className="fw-bold text-uppercase d-block mb-1" style={{ color: '#34d399', letterSpacing: '0.04em' }}>Net Monthly Savings</small>
            <h3 className="fw-extrabold text-white mt-1 mb-0" style={{ color: '#ffffff' }}>₹{savings.toLocaleString()}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="finora-card p-4 text-center border-info" style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}>
            <small className="fw-bold text-uppercase d-block mb-1" style={{ color: '#c084fc', letterSpacing: '0.04em' }}>Savings Rate (%)</small>
            <h3 className="fw-extrabold text-white mt-1 mb-0" style={{ color: '#ffffff' }}>{rate}%</h3>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <SavingsTrendChart />
      </div>

      <div className="finplanner-card p-4">
        <h5 className="fw-bold text-light mb-3">Savings Benchmark Guidelines</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="p-3 bg-dark rounded border border-secondary">
              <span className="fw-bold text-success">🟢 50/30/20 Rule Compliant</span>
              <p className="small text-muted mb-0 mt-1">Allocating &gt;20% of monthly income towards long-term savings & investments.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 bg-dark rounded border border-secondary">
              <span className="fw-bold text-info">💡 Emergency Fund Ratio</span>
              <p className="small text-muted mb-0 mt-1">Recommended liquid cash reserve: 3x to 6x of monthly living expenses.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 bg-dark rounded border border-secondary">
              <span className="fw-bold text-warning">⚡ Automatic Transfers</span>
              <p className="small text-muted mb-0 mt-1">Schedule automatic monthly SIP / goal contributions on payday.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
