import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import CustomTooltip from './CustomTooltip';

export default function InvestmentPerformanceChart() {
  const data = [
    { month: 'May', Invested: 60000, PortfolioValue: 62000 },
    { month: 'Jun', Invested: 65000, PortfolioValue: 68500 },
    { month: 'Jul', Invested: 70000, PortfolioValue: 74200 },
    { month: 'Aug', Invested: 72000, PortfolioValue: 78000 },
    { month: 'Sep', Invested: 75000, PortfolioValue: 82500 }
  ];

  return (
    <div className="finplanner-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold text-light mb-0">📈 Investment Performance</h5>
          <small className="text-muted">Invested Capital vs Portfolio Valuation (₹)</small>
        </div>
        <span className="badge bg-success-subtle text-success border border-success">
          +10.0% Gain (+₹7,500)
        </span>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="Invested" stroke="#9ca3af" strokeWidth={2} strokeDasharray="4 4" name="Capital Invested" />
            <Line type="monotone" dataKey="PortfolioValue" stroke="#10b981" strokeWidth={3} name="Portfolio Valuation" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
