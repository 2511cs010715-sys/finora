import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBell, FiAlertCircle, FiCheckCircle, FiTarget, FiDollarSign,
  FiTrash2, FiClock, FiArrowRight, FiZap, FiShield, FiRefreshCw, FiCreditCard
} from 'react-icons/fi';

const INITIAL_NOTIFICATIONS = [
  {
    id: 0,
    type: 'EMI_ALERT',
    title: '⚠️ Overdue EMI Loan Payment Alert!',
    text: 'Home Loan EMI of ₹15,000 was due on the 3rd of this month! Process payment immediately to protect CIBIL score.',
    time: 'Just now',
    icon: FiAlertCircle,
    badgeBg: 'rgba(239, 68, 68, 0.25)',
    badgeColor: '#f87171',
    actionText: 'Pay Overdue EMI 💳',
    actionPath: '/emi'
  },
  {
    id: 1,
    type: 'GOAL',
    title: '🎯 Goal Milestone Reached',
    text: 'Emergency Reserve Fund has crossed 60% completion! You are 1.4x ahead of schedule.',
    time: '15 mins ago',
    icon: FiTarget,
    badgeBg: 'rgba(56, 189, 248, 0.2)',
    badgeColor: '#38bdf8',
    actionText: 'View Goal',
    actionPath: '/goals'
  },
  {
    id: 2,
    type: 'REMINDER',
    title: '💸 Monthly Savings Reminder',
    text: 'Scheduled transfer: Transfer ₹15,000 to Emergency Reserve Goal before end of month.',
    time: '2 hours ago',
    icon: FiDollarSign,
    badgeBg: 'rgba(16, 185, 129, 0.2)',
    badgeColor: '#34d399',
    actionText: 'Manage Savings',
    actionPath: '/savings'
  },
  {
    id: 3,
    type: 'AI_ALERT',
    title: '🤖 AI Overspending Risk Alert',
    text: 'Shopping expenses spiked by 28% this week (₹7,560 spent). Daily safe-to-spend is now ₹845/day.',
    time: '4 hours ago',
    icon: FiShield,
    badgeBg: 'rgba(239, 68, 68, 0.2)',
    badgeColor: '#f87171',
    actionText: 'Inspect AI Insights',
    actionPath: '/suggestions'
  },
  {
    id: 4,
    type: 'REPORT',
    title: '📑 Monthly Summary Statement Ready',
    text: 'August 2026 financial audit report is compiled and ready for PDF/CSV download.',
    time: '1 day ago',
    icon: FiCheckCircle,
    badgeBg: 'rgba(168, 85, 247, 0.2)',
    badgeColor: '#c084fc',
    actionText: 'View Report',
    actionPath: '/reports'
  },
  {
    id: 5,
    type: 'REMINDER',
    title: '📅 Housing Rent Due Alert',
    text: 'Apartment Rent & Maintenance payment of ₹12,000 due in 5 days. Ensure sufficient liquid balance.',
    time: '2 days ago',
    icon: FiClock,
    badgeBg: 'rgba(245, 158, 11, 0.2)',
    badgeColor: '#fbbf24',
    actionText: 'Bill Calendar',
    actionPath: '/calendar'
  }
];

export default function NotificationCenterPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('ALL');

  const handleClearAll = () => setNotifications([]);

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredList = filter === 'ALL'
    ? notifications
    : notifications.filter(n => n.type === filter);

  return (
    <div className="container-fluid px-1 py-2">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
        <div className="d-flex align-items-center gap-3">
          <div
            className="p-3 rounded-4 d-flex align-items-center justify-content-center shadow flex-shrink-0"
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              border: '1.5px solid #f59e0b',
              color: '#fbbf24',
              width: '54px',
              height: '54px'
            }}
          >
            <FiBell size={30} />
          </div>
          <div>
            <h2 className="fw-extrabold text-white mb-1" style={{ color: '#ffffff' }}>
              Notification & Alerts Center 🔔
            </h2>
            <p className="fw-medium mb-0" style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>
              Real-time telemetry alerts, overdue EMI loan warnings, goal milestones, and AI risk alerts
            </p>
          </div>
        </div>

        <div className="d-flex gap-2">
          {notifications.length > 0 && (
            <button
              className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1.5"
              onClick={handleClearAll}
            >
              <FiTrash2 size={16} /> Clear All Alerts
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="d-flex gap-2 mb-4 overflow-auto pb-1">
        {[
          { key: 'ALL', label: 'All Alerts' },
          { key: 'EMI_ALERT', label: '⚠️ EMI Alerts' },
          { key: 'GOAL', label: '🎯 Goals' },
          { key: 'REMINDER', label: '⏰ Reminders' },
          { key: 'AI_ALERT', label: '🤖 AI Risks' },
          { key: 'REPORT', label: '📑 Reports' }
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`btn btn-sm rounded-pill px-3.5 py-1.5 fw-bold transition-all ${
              filter === item.key
                ? 'btn-primary shadow'
                : 'btn-outline-secondary text-white'
            }`}
            style={{ fontSize: '0.85rem' }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredList.length > 0 ? (
        <div className="d-flex flex-column gap-3">
          {filteredList.map(n => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className="finora-card p-3.5 border-secondary d-flex flex-column flex-sm-row align-items-start gap-3 shadow"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}
              >
                <div
                  className="p-2.5 rounded-3 flex-shrink-0 d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: n.badgeBg,
                    color: n.badgeColor,
                    border: `1px solid ${n.badgeColor}`,
                    width: '44px',
                    height: '44px'
                  }}
                >
                  <Icon size={22} />
                </div>

                <div className="flex-grow-1 w-100">
                  <div className="d-flex justify-content-between align-items-center mb-1 flex-wrap gap-2">
                    <h5 className="fw-bold text-white mb-0" style={{ color: '#ffffff', fontSize: '1.05rem' }}>
                      {n.title}
                    </h5>
                    <span className="badge bg-dark text-info border border-info-subtle fw-semibold" style={{ fontSize: '0.78rem' }}>
                      {n.time}
                    </span>
                  </div>

                  <p className="fw-medium mb-3" style={{ color: '#f1f5f9', fontSize: '0.92rem', lineHeight: '1.5' }}>
                    {n.text}
                  </p>

                  <div className="d-flex justify-content-between align-items-center">
                    <Link
                      to={n.actionPath}
                      className="btn btn-outline-info btn-sm rounded-pill px-3 fw-semibold d-inline-flex align-items-center gap-1.5"
                      style={{ fontSize: '0.82rem' }}
                    >
                      {n.actionText} <FiArrowRight size={14} />
                    </Link>

                    <button
                      className="btn btn-link text-danger p-0 text-decoration-none small fw-semibold"
                      onClick={() => handleDelete(n.id)}
                      title="Dismiss alert"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="finora-card p-5 text-center shadow" style={{ backgroundColor: 'rgba(15, 23, 42, 0.88)' }}>
          <div className="bg-primary bg-opacity-25 text-info p-3 rounded-circle d-inline-block mb-3 border border-info">
            <FiBell size={36} />
          </div>
          <h4 className="fw-bold text-white mb-2" style={{ color: '#ffffff' }}>No Notifications Found</h4>
          <p className="fw-medium mb-4" style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>
            You have no active alerts under this category at the moment.
          </p>
          <button
            className="btn btn-outline-primary rounded-pill px-4 fw-bold"
            onClick={() => {
              setNotifications(INITIAL_NOTIFICATIONS);
              setFilter('ALL');
            }}
          >
            <FiRefreshCw className="me-1" /> Restore Sample Alerts
          </button>
        </div>
      )}
    </div>
  );
}
