import React, { useState, useEffect } from 'react';
import { FiBell, FiPlus, FiTrash2, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { getAlerts, createAlert, deleteAlert } from '../services/api';

const MOCK_ALERTS = [
  { id: 1, symbol: 'RELIANCE', alertType: 'PRICE_ABOVE', threshold: 3000.00, status: 'ACTIVE' },
  { id: 2, symbol: 'AAPL', alertType: 'PRICE_BELOW', threshold: 215.00, status: 'ACTIVE' }
];

export default function PriceAlertsPage() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [showModal, setShowModal] = useState(false);
  
  const [assetId, setAssetId] = useState('5');
  const [alertType, setAlertType] = useState('PRICE_ABOVE');
  const [threshold, setThreshold] = useState('');

  const fetchAlerts = async () => {
    try {
      const res = await getAlerts();
      if (res.data && res.data.length > 0) {
        setAlerts(res.data.map(a => ({
          id: a.id,
          symbol: a.asset?.symbol || 'ASSET',
          alertType: a.alertType,
          threshold: a.threshold,
          status: a.status
        })));
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!threshold) return;

    try {
      await createAlert({
        assetId: Number(assetId),
        alertType,
        threshold: Number(threshold)
      });
      setShowModal(false);
      fetchAlerts();
    } catch (err) {
      setAlerts([...alerts, {
        id: Date.now(),
        symbol: assetId === '5' ? 'RELIANCE' : 'AAPL',
        alertType,
        threshold: Number(threshold),
        status: 'ACTIVE'
      }]);
      setShowModal(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAlert(id);
      fetchAlerts();
    } catch (err) {
      setAlerts(alerts.filter(a => a.id !== id));
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-light mb-1">Target Price & Threshold Alerts</h2>
          <p className="text-muted small mb-0">Receive instant telemetry notifications when asset values breach specified thresholds</p>
        </div>
        <button className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <FiPlus /> Create Price Alert
        </button>
      </div>

      <div className="finverse-card p-4">
        <h5 className="fw-bold text-light mb-3">Configured Price Monitors</h5>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr className="text-muted border-secondary">
                <th>Asset Symbol</th>
                <th>Alert Condition</th>
                <th>Target Threshold</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(a => (
                <tr key={a.id}>
                  <td className="fw-bold text-primary">{a.symbol}</td>
                  <td>
                    <span className="badge bg-secondary-subtle text-secondary border border-secondary">
                      {a.alertType === 'PRICE_ABOVE' ? 'Crosses Above ▲' : 'Crosses Below ▼'}
                    </span>
                  </td>
                  <td className="fw-bold text-light">₹{Number(a.threshold).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${a.status === 'ACTIVE' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline-danger btn-sm p-1 rounded-circle border-0" onClick={() => handleDelete(a.id)}>
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop-custom">
          <div className="finverse-card p-4" style={{ maxWidth: '420px', width: '90%' }}>
            <h5 className="fw-bold text-light mb-3">Create New Price Alert</h5>
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label className="form-label text-muted small">Target Asset</label>
                <select className="form-select bg-dark text-light border-secondary" value={assetId} onChange={(e) => setAssetId(e.target.value)}>
                  <option value="5">RELIANCE - Reliance Industries</option>
                  <option value="1">NIFTY50 - NIFTY 50 Index</option>
                  <option value="8">AAPL - Apple Inc.</option>
                  <option value="6">TCS - Tata Consultancy Services</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Alert Condition</label>
                <select className="form-select bg-dark text-light border-secondary" value={alertType} onChange={(e) => setAlertType(e.target.value)}>
                  <option value="PRICE_ABOVE">Price Rises Above (₹)</option>
                  <option value="PRICE_BELOW">Price Drops Below (₹)</option>
                  <option value="PERCENT_CHANGE">Daily Change Exceeds (%)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small">Threshold Value</label>
                <input
                  type="number"
                  step="any"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="e.g. 3000.00"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-secondary w-50" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary w-50 fw-bold">Set Alert</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
