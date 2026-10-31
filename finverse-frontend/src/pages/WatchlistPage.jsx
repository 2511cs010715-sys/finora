import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBookmark, FiStar, FiTrash2, FiCpu, FiTrendingUp } from 'react-icons/fi';
import { getWatchlist, removeFromWatchlist } from '../services/api';

const MOCK_WATCHLIST = [
  { id: 1, symbol: 'NIFTY50', name: 'NIFTY 50 Index', currentPrice: 24320.50, dailyChangePercent: 0.60, trend: 'BULLISH' },
  { id: 2, symbol: 'RELIANCE', name: 'Reliance Industries', currentPrice: 2980.40, dailyChangePercent: 1.17, trend: 'BULLISH' },
  { id: 3, symbol: 'AAPL', name: 'Apple Inc.', currentPrice: 224.50, dailyChangePercent: 1.40, trend: 'BULLISH' },
  { id: 4, symbol: 'MSFT', name: 'Microsoft Corporation', currentPrice: 448.20, dailyChangePercent: 1.27, trend: 'BULLISH' }
];

export default function WatchlistPage() {
  const [items, setItems] = useState(MOCK_WATCHLIST);

  const fetchWatchlist = async () => {
    try {
      const res = await getWatchlist();
      if (res.data && res.data.length > 0) {
        setItems(res.data.map(w => ({
          id: w.id,
          symbol: w.asset?.symbol,
          name: w.asset?.assetName,
          currentPrice: w.asset?.currentPrice,
          dailyChangePercent: w.asset?.dailyChangePercent,
          trend: 'BULLISH'
        })));
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeFromWatchlist(id);
      fetchWatchlist();
    } catch (err) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-light mb-1">Tracked Asset Watchlist</h2>
          <p className="text-muted small mb-0">Star your favorite assets for fast monitoring and AI prediction access</p>
        </div>
      </div>

      <div className="row g-4">
        {items.map(item => {
          const isPos = (item.dailyChangePercent || 0) >= 0;
          return (
            <div key={item.id} className="col-md-6 col-lg-3">
              <div className="finverse-card p-4 h-100 position-relative">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <FiStar size={20} className="text-warning fill-warning" />
                    <span className="fw-bold text-primary fs-5">{item.symbol}</span>
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm p-1 rounded-circle border-0"
                    onClick={() => handleRemove(item.id)}
                    title="Remove from Watchlist"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>

                <small className="text-muted d-block mb-3">{item.name}</small>

                <div className="d-flex align-items-baseline justify-content-between mb-3">
                  <h4 className="fw-extrabold text-light mb-0">₹{item.currentPrice?.toLocaleString()}</h4>
                  <span className={`badge ${isPos ? 'badge-bullish' : 'badge-bearish'}`}>
                    {isPos ? '▲ +' : '▼ '}{item.dailyChangePercent}%
                  </span>
                </div>

                <div className="d-flex gap-2 mt-2 pt-2 border-top border-secondary">
                  <Link to={`/analysis?symbol=${item.symbol}`} className="btn btn-outline-secondary btn-sm w-50 rounded-pill text-light">
                    Analysis
                  </Link>
                  <Link to={`/predictions?symbol=${item.symbol}`} className="btn btn-primary btn-sm w-50 rounded-pill fw-bold">
                    AI Predict
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
