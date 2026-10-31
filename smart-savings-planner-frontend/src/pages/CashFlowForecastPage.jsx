import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FiTrendingUp, FiZap, FiInfo } from 'react-icons/fi';
import CustomTooltip from '../components/Charts/CustomTooltip';

export default function CashFlowForecastPage() {
  const forecastData = [
    { month: 'Oct 2026', Income: 50000, Expenses: 30800, NetSurplus: 19200, CumulativeSavings: 19200 },
    { month: 'Nov 2026', Income: 50000, Expenses: 29500, NetSurplus: 20500, CumulativeSavings: 39700 },
    { month: 'Dec 2026', Income: 52000, Expenses: 33000, NetSurplus: 19000, CumulativeSavings: 58700 },
    { month: 'Jan 2027', Income: 55000, Expenses: 31000, NetSurplus: 24000, CumulativeSavings: 82700 },
    { month: 'Feb 2027', Income: 55000, Expenses: 30000, NetSurplus: 25000, CumulativeSavings: 107700 },
    { month: 'Mar 2027', Income: 55000, Expenses: 30500, NetSurplus: 24500, CumulativeSavings: 132200 }
  ];

  return (
    <div className="container-fluid px-1 py-2">
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 text-info mb-1">
          <div className="p-2 bg-info-subtle text-info rounded-3">
            <FiTrendingUp size={24} />
          </div>
          <h2 className="fw-bold text-light mb-0">6-Month Cash-Flow Forecast</h2>
        </div>
        <p className="small mb-0" style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>
          Predictive projection of income, recurring expense trajectory, and cumulative wealth accumulation.
        </p>
      </div>

      <div className="finplanner-card p-4 p-md-5 mb-4 border-info" style={{ backgroundColor: '#0b0f19' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-light mb-0">Projected Cumulative Savings Trajectory (Oct 2026 – Mar 2027)</h5>
          <span className="badge bg-info-subtle text-info border border-info">
            🔮 ML Projected Growth
          </span>
        </div>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="CumulativeSavings" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#forecastGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="finplanner-card p-4" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.12)' }}>
            <small className="fw-semibold" style={{ color: '#e2e8f0' }}>Projected 6-Month Surplus</small>
            <h2 className="fw-extrabold text-success mt-1 mb-0">₹132,200</h2>
            <small className="d-block mt-2" style={{ color: '#cbd5e1' }}>Cumulative net wealth growth</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="finplanner-card p-4" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.12)' }}>
            <small className="fw-semibold" style={{ color: '#e2e8f0' }}>Avg Expected Monthly Savings</small>
            <h2 className="fw-extrabold text-info mt-1 mb-0">₹22,033 / mo</h2>
            <small className="d-block mt-2" style={{ color: '#cbd5e1' }}>Projected 40.1% Savings Rate</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="finplanner-card p-4" style={{ backgroundColor: '#0b0f19', border: '1px solid rgba(255,255,255,0.12)' }}>
            <small className="fw-semibold" style={{ color: '#e2e8f0' }}>Emergency Fund Target Completion</small>
            <h2 className="fw-extrabold text-warning mt-1 mb-0">Nov 2026</h2>
            <small className="d-block mt-2" style={{ color: '#cbd5e1' }}>Achieved 30 days early</small>
          </div>
        </div>
      </div>
    </div>
  );
}
