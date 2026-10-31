import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome, FiCreditCard, FiDollarSign, FiTarget, FiPieChart,
  FiBarChart2, FiCpu, FiTrendingUp, FiCalendar, FiFileText,
  FiBell, FiSettings, FiChevronLeft, FiChevronRight, FiGrid, FiActivity, FiLayers
} from 'react-icons/fi';
import TelemetryModal from './TelemetryModal';

export default function Sidebar({ isCollapsed, toggleCollapse }) {
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);

  // 4 Categorized Modules for Modern Fintech Navigation
  const navSections = [
    {
      title: 'CORE COMMAND',
      items: [
        { label: 'Dashboard', emoji: '🏠', path: '/dashboard', badge: null },
        { label: 'EMI & Overdue Loans', emoji: '💳', path: '/emi', badge: 'Alert ⚠️' },
        { label: 'Transactions Log', emoji: '💳', path: '/expenses', badge: 'Live' },
        { label: 'Accounts & Wallets', emoji: '🏦', path: '/accounts', badge: '🔒 PIN' },
        { label: 'Budget & Safe-Spend', emoji: '💰', path: '/calculator', badge: null }
      ]
    },
    {
      title: 'WEALTH & MILESTONES',
      items: [
        { label: 'Savings Goals', emoji: '🎯', path: '/goals', badge: '3 Active' },
        { label: 'Investments Catalog', emoji: '📈', path: '/investments', badge: null },
        { label: 'Market Intelligence', emoji: '📊', path: '/market', badge: '⚡' }
      ]
    },
    {
      title: 'AI & PREDICTIONS',
      items: [
        { label: 'AI Financial Insights', emoji: '🤖', path: '/suggestions', badge: 'AI' },
        { label: '12M Financial Twin', emoji: '🔮', path: '/twin', badge: 'Model' },
        { label: 'Cash-Flow Forecast', emoji: '📈', path: '/forecast', badge: null }
      ]
    },
    {
      title: 'SYSTEM & ALERTS',
      items: [
        { label: 'Bills & Subscriptions', emoji: '📅', path: '/calendar', badge: null },
        { label: 'Monthly Statements', emoji: '📑', path: '/reports', badge: null },
        { label: 'Notification Center', emoji: '🔔', path: '/notifications', badge: 'New' },
        { label: 'Profile & Settings', emoji: '⚙️', path: '/profile', badge: null }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {!isCollapsed && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 vh-100 bg-dark bg-opacity-75"
          style={{ zIndex: 1045 }}
          onClick={toggleCollapse}
        />
      )}

      {/* Main Modern 2026 Sidebar */}
      <aside
        className={`d-flex flex-column border-end position-sticky top-0 vh-100 transition-all flex-shrink-0 ${
          isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
        }`}
        style={{
          width: isCollapsed ? '82px' : '280px',
          zIndex: 1050,
          backgroundColor: '#070a14',
          borderColor: 'rgba(56, 189, 248, 0.22)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto',
          overflowX: 'hidden',
          boxShadow: '4px 0 25px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Brand Header Logo & Collapse Toggle */}
        <div className="p-3 border-bottom border-secondary d-flex align-items-center justify-content-between" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className={`d-flex align-items-center gap-2.5 ${isCollapsed ? 'justify-content-center w-100' : ''}`}>
            <div
              className="rounded-3 p-2.5 d-flex align-items-center justify-content-center shadow"
              style={{
                width: '42px',
                height: '42px',
                background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
              }}
            >
              <FiTrendingUp size={22} className="text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <div className="d-flex align-items-center gap-1.5">
                  <span className="fw-extrabold fs-4 gradient-title tracking-tight">FINORA</span>
                  <span className="badge bg-info-subtle text-info border border-info px-1.5 py-0.5" style={{ fontSize: '0.62rem' }}>2026</span>
                </div>
                <small className="d-block text-uppercase fw-bold" style={{ fontSize: '0.65rem', color: '#38bdf8', letterSpacing: '0.06em' }}>
                  AI Command Center
                </small>
              </div>
            )}
          </div>

          <button
            className="btn btn-outline-secondary btn-sm p-1.5 rounded-circle border-0 text-light shadow-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand Navigation Menu" : "Collapse Menu"}
          >
            {isCollapsed ? <FiChevronRight size={18} className="text-info" /> : <FiChevronLeft size={18} className="text-info" />}
          </button>
        </div>

        {/* Categorized Navigation Sections */}
        <div className="px-2 py-3 flex-grow-1 overflow-auto">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="mb-3">
              {!isCollapsed && (
                <div className="px-3 mb-1.5 d-flex align-items-center justify-content-between">
                  <span className="fw-extrabold text-uppercase" style={{ fontSize: '0.68rem', color: '#94a3b8', letterSpacing: '0.08em' }}>
                    {section.title}
                  </span>
                </div>
              )}

              <ul className="nav nav-pills flex-column gap-1">
                {section.items.map((item, iIdx) => (
                  <li key={iIdx} className="nav-item">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `nav-link d-flex align-items-center justify-content-between py-2.5 px-3 rounded-3 text-nowrap fw-bold transition-all ${
                          isActive
                            ? 'active-sidebar-glow'
                            : 'hover-sidebar-item'
                        } ${isCollapsed ? 'justify-content-center px-0' : ''}`
                      }
                      title={item.label}
                    >
                      <div className="d-flex align-items-center gap-2.5">
                        <span style={{ fontSize: '1.1rem' }}>{item.emoji}</span>
                        {!isCollapsed && (
                          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                            {item.label}
                          </span>
                        )}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer AI Engine Telemetry Capsule */}
        <div className="p-3 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.1)', backgroundColor: '#0b0f19' }}>
          <div
            className={`p-2.5 rounded-3 border d-flex align-items-center gap-2 shadow-sm ${
              isCollapsed ? 'justify-content-center' : 'justify-content-between'
            }`}
            onClick={() => setShowTelemetryModal(true)}
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              borderColor: 'rgba(56, 189, 248, 0.35)',
              cursor: 'pointer'
            }}
            title="Click to open Live AI Telemetry & Microservice Monitor"
          >
            <div className="d-flex align-items-center gap-2">
              <span className="spinner-grow spinner-grow-sm text-success" role="status" style={{ width: '0.58rem', height: '0.58rem' }}></span>
              {!isCollapsed && (
                <div>
                  <div className="fw-extrabold text-white" style={{ fontSize: '0.8rem', color: '#ffffff' }}>AI Microservice</div>
                  <small className="fw-bold d-block" style={{ fontSize: '0.7rem', color: '#34d399' }}>Port 5001 Online 🟢</small>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <span className="badge bg-success-subtle text-success border border-success" style={{ fontSize: '0.65rem' }}>
                99.9%
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* AI Telemetry Status Modal */}
      <TelemetryModal isOpen={showTelemetryModal} onClose={() => setShowTelemetryModal(false)} />
    </>
  );
}
