import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function PortfolioAllocationChart({ items = [] }) {
  if (!items || items.length === 0) {
    return (
      <div className="finverse-card p-4 text-center text-muted">
        No positions in portfolio. Add assets to view allocation breakdown.
      </div>
    );
  }

  const data = items.map(item => ({
    name: item.asset?.symbol || item.symbol || 'Asset',
    value: Number(item.currentValue || (item.quantity * item.purchasePrice) || 100)
  }));

  return (
    <div className="finverse-card p-4">
      <h5 className="fw-bold text-light mb-1">Portfolio Asset Allocation</h5>
      <p className="text-muted small mb-3">Breakdown by current asset valuation</p>

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
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Valuation']}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
