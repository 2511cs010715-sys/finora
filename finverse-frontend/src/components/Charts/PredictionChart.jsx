import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ReferenceLine } from 'recharts';

export default function PredictionChart({ forecastPoints = [], currentPrice = 0, symbol = 'Asset' }) {
  if (!forecastPoints || forecastPoints.length === 0) {
    return (
      <div className="finverse-card p-4 text-center text-muted">
        Select asset and model parameters to render AI prediction trajectory.
      </div>
    );
  }

  // Combine baseline historical point with forecast steps
  const chartData = [
    { date: 'Today (Base)', predicted_price: Number(currentPrice), isBase: true },
    ...forecastPoints.map(pt => ({
      date: pt.date || `Day ${pt.day}`,
      predicted_price: Number(pt.predicted_price),
      isBase: false
    }))
  ];

  return (
    <div className="finverse-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="fw-bold text-light mb-0">AI Model Forecast Trajectory</h5>
          <small className="text-muted">Projected price trajectory over next target horizon</small>
        </div>
        <span className="badge bg-primary-subtle text-primary border border-primary px-3 py-2">
          ML Regression Curve
        </span>
      </div>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" fontSize={11} domain={['auto', 'auto']} tickFormatter={(v) => `₹${v}`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Predicted Price']}
            />
            <Legend />
            <ReferenceLine y={Number(currentPrice)} label="Baseline" stroke="#6b7280" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="predicted_price"
              name="AI Projected Price (₹)"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 5, fill: '#10b981' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
