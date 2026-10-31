import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, change, isPositive, icon: Icon, badgeText, subtitle }) {
  const isTargetBadge = badgeText && (badgeText.includes('Target') || badgeText.includes('20%'));
  const isMilestoneBadge = badgeText && (badgeText.includes('Milestone') || badgeText.includes('Goal') || title === 'Active Goals');

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="finplanner-card p-3 p-xl-4 h-100 position-relative overflow-hidden d-flex flex-column justify-content-between"
    >
      <div>
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <span className="text-muted small fw-semibold text-uppercase tracking-wider text-truncate" title={title}>{title}</span>
          {Icon && (
            <div className={`p-2 rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 ${
              isMilestoneBadge ? 'bg-info-subtle text-info' : 'bg-primary-subtle text-primary'
            }`}>
              <Icon size={18} />
            </div>
          )}
        </div>

        <div className="d-flex align-items-baseline flex-wrap gap-2 mb-1">
          <h3 className={`fw-bold mb-0 fs-4 text-break ${isMilestoneBadge ? 'text-info' : 'text-light'}`}>{value}</h3>
          {change !== undefined && (
            <span className={`small fw-bold text-nowrap ${isPositive ? 'text-success' : 'text-danger'}`}>
              {isPositive ? '↑ +' : '↓ '}{change}
            </span>
          )}
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between flex-wrap gap-1 mt-2 pt-2 border-top border-secondary-subtle">
        {subtitle && <small className="text-muted text-truncate" style={{ maxWidth: '100%' }}>{subtitle}</small>}
        {badgeText && (
          <span
            className={`badge text-truncate ms-auto ${
              isTargetBadge
                ? 'bg-success-subtle text-success border border-success fw-bold px-2 py-1'
                : isMilestoneBadge
                ? 'bg-info-subtle text-info border border-info fw-bold px-2 py-1'
                : 'bg-secondary-subtle text-light border border-secondary'
            }`}
            style={{ fontSize: '0.72rem', maxWidth: '100%' }}
          >
            {badgeText}
          </span>
        )}
      </div>
    </motion.div>
  );
}
