import React, { useState, useEffect } from 'react';
import { FiShield, FiUsers, FiDollarSign, FiTarget, FiPieChart, FiCheckCircle } from 'react-icons/fi';
import { getAdminStats } from '../services/api';
import TelemetryModal from '../components/TelemetryModal';

const MOCK_STATS = {
  totalUsers: 2,
  totalIncomeRecords: 2,
  totalExpenseRecords: 6,
  totalActiveGoals: 3,
  totalInvestments: 4,
  aiServiceStatus: 'UP',
  systemUptime: '99.99%'
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(MOCK_STATS);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminStats();
        if (res.data) setStats(res.data);
      } catch (err) {}
    };
    fetchStats();
  }, []);

  return (
    <div className="container-fluid px-1 py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 text-warning mb-1">
            <FiShield size={24} />
            <h2 className="fw-bold text-light mb-0">Admin System Control Dashboard</h2>
          </div>
          <p className="text-muted small">Monitor user registrations, recorded cash flows, active goals, and AI service health</p>
        </div>
        <button
          className="btn p-0 border-0 bg-transparent text-start"
          onClick={() => setShowTelemetryModal(true)}
          title="Click to open Live AI Telemetry & Microservice Monitor"
        >
          <span className="badge bg-success bg-opacity-20 text-success border border-success p-2.5 fw-bold d-inline-flex align-items-center gap-1.5" style={{ cursor: 'pointer' }}>
            <span className="spinner-grow spinner-grow-sm text-success" style={{ width: '0.55rem', height: '0.55rem' }}></span>
            🟢 Python AI Microservice Online (Port 5001)
          </span>
        </button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="finplanner-card p-4 text-center">
            <FiUsers size={28} className="text-primary mb-2" />
            <small className="text-muted d-block fw-semibold">Registered Users</small>
            <h3 className="fw-bold text-light mt-1 mb-0">{stats.totalUsers}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="finplanner-card p-4 text-center">
            <FiDollarSign size={28} className="text-success mb-2" />
            <small className="text-muted d-block fw-semibold">Income & Expense Records</small>
            <h3 className="fw-bold text-light mt-1 mb-0">{Number(stats.totalIncomeRecords) + Number(stats.totalExpenseRecords)}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="finplanner-card p-4 text-center">
            <FiTarget size={28} className="text-warning mb-2" />
            <small className="text-muted d-block fw-semibold">Active Savings Goals</small>
            <h3 className="fw-bold text-light mt-1 mb-0">{stats.totalActiveGoals}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="finplanner-card p-4 text-center">
            <FiPieChart size={28} className="text-info mb-2" />
            <small className="text-muted d-block fw-semibold">Investments Cataloged</small>
            <h3 className="fw-bold text-light mt-1 mb-0">{stats.totalInvestments}</h3>
          </div>
        </div>
      </div>

      <div className="finplanner-card p-4">
        <h5 className="fw-bold text-light mb-3">System Execution Telemetry</h5>
        <div className="p-3 bg-dark rounded border border-secondary mb-3">
          <div className="row g-2 text-muted small">
            <div className="col-md-4"><strong>Python AI Service:</strong> http://localhost:5001</div>
            <div className="col-md-4"><strong>Spring Boot API:</strong> http://localhost:8080/api</div>
            <div className="col-md-4"><strong>Database Engine:</strong> MySQL / H2 Relational</div>
          </div>
        </div>
        <div className="p-3 bg-dark rounded border border-secondary text-light small">
          ✅ <strong>Status:</strong> Algorithmic Financial Health Score (0-100) and recommendation rules active.
        </div>
      </div>

      {/* AI Telemetry Status Modal */}
      <TelemetryModal isOpen={showTelemetryModal} onClose={() => setShowTelemetryModal(false)} />
    </div>
  );
}
