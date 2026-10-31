import React from 'react';
import { FiActivity, FiTrendingUp, FiTrendingDown, FiAlertCircle } from 'react-icons/fi';
import MarketTrendChart from '../components/Charts/MarketTrendChart';

export default function MarketTrendPage() {
  const trends = [
    { symbol: 'NIFTY50', name: 'NIFTY 50 Index', status: 'BULLISH', signal: '🟢 Strong Uptrend', sma20: '24,180', momentum: 'High', volume: 'Above Avg' },
    { symbol: 'RELIANCE', name: 'Reliance Industries', status: 'BULLISH', signal: '🟢 Breakout Candidate', sma20: '2,920', momentum: 'High', volume: 'High' },
    { symbol: 'AAPL', name: 'Apple Inc.', status: 'BULLISH', signal: '🟢 Positive Momentum', sma20: '$218.40', momentum: 'Moderate', volume: 'Normal' },
    { symbol: 'TCS', name: 'Tata Consultancy Services', status: 'NEUTRAL', signal: '🟡 Consolidation Phase', sma20: '4,225', momentum: 'Neutral', volume: 'Low' },
    { symbol: 'TSLA', name: 'Tesla Inc.', status: 'BEARISH', signal: '🔴 Short-term Pullback', sma20: '$222.00', momentum: 'Weak', volume: 'Spike' }
  ];

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="fw-bold text-light mb-1">Market Trend & Technical Signals</h2>
        <p className="text-muted small">Multi-timeframe technical indicator signals across top assets</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <MarketTrendChart />
        </div>
        <div className="col-lg-6">
          <div className="finverse-card p-4 h-100">
            <h5 className="fw-bold text-light mb-3">Market Signal Breakdown</h5>
            <div className="d-flex flex-column gap-3">
              <div className="p-3 bg-dark rounded border border-secondary d-flex align-items-center justify-content-between">
                <div>
                  <span className="fw-bold text-success">🟢 Bullish Regime (72%)</span>
                  <p className="small text-muted mb-0">Benchmark indices trading above 20-day & 50-day moving averages.</p>
                </div>
              </div>
              <div className="p-3 bg-dark rounded border border-secondary d-flex align-items-center justify-content-between">
                <div>
                  <span className="fw-bold text-warning">🟡 Neutral Regime (18%)</span>
                  <p className="small text-muted mb-0">Sideways consolidation with low volatility compression.</p>
                </div>
              </div>
              <div className="p-3 bg-dark rounded border border-secondary d-flex align-items-center justify-content-between">
                <div>
                  <span className="fw-bold text-danger">🔴 Bearish Pullback (10%)</span>
                  <p className="small text-muted mb-0">Isolated pullbacks due to sector rotation or earnings variance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Technical Matrix Table */}
      <div className="finverse-card p-4">
        <h5 className="fw-bold text-light mb-3">Technical Indicator Matrix</h5>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr className="text-muted border-secondary">
                <th>Asset Symbol</th>
                <th>Asset Name</th>
                <th>Trend Signal</th>
                <th>20-Day SMA</th>
                <th>Momentum Score</th>
                <th>Volume Surge</th>
              </tr>
            </thead>
            <tbody>
              {trends.map(t => (
                <tr key={t.symbol}>
                  <td className="fw-bold text-primary">{t.symbol}</td>
                  <td className="text-muted small">{t.name}</td>
                  <td>
                    <span className={t.status === 'BULLISH' ? 'badge-bullish' : t.status === 'BEARISH' ? 'badge-bearish' : 'badge-neutral'}>
                      {t.signal}
                    </span>
                  </td>
                  <td className="fw-semibold">₹{t.sma20}</td>
                  <td>{t.momentum}</td>
                  <td className="text-muted small">{t.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
