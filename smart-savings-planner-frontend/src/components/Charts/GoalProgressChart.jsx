import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import CustomTooltip from './CustomTooltip';

export default function GoalProgressChart({ goals = [] }) {
  const data = (goals && goals.length > 0 ? goals : [
    { goalName: 'Emergency Fund', targetAmount: 100000, currentAmount: 60000 },
    { goalName: 'Laptop Upgrade', targetAmount: 95000, currentAmount: 45000 },
    { goalName: 'Vacation Trip', targetAmount: 35000, currentAmount: 15000 }
  ]).map(g => ({
    name: g.goalName,
    Saved: Number(g.currentAmount || 0),
    Target: Number(g.targetAmount || 100)
  }));

  return (
    <div className="finplanner-card p-4">
      <h5 className="fw-bold text-light mb-1">Savings Goal Completion</h5>
      <p className="text-muted small mb-3">Saved vs Target Goal Progress (₹)</p>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis type="number" stroke="#9ca3af" fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
            <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={11} width={120} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
            <Bar dataKey="Saved" fill="#10b981" radius={[0, 4, 4, 0]} />
            <Bar dataKey="Target" fill="rgba(255,255,255,0.12)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
