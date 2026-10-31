import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiTrendingUp } from 'react-icons/fi';
import { getAssets } from '../services/api';

const MOCK_SUGGESTIONS = [
  { symbol: 'NIFTY50', assetName: 'NIFTY 50 Index', currentPrice: 24320.50, assetType: 'INDEX' },
  { symbol: 'SENSEX', assetName: 'BSE SENSEX Index', currentPrice: 79840.10, assetType: 'INDEX' },
  { symbol: 'RELIANCE', assetName: 'Reliance Industries Ltd.', currentPrice: 2980.40, assetType: 'STOCK' },
  { symbol: 'TCS', assetName: 'Tata Consultancy Services', currentPrice: 4210.00, assetType: 'STOCK' },
  { symbol: 'INFY', assetName: 'Infosys Limited', currentPrice: 1785.60, assetType: 'STOCK' },
  { symbol: 'AAPL', assetName: 'Apple Inc.', currentPrice: 224.50, assetType: 'STOCK' },
  { symbol: 'MSFT', assetName: 'Microsoft Corporation', currentPrice: 448.20, assetType: 'STOCK' },
  { symbol: 'TSLA', assetName: 'Tesla Inc.', currentPrice: 215.30, assetType: 'STOCK' }
];

export default function AssetSearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await getAssets(query);
        if (res.data && res.data.length > 0) {
          setResults(res.data);
        } else {
          setResults(MOCK_SUGGESTIONS.filter(a => 
            a.symbol.toLowerCase().includes(query.toLowerCase()) || 
            a.assetName.toLowerCase().includes(query.toLowerCase())
          ));
        }
      } catch (err) {
        setResults(MOCK_SUGGESTIONS.filter(a => 
          a.symbol.toLowerCase().includes(query.toLowerCase()) || 
          a.assetName.toLowerCase().includes(query.toLowerCase())
        ));
      }
      setIsOpen(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (symbol) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/analysis?symbol=${symbol}`);
  };

  return (
    <div className="position-relative" ref={searchRef} style={{ maxWidth: '320px', width: '100%' }}>
      <div className="input-group">
        <span className="input-group-text border-end-0 bg-dark text-muted" style={{ borderColor: 'var(--border-color)' }}>
          <FiSearch />
        </span>
        <input
          type="text"
          className="form-control bg-dark text-light border-start-0 ps-0"
          placeholder="Search asset (e.g. RELIANCE, AAPL, NIFTY50)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          style={{ borderColor: 'var(--border-color)', fontSize: '0.875rem' }}
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="position-absolute w-100 mt-1 finverse-card p-2 shadow-lg z-3" style={{ background: 'var(--bg-card)', zIndex: 1100 }}>
          <div className="text-muted small px-2 py-1 border-bottom border-secondary mb-1">Asset Suggestions</div>
          {results.map((item) => (
            <div
              key={item.symbol}
              className="d-flex align-items-center justify-content-between p-2 rounded hover-bg cursor-pointer"
              onClick={() => handleSelect(item.symbol)}
              style={{ cursor: 'pointer', transition: 'background 0.2s' }}
            >
              <div>
                <span className="fw-bold me-2 text-primary">{item.symbol}</span>
                <small className="text-muted d-block">{item.assetName}</small>
              </div>
              <div className="text-end">
                <span className="fw-semibold text-light">₹{item.currentPrice?.toLocaleString()}</span>
                <span className="badge bg-secondary ms-2" style={{ fontSize: '0.65rem' }}>{item.assetType}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
