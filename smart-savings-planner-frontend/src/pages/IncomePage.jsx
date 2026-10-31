import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiDollarSign, FiCalendar, FiTag } from 'react-icons/fi';
import { getIncome, addIncome, deleteIncome } from '../services/api';

const MOCK_INCOME = [
  { id: 1, source: 'Tech Corp Salary', category: 'Salary', amount: 45000.00, incomeDate: '2026-08-01', description: 'Monthly primary paycheck' },
  { id: 2, source: 'Freelance Web Design', category: 'Freelance', amount: 5000.00, incomeDate: '2026-08-10', description: 'UI/UX client redesign' }
];

export default function IncomePage() {
  const [incomes, setIncomes] = useState(MOCK_INCOME);
  const [showModal, setShowModal] = useState(false);
  
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('Salary');
  const [amount, setAmount] = useState('');
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');

  const fetchIncomes = async () => {
    try {
      const res = await getIncome();
      if (res.data && res.data.length > 0) setIncomes(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!source || !amount) return;

    try {
      await addIncome({
        source,
        category,
        amount: Number(amount),
        incomeDate,
        description
      });
      setShowModal(false);
      fetchIncomes();
    } catch (err) {
      setIncomes([{
        id: Date.now(),
        source,
        category,
        amount: Number(amount),
        incomeDate,
        description
      }, ...incomes]);
      setShowModal(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteIncome(id);
      fetchIncomes();
    } catch (err) {
      setIncomes(incomes.filter(i => i.id !== id));
    }
  };

  const totalIncomeVal = incomes.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return (
    <div className="container-fluid px-1 py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-light mb-1">Income Stream Manager</h2>
          <p className="text-muted small mb-0">Record and categorize primary salary, freelance, and business income</p>
        </div>
        <button className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <FiPlus /> Add Income
        </button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="finplanner-card p-4">
            <small className="text-muted fw-semibold">Total Monthly Inflow</small>
            <h2 className="fw-extrabold text-success mt-1 mb-0">₹{totalIncomeVal.toLocaleString()}</h2>
          </div>
        </div>
        <div className="col-md-6">
          <div className="finplanner-card p-4">
            <small className="text-muted fw-semibold">Recorded Transactions</small>
            <h2 className="fw-extrabold text-light mt-1 mb-0">{incomes.length} Entries</h2>
          </div>
        </div>
      </div>

      <div className="finplanner-card p-4">
        <h5 className="fw-bold text-light mb-3">Income History Statement</h5>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr className="text-muted border-secondary">
                <th>Source Name</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map(item => (
                <tr key={item.id}>
                  <td className="fw-bold text-light">{item.source}</td>
                  <td>
                    <span className="badge bg-primary-subtle text-primary border border-primary">
                      {item.category}
                    </span>
                  </td>
                  <td className="fw-extrabold text-success">₹{Number(item.amount).toLocaleString()}</td>
                  <td className="text-muted small">{item.incomeDate}</td>
                  <td className="text-muted small">{item.description || '-'}</td>
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

      {showModal && (
        <div className="modal-backdrop-custom">
          <div className="finplanner-card p-4" style={{ maxWidth: '440px', width: '90%' }}>
            <h5 className="fw-bold text-light mb-3">Add Income Entry</h5>
            <form onSubmit={handleAddSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small">Income Source Name</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="e.g. Salary, Client Invoice"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Category</label>
                <select className="form-select bg-dark text-light border-secondary" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Business">Business</option>
                  <option value="Allowance">Allowance</option>
                  <option value="Interest">Interest</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Amount (₹)</label>
                <input
                  type="number"
                  step="any"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="45000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Income Date</label>
                <input
                  type="date"
                  className="form-control bg-dark text-light border-secondary"
                  value={incomeDate}
                  onChange={(e) => setIncomeDate(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small">Description (Optional)</label>
                <textarea
                  className="form-control bg-dark text-light border-secondary"
                  rows="2"
                  placeholder="Notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-secondary w-50" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary w-50 fw-bold">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
