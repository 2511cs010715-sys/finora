import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, change, isPositive, icon: Icon, badgeText, subtitle }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="finverse-card p-3 p-xl-4 h-100 position-relative overflow-hidden"
    >
      <div className="d-flex justify-content-between align-items-start mb-2">
        <span className="text-muted small fw-semibold text-uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="bg-primary-subtle text-primary p-2 rounded-3 d-flex align-items-center justify-content-center">
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="d-flex align-items-baseline gap-2 mb-1">
        <h3 className="fw-bold mb-0 text-light">{value}</h3>
        {change !== undefined && (
          <span className={`small fw-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
            {isPositive ? '↑ +' : '↓ '}{change}
          </span>
        )}
      </div>

      <div className="d-flex align-items-center justify-content-between mt-2">
        {subtitle && <small className="text-muted">{subtitle}</small>}
        {badgeText && (
          <span className="badge bg-secondary-subtle text-secondary border border-secondary" style={{ fontSize: '0.7rem' }}>
            {badgeText}
          </span>
        )}
      </div>
    </motion.div>
  );
}
