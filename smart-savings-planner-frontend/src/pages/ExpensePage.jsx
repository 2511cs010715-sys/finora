import React, { useState, useEffect, useRef } from 'react';
import CsvImportModal from '../components/CsvImportModal';
import { FiPlus, FiTrash2, FiSearch, FiFilter, FiDollarSign, FiCreditCard, FiUpload, FiDownload } from 'react-icons/fi';
import { getExpenses, addExpense, deleteExpense } from '../services/api';

const MOCK_EXPENSES = [
  { id: 1, expenseName: 'Grocery & Organics', category: '🍔 Food', amount: 6500.00, expenseDate: '2026-08-02', paymentMethod: 'UPI', description: 'Supermarket groceries' },
  { id: 2, expenseName: 'Apartment Rent & Maint.', category: '💡 Bills', amount: 12000.00, expenseDate: '2026-08-03', paymentMethod: 'Bank Transfer', description: 'Monthly housing rent' },
  { id: 3, expenseName: 'Fuel & Transit', category: '🚗 Travel', amount: 3200.00, expenseDate: '2026-08-05', paymentMethod: 'Credit Card', description: 'Vehicle petrol & Metro' },
  { id: 4, expenseName: 'Online Learning Course', category: '🎓 Education', amount: 4000.00, expenseDate: '2026-08-08', paymentMethod: 'UPI', description: 'Full-Stack Certification' },
  { id: 5, expenseName: 'Apparel & Gadgets', category: '🛍️ Shopping', amount: 2300.00, expenseDate: '2026-08-11', paymentMethod: 'Debit Card', description: 'Monthly shopping' },
  { id: 6, expenseName: 'Broadband & Power', category: '💡 Bills', amount: 2800.00, expenseDate: '2026-08-12', paymentMethod: 'UPI', description: 'Internet and utility bill' }
];

