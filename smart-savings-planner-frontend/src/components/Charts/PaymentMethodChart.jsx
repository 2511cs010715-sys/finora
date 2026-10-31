import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import CustomTooltip from './CustomTooltip';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function PaymentMethodChart({ expenses = [] }) {
  const methodMap = {};
  if (expenses && expenses.length > 0) {
    expenses.forEach(e => {
      const m = e.paymentMethod || 'UPI';
      const amt = Number(e.amount || 0);
      methodMap[m] = (methodMap[m] || 0) + amt;
    });
  } else {
    methodMap['UPI'] = 13300;
    methodMap['Bank Transfer'] = 12000;
    methodMap['Credit Card'] = 3200;
    methodMap['Debit Card'] = 2300;
  }

  const data = Object.keys(methodMap).map(m => ({
    name: m,
    value: methodMap[m]
  }));

  return (
    <div className="finplanner-card p-4">
      <h5 className="fw-bold text-light mb-1">💳 Spending by Payment Method</h5>
      <p className="text-muted small mb-3">Breakdown by UPI, Cards, and Transfers</p>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
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
