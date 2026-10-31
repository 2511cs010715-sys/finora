import React, { useState, useEffect, useRef } from 'react';
import { FiPlus, FiTrash2, FiPieChart, FiTrendingUp, FiShield, FiPercent } from 'react-icons/fi';
import InvestmentAllocationChart from '../components/Charts/InvestmentAllocationChart';
import { getInvestments, addInvestment, deleteInvestment } from '../services/api';

const MOCK_INVESTMENTS = [
  { id: 1, investmentName: 'Nifty 50 Index SIP', investmentType: 'Mutual Funds', riskPreference: 'Medium Risk', investedAmount: 30000.00, investmentDate: '2026-01-15', expectedReturn: 12.50, description: 'Index fund monthly SIP' },
  { id: 2, investmentName: 'Tech Equities Basket', investmentType: 'Stocks', riskPreference: 'High Risk', investedAmount: 25000.00, investmentDate: '2026-03-10', expectedReturn: 15.00, description: 'Blue-chip technology stocks' },
  { id: 3, investmentName: 'Bank Fixed Deposit (FD)', investmentType: 'Fixed Deposit', riskPreference: 'Low Risk', investedAmount: 15000.00, investmentDate: '2026-05-01', expectedReturn: 7.20, description: 'Guaranteed term deposit' },
  { id: 4, investmentName: 'Monthly Recurring Deposit (RD)', investmentType: 'Recurring Deposit', riskPreference: 'Low Risk', investedAmount: 10000.00, investmentDate: '2026-06-01', expectedReturn: 6.80, description: 'Guaranteed RD monthly savings' },
  { id: 5, investmentName: 'Digital Sovereign Gold', investmentType: 'Gold', riskPreference: 'Low Risk', investedAmount: 5000.00, investmentDate: '2026-06-20', expectedReturn: 9.00, description: 'Gold ETF allocation' }
];