export default function ExpensePage() {
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const formRef = useRef(null);

  const handleOpenModal = () => {
    setShowModal(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const [expenseName, setExpenseName] = useState('');
  const [category, setCategory] = useState('🍔 Food');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [description, setDescription] = useState('');

  const fetchExpenses = async () => {
    try {
      const res = await getExpenses();
      if (res.data && res.data.length > 0) setExpenses(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!expenseName || !amount) return;

    const newExpenseObj = {
      id: Date.now(),
      expenseName: expenseName.trim(),
      category,
      amount: Number(amount),
      expenseDate,
      paymentMethod,
      description: description || 'Direct expense entry'
    };

    try {
      await addExpense(newExpenseObj);
    } catch (err) {
      // Offline fallback
    }

    setExpenses(prev => [newExpenseObj, ...prev]);
    setExpenseName('');
    setAmount('');
    setDescription('');
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
    } catch (err) {}
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const handleExportCsv = () => {
    const headers = ['Expense Name', 'Category', 'Amount (INR)', 'Date', 'Payment Method', 'Description'];
    const rows = expenses.map(e => [
      `"${e.expenseName}"`,
      `"${e.category}"`,
      e.amount,
      `"${e.expenseDate}"`,
      `"${e.paymentMethod}"`,
      `"${e.description || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Finora_Expenses_Statement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCsvImportSuccess = (importedItems) => {
    if (importedItems && importedItems.length > 0) {
      setExpenses(prev => [...importedItems, ...prev]);
    } else {
      fetchExpenses();
    }
  };

  const filtered = expenses.filter(e =>
    e.expenseName.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalExpensesVal = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const categoryTotals = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount || 0);
  });
  const highestCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b, '💡 Bills');

  const renderPaymentBadge = (method) => {
    switch (method) {
      case 'UPI':
        return <span className="badge px-2.5 py-1.5 fw-bold" style={{ backgroundColor: 'rgba(168, 85, 247, 0.22)', color: '#c084fc', border: '1px solid #c084fc' }}>📱 UPI</span>;
      case 'Credit Card':
        return <span className="badge px-2.5 py-1.5 fw-bold" style={{ backgroundColor: 'rgba(239, 68, 68, 0.22)', color: '#f87171', border: '1px solid #f87171' }}>💳 Credit Card</span>;
      case 'Debit Card':
        return <span className="badge px-2.5 py-1.5 fw-bold" style={{ backgroundColor: 'rgba(56, 189, 248, 0.22)', color: '#38bdf8', border: '1px solid #38bdf8' }}>💳 Debit Card</span>;
      case 'Cash':
        return <span className="badge px-2.5 py-1.5 fw-bold" style={{ backgroundColor: 'rgba(16, 185, 129, 0.22)', color: '#34d399', border: '1px solid #34d399' }}>👛 Cash</span>;
      case 'Bank Transfer':
        return <span className="badge px-2.5 py-1.5 fw-bold" style={{ backgroundColor: 'rgba(245, 158, 11, 0.22)', color: '#fbbf24', border: '1px solid #fbbf24' }}>🏦 Bank Transfer</span>;
      default:
        return <span className="badge px-2.5 py-1.5 fw-bold bg-secondary text-white">{method}</span>;
    }
  };

  return (
    <div className="container-fluid px-1 py-2">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-extrabold text-white mb-1" style={{ color: '#ffffff' }}>Expense Management & Spending History</h2>
          <p className="fw-medium mb-0" style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>Record, categorize, and track daily/monthly expenditures</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-outline-secondary rounded-pill px-3 fw-bold d-flex align-items-center gap-2 text-white border-secondary" onClick={handleExportCsv}>
            <FiDownload /> Export CSV
          </button>
          <button className="btn btn-outline-info rounded-pill px-3 fw-bold d-flex align-items-center gap-2" onClick={() => setShowCsvModal(true)}>
            <FiUpload /> Import CSV Statement
          </button>
          <button className="btn btn-danger rounded-pill px-4 fw-bold d-flex align-items-center gap-2 shadow" onClick={handleOpenModal}>
            <FiPlus /> Add Expense
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="finora-card p-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}>
            <small className="fw-bold text-uppercase d-block mb-1" style={{ color: '#f87171', letterSpacing: '0.04em' }}>Total Monthly Expenses</small>
            <h2 className="fw-extrabold text-white mt-1 mb-0" style={{ color: '#ffffff' }}>₹{totalExpensesVal.toLocaleString()}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="finora-card p-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}>
            <small className="fw-bold text-uppercase d-block mb-1" style={{ color: '#fbbf24', letterSpacing: '0.04em' }}>Highest Spending Category</small>
            <h2 className="fw-extrabold text-white mt-1 mb-0" style={{ color: '#ffffff' }}>{highestCategory}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="finora-card p-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}>
            <small className="fw-bold text-uppercase d-block mb-1" style={{ color: '#38bdf8', letterSpacing: '0.04em' }}>Average Daily Outflow</small>
            <h2 className="fw-extrabold text-white mt-1 mb-0" style={{ color: '#ffffff' }}>₹{Math.round(totalExpensesVal / 30).toLocaleString()} / day</h2>
          </div>
        </div>
      </div>

      <div className="finplanner-card p-4">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-3">
          <h5 className="fw-bold text-light mb-0">Daily & Monthly Expense History</h5>
          <div className="input-group" style={{ maxWidth: '280px' }}>
            <span className="input-group-text bg-dark text-muted border-secondary">
              <FiSearch />
            </span>
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr style={{ color: '#ffffff', backgroundColor: 'rgba(15, 23, 42, 0.95)', borderBottom: '2px solid rgba(255, 255, 255, 0.15)' }}>
                <th style={{ color: '#ffffff', fontSize: '0.92rem' }}>Expense Name</th>
                <th style={{ color: '#ffffff', fontSize: '0.92rem' }}>Category</th>
                <th style={{ color: '#ffffff', fontSize: '0.92rem' }}>Amount</th>
                <th style={{ color: '#38bdf8', fontSize: '0.92rem' }}>Date 📅</th>
                <th style={{ color: '#ffffff', fontSize: '0.92rem' }}>Payment Method</th>
                <th style={{ color: '#ffffff', fontSize: '0.92rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id} style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <td className="fw-extrabold text-white" style={{ color: '#ffffff', fontSize: '0.95rem' }}>{item.expenseName}</td>
                  <td>
                    <span className="badge px-2.5 py-1.5 fw-bold" style={{ backgroundColor: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.5)' }}>
                      {item.category}
                    </span>
                  </td>
                  <td className="fw-extrabold text-danger" style={{ fontSize: '1rem', color: '#f87171' }}>₹{Number(item.amount).toLocaleString()}</td>
                  <td className="fw-bold" style={{ color: '#38bdf8', fontSize: '0.92rem' }}>{item.expenseDate}</td>
                  <td>
                    {renderPaymentBadge(item.paymentMethod)}
                  </td>
                  <td>
                    <button className="btn btn-outline-danger btn-sm p-1 rounded-circle border-0" onClick={() => handleDelete(item.id)} title="Delete record">
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
          <div ref={formRef} className="finplanner-card p-4 shadow-lg" style={{ maxWidth: '440px', width: '90%', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.2)' }}>
            <h5 className="fw-bold text-light mb-3">Add Expense Record</h5>
            <form onSubmit={handleAddSubmit}>
              <div className="mb-3">
                <label className="form-label text-muted small">Expense Name</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="e.g. Supermarket Grocery, Utility Bill"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Category</label>
                <select className="form-select bg-dark text-light border-secondary" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="🍔 Food">🍔 Food</option>
                  <option value="🎓 Education">🎓 Education</option>
                  <option value="🚗 Travel">🚗 Travel</option>
                  <option value="🛍️ Shopping">🛍️ Shopping</option>
                  <option value="💡 Bills">💡 Bills</option>
                  <option value="📦 Others">📦 Others</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Amount (₹)</label>
                <input
                  type="number"
                  step="any"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="2500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Date</label>
                <input
                  type="date"
                  className="form-control bg-dark text-light border-secondary"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Payment Method</label>
                <select className="form-select bg-dark text-light border-secondary" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="UPI">UPI</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button type="button" className="btn btn-secondary w-50" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-danger w-50 fw-bold">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CsvImportModal isOpen={showCsvModal} onClose={() => setShowCsvModal(false)} onImportSuccess={handleCsvImportSuccess} />
    </div>
  );
}

