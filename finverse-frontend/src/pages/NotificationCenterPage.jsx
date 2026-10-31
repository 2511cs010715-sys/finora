import React, { useState } from 'react';
import { FiBell, FiCpu, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'ALERT', title: 'Price Threshold Alert Triggered', text: 'RELIANCE crossed above target threshold ₹2,950.00.', time: '10 mins ago', icon: FiAlertCircle, color: 'text-warning' },
  { id: 2, type: 'PREDICTION', title: 'AI Prediction Completed', text: 'Random Forest model completed 7-day forecast for AAPL (Target: $231.40, Confidence: 92.1%).', time: '1 hour ago', icon: FiCpu, color: 'text-primary' },
  { id: 3, type: 'SYSTEM', title: 'Monthly Summary Ready', text: 'August financial summary report is generated and ready for download.', time: '5 hours ago', icon: FiCheckCircle, color: 'text-success' }
];

export default function NotificationCenterPage() {
  const [list, setList] = useState(INITIAL_NOTIFICATIONS);

  const clearAll = () => setList([]);

  return (
    <div className="container py-4" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-light mb-1">Notification Center</h2>
          <p className="text-muted small mb-0">Price alerts, ML completion logs, and system announcements</p>
        </div>
        {list.length > 0 && (
          <button className="btn btn-outline-secondary btn-sm rounded-pill text-light" onClick={clearAll}>
            Clear Notifications
          </button>
        )}
      </div>

      {list.length > 0 ? (
        <div className="d-flex flex-column gap-3">
          {list.map(n => {
            const Icon = n.icon;
            return (
              <div key={n.id} className="finverse-card p-3 d-flex align-items-start gap-3">
                <div className={`p-2 rounded-3 bg-dark border border-secondary ${n.color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="fw-bold text-light mb-0">{n.title}</h6>
                    <span className="small text-muted">{n.time}</span>
                  </div>
                  <p className="small text-muted mb-0">{n.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="finverse-card p-5 text-center text-muted">
          <FiBell size={32} className="mb-2" />
          <p className="mb-0">No unread notifications at this time.</p>
        </div>
      )}
    </div>
  );
}
