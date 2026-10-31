import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import CustomTooltip from './CustomTooltip';

export default function NetWorthTrendChart() {
  const data = [
    { month: 'May 2026', NetWorth: 185000 },
    { month: 'Jun 2026', NetWorth: 201000 },
    { month: 'Jul 2026', NetWorth: 216000 },
    { month: 'Aug 2026', NetWorth: 232000 },
    { month: 'Sep 2026', NetWorth: 245000 },
    { month: 'Oct 2026 (Est)', NetWorth: 264200 }
  ];

  return (
    <div className="finplanner-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold text-light mb-0">📈 Net-Worth Growth Trend</h5>
          <small className="text-muted">Total assets minus liabilities trajectory (₹)</small>
        </div>
        <span className="badge bg-success-subtle text-success border border-success">
          +32.4% YTD Growth
        </span>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.45}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="NetWorth" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#nwGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
