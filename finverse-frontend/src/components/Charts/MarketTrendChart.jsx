import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function MarketTrendChart() {
  const trendMetrics = [
    { name: 'Bullish Momentum', score: 72, color: '#10b981' },
    { name: 'Neutral Consolidation', score: 18, color: '#f59e0b' },
    { name: 'Bearish Correction', score: 10, color: '#ef4444' }
  ];

  return (
    <div className="finverse-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold text-light mb-0">Market Sentiment & Momentum</h5>
          <small className="text-muted">Multi-factor trend distribution signals</small>
        </div>
        <span className="badge-bullish">🟢 72% Bullish</span>
      </div>

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trendMetrics} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis type="number" stroke="#9ca3af" fontSize={11} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={11} width={130} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              formatter={(val) => [`${val}%`, 'Signal Strength']}
            />
            <Bar dataKey="score" radius={[0, 8, 8, 0]} fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
