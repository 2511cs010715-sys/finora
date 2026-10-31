import React from 'react';

export default function CustomTooltip({ active, payload, label, currency = true }) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-3 shadow-lg border" style={{
        background: 'rgba(15, 23, 42, 0.94)',
        borderColor: 'rgba(59, 130, 246, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: '#f8fafc',
        minWidth: '160px'
      }}>
        {label && <div className="fw-bold text-muted small mb-2 border-bottom border-secondary pb-1">{label}</div>}
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="d-flex align-items-center justify-content-between gap-3 my-1">
            <div className="d-flex align-items-center gap-2">
              <span
                className="rounded-circle d-inline-block"
                style={{ width: '10px', height: '10px', backgroundColor: entry.color || entry.fill || '#3b82f6' }}
              />
              <span className="small text-light fw-medium">{entry.name}:</span>
            </div>
            <span className="fw-bold" style={{ color: entry.color || entry.fill || '#38bdf8' }}>
              {currency ? `₹${Number(entry.value).toLocaleString()}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}
