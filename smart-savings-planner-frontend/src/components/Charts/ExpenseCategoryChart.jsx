import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip';

const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ec4899', '#06b6d4'];

export default function ExpenseCategoryChart({ expenses = [] }) {
  const categoryMap = {};
  if (expenses && expenses.length > 0) {
    expenses.forEach(e => {
      const cat = e.category || 'Other';
      const amt = Number(e.amount || 0);
      categoryMap[cat] = (categoryMap[cat] || 0) + amt;
    });
  } else {
    categoryMap['Bills'] = 14800;
    categoryMap['Food'] = 6500;
    categoryMap['Education'] = 4000;
    categoryMap['Transport'] = 3200;
    categoryMap['Entertainment'] = 2300;
  }

  const data = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat]
  }));

  return (
    <div className="finplanner-card p-4">
      <h5 className="fw-bold text-light mb-1">Expense Breakdown by Category</h5>
      <p className="text-muted small mb-3">Distribution of monthly expenditure</p>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={85}
              paddingAngle={4}
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
