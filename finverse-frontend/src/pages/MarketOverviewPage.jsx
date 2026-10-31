import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrendingUp, FiTrendingDown, FiActivity, FiSearch, FiInfo } from 'react-icons/fi';
import { getMarketOverview } from '../services/api';

const MOCK_OVERVIEW = {
  indices: [
    { symbol: 'NIFTY50', assetName: 'NIFTY 50 Index', currentPrice: 24320.50, dailyChange: 145.20, dailyChangePercent: 0.60, marketStatus: 'OPEN' },
    { symbol: 'SENSEX', assetName: 'BSE SENSEX Index', currentPrice: 79840.10, dailyChange: 312.80, dailyChangePercent: 0.39, marketStatus: 'OPEN' },
    { symbol: 'NASDAQ', assetName: 'NASDAQ Composite', currentPrice: 17890.30, dailyChange: -45.10, dailyChangePercent: -0.25, marketStatus: 'OPEN' },
    { symbol: 'SP500', assetName: 'S&P 500 Index', currentPrice: 5540.20, dailyChange: 12.40, dailyChangePercent: 0.22, marketStatus: 'OPEN' }
  ],
  topGainers: [
    { symbol: 'AAPL', assetName: 'Apple Inc.', currentPrice: 224.50, dailyChangePercent: 1.40, sector: 'Technology' },
    { symbol: 'MSFT', assetName: 'Microsoft Corporation', currentPrice: 448.20, dailyChangePercent: 1.27, sector: 'Technology' },
    { symbol: 'INFY', assetName: 'Infosys Limited', currentPrice: 1785.60, dailyChangePercent: 1.26, sector: 'IT' },
    { symbol: 'RELIANCE', assetName: 'Reliance Industries Ltd.', currentPrice: 2980.40, dailyChangePercent: 1.17, sector: 'Energy & Tech' }
  ],
  topLosers: [
    { symbol: 'TSLA', assetName: 'Tesla Inc.', currentPrice: 215.30, dailyChangePercent: -3.06, sector: 'Automotive' },
    { symbol: 'TCS', assetName: 'Tata Consultancy Services', currentPrice: 4210.00, dailyChangePercent: -0.43, sector: 'IT' }
  ]
};

export default function MarketOverviewPage() {
  const [data, setData] = useState(MOCK_OVERVIEW);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await getMarketOverview();
        if (res.data) setData(res.data);
      } catch (err) {
        setData(MOCK_OVERVIEW);
      } finally {
        setLoading(false);
      }
    };
    fetchMarket();
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-light mb-1">Market Overview & Indices</h2>
          <p className="text-muted small mb-0">Track major Indian and international benchmark indices and equities</p>
        </div>
        <div className="badge bg-secondary-subtle text-secondary border border-secondary p-2">
          <FiInfo className="me-1" /> Historical & Telemetry Demo Data
        </div>
      </div>

      {/* Major Indices Grid */}
      <h5 className="fw-bold text-light mb-3">Benchmark Indices</h5>
      <div className="row g-3 mb-5">
        {(data.indices || MOCK_OVERVIEW.indices).map((item) => {
          const isPos = (item.dailyChangePercent || 0) >= 0;
          return (
            <div key={item.symbol} className="col-md-6 col-lg-3">
              <Link to={`/analysis?symbol=${item.symbol}`} className="text-decoration-none">
                <div className="finverse-card p-4 hover-lift">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-primary fs-5">{item.symbol}</span>
                    <span className={`badge ${isPos ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger border border-danger'}`}>
                      {isPos ? '▲ +' : '▼ '}{item.dailyChangePercent}%
                    </span>
                  </div>
                  <h4 className="fw-extrabold text-light mb-1">₹{item.currentPrice?.toLocaleString()}</h4>
                  <small className="text-muted">{item.assetName}</small>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Top Gainers & Losers Tables */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="finverse-card p-4">
            <h5 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
              <FiTrendingUp /> Top Gainers Today
            </h5>
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                <thead>
                  <tr className="text-muted border-secondary">
                    <th>Symbol</th>
                    <th>Asset Name</th>
                    <th>Price</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.topGainers || MOCK_OVERVIEW.topGainers).map((a) => (
                    <tr key={a.symbol}>
                      <td>
                        <Link to={`/analysis?symbol=${a.symbol}`} className="fw-bold text-primary text-decoration-none">
                          {a.symbol}
                        </Link>
                      </td>
                      <td className="small text-muted">{a.assetName}</td>
                      <td className="fw-semibold">₹{a.currentPrice?.toLocaleString()}</td>
                      <td className="text-success fw-bold">+{a.dailyChangePercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="finverse-card p-4">
            <h5 className="fw-bold text-danger mb-3 d-flex align-items-center gap-2">
              <FiTrendingDown /> Top Losers Today
            </h5>
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                <thead>
                  <tr className="text-muted border-secondary">
                    <th>Symbol</th>
                    <th>Asset Name</th>
                    <th>Price</th>
                    <th>Change</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.topLosers || MOCK_OVERVIEW.topLosers).map((a) => (
                    <tr key={a.symbol}>
                      <td>
                        <Link to={`/analysis?symbol=${a.symbol}`} className="fw-bold text-primary text-decoration-none">
                          {a.symbol}
                        </Link>
                      </td>
                      <td className="small text-muted">{a.assetName}</td>
                      <td className="fw-semibold">₹{a.currentPrice?.toLocaleString()}</td>
                      <td className="text-danger fw-bold">{a.dailyChangePercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
