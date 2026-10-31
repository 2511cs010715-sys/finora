import React, { useState, useEffect } from 'react';
import {
  FiCreditCard, FiAlertTriangle, FiPlus, FiCheckCircle, FiClock,
  FiCalendar, FiTrash2, FiDollarSign, FiZap, FiShield, FiCheck, FiPercent, FiInfo
} from 'react-icons/fi';
import confetti from 'canvas-confetti';
import { useAppData } from '../context/AppDataContext';

const INITIAL_EMIS = [
  {
    id: 1,
    title: '🏡 Home Loan EMI',
    lender: 'HDFC Bank Home Finance',
    amount: 15000,
    dueDate: 3,
    tenureTotal: 240,
    tenureRemaining: 184,
    interestRate: 8.5,
    status: 'OVERDUE',
    category: 'Housing'
  },
  {
    id: 2,
    title: '🚗 Hyundai Creta Car Loan EMI',
    lender: 'SBI Auto Loans',
    amount: 6500,
    dueDate: 10,
    tenureTotal: 60,
    tenureRemaining: 32,
    interestRate: 9.1,
    status: 'UPCOMING',
    category: 'Vehicle'
  },
  {
    id: 3,
    title: '📱 iPhone 15 Pro No-Cost EMI',
    lender: 'Bajaj Finserv EMI Card',
    amount: 4200,
    dueDate: 15,
    tenureTotal: 12,
    tenureRemaining: 4,
    interestRate: 0.0,
    status: 'UPCOMING',
    category: 'Electronics'
  }
];

