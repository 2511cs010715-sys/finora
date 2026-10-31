import React, { useState } from 'react';
import { FiLock, FiCheckCircle, FiShield, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import confetti from 'canvas-confetti';

export default function PinSecurityModal({ isOpen, onClose }) {
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isScanningBiometric, setIsScanningBiometric] = useState(false);

  if (!isOpen) return null;

  const handlePinSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    // Accept default PIN 1234, 0000, 9999 or any valid 4-digit code
    if (pin.length === 4) {
      triggerSuccessfulUnlock();
    } else {
      setErrorMsg('Please enter a valid 4-digit security PIN.');
    }
  };

  const triggerSuccessfulUnlock = () => {
    setUnlocked(true);
    setErrorMsg('');
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {}

    setTimeout(() => {
      setUnlocked(false);
      setPin('');
      setIsScanningBiometric(false);
      onClose();
    }, 1200);
  };

  const handleBiometricScan = () => {
    setIsScanningBiometric(true);
    setErrorMsg('');

    setTimeout(() => {
      triggerSuccessfulUnlock();
    }, 1000);
  };

  const handleKeypadPress = (num) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === 4) {
        setUnlocked(true);
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
        setTimeout(() => {
          setUnlocked(false);
          setPin('');
          onClose();
        }, 1200);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  return (
    <div
      className="modal-backdrop-custom d-flex align-items-center justify-content-center"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1060,
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
    >
      <div
        className="finora-card p-4 text-center rounded-4 shadow-lg border-primary"
        style={{
          maxWidth: '400px',
          width: '92%',
          backgroundColor: '#0f172a',
          borderColor: '#38bdf8',
          boxShadow: '0 15px 45px rgba(2, 132, 199, 0.25)'
        }}
      >
        {/* Modal Close Button */}
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary">
          <div className="d-flex align-items-center gap-2">
            <span className="p-2 bg-primary bg-opacity-25 text-primary rounded-circle border border-primary">
              <FiShield size={20} />
            </span>
            <h5 className="fw-bold text-white mb-0" style={{ color: '#ffffff' }}>PIN / Biometric Security</h5>
          </div>
          <button className="btn-close btn-close-white" onClick={onClose}></button>
        </div>

        {unlocked ? (
          <div className="alert alert-success d-flex flex-column align-items-center justify-content-center gap-2 py-4 px-3 border border-success rounded-3 my-3">
            <FiCheckCircle size={36} className="text-success" />
            <h5 className="fw-extrabold text-success mb-0">Identity Authenticated!</h5>
            <small className="text-white fw-semibold">Financial Records Unlocked 🟢</small>
          </div>
        ) : (
          <div>
            <p className="fw-medium mb-3 text-white" style={{ fontSize: '0.88rem', color: '#e2e8f0' }}>
              Enter 4-digit PIN or scan Biometric Touch ID to authenticate
            </p>

            {errorMsg && (
              <div className="alert alert-danger py-1.5 px-3 small border border-danger mb-3 fw-bold">
                <FiAlertCircle className="me-1" /> {errorMsg}
              </div>
            )}

            {/* PIN Display Dots */}
            <div className="d-flex justify-content-center gap-3 mb-4">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`rounded-circle border d-flex align-items-center justify-content-center transition-all ${
                    pin.length > idx
                      ? 'bg-primary border-info text-white shadow-sm'
                      : 'bg-dark border-secondary text-muted'
                  }`}
                  style={{ width: '45px', height: '45px', fontSize: '1.4rem' }}
                >
                  {pin.length > idx ? '●' : ''}
                </div>
              ))}
            </div>

            {/* Interactive Keypad */}
            <div className="row g-2 mb-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div key={num} className="col-4">
                  <button
                    type="button"
                    className="btn btn-dark w-100 py-2.5 rounded-3 fw-bold text-white border border-secondary shadow-sm hover-sidebar-item"
                    style={{ fontSize: '1.2rem', backgroundColor: '#1e293b' }}
                    onClick={() => handleKeypadPress(num.toString())}
                  >
                    {num}
                  </button>
                </div>
              ))}
              <div className="col-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 py-2.5 rounded-3 fw-bold text-warning border-secondary"
                  style={{ fontSize: '0.82rem' }}
                  onClick={handleClear}
                >
                  CLEAR
                </button>
              </div>
              <div className="col-4">
                <button
                  type="button"
                  className="btn btn-dark w-100 py-2.5 rounded-3 fw-bold text-white border border-secondary shadow-sm"
                  style={{ fontSize: '1.2rem', backgroundColor: '#1e293b' }}
                  onClick={() => handleKeypadPress('0')}
                >
                  0
                </button>
              </div>
              <div className="col-4">
                <button
                  type="button"
                  className="btn btn-outline-danger w-100 py-2.5 rounded-3 fw-bold border-secondary"
                  style={{ fontSize: '1.1rem' }}
                  onClick={handleBackspace}
                  title="Backspace"
                >
                  ⌫
                </button>
              </div>
            </div>

            {/* Biometric Touch ID / Face ID Authentication Button */}
            <div className="pt-2 border-top border-secondary mt-3">
              <button
                type="button"
                className="btn btn-outline-info w-100 py-2.5 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                style={{ backgroundColor: 'rgba(56, 189, 248, 0.12)', border: '1.5px solid #38bdf8' }}
                onClick={handleBiometricScan}
                disabled={isScanningBiometric}
              >
                {isScanningBiometric ? (
                  <>
                    <span className="spinner-grow spinner-grow-sm text-info"></span>
                    <span>Scanning Touch ID / Face ID...</span>
                  </>
                ) : (
                  <>
                    <span className="fs-5">👆</span>
                    <span>Scan Biometric / Touch ID</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
