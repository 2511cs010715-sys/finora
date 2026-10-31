import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiPieChart, FiTrendingUp, FiCheck } from 'react-icons/fi';
import PortfolioAllocationChart from '../components/Charts/PortfolioAllocationChart';
import { getPortfolio, addPortfolioPosition, deletePortfolioPosition, getAssets } from '../services/api';

const MOCK_PORTFOLIO = [
  { id: 1, symbol: 'RELIANCE', name: 'Reliance Industries', quantity: 25, purchasePrice: 2850.00, currentPrice: 2980.40, investedValue: 71250, currentValue: 74510, gainLoss: 3260, gainLossPercent: 4.57 },
  { id: 2, symbol: 'INFY', name: 'Infosys Limited', quantity: 50, purchasePrice: 1720.00, currentPrice: 1785.60, investedValue: 86000, currentValue: 89280, gainLoss: 3280, gainLossPercent: 3.81 },
  { id: 3, symbol: 'AAPL', name: 'Apple Inc.', quantity: 15, purchasePrice: 210.00, currentPrice: 224.50, investedValue: 3150, currentValue: 3367.50, gainLoss: 217.50, gainLossPercent: 6.90 }
];

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState(MOCK_PORTFOLIO);
  const [assetList, setAssetList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  const fetchPortfolioData = async () => {
    try {
      const res = await getPortfolio();
      if (res.data && res.data.items && res.data.items.length > 0) {
        setPortfolioItems(res.data.items);
      }
    } catch (err) {
      // Retain mock fallback
    }
  };

  useEffect(() => {
    fetchPortfolioData();
    const fetchAssets = async () => {
      try {
        const res = await getAssets();
        if (res.data) setAssetList(res.data);
      } catch (err) {}
    };
    fetchAssets();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssetId || !quantity) return;

    try {
      await addPortfolioPosition({
        assetId: Number(selectedAssetId),
        quantity: Number(quantity),
        purchasePrice: purchasePrice ? Number(purchasePrice) : undefined
      });
      setShowAddModal(false);
      fetchPortfolioData();
    } catch (err) {
      // Local optimistic fallback
      const assetObj = assetList.find(a => a.id === Number(selectedAssetId)) || { symbol: 'TSLA', assetName: 'Tesla Inc.', currentPrice: 215.30 };
      const qty = Number(quantity);
      const buyPrice = purchasePrice ? Number(purchasePrice) : assetObj.currentPrice;
      const newItem = {
        id: Date.now(),
        symbol: assetObj.symbol,
        name: assetObj.assetName,
        quantity: qty,
        purchasePrice: buyPrice,
        currentPrice: assetObj.currentPrice,
        investedValue: qty * buyPrice,
        currentValue: qty * assetObj.currentPrice,
        gainLoss: (qty * assetObj.currentPrice) - (qty * buyPrice),
        gainLossPercent: (((assetObj.currentPrice - buyPrice) / buyPrice) * 100).toFixed(2)
      };
      setPortfolioItems([...portfolioItems, newItem]);
      setShowAddModal(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePortfolioPosition(id);
      fetchPortfolioData();
    } catch (err) {
      setPortfolioItems(portfolioItems.filter(item => item.id !== id));
    }
  };

  const totalVal = portfolioItems.reduce((acc, curr) => acc + Number(curr.currentValue || (curr.quantity * curr.currentPrice) || 0), 0);
  const totalInv = portfolioItems.reduce((acc, curr) => acc + Number(curr.investedValue || (curr.quantity * curr.purchasePrice) || 0), 0);
  const totalGain = totalVal - totalInv;
  const totalGainPct = totalInv > 0 ? ((totalGain / totalInv) * 100).toFixed(2) : '0.00';

  return (
    <div className="container py-4">
      {/* Top Action Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-light mb-1">Virtual Investment Portfolio</h2>
          <p className="text-muted small mb-0">Manage asset positions, quantity, cost basis, and unrealized yield</p>
        </div>
        <button
          className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <FiPlus /> Add Position
        </button>
      </div>

      {/* Portfolio Totals Metrics */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="finverse-card p-4">
            <small className="text-muted fw-semibold uppercase">Total Portfolio Valuation</small>
            <h2 className="fw-extrabold text-light mt-1 mb-0">₹{totalVal.toLocaleString()}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="finverse-card p-4">
            <small className="text-muted fw-semibold uppercase">Total Capital Invested</small>
            <h2 className="fw-extrabold text-light mt-1 mb-0">₹{totalInv.toLocaleString()}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="finverse-card p-4">
            <small className="text-muted fw-semibold uppercase">Unrealized Gain / Loss</small>
            <h2 className={`fw-extrabold mt-1 mb-0 ${totalGain >= 0 ? 'text-success' : 'text-danger'}`}>
              {totalGain >= 0 ? '+' : ''}₹{totalGain.toLocaleString()} ({totalGainPct}%)
            </h2>
          </div>
        </div>
      </div>

      {/* Portfolio Table & Allocation Chart Grid */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="finverse-card p-4">
            <h5 className="fw-bold text-light mb-3">Active Asset Holdings</h5>
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                <thead>
                  <tr className="text-muted border-secondary">
                    <th>Asset</th>
                    <th>Qty</th>
                    <th>Avg Buy Price</th>
                    <th>Current Price</th>
                    <th>Valuation</th>
                    <th>Gain / Loss</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioItems.map(item => {
                    const sym = item.asset?.symbol || item.symbol;
                    const name = item.asset?.assetName || item.name;
                    const qty = item.quantity;
                    const buyP = item.purchasePrice;
                    const curP = item.asset?.currentPrice || item.currentPrice || buyP;
                    const val = qty * curP;
                    const gain = val - (qty * buyP);
                    const gainPct = buyP > 0 ? ((gain / (qty * buyP)) * 100).toFixed(2) : 0;
                    const isPos = gain >= 0;

                    return (
                      <tr key={item.id}>
                        <td>
                          <span className="fw-bold text-primary">{sym}</span>
                          <small className="text-muted d-block">{name}</small>
                        </td>
                        <td className="fw-semibold">{qty}</td>
                        <td>₹{Number(buyP).toLocaleString()}</td>
                        <td>₹{Number(curP).toLocaleString()}</td>
                        <td className="fw-bold text-light">₹{Number(val).toLocaleString()}</td>
                        <td className={`fw-bold ${isPos ? 'text-success' : 'text-danger'}`}>
                          {isPos ? '+' : ''}₹{gain.toFixed(2)} ({gainPct}%)
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-danger btn-sm p-1 rounded-circle border-0"
                            onClick={() => handleDelete(item.id)}
                            title="Delete Position"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <PortfolioAllocationChart items={portfolioItems} />
        </div>
      </div>

      {/* Add Position Modal */}
      {showAddModal && (
        <div className="modal-backdrop-custom">
          <div className="finverse-card p-4" style={{ maxWidth: '440px', width: '90%' }}>
            <h5 className="fw-bold text-light mb-3">Add Virtual Portfolio Position</h5>
            <form onSubmit={handleAddSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small">Select Asset</label>
                <select
                  className="form-select bg-dark text-light border-secondary"
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  required
                >
                  <option value="">Choose Asset...</option>
                  <option value="1">NIFTY50 (NIFTY 50 Index)</option>
                  <option value="5">RELIANCE (Reliance Industries)</option>
                  <option value="6">TCS (Tata Consultancy Services)</option>
                  <option value="7">INFY (Infosys Limited)</option>
                  <option value="8">AAPL (Apple Inc.)</option>
                  <option value="9">MSFT (Microsoft Corp.)</option>
                  <option value="10">TSLA (Tesla Inc.)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Quantity</label>
                <input
                  type="number"
                  step="any"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="e.g. 10"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small">Purchase Price (Optional)</label>
                <input
                  type="number"
                  step="any"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Defaults to current market price"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                />
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-secondary w-50" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary w-50 fw-bold">
                  Add Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