export default function InvestmentPage() {
  const [investments, setInvestments] = useState(MOCK_INVESTMENTS);
  const [showModal, setShowModal] = useState(false);
  const formRef = useRef(null);

  const handleOpenModal = () => {
    setShowModal(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };
  
  const [investmentName, setInvestmentName] = useState('');
  const [investmentType, setInvestmentType] = useState('Mutual Funds');
  const [riskPreference, setRiskPreference] = useState('Medium Risk');
  const [investedAmount, setInvestedAmount] = useState('');
  const [investmentDate, setInvestmentDate] = useState(new Date().toISOString().slice(0, 10));
  const [expectedReturn, setExpectedReturn] = useState('10.0');
  const [description, setDescription] = useState('');

  // Expected returns calculator state
  const [calcCapital, setCalcCapital] = useState(50000);
  const [calcRate, setCalcRate] = useState(12);
  const [calcYears, setCalcYears] = useState(5);

  const fetchInvestments = async () => {
    try {
      const res = await getInvestments();
      if (res.data && res.data.length > 0) setInvestments(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!investmentName || !investedAmount) return;

    try {
      await addInvestment({
        investmentName,
        investmentType,
        investedAmount: Number(investedAmount),
        investmentDate,
        expectedReturn: Number(expectedReturn),
        description
      });
      setShowModal(false);
      fetchInvestments();
    } catch (err) {
      setInvestments([...investments, {
        id: Date.now(),
        investmentName,
        investmentType,
        riskPreference,
        investedAmount: Number(investedAmount),
        investmentDate,
        expectedReturn: Number(expectedReturn),
        description
      }]);
      setShowModal(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInvestment(id);
      fetchInvestments();
    } catch (err) {
      setInvestments(investments.filter(i => i.id !== id));
    }
  };

  const totalInvestedVal = investments.reduce((acc, curr) => acc + Number(curr.investedAmount || 0), 0);

  // Quick Expected Returns Calculation: A = P * (1 + r*t)
  const calcEstReturn = Math.round(Number(calcCapital) * Math.pow(1 + Number(calcRate)/100, Number(calcYears)));
  const calcGain = Math.max(0, calcEstReturn - Number(calcCapital));

  return (
    <div className="container-fluid px-1 py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-light mb-1">Investment Planner & Asset Allocation</h2>
          <p className="text-muted small mb-0">Manage Fixed Deposit (FD), Recurring Deposit (RD), Mutual Funds, Stocks, and Gold by risk preference</p>
        </div>
        <button className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2" onClick={handleOpenModal}>
          <FiPlus /> Add Investment
        </button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="finplanner-card p-4">
            <small className="text-muted fw-semibold">Total Invested Portfolio Capital</small>
            <h2 className="fw-extrabold text-light mt-1 mb-3">₹{totalInvestedVal.toLocaleString()}</h2>
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                <thead>
                  <tr className="text-muted border-secondary">
                    <th>Investment Name</th>
                    <th>Asset Category</th>
                    <th>Risk Profile</th>
                    <th>Capital</th>
                    <th>Exp. Return</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map(item => (
                    <tr key={item.id}>
                      <td className="fw-bold text-light">{item.investmentName}</td>
                      <td>
                        <span className="badge bg-secondary-subtle text-secondary border border-secondary">
                          {item.investmentType}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${item.riskPreference?.includes('High') ? 'bg-danger-subtle text-danger' : item.riskPreference?.includes('Medium') ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'}`}>
                          {item.riskPreference || 'Low Risk'}
                        </span>
                      </td>
                      <td className="fw-extrabold text-success">₹{Number(item.investedAmount).toLocaleString()}</td>
                      <td className="fw-bold text-info">+{item.expectedReturn}%</td>
                      <td>
                        <button className="btn btn-outline-danger btn-sm p-1 rounded-circle border-0" onClick={() => handleDelete(item.id)}>
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <InvestmentAllocationChart investments={investments} />
        </div>
      </div>

      {/* Expected Returns Calculator Widget */}
      <div className="finplanner-card p-4 border-info">
        <div className="d-flex align-items-center gap-2 mb-3 text-info">
          <FiPercent size={22} />
          <h5 className="fw-bold text-light mb-0">Expected Returns Calculator</h5>
        </div>

        <div className="row g-4 align-items-center">
          <div className="col-md-7">
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label text-muted small">Invested Capital (₹)</label>
                <input
                  type="number"
                  className="form-control bg-dark text-light border-secondary"
                  value={calcCapital}
                  onChange={(e) => setCalcCapital(e.target.value)}
                />
              </div>
              <div className="col-3">
                <label className="form-label text-muted small">Return (%)</label>
                <input
                  type="number"
                  className="form-control bg-dark text-light border-secondary"
                  value={calcRate}
                  onChange={(e) => setCalcRate(e.target.value)}
                />
              </div>
              <div className="col-3">
                <label className="form-label text-muted small">Years</label>
                <input
                  type="number"
                  className="form-control bg-dark text-light border-secondary"
                  value={calcYears}
                  onChange={(e) => setCalcYears(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="col-md-5 text-center">
            <div className="p-3 bg-dark rounded border border-secondary">
              <small className="text-muted d-block">Projected Future Valuation</small>
              <h3 className="fw-extrabold text-success mb-1">₹{calcEstReturn.toLocaleString()}</h3>
              <small className="text-info">Estimated Capital Gain: +₹{calcGain.toLocaleString()}</small>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop-custom">
          <div ref={formRef} className="finplanner-card p-4 shadow-lg" style={{ maxWidth: '440px', width: '90%', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.2)' }}>
            <h5 className="fw-bold text-light mb-3">Add Investment Position</h5>
            <form onSubmit={handleAddSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small">Investment Name</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="e.g. Nifty 50 SIP, Bank FD"
                  value={investmentName}
                  onChange={(e) => setInvestmentName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Asset Category</label>
                <select className="form-select bg-dark text-light border-secondary" value={investmentType} onChange={(e) => setInvestmentType(e.target.value)}>
                  <option value="Fixed Deposit">Fixed Deposit (FD)</option>
                  <option value="Recurring Deposit">Recurring Deposit (RD)</option>
                  <option value="Mutual Funds">Mutual Funds</option>
                  <option value="Stocks">Stocks & Equities</option>
                  <option value="Gold">Gold & ETFs</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Risk Preference</label>
                <select className="form-select bg-dark text-light border-secondary" value={riskPreference} onChange={(e) => setRiskPreference(e.target.value)}>
                  <option value="Low Risk">Low Risk (Guaranteed)</option>
                  <option value="Medium Risk">Medium Risk (Balanced)</option>
                  <option value="High Risk">High Risk (Aggressive)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Invested Amount (₹)</label>
                <input
                  type="number"
                  step="any"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="25000"
                  value={investedAmount}
                  onChange={(e) => setInvestedAmount(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Expected Return Rate (%)</label>
                <input
                  type="number"
                  step="any"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="12.0"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small">Investment Date</label>
                <input
                  type="date"
                  className="form-control bg-dark text-light border-secondary"
                  value={investmentDate}
                  onChange={(e) => setInvestmentDate(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-secondary w-50" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary w-50 fw-bold">Save Position</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
