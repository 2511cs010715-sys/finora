import React from 'react';
import { motion } from 'framer-motion';

export default function HealthScoreGauge({ score = 78 }) {
  const getScoreColor = (val) => {
    if (val >= 80) return '#10b981'; // Green
    if (val >= 60) return '#3b82f6'; // Blue
    if (val >= 40) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const getScoreRating = (val) => {
    if (val >= 80) return 'Excellent Financial Health';
    if (val >= 60) return 'Good Financial Health';
    if (val >= 40) return 'Moderate Financial Health';
    return 'Action Recommended';
  };

  const strokeDashoffset = 283 - (283 * score) / 100;
  const color = getScoreColor(score);

  return (
    <div className="finplanner-card p-4 text-center">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold text-light mb-0">Financial Health Score</h6>
        <span className="badge bg-secondary-subtle text-secondary border border-secondary" style={{ fontSize: '0.65rem' }}>
          Educational Index
        </span>
      </div>

      <div className="position-relative d-inline-flex justify-content-center align-items-center my-3" style={{ width: '130px', height: '130px' }}>
        <svg width="130" height="130" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="position-absolute text-center">
          <span className="fw-extrabold fs-2 text-light">{score}</span>
          <span className="small text-muted d-block" style={{ fontSize: '0.7rem' }}>/ 100</span>
        </div>
      </div>

      <div className="fw-bold text-light small mb-1">{getScoreRating(score)}</div>
      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
        Evaluated from monthly savings rate, expense ratio, and goal progress.
      </small>
    </div>
  );
}
