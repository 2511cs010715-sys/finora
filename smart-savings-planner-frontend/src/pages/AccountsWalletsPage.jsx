import React, { useState } from 'react';
import { FiCreditCard, FiDollarSign, FiPlus, FiTrash2, FiCheckCircle, FiLock, FiUnlock, FiShield } from 'react-icons/fi';
import PinSecurityModal from '../components/PinSecurityModal';

const MOCK_ACCOUNTS = [
  { id: 1, name: '🏦 HDFC Bank Salary Account', type: 'Bank Account', balance: 82450.00, accountNo: '•••• 4892', isPrimary: true },
  { id: 2, name: '🏦 SBI Savings Account', type: 'Bank Account', balance: 42800.00, accountNo: '•••• 1120', isPrimary: false },
  { id: 3, name: '💳 HDFC Regalia Credit Card', type: 'Credit Card', balance: -12450.00, accountNo: '•••• 8831', isPrimary: false },
  { id: 4, name: '👛 Cash Wallet Reserve', type: 'Cash', balance: 5200.00, accountNo: 'Physical Cash', isPrimary: false },
  { id: 5, name: '📱 Paytm / PhonePe UPI Wallet', type: 'UPI Wallet', balance: 2800.00, accountNo: 'varshini@upi', isPrimary: false }
];

