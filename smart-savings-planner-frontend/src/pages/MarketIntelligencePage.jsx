import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FiBarChart2, FiTrendingUp, FiActivity, FiZap, FiCheckCircle } from 'react-icons/fi';
import CustomTooltip from '../components/Charts/CustomTooltip';

export default function MarketIntelligencePage() {
  const marketTickers = [
    { symbol: 'NIFTY 50', value: '24,520.40', change: '+1.25%', trend: 'BULLISH 🟢', color: 'text-success' },
    { symbol: 'SENSEX', value: '80,410.80', change: '+0.98%', trend: 'BULLISH 🟢', color: 'text-success' },
    { symbol: 'NASDAQ 100', value: '19,850.20', change: '+1.85%', trend: 'BULLISH 🟢', color: 'text-success' },
    { symbol: 'GOLD (24K)', value: '₹72,400', change: '+0.35%', trend: 'NEUTRAL 🟡', color: 'text-warning' },
    { symbol: 'BITCOIN', value: '$68,450', change: '+3.50%', trend: 'BULLISH 🟢', color: 'text-success' }
  ];

  const marketChartData = [
    { day: 'Day 1', Nifty: 24100, Sensex: 79200 },
    { day: 'Day 5', Nifty: 24250, Sensex: 79600 },
    { day: 'Day 10', Nifty: 24180, Sensex: 79400 },
    { day: 'Day 15', Nifty: 24350, Sensex: 80100 },
    { day: 'Day 20', Nifty: 24420, Sensex: 80250 },
    { day: 'Day 25', Nifty: 24520, Sensex: 80410 }
  ];

  return (
    <div className="container-fluid px-1 py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 text-info mb-1">
            <div className="p-2 bg-info-subtle text-info rounded-3">
              <FiBarChart2 size={24} />
            </div>
            <h2 className="fw-bold text-light mb-0">2026 Market Intelligence</h2>
          </div>
          <p className="text-muted small mb-0">Real-time market index telemetry, algorithmic trend signals, and sector sentiment analysis</p>
        </div>

        <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill fw-bold">
          🟢 Live Market Data Feed
        </span>
      </div>

      {/* Ticker Strip Cards */}
      <div className="row g-3 mb-4">
        {marketTickers.map((t, idx) => (
          <div key={idx} className="col-6 col-md">
            <div className="finora-card p-3 text-center">
              <small className="text-muted fw-bold d-block mb-1">{t.symbol}</small>
              <h5 className="fw-extrabold text-light mb-1">{t.value}</h5>
              <span className={`small fw-bold ${t.color}`}>{t.change} • {t.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Primary Market Telemetry Chart */}
      <div className="finora-card p-4 mb-4 border-info">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-light mb-0">NIFTY 50 vs SENSEX 30-Day Trajectory</h5>
          <span className="badge bg-primary-subtle text-primary border border-primary">
            20-Day SMA Cross
          </span>
        </div>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={marketChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="niftyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} domain={['dataMin - 500', 'dataMax + 500']} />
              <Tooltip content={<CustomTooltip currency={false} />} />
              <Area type="monotone" dataKey="Nifty" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#niftyGrad)" name="NIFTY 50" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
