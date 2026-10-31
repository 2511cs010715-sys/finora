import React, { useState } from 'react';
import { FiAward, FiCheckCircle, FiZap, FiTarget } from 'react-icons/fi';

const MOCK_CHALLENGES = [
  { id: 1, title: '🏆 30-Day Savings Challenge', progressDays: 18, totalDays: 30, currentAmount: 6400, targetAmount: 10000, description: 'Save small daily incremental amounts over 30 days.' },
  { id: 2, title: '☕ No-Spend Weekend Challenge', progressDays: 2, totalDays: 2, currentAmount: 1500, targetAmount: 1500, description: 'Avoid discretionary dining out or shopping over the weekend.' },
  { id: 3, title: '🍔 Reduce Food Spending Challenge', progressDays: 14, totalDays: 30, currentAmount: 2200, targetAmount: 4000, description: 'Cut monthly restaurant bills by 20%.' },
  { id: 4, title: '🛡️ Emergency Buffer Sprint', progressDays: 10, totalDays: 15, currentAmount: 8000, targetAmount: 12000, description: 'Deposit surplus into high-yield emergency reserve.' }
];

export default function FinancialChallengesPage() {
  const [challenges, setChallenges] = useState(MOCK_CHALLENGES);

  return (
    <div className="container-fluid px-1 py-2">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 text-warning mb-1">
            <div className="p-2 bg-warning-subtle text-warning rounded-3">
              <FiAward size={24} />
            </div>
            <h2 className="fw-bold text-light mb-0">FINORA Financial Challenges</h2>
          </div>
          <p className="text-muted small mb-0">Gamified personal finance challenges to accelerate wealth discipline</p>
        </div>

        <span className="badge bg-warning-subtle text-warning border border-warning px-3 py-2 rounded-pill fw-bold">
          4 Active Challenges
        </span>
      </div>

      <div className="row g-4">
        {challenges.map(c => {
          const pct = Math.min(100, Math.round((c.currentAmount / c.targetAmount) * 100));
          const isDone = c.currentAmount >= c.targetAmount;

          return (
            <div key={c.id} className="col-md-6">
              <div className={`finora-card p-4 h-100 d-flex flex-column justify-content-between ${isDone ? 'border-success' : 'border-primary'}`}>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-primary-subtle text-primary border border-primary">
                      Day {c.progressDays} / {c.totalDays}
                    </span>
                    {isDone ? <span className="badge bg-success-subtle text-success">🏆 Challenge Completed</span> : <span className="badge bg-warning-subtle text-warning">In Progress</span>}
                  </div>

                  <h4 className="fw-extrabold text-light mb-1">{c.title}</h4>
                  <small className="text-muted d-block mb-3">{c.description}</small>

                  <div className="p-3 bg-dark rounded border border-secondary mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="text-muted small">Saved vs Target:</span>
                      <span className="fw-extrabold text-success fs-5">₹{c.currentAmount.toLocaleString()} / ₹{c.targetAmount.toLocaleString()}</span>
                    </div>
                    <div className="progress bg-secondary" style={{ height: '10px' }}>
                      <div className={`progress-bar ${isDone ? 'bg-success' : 'bg-primary'}`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center pt-2">
                  <span className="small text-muted fw-semibold">{pct}% Progress</span>
                  <button className={`btn btn-sm rounded-pill px-3 fw-bold ${isDone ? 'btn-outline-success' : 'btn-primary'}`}>
                    {isDone ? 'Claim Badge ✓' : 'Log Contribution'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
