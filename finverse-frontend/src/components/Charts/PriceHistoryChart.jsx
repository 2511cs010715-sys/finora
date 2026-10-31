import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function PriceHistoryChart({ data = [], symbol = 'Asset' }) {
  const [timeFilter, setTimeFilter] = useState('1M');

  // Filter dataset according to selected timeline filter
  const getFilteredData = () => {
    if (!data || data.length === 0) return [];
    if (timeFilter === '1D') return data.slice(-5);
    if (timeFilter === '1W') return data.slice(-10);
    if (timeFilter === '1M') return data.slice(-25);
    if (timeFilter === '6M') return data.slice(-45);
    return data;
  };

  const chartData = getFilteredData();

  return (
    <div className="finverse-card p-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-3">
        <div>
          <h5 className="fw-bold text-light mb-0">{symbol} Historical Price Action</h5>
          <small className="text-muted">Closing Prices & Volume Trend Analysis</small>
        </div>

        {/* Time Horizon Filter Buttons */}
        <div className="btn-group btn-group-sm bg-dark p-1 rounded-pill border border-secondary" role="group">
          {['1D', '1W', '1M', '6M', '1Y'].map(tf => (
            <button
              key={tf}
              type="button"
              className={`btn rounded-pill border-0 px-3 ${timeFilter === tf ? 'btn-primary text-white fw-bold' : 'btn-dark text-muted'}`}
              onClick={() => setTimeFilter(tf)}
              style={{ fontSize: '0.75rem' }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: 320 }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="trading_date" stroke="#9ca3af" fontSize={11} tickFormatter={(str) => str?.slice(5) || str} />
              <YAxis stroke="#9ca3af" fontSize={11} domain={['auto', 'auto']} tickFormatter={(val) => `₹${val}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Close Price']}
                labelFormatter={(label) => `Trading Date: ${label}`}
              />
              <Area type="monotone" dataKey="close_price" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#priceGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            No historical price points available.
          </div>
        )}
      </div>
    </div>
  );
}
