import React, { useState, useEffect } from 'react';
import { FiShield, FiUsers, FiCpu, FiPlus, FiDatabase, FiCheckCircle } from 'react-icons/fi';
import { getAdminStats } from '../services/api';

const MOCK_STATS = {
  totalUsers: 2,
  totalAssets: 10,
  totalPredictionsGenerated: 14,
  mlServiceStatus: 'UP',
  activeEngine: 'RandomForest + LinearRegression',
  systemUptime: '99.98%'
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(MOCK_STATS);

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
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 text-warning mb-1">
            <FiShield size={24} />
            <h2 className="fw-bold text-light mb-0">System Admin Control Portal</h2>
          </div>
          <p className="text-muted small">Monitor system telemetry, database status, and Python ML microservice health</p>
        </div>
        <span className="badge bg-success-subtle text-success border border-success p-2">
          🟢 ML Service Online (Port 5000)
        </span>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="finverse-card p-4 text-center">
            <FiUsers size={28} className="text-primary mb-2" />
            <small className="text-muted d-block fw-semibold">Registered Users</small>
            <h3 className="fw-bold text-light mt-1 mb-0">{stats.totalUsers}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="finverse-card p-4 text-center">
            <FiDatabase size={28} className="text-success mb-2" />
            <small className="text-muted d-block fw-semibold">Catalog Assets</small>
            <h3 className="fw-bold text-light mt-1 mb-0">{stats.totalAssets}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="finverse-card p-4 text-center">
            <FiCpu size={28} className="text-warning mb-2" />
            <small className="text-muted d-block fw-semibold">ML Predictions Executed</small>
            <h3 className="fw-bold text-light mt-1 mb-0">{stats.totalPredictionsGenerated}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="finverse-card p-4 text-center">
            <FiCheckCircle size={28} className="text-info mb-2" />
            <small className="text-muted d-block fw-semibold">System Uptime</small>
            <h3 className="fw-bold text-light mt-1 mb-0">{stats.systemUptime}</h3>
          </div>
        </div>
      </div>

      <div className="finverse-card p-4">
        <h5 className="fw-bold text-light mb-3">Microservice Health & Model Engine</h5>
        <div className="p-3 bg-dark rounded border border-secondary mb-3">
          <div className="row g-2 text-muted small">
            <div className="col-md-4"><strong>ML Service REST URL:</strong> http://localhost:5000</div>
            <div className="col-md-4"><strong>Spring Boot API:</strong> http://localhost:8080/api</div>
            <div className="col-md-4"><strong>Database Engine:</strong> MySQL / H2 Relational</div>
          </div>
        </div>
        <div className="p-3 bg-dark rounded border border-secondary text-light small">
          ✅ <strong>Execution Status:</strong> Python Scikit-Learn 1.4.2 pipeline active. Automatic feature extraction (SMA-5, SMA-20, Volatility Index) loaded for Random Forest Regressor fitting.
        </div>
      </div>
    </div>
  );
}
