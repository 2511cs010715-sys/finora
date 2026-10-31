import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function InvestmentAllocationChart({ investments = [] }) {
  const typeMap = {};
  if (investments && investments.length > 0) {
    investments.forEach(i => {
      const type = i.investmentType || 'Other';
      const amt = Number(i.investedAmount || 0);
      typeMap[type] = (typeMap[type] || 0) + amt;
    });
  } else {
    typeMap['Mutual Funds'] = 30000;
    typeMap['Stocks'] = 25000;
    typeMap['Fixed Deposits'] = 15000;
    typeMap['Gold'] = 5000;
  }

  const data = Object.keys(typeMap).map(type => ({
    name: type,
    value: typeMap[type]
  }));

  return (
    <div className="finplanner-card p-4">
      <h5 className="fw-bold text-light mb-1">Investment Asset Allocation</h5>
      <p className="text-muted small mb-3">Portfolio breakdown by asset class</p>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="#0f172a"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
