import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip';

export default function IncomeVsExpenseChart({ income = 50000, expenses = 30800, savings = 19200 }) {
  const data = [
    { month: 'May 2026', Income: 48000, Expenses: 31000, Savings: 17000 },
    { month: 'Jun 2026', Income: 48000, Expenses: 29500, Savings: 18500 },
    { month: 'Jul 2026', Income: 50000, Expenses: 32000, Savings: 18000 },
    { month: 'Aug 2026 (Current)', Income: Number(income), Expenses: Number(expenses), Savings: Number(savings) }
  ];

  return (
    <div className="finplanner-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold text-light mb-0">Income vs Expense Comparison</h5>
          <small className="text-muted">Monthly financial flow tracking</small>
        </div>
        <span className="badge bg-primary-subtle text-primary border border-primary">
          Monthly Telemetry
        </span>
      </div>

      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
            <Legend />
            <Bar dataKey="Income" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Savings" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