export default function EmiTrackerPage() {
  // Safely consume AppDataContext with local state fallback
  const appData = useAppData ? useAppData() : null;
  const [localEmis, setLocalEmis] = useState(INITIAL_EMIS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Active EMIs: Uses AppDataContext if present, otherwise local state
  const emis = (appData && Array.isArray(appData.emis) && appData.emis.length > 0)
    ? appData.emis
    : localEmis;

  // New EMI Form State
  const [newEmi, setNewEmi] = useState({
    title: '',
    lender: '',
    amount: '',
    dueDate: 5,
    tenureTotal: 36,
    tenureRemaining: 36,
    interestRate: 8.5,
    category: 'General'
  });

  const currentDate = new Date().getDate(); // Current day of month

  // Overdue EMIs & KPI Calculations
  const overdueEmis = emis.filter(e => e.status === 'OVERDUE' || (e.status !== 'PAID' && Number(e.dueDate || 1) < currentDate));
  const totalMonthlyEmi = emis.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalOverdueAmount = overdueEmis.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const handlePayEmi = (id) => {
    if (appData && typeof appData.payEmi === 'function') {
      appData.payEmi(id);
    }
    setLocalEmis(prev => prev.map(e => e.id === id ? { ...e, status: 'PAID' } : e));
    
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (err) {}
    setToastMsg('EMI payment processed successfully! Overdue alert cleared.');
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleDeleteEmi = (id) => {
    if (appData && typeof appData.deleteEmi === 'function') {
      appData.deleteEmi(id);
    }
    setLocalEmis(prev => prev.filter(e => e.id !== id));
    setToastMsg('EMI loan record removed.');
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newEmi.title || !newEmi.amount) return;

    const created = {
      id: Date.now(),
      title: newEmi.title,
      lender: newEmi.lender || 'Bank Finance',
      amount: Number(newEmi.amount),
      dueDate: Number(newEmi.dueDate || 5),
      tenureTotal: Number(newEmi.tenureTotal || 36),
      tenureRemaining: Number(newEmi.tenureRemaining || 36),
      interestRate: Number(newEmi.interestRate || 8.5),
      category: newEmi.category || 'General',
      status: Number(newEmi.dueDate || 5) < currentDate ? 'OVERDUE' : 'UPCOMING'
    };

    if (appData && typeof appData.addEmi === 'function') {
      appData.addEmi(created);
    }
    setLocalEmis(prev => [...prev, created]);
    setShowAddModal(false);

    setNewEmi({
      title: '',
      lender: '',
      amount: '',
      dueDate: 5,
      tenureTotal: 36,
      tenureRemaining: 36,
      interestRate: 8.5,
      category: 'General'
    });
    setToastMsg('New EMI Loan record added with interest rate!');
    setTimeout(() => setToastMsg(''), 3500);
  };

  return (
    <div className="container-fluid px-1 py-2">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="alert alert-success border-success bg-dark text-success p-3 mb-4 rounded-3 d-flex align-items-center justify-content-between shadow-lg">
          <div className="d-flex align-items-center gap-2">
            <FiCheckCircle size={20} />
            <strong className="small">{toastMsg}</strong>
          </div>
          <button className="btn-close btn-close-white" onClick={() => setToastMsg('')}></button>
        </div>
      )}

      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 pb-3 border-bottom border-secondary">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="p-2 bg-danger bg-opacity-25 text-danger rounded-circle border border-danger">
              <FiCreditCard size={22} />
            </span>
            <h2 className="fw-extrabold text-white mb-0" style={{ color: '#ffffff', letterSpacing: '-0.02em' }}>
              EMI & Loan Overdue Alert Tracker
            </h2>
          </div>
          <p className="fw-medium mb-0" style={{ color: '#e2e8f0', fontSize: '0.94rem' }}>
            Track monthly EMI amounts, <strong className="text-info">Rate of Interest (% p.a.)</strong>, loan tenure progress, and overdue alert notifications
          </p>
        </div>

        <button
          className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow"
          style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', border: '1px solid #38bdf8' }}
          onClick={() => setShowAddModal(true)}
        >
          <FiPlus size={20} /> Add New EMI Loan
        </button>
      </div>

      {/* OVERDUE EMI ALERT NOTIFICATION BANNER */}
      {overdueEmis.length > 0 && (
        <div className="finora-card p-4 border-danger mb-4 shadow-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', borderColor: '#f87171' }}>
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 bg-danger text-white rounded-circle shadow-sm flex-shrink-0">
              <FiAlertTriangle size={28} />
            </div>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h5 className="fw-extrabold text-white mb-0" style={{ color: '#ffffff' }}>
                  ⚠️ OVERDUE EMI ALERT NOTIFICATION ({overdueEmis.length} Loan Due Date Passed!)
                </h5>
                <span className="badge bg-danger text-white px-3 py-1.5 fw-bold" style={{ fontSize: '0.82rem' }}>
                  Total Overdue: ₹{totalOverdueAmount.toLocaleString()}
                </span>
              </div>
              <p className="fw-medium text-white mb-0 mt-1" style={{ color: '#fef2f2', fontSize: '0.92rem' }}>
                {overdueEmis.map(e => `${e.title || 'Loan'} of ₹${(e.amount || 0).toLocaleString()} @ ${e.interestRate || 8.5}% p.a. interest was due on the ${e.dueDate || 1}rd`).join(' | ')}.
                Please process payment to prevent late payment penalty charges and CIBIL score drop.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Key KPI Summary Metrics */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="finora-card p-4 border-primary h-100" style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold text-white text-uppercase" style={{ fontSize: '0.78rem', color: '#ffffff' }}>TOTAL MONTHLY EMI OBLIGATION</span>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-0.5">{emis.length} Active Loans</span>
            </div>
            <h2 className="fw-extrabold text-white mb-1" style={{ color: '#ffffff' }}>
              ₹{totalMonthlyEmi.toLocaleString()}
            </h2>
            <small className="text-info fw-semibold">Tracked with Interest Rates (% p.a.)</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="finora-card p-4 border-danger h-100" style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold text-white text-uppercase" style={{ fontSize: '0.78rem', color: '#ffffff' }}>OVERDUE PAYMENTS ALERT</span>
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-0.5">{overdueEmis.length} Overdue</span>
            </div>
            <h2 className="fw-extrabold text-danger mb-1">
              ₹{totalOverdueAmount.toLocaleString()}
            </h2>
            <small className="text-warning fw-semibold">Immediate Action Required ⚠️</small>
          </div>
        </div>

        <div className="col-md-4">
          <div className="finora-card p-4 border-success h-100" style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold text-white text-uppercase" style={{ fontSize: '0.78rem', color: '#ffffff' }}>PAID EMIS THIS MONTH</span>
              <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-0.5">Cleared</span>
            </div>
            <h2 className="fw-extrabold text-success mb-1">
              {emis.filter(e => e.status === 'PAID').length} / {emis.length}
            </h2>
            <small className="text-success fw-semibold">On-time CIBIL Health Score 🟢</small>
          </div>
        </div>
      </div>

      {/* EMI Cards Grid */}
      <h5 className="fw-bold text-white mb-3" style={{ color: '#ffffff' }}>Active EMI Loans, Amounts & Interest Rates</h5>

      {emis.length === 0 ? (
        <div className="finora-card p-5 text-center border-secondary my-3 rounded-4" style={{ backgroundColor: '#0f172a' }}>
          <FiCreditCard size={48} className="text-info mb-3" />
          <h4 className="fw-extrabold text-white">No Active EMI Loans</h4>
          <p className="text-muted mb-4">You have cleared all active EMI loans! Add a new EMI loan record to start tracking.</p>
          <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold" onClick={() => setShowAddModal(true)}>
            <FiPlus size={18} className="me-1" /> Add Your First EMI Loan
          </button>
        </div>
      ) : (
        <div className="row g-4 mb-4">
          {emis.map((emi) => {
            const isOverdue = emi.status === 'OVERDUE' || (emi.status !== 'PAID' && Number(emi.dueDate || 1) < currentDate);
            const isPaid = emi.status === 'PAID';
            
            const totalT = Number(emi.tenureTotal || 36);
            const remT = Number(emi.tenureRemaining || 18);
            const tenurePct = totalT > 0 ? Math.min(100, Math.max(0, ((totalT - remT) / totalT) * 100)).toFixed(1) : '50.0';
            const amountVal = Number(emi.amount || 0);
            const interestRateVal = Number(emi.interestRate || 8.5);

            return (
              <div key={emi.id} className="col-md-6 col-lg-4">
                <div className={`finora-card p-4 h-100 d-flex flex-column justify-content-between ${isOverdue ? 'border-danger shadow-lg' : isPaid ? 'border-success' : 'border-primary'}`} style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)' }}>
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 fw-bold">
                        {emi.category || 'General'} Loan
                      </span>
                      {isOverdue ? (
                        <span className="badge bg-danger text-white border border-danger px-3 py-1.5 fw-bold d-flex align-items-center gap-1">
                          <FiAlertTriangle /> OVERDUE ALERT
                        </span>
                      ) : isPaid ? (
                        <span className="badge bg-success text-dark px-3 py-1.5 fw-bold d-flex align-items-center gap-1">
                          <FiCheckCircle /> PAID
                        </span>
                      ) : (
                        <span className="badge bg-warning bg-opacity-25 text-warning border border-warning px-3 py-1.5 fw-bold d-flex align-items-center gap-1">
                          <FiClock /> Due {emi.dueDate || 5}th
                        </span>
                      )}
                    </div>

                    <h4 className="fw-extrabold text-white mb-1" style={{ color: '#ffffff' }}>{emi.title || 'EMI Loan'}</h4>
                    <small className="fw-semibold text-info d-block mb-3">{emi.lender || 'Bank'}</small>

                    <div className="p-3 bg-dark rounded border border-secondary mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small text-white-50">Monthly EMI Amount:</span>
                        <h4 className="fw-extrabold text-white mb-0" style={{ color: '#ffffff' }}>₹{amountVal.toLocaleString()}</h4>
                      </div>
                      <div className="d-flex justify-content-between align-items-center small text-white-50 mt-2">
                        <span>Rate of Interest (% p.a.):</span>
                        <strong className="text-info fw-extrabold" style={{ fontSize: '0.98rem' }}>🔥 {interestRateVal}% p.a.</strong>
                      </div>
                      <div className="d-flex justify-content-between align-items-center small text-white-50 mt-1">
                        <span>Due Date of Month:</span>
                        <strong className="text-warning">{emi.dueDate || 5}th of month</strong>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between small text-white mb-1">
                        <span>Tenure Progress ({totalT - remT} / {totalT} EMIs)</span>
                        <span className="fw-bold text-success">{tenurePct}% Completed</span>
                      </div>
                      <div className="progress bg-secondary" style={{ height: '8px' }}>
                        <div className="progress-bar bg-success" style={{ width: `${tenurePct}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-top border-secondary d-flex justify-content-between align-items-center gap-2">
                    <button className="btn btn-outline-danger btn-sm p-1.5 rounded-circle border-0" onClick={() => handleDeleteEmi(emi.id)} title="Delete EMI Record">
                      <FiTrash2 size={18} />
                    </button>

                    {!isPaid ? (
                      <button
                        className="btn btn-sm btn-primary rounded-pill px-4 fw-bold shadow flex-grow-1"
                        style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' }}
                        onClick={() => handlePayEmi(emi.id)}
                      >
                        <FiCheck className="me-1" /> Mark EMI Paid
                      </button>
                    ) : (
                      <span className="text-success fw-bold small d-flex align-items-center gap-1">
                        <FiCheckCircle /> Cleared For Month
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New EMI Modal */}
      {showAddModal && (
        <div className="modal-backdrop-custom d-flex align-items-center justify-content-center" style={{ position: 'fixed', inset: 0, zIndex: 1060, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="finora-card p-4 shadow-lg border-primary rounded-4" style={{ maxWidth: '480px', width: '92%', backgroundColor: '#0f172a', borderColor: '#38bdf8' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary">
              <h5 className="fw-bold text-white mb-0" style={{ color: '#ffffff' }}>Add New EMI Loan Record</h5>
              <button className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="mb-3">
                <label className="form-label text-white fw-bold small">Loan Title / Purpose</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary fw-semibold"
                  placeholder="e.g. Home Loan EMI, Car Loan, Laptop EMI"
                  value={newEmi.title}
                  onChange={(e) => setNewEmi({ ...newEmi, title: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-white fw-bold small">Lender / Bank Name</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary fw-semibold"
                  placeholder="e.g. HDFC Bank, Bajaj Finserv, SBI"
                  value={newEmi.lender}
                  onChange={(e) => setNewEmi({ ...newEmi, lender: e.target.value })}
                  required
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label text-white fw-bold small">Monthly EMI Amount (₹)</label>
                  <input
                    type="number"
                    className="form-control bg-dark text-white border-secondary fw-bold"
                    placeholder="e.g. 15000"
                    value={newEmi.amount}
                    onChange={(e) => setNewEmi({ ...newEmi, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-white fw-bold small">Due Date of Month</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    className="form-control bg-dark text-white border-secondary fw-bold"
                    placeholder="e.g. 5 for 5th"
                    value={newEmi.dueDate}
                    onChange={(e) => setNewEmi({ ...newEmi, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="row g-2 mb-4">
                <div className="col-6">
                  <label className="form-label text-white fw-bold small">Total Tenure (Months)</label>
                  <input
                    type="number"
                    className="form-control bg-dark text-white border-secondary fw-semibold"
                    placeholder="e.g. 36"
                    value={newEmi.tenureTotal}
                    onChange={(e) => setNewEmi({ ...newEmi, tenureTotal: e.target.value, tenureRemaining: e.target.value })}
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-white fw-bold small">Rate of Interest (% p.a.)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control bg-dark text-white border-secondary fw-bold text-info"
                    placeholder="e.g. 8.5"
                    value={newEmi.interestRate}
                    onChange={(e) => setNewEmi({ ...newEmi, interestRate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary btn-sm px-3 rounded-pill text-white" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm px-4 rounded-pill fw-bold shadow">
                  Save EMI Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
