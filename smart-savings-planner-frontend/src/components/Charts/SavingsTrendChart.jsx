import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import CustomTooltip from './CustomTooltip';

export default function SavingsTrendChart() {
  const data = [
    { month: 'Mar', savings: 14000, rate: 29.1 },
    { month: 'Apr', savings: 16000, rate: 33.3 },
    { month: 'May', savings: 17000, rate: 35.4 },
    { month: 'Jun', savings: 18500, rate: 38.5 },
    { month: 'Jul', savings: 18000, rate: 36.0 },
    { month: 'Aug', savings: 19200, rate: 38.4 }
  ];

  return (
    <div className="finplanner-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold text-light mb-0">Savings Trend & Growth</h5>
          <small className="text-muted">Monthly savings trajectory (₹)</small>
        </div>
        <span className="badge bg-success-subtle text-success border border-success">
          38.4% Savings Rate
        </span>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.45}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#savingsGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
