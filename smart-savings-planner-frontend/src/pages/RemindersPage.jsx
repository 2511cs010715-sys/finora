import React, { useState, useEffect } from 'react';
import { FiClock, FiPlus, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { getReminders, createReminder, deleteReminder } from '../services/api';

const MOCK_REMINDERS = [
  { id: 1, reminderType: 'Monthly Savings', title: 'Transfer ₹15,000 to Emergency Fund Goal', reminderDate: '2026-08-25', status: 'ACTIVE' },
  { id: 2, reminderType: 'Bill Reminder', title: 'Pay Broadband & Utility Bill', reminderDate: '2026-08-28', status: 'ACTIVE' },
  { id: 3, reminderType: 'Investment Contribution', title: 'Execute Monthly Index Fund SIP', reminderDate: '2026-09-01', status: 'ACTIVE' }
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState(MOCK_REMINDERS);
  const [showModal, setShowModal] = useState(false);
  
  const [reminderType, setReminderType] = useState('Monthly Savings');
  const [title, setTitle] = useState('');
  const [reminderDate, setReminderDate] = useState(new Date(Date.now() + 7*24*60*60*1000).toISOString().slice(0, 10));

  const fetchReminders = async () => {
    try {
      const res = await getReminders();
      if (res.data && res.data.length > 0) setReminders(res.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      await createReminder({
        reminderType,
        title,
        reminderDate,
        status: 'ACTIVE'
      });
      setShowModal(false);
      fetchReminders();
    } catch (err) {
      setReminders([...reminders, {
        id: Date.now(),
        reminderType,
        title,
        reminderDate,
        status: 'ACTIVE'
      }]);
      setShowModal(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReminder(id);
      fetchReminders();
    } catch (err) {
      setReminders(reminders.filter(r => r.id !== id));
    }
  };

  return (
    <div className="container-fluid px-1 py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-light mb-1">Financial Reminders & Alerts</h2>
          <p className="text-muted small mb-0">Set automated alerts for bill payments, goal contributions, and monthly savings transfers</p>
        </div>
        <button className="btn btn-primary rounded-pill px-4 fw-bold d-flex align-items-center gap-2" onClick={() => setShowModal(true)}>
          <FiPlus /> Create Reminder
        </button>
      </div>

      <div className="finplanner-card p-4">
        <h5 className="fw-bold text-light mb-3">Active Scheduled Reminders</h5>
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr className="text-muted border-secondary">
                <th>Reminder Type</th>
                <th>Title / Instructions</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map(r => (
                <tr key={r.id}>
                  <td>
                    <span className="badge bg-primary-subtle text-primary border border-primary">
                      {r.reminderType}
                    </span>
                  </td>
                  <td className="fw-bold text-light">{r.title}</td>
                  <td className="text-muted small">{r.reminderDate}</td>
                  <td>
                    <span className={`badge ${r.status === 'ACTIVE' ? 'bg-success-subtle text-success' : 'bg-secondary'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline-danger btn-sm p-1 rounded-circle border-0" onClick={() => handleDelete(r.id)}>
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
          <div className="finplanner-card p-4" style={{ maxWidth: '420px', width: '90%' }}>
            <h5 className="fw-bold text-light mb-3">Create Financial Reminder</h5>
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label className="form-label text-muted small">Reminder Type</label>
                <select className="form-select bg-dark text-light border-secondary" value={reminderType} onChange={(e) => setReminderType(e.target.value)}>
                  <option value="Monthly Savings">Monthly Savings Transfer</option>
                  <option value="Expense Review">Expense Review</option>
                  <option value="Goal Contribution">Goal Contribution</option>
                  <option value="Investment Contribution">Investment SIP Contribution</option>
                  <option value="Bill Reminder">Bill & Utility Reminder</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small">Reminder Title</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="e.g. Pay Internet Bill"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted small">Due Date</label>
                <input
                  type="date"
                  className="form-control bg-dark text-light border-secondary"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-secondary w-50" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary w-50 fw-bold">Set Reminder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
