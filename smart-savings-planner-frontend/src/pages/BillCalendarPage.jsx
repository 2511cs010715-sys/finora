import React, { useState } from 'react';
import { FiCalendar, FiBell, FiCheckCircle, FiClock, FiAlertTriangle, FiRefreshCw, FiDollarSign } from 'react-icons/fi';

const MOCK_BILLS = [
  { id: 1, title: '🏠 Home Rent / Maintenance', amount: 12000, dueDate: '2026-10-05', category: 'Housing', isRecurring: true, status: 'UNPAID', alert: 'Due in 4 Days' },
  { id: 2, title: '🚗 Auto Loan EMI', amount: 8500, dueDate: '2026-10-10', category: 'EMI', isRecurring: true, status: 'UNPAID', alert: 'Recurring EMI' },
  { id: 3, title: '⚡ Electricity & Power Utility', amount: 1800, dueDate: '2026-10-14', category: 'Utilities', isRecurring: true, status: 'UNPAID', alert: 'Normal Utility' },
  { id: 4, title: '🌐 Fiber Broadband Internet', amount: 999, dueDate: '2026-10-18', category: 'Utilities', isRecurring: true, status: 'UNPAID', alert: 'Auto-Debit Ready' },
  { id: 5, title: '📱 Mobile Postpaid Plan', amount: 799, dueDate: '2026-09-28', category: 'Utilities', isRecurring: true, status: 'PAID', alert: 'Paid on Time' }
];

export default function BillCalendarPage() {
  const [bills, setBills] = useState(MOCK_BILLS);

  const toggleStatus = (id) => {
    setBills(bills.map(b => b.id === id ? { ...b, status: b.status === 'PAID' ? 'UNPAID' : 'PAID' } : b));
  };

  const totalUpcoming = bills.filter(b => b.status === 'UNPAID').reduce((acc, b) => acc + b.amount, 0);

  return (
    <div className="container-fluid px-1 py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 text-warning mb-1">
            <div className="p-2 bg-warning-subtle text-warning rounded-3">
              <FiCalendar size={24} />
            </div>
            <h2 className="fw-bold text-light mb-0">Bill & EMI Calendar</h2>
          </div>
          <p className="text-muted small mb-0">Track upcoming utility bills, recurring payment detection, and EMI due dates.</p>
        </div>

        <span className="badge bg-warning-subtle text-warning border border-warning px-3 py-2 rounded-pill fw-bold">
          🔔 {bills.filter(b => b.status === 'UNPAID').length} Upcoming Bills (₹{totalUpcoming.toLocaleString()})
        </span>
      </div>

      {/* Smart Spending Alert Banner */}
      <div className="alert alert-warning border-warning-subtle bg-dark text-warning p-3 mb-4 d-flex align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-3">
          <FiAlertTriangle size={24} className="flex-shrink-0" />
          <div>
            <strong>SMART SPENDING ALERT:</strong> Housing Rent & Auto EMI due within 10 days. Ensure ₹20,500 liquid balance in bank account.
          </div>
        </div>
        <span className="badge bg-warning text-dark fw-bold">Active Threshold</span>
      </div>

      {/* Bills Calendar Grid */}
      <div className="row g-4 mb-4">
        {bills.map(b => (
          <div key={b.id} className="col-md-6 col-lg-4">
            <div className={`finplanner-card p-4 h-100 d-flex flex-column justify-content-between ${b.status === 'PAID' ? 'border-success' : 'border-warning'}`}>
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className={`badge ${b.status === 'PAID' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                    {b.status}
                  </span>
                  {b.isRecurring && (
                    <span className="badge bg-dark text-info border border-secondary">
                      <FiRefreshCw className="me-1" /> Recurring
                    </span>
                  )}
                </div>

                <h5 className="fw-bold text-light mb-1">{b.title}</h5>
                <small className="text-muted d-block mb-3">Due Date: <strong>{b.dueDate}</strong> ({b.alert})</small>

                <div className="p-3 bg-dark rounded border border-secondary mb-3">
                  <span className="text-muted small d-block">Amount Due</span>
                  <h3 className="fw-extrabold text-light mb-0">₹{b.amount.toLocaleString()}</h3>
                </div>
              </div>

              <button
                className={`btn w-100 rounded-pill fw-bold ${b.status === 'PAID' ? 'btn-outline-secondary text-light' : 'btn-success'}`}
                onClick={() => toggleStatus(b.id)}
              >
                {b.status === 'PAID' ? 'Mark as Unpaid' : 'Mark Bill Paid ✓'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