export default function AccountsWalletsPage() {
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
  const [showModal, setShowModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const [name, setName] = useState('');
  const [type, setType] = useState('Bank Account');
  const [balance, setBalance] = useState('');

  const totalAssets = accounts.filter(a => a.balance > 0).reduce((acc, a) => acc + a.balance, 0);
  const totalLiabilities = Math.abs(accounts.filter(a => a.balance < 0).reduce((acc, a) => acc + a.balance, 0));
  const netPosition = totalAssets - totalLiabilities;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !balance) return;
    setAccounts([...accounts, {
      id: Date.now(),
      name,
      type,
      balance: Number(balance),
      accountNo: '•••• New',
      isPrimary: false
    }]);
    setShowModal(false);
    setName('');
    setBalance('');
  };

  const handleDelete = (id) => {
    setAccounts(accounts.filter(a => a.id !== id));
  };

  const renderBadge = (accType) => {
    switch (accType) {
      case 'Bank Account':
        return <span className="badge px-3 py-2 fw-bold fs-6" style={{ backgroundColor: 'rgba(56, 189, 248, 0.22)', color: '#38bdf8', border: '1px solid #38bdf8' }}>🏦 Bank Account</span>;
      case 'Credit Card':
        return <span className="badge px-3 py-2 fw-bold fs-6" style={{ backgroundColor: 'rgba(239, 68, 68, 0.22)', color: '#f87171', border: '1px solid #f87171' }}>💳 Credit Card</span>;
      case 'Cash':
        return <span className="badge px-3 py-2 fw-bold fs-6" style={{ backgroundColor: 'rgba(16, 185, 129, 0.22)', color: '#34d399', border: '1px solid #34d399' }}>👛 Cash</span>;
      case 'UPI Wallet':
        return <span className="badge px-3 py-2 fw-bold fs-6" style={{ backgroundColor: 'rgba(168, 85, 247, 0.22)', color: '#c084fc', border: '1px solid #c084fc' }}>📱 UPI Wallet</span>;
      default:
        return <span className="badge px-3 py-2 fw-bold fs-6 bg-primary text-white">{accType}</span>;
    }
  };

  return (
    <div className="container-fluid px-1 py-2">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 pb-3 border-bottom border-secondary">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="p-2 bg-primary bg-opacity-25 text-primary rounded-circle border border-primary">
              <FiShield size={22} />
            </span>
            <h2 className="fw-extrabold text-white mb-0" style={{ color: '#ffffff', letterSpacing: '-0.02em' }}>
              Accounts & Wallets Management
            </h2>
          </div>
          <p className="fw-medium mb-0" style={{ color: '#e2e8f0', fontSize: '0.94rem' }}>
            Biometric-protected tracking for <strong style={{ color: '#38bdf8' }}>Bank Accounts</strong>, <strong style={{ color: '#f87171' }}>Credit Debt</strong>, <strong style={{ color: '#34d399' }}>Cash</strong>, and <strong style={{ color: '#c084fc' }}>UPI Wallets</strong>
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Biometric Lock / Unlock Toggle Button */}
          <button
            className={`btn btn-sm rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-1.5 shadow ${isUnlocked ? 'btn-outline-success text-success border-success' : 'btn-outline-warning text-warning border-warning'}`}
            onClick={() => {
              if (isUnlocked) {
                setIsUnlocked(false);
              } else {
                setShowPinModal(true);
              }
            }}
          >
            {isUnlocked ? (
              <>
                <FiUnlock size={18} /> <span>Balances Unlocked</span>
              </>
            ) : (
              <>
                <FiLock size={18} /> <span>Unlock Balances (PIN / Biometric)</span>
              </>
            )}
          </button>

          <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2 shadow" onClick={() => setShowModal(true)}>
            <FiPlus size={20} /> Add Account
          </button>
        </div>
      </div>

      {/* Security Status Banner */}
      {!isUnlocked && (
        <div className="alert alert-warning border-warning-subtle bg-dark text-warning p-3 mb-4 rounded-3 d-flex align-items-center justify-content-between shadow">
          <div className="d-flex align-items-center gap-2">
            <FiLock size={20} className="text-warning flex-shrink-0" />
            <span className="fw-semibold small">
              Accounts & Wallets balances are currently protected with 256-Bit SSL & Biometric Lock. Click "Unlock Balances" to view exact numbers.
            </span>
          </div>
          <button className="btn btn-warning btn-sm rounded-pill px-3 fw-bold" onClick={() => setShowPinModal(true)}>
            Scan Touch ID / PIN
          </button>
        </div>
      )}

      {/* Net Position Summary Row */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="finora-card p-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}>
            <small className="fw-bold text-uppercase d-block mb-1" style={{ color: '#34d399', letterSpacing: '0.04em' }}>Total Liquid Assets</small>
            <h2 className="fw-extrabold text-white mt-1 mb-0" style={{ color: '#ffffff' }}>
              {isUnlocked ? `₹${totalAssets.toLocaleString()}` : '••••••••'}
            </h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="finora-card p-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}>
            <small className="fw-bold text-uppercase d-block mb-1" style={{ color: '#f87171', letterSpacing: '0.04em' }}>Total Credit Card Debt</small>
            <h2 className="fw-extrabold text-white mt-1 mb-0" style={{ color: '#ffffff' }}>
              {isUnlocked ? `₹${totalLiabilities.toLocaleString()}` : '••••••••'}
            </h2>
          </div>
        </div>

        <div className="col-md-4">
          <div className="finora-card p-4 border-primary" style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}>
            <small className="fw-bold text-uppercase d-block mb-1" style={{ color: '#38bdf8', letterSpacing: '0.04em' }}>Net Cash Position</small>
            <h2 className="fw-extrabold text-white mt-1 mb-0" style={{ color: '#ffffff' }}>
              {isUnlocked ? `₹${netPosition.toLocaleString()}` : '••••••••'}
            </h2>
          </div>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="row g-4">
        {accounts.map(acc => (
          <div key={acc.id} className="col-md-6 col-lg-4">
            <div className={`finora-card p-4 h-100 d-flex flex-column justify-content-between ${acc.balance < 0 ? 'border-danger' : 'border-secondary'}`} style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}>
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  {renderBadge(acc.type)}
                  <button className="btn btn-outline-danger btn-sm p-1 rounded-circle border-0" onClick={() => handleDelete(acc.id)} title="Delete Account">
                    <FiTrash2 size={18} />
                  </button>
                </div>

                <h4 className="fw-extrabold text-white mb-1" style={{ color: '#ffffff' }}>{acc.name}</h4>
                <small className="fw-semibold d-block mb-3" style={{ color: '#94a3b8', fontSize: '0.88rem' }}>{acc.accountNo}</small>

                <div className="p-3 rounded border border-secondary" style={{ backgroundColor: 'rgba(8, 11, 24, 0.95)' }}>
                  <span className="fw-bold text-uppercase d-block mb-1" style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Available Balance</span>
                  <h3 className={`fw-extrabold mb-0 ${acc.balance < 0 ? 'text-danger' : 'text-success'}`} style={{ color: acc.balance < 0 ? '#f87171' : '#34d399' }}>
                    {isUnlocked ? (acc.balance < 0 ? `-${Math.abs(acc.balance).toLocaleString()}` : `₹${acc.balance.toLocaleString()}`) : '••••••••'}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Account Modal */}
      {showModal && (
        <div className="modal-backdrop-custom d-flex align-items-center justify-content-center" style={{ position: 'fixed', inset: 0, zIndex: 1060, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="finora-card p-4 shadow-lg border-primary rounded-4" style={{ maxWidth: '440px', width: '90%', backgroundColor: '#0f172a', borderColor: '#38bdf8' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary">
              <h4 className="fw-bold text-white mb-0" style={{ color: '#ffffff' }}>Add Account / Wallet</h4>
              <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="form-label text-white fw-bold small" style={{ color: '#ffffff' }}>Account Name</label>
                <input
                  type="text"
                  className="form-control text-white border-secondary fw-medium"
                  style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                  placeholder="e.g. HDFC Bank, SBI Account"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-white fw-bold small" style={{ color: '#ffffff' }}>Account Type</label>
                <select className="form-select text-white border-secondary fw-semibold" style={{ backgroundColor: '#0f172a', color: '#ffffff' }} value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="Bank Account" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>🏦 Bank Account</option>
                  <option value="Credit Card" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>💳 Credit Card</option>
                  <option value="Cash" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>👛 Cash</option>
                  <option value="UPI Wallet" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>📱 UPI Wallet</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label text-white fw-bold small" style={{ color: '#ffffff' }}>Current Balance (₹)</label>
                <input
                  type="number"
                  step="any"
                  className="form-control text-white border-secondary fw-bold"
                  style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
                  placeholder="e.g. 25000 or -5000 for credit card"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary btn-sm w-50 rounded-pill text-white" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm w-50 rounded-pill fw-bold shadow">Save Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PIN & Biometric Security Lock Modal */}
      <PinSecurityModal
        isOpen={showPinModal}
        onClose={() => {
          setShowPinModal(false);
          setIsUnlocked(true);
        }}
      />
    </div>
  );
}
