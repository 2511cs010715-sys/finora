import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiCheckCircle, FiTrendingUp, FiActivity, FiLayers } from 'react-icons/fi';

const STEPS = [
  { id: 1, text: "Preparing financial market telemetry & dataset...", icon: FiLayers },
  { id: 2, text: "Analyzing historical market patterns & moving averages...", icon: FiActivity },
  { id: 3, text: "Executing Python Scikit-Learn Regression Pipeline...", icon: FiCpu },
  { id: 4, text: "Generating future price trajectory & confidence ratings...", icon: FiTrendingUp }
];

export default function PredictionLoader({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          if (onComplete) setTimeout(onComplete, 600);
          return prev;
        }
      });
    }, 900);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="finverse-card p-5 text-center my-4 prediction-glow">
      <div className="mb-4">
        <div className="spinner-grow text-primary" role="status" style={{ width: '3.5rem', height: '3.5rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>

      <h4 className="fw-bold text-light mb-4">FinVerse AI Engine Processing...</h4>

      <div className="max-w-md mx-auto d-flex flex-column gap-3 text-start px-3" style={{ maxWidth: '480px' }}>
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={step.id}
              className={`d-flex align-items-center gap-3 p-3 rounded-3 border transition-all ${
                isCurrent ? 'border-primary bg-primary-subtle text-primary fw-bold' :
                isDone ? 'border-success-subtle text-success bg-success-subtle' :
                'border-secondary-subtle text-muted opacity-50'
              }`}
            >
              {isDone ? (
                <FiCheckCircle size={20} className="text-success flex-shrink-0" />
              ) : isCurrent ? (
                <div className="spinner-border spinner-border-sm text-primary flex-shrink-0" />
              ) : (
                <Icon size={20} className="flex-shrink-0" />
              )}
              <span className="small">{step.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
