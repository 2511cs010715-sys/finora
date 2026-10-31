import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSearch, FiBell, FiHelpCircle, FiSun, FiMoon, FiUser,
  FiShield, FiLogOut, FiMenu, FiX, FiTrendingUp, FiVolume2, FiVolumeX,
  FiPlusCircle, FiDollarSign, FiZap, FiCheck
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TelemetryModal from './TelemetryModal';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Modals & UI States
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [showSafeSpendModal, setShowSafeSpendModal] = useState(false);

  // Search & Accessibility
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceLang, setVoiceLang] = useState('TE'); // Defaulting to Telugu ('TE')

  // Currency Switcher State (INR, USD, EUR, GBP)
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('finora_currency') || 'INR';
  });

  const currencySymbols = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  const handleCurrencyChange = (newCurr) => {
    setCurrency(newCurr);
    localStorage.setItem('finora_currency', newCurr);
  };

  // Quick Add Transaction Form State
  const [quickTx, setQuickTx] = useState({
    title: '',
    amount: '',
    category: 'Food & Dining',
    type: 'expense'
  });
  const [txSuccessMsg, setTxSuccessMsg] = useState('');

  // AI Voice Assistant Reader with Telugu & English Support
  const toggleVoiceAssistant = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        let textToRead = '';
        let targetLang = 'te-IN';

        if (voiceLang === 'TE') {
          textToRead = `ఫినోరా 2026 ఆర్థిక కమాండ్ సెంటర్‌కు స్వాగతం. మీ ప్రస్తుత ఆర్థిక ఆరోగ్య స్కోరు 88 గ్రేడ్ ఏ ప్లస్. మీ నెలవారీ ఆదాయం 65 వేల రూపాయలు, నికర పొదుపు రేటు 38.4 శాతం. మీ ఆదా లక్ష్యాలు మరియు ఏఐ మైక్రోసర్వీసులు అన్నీ విజయవంతంగా నడుస్తున్నాయి.`;
          targetLang = 'te-IN';
        } else {
          textToRead = `Welcome to Finora 2026 Financial Command Center. Your current financial health score is 88 Grade A Plus. Monthly income is 65,000 rupees with a net savings rate of 38.4 percent. All goal milestones and Python AI microservices are online.`;
          targetLang = 'en-US';
        }

        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = targetLang;
        utterance.rate = 0.95;
        utterance.pitch = 1.05;

        // Find matching Telugu or English voice if available in browser
        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find(v => 
          v.lang.toLowerCase().includes(targetLang.toLowerCase()) || 
          v.lang.toLowerCase().startsWith(voiceLang === 'TE' ? 'te' : 'en') ||
          v.name.toLowerCase().includes(voiceLang === 'TE' ? 'telugu' : 'english')
        );

        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleQuickAddSubmit = (e) => {
    e.preventDefault();
    if (!quickTx.title || !quickTx.amount) return;

    setTxSuccessMsg(`Successfully added ${quickTx.type === 'expense' ? 'Expense' : 'Income'} of ${currencySymbols[currency]}${quickTx.amount}!`);
    setTimeout(() => {
      setTxSuccessMsg('');
      setShowQuickAddModal(false);
      setQuickTx({ title: '', amount: '', category: 'Food & Dining', type: 'expense' });
      navigate(quickTx.type === 'expense' ? '/expenses' : '/income');
    }, 1200);
  };

  // Index of searchable items
  const searchableItems = [
    { title: 'Dashboard & Command Overview', category: 'Page', path: '/dashboard', icon: '🏠' },
    { title: 'EMI & Loan Overdue Alert Tracker', category: 'Page', path: '/emi', icon: '💳' },
    { title: 'Transactions & Expenses Log', category: 'Page', path: '/expenses', icon: '💳' },
    { title: 'Accounts & Wallets (Biometric Locked)', category: 'Page', path: '/accounts', icon: '🏦' },
    { title: 'Budget & Safe-to-Spend Calculator', category: 'Page', path: '/calculator', icon: '💰' },
    { title: 'Financial Goals Tracker', category: 'Page', path: '/goals', icon: '🎯' },
    { title: 'Investment Portfolio Allocation', category: 'Page', path: '/investments', icon: '📈' },
    { title: 'Market Intelligence Tickers', category: 'Page', path: '/market', icon: '📊' },
    { title: 'AI Insights & Strategic Advisory', category: 'Page', path: '/suggestions', icon: '🤖' },
    { title: '12-Month Future Financial Twin', category: 'Page', path: '/twin', icon: '🔮' },
    { title: 'Bills & Subscriptions Calendar', category: 'Page', path: '/calendar', icon: '📅' },
    { title: 'Monthly Reports & Statements', category: 'Page', path: '/reports', icon: '📑' },
    { title: 'Notifications & Alerts Center', category: 'Page', path: '/notifications', icon: '🔔' },
    { title: 'Profile & Settings', category: 'Page', path: '/profile', icon: '⚙️' },
    { title: 'Home Loan EMI (₹15,000 due 5th)', category: 'EMI Loan', path: '/emi', icon: '🏡' },
    { title: 'Car Loan EMI (₹6,500 due 10th)', category: 'EMI Loan', path: '/emi', icon: '🚗' },
    { title: 'iPhone 15 Pro EMI (₹4,200 due 15th)', category: 'EMI Loan', path: '/emi', icon: '📱' },
    { title: 'HDFC Savings Account', category: 'Account', path: '/accounts', icon: '🏦' },
    { title: 'SBI Savings Account', category: 'Account', path: '/accounts', icon: '🏦' }
  ];

  const searchResults = searchQuery.trim() === ''
    ? []
    : searchableItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.path.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <>
      {/* Distinct 2026 Floating Capsule Navbar Console */}
      <nav
        className="navbar sticky-top my-2 mx-2 mx-md-3 py-2 px-3 px-md-4 rounded-4 shadow-lg border"
        style={{
          zIndex: 1040,
          backgroundColor: 'rgba(15, 23, 42, 0.94)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(56, 189, 248, 0.3)',
          boxShadow: '0 10px 30px rgba(2, 132, 199, 0.18)'
        }}
      >
        <div className="container-fluid px-0 d-flex align-items-center justify-content-between gap-2 gap-md-3">
          
          {/* Left Dock: Sidebar Toggle + Greeting Pill */}
          <div className="d-flex align-items-center gap-2.5">
            <button
              className="btn btn-outline-secondary btn-sm p-2 rounded-circle border-0 text-muted d-lg-none"
              onClick={onToggleSidebar}
              title="Toggle Menu"
            >
              <FiMenu size={22} />
            </button>

            <div>
              <div className="d-flex align-items-center gap-2">
                <h5 className="fw-bold text-white mb-0" style={{ fontSize: '1.05rem', color: '#ffffff' }}>
                  {getGreeting()}, <span className="text-primary">{user?.name || 'Investors'}</span> 👋
                </h5>
                <button
                  className="btn p-0 border-0 bg-transparent text-start d-none d-sm-inline-block"
                  onClick={() => setShowTelemetryModal(true)}
                  title="Click to open Live AI Telemetry & Microservice Monitor"
                >
                  <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1.5 px-2 py-0.5" style={{ fontSize: '0.7rem', cursor: 'pointer' }}>
                    <span className="spinner-grow spinner-grow-sm text-success" style={{ width: '0.5rem', height: '0.5rem' }}></span>
                    AI Engine Active
                  </span>
                </button>
              </div>
              <small className="d-block fw-medium mt-0.5" style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                Finora 2026 AI Command • <span className="fw-bold" style={{ color: '#38bdf8' }}>{currentDateStr}</span>
              </small>
            </div>
          </div>

          {/* Center Dock: Global Search Bar */}
          <div className="d-none d-lg-flex flex-grow-1 mx-3 position-relative" style={{ maxWidth: '420px' }}>
            <div className="input-group input-group-sm w-100 shadow-sm" style={{ borderRadius: '25px', overflow: 'hidden', border: '1.5px solid #38bdf8' }}>
              <span className="input-group-text border-0 px-3" style={{ backgroundColor: '#0f172a', color: '#38bdf8' }}>
                <FiSearch size={15} />
              </span>
              <input
                id="finora-global-search"
                type="text"
                className="form-control border-0 py-2 fs-6 fw-bold text-white placeholder-slate"
                style={{ backgroundColor: '#0f172a', outline: 'none' }}
                placeholder="Search transactions, goals, EMIs, accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="btn border-0 pe-3"
                  style={{ backgroundColor: '#0f172a', color: '#f87171' }}
                  onClick={() => setSearchQuery('')}
                >
                  <FiX size={15} />
                </button>
              )}
            </div>

            {/* Live Search Results Dropdown */}
            {searchQuery.trim() !== '' && (
              <div
                className="position-absolute top-100 start-0 w-100 shadow-lg p-2 mt-2 border rounded-3 z-3 overflow-auto"
                style={{ maxHeight: '360px', background: '#0f172a', borderColor: '#38bdf8', backdropFilter: 'blur(20px)' }}
              >
                <div className="px-2 py-1.5 border-bottom border-secondary d-flex justify-content-between align-items-center mb-1">
                  <small className="fw-bold text-uppercase" style={{ color: '#e2e8f0', fontSize: '0.75rem' }}>SEARCH RESULTS</small>
                  <small className="fw-bold" style={{ color: '#38bdf8', fontSize: '0.8rem' }}>{searchResults.length} items found</small>
                </div>

                {searchResults.length > 0 ? (
                  <ul className="list-unstyled mb-0">
                    {searchResults.map((item, idx) => (
                      <li key={idx}>
                        <Link
                          to={item.path}
                          className="d-flex align-items-center justify-content-between p-2.5 rounded text-decoration-none hover-sidebar-item"
                          onClick={() => setSearchQuery('')}
                        >
                          <div className="d-flex align-items-center gap-2.5">
                            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                            <span className="fw-bold small text-white">{item.title}</span>
                          </div>
                          <span className="badge bg-info-subtle text-info border border-info" style={{ fontSize: '0.7rem' }}>
                            {item.category}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-3 text-center small" style={{ color: '#cbd5e1' }}>
                    No results matching "<strong className="text-white">{searchQuery}</strong>". Try searching for <em>EMI</em>, <em>Food</em>, or <em>Goals</em>.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Hub: Quick Add, Safe-to-Spend Pill, Currency Switcher, AI Voice Briefing & Profile */}
          <div className="d-flex align-items-center gap-1.5 gap-sm-2">
            
            {/* Quick Add Transaction Modal Trigger */}
            <button
              className="btn btn-sm btn-gradient-primary rounded-pill px-2.5 px-sm-3 py-1.5 d-flex align-items-center gap-1.5 fw-bold text-white shadow-sm"
              style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', border: '1px solid #38bdf8', fontSize: '0.82rem' }}
              onClick={() => setShowQuickAddModal(true)}
              title="Quick Add Transaction / Expense"
            >
              <FiPlusCircle size={16} />
              <span className="d-none d-sm-inline">+ Quick Add</span>
            </button>

            {/* Safe-to-Spend Daily Limit Telemetry Pill */}
            <button
              className="btn btn-sm btn-outline-info rounded-pill px-2.5 py-1 d-none d-md-flex align-items-center gap-1.5 text-info border-info border-opacity-50"
              style={{ backgroundColor: 'rgba(56, 189, 248, 0.08)', fontSize: '0.78rem' }}
              onClick={() => setShowSafeSpendModal(true)}
              title="Daily Safe-to-Spend Telemetry"
            >
              <FiZap size={14} className="text-warning" />
              <span className="fw-bold text-white">Safe: {currencySymbols[currency]}1,420<small className="text-muted">/day</small></span>
            </button>

            {/* Currency Selector Dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-sm btn-outline-secondary rounded-pill px-2 py-1 dropdown-toggle text-light border-secondary d-flex align-items-center gap-1"
                type="button"
                data-bs-toggle="dropdown"
                style={{ fontSize: '0.78rem', backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                title="Select Currency"
              >
                <FiDollarSign size={14} className="text-success" />
                <span className="fw-bold">{currency}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end finora-card shadow-lg p-1" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}>
                {Object.keys(currencySymbols).map((curr) => (
                  <li key={curr}>
                    <button
                      className={`dropdown-item py-1.5 px-3 rounded text-white d-flex align-items-center justify-content-between small fw-semibold ${currency === curr ? 'bg-primary active' : ''}`}
                      onClick={() => handleCurrencyChange(curr)}
                    >
                      <span>{currencySymbols[curr]} {curr}</span>
                      {currency === curr && <FiCheck size={14} className="text-white ms-2" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Voice Assistant Language Selector Toggle (Telugu 🇮🇳 / English 🇬🇧) */}
            <div className="btn-group btn-group-sm rounded-pill border border-info border-opacity-50 p-0.5" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
              <button
                className={`btn btn-sm px-2 py-0.5 rounded-pill fw-bold ${voiceLang === 'TE' ? 'btn-info text-dark' : 'text-muted border-0'}`}
                style={{ fontSize: '0.72rem' }}
                onClick={() => setVoiceLang('TE')}
                title="Switch AI Voice Assistant to Telugu (తెలుగు)"
              >
                🇮🇳 తెలుగు
              </button>
              <button
                className={`btn btn-sm px-2 py-0.5 rounded-pill fw-bold ${voiceLang === 'EN' ? 'btn-info text-dark' : 'text-muted border-0'}`}
                style={{ fontSize: '0.72rem' }}
                onClick={() => setVoiceLang('EN')}
                title="Switch AI Voice Assistant to English"
              >
                🇬🇧 EN
              </button>
            </div>

            {/* AI Voice Assistant Reader Button */}
            <button
              className={`btn btn-sm p-2 rounded-circle border-0 ${isSpeaking ? 'btn-success text-white' : 'btn-outline-info text-info'}`}
              onClick={toggleVoiceAssistant}
              title={isSpeaking ? "Stop AI Voice Briefing" : `Listen to AI Financial Voice Briefing in ${voiceLang === 'TE' ? 'Telugu (తెలుగు)' : 'English'}`}
            >
              {isSpeaking ? <FiVolumeX size={18} className="spinner-grow spinner-grow-sm text-white" /> : <FiVolume2 size={18} className="text-info" />}
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              className="btn btn-outline-secondary btn-sm p-2 rounded-circle border-0 text-muted"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <FiSun size={18} className="text-warning" /> : <FiMoon size={18} className="text-primary" />}
            </button>

            {/* Notifications Alert Center */}
            <Link
              to="/notifications"
              className="btn btn-outline-info btn-sm p-2 rounded-circle border border-info border-opacity-50 position-relative text-warning shadow-sm"
              style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)' }}
              title="Notification & Alerts Center"
            >
              <FiBell size={18} className="text-warning" />
              <span className="position-absolute top-0 start-100 translate-middle p-1.5 bg-danger border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            </Link>

            {/* User Profile Dropdown */}
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary btn-sm rounded-pill px-2.5 py-1 dropdown-toggle d-flex align-items-center gap-1.5"
                  type="button"
                  data-bs-toggle="dropdown"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
                >
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '26px', height: '26px', fontSize: '0.78rem' }}>
                    {(user?.name || 'Investors').charAt(0)}
                  </div>
                  <span className="d-none d-xl-inline fw-semibold text-white">{user?.name || 'Investors'}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end finora-card shadow-lg p-2 mt-2" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}>
                  <li>
                    <Link className="dropdown-item py-2 text-light rounded d-flex align-items-center gap-2" to="/profile">
                      <FiUser className="text-primary" /> Profile & Account Settings
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item py-2 text-light rounded d-flex align-items-center gap-2" onClick={() => setShowSafeSpendModal(true)}>
                      <FiZap className="text-warning" /> Daily Safe-to-Spend Limit
                    </button>
                  </li>
                  {user?.role === 'ROLE_ADMIN' && (
                    <li>
                      <Link className="dropdown-item py-2 text-warning rounded d-flex align-items-center gap-2" to="/admin">
                        <FiShield /> Admin Command Panel
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger rounded d-flex align-items-center gap-2" onClick={logout}>
                      <FiLogOut /> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-1.5">
                <Link to="/login" className="btn btn-outline-primary btn-sm px-3 rounded-pill">
                  Sign In
                </Link>
              </div>
            )}

          </div>

        </div>
      </nav>

      {/* AI Telemetry Monitor Modal */}
      <TelemetryModal isOpen={showTelemetryModal} onClose={() => setShowTelemetryModal(false)} />

      {/* Quick Add Transaction Modal */}
      {showQuickAddModal && (
        <div className="modal-backdrop-custom d-flex align-items-center justify-content-center" style={{ position: 'fixed', inset: 0, zIndex: 1060, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="finora-card p-4 shadow-lg border-primary rounded-4" style={{ maxWidth: '440px', width: '92%', backgroundColor: '#0f172a', borderColor: '#38bdf8' }}>
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary">
              <div className="d-flex align-items-center gap-2">
                <span className="p-2 bg-primary bg-opacity-25 text-primary rounded-circle border border-primary">
                  <FiPlusCircle size={20} />
                </span>
                <h5 className="fw-bold text-white mb-0">Quick Add Transaction</h5>
              </div>
              <button className="btn-close btn-close-white" onClick={() => setShowQuickAddModal(false)}></button>
            </div>

            {txSuccessMsg ? (
              <div className="alert alert-success d-flex align-items-center gap-2 border border-success fw-bold my-3 py-3">
                <FiCheck size={20} />
                <span>{txSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleQuickAddSubmit}>
                <div className="mb-3">
                  <label className="form-label text-light fw-semibold small">Transaction Type</label>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className={`btn btn-sm flex-grow-1 fw-bold ${quickTx.type === 'expense' ? 'btn-danger' : 'btn-outline-secondary text-white'}`}
                      onClick={() => setQuickTx({ ...quickTx, type: 'expense' })}
                    >
                      Expense 💸
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm flex-grow-1 fw-bold ${quickTx.type === 'income' ? 'btn-success' : 'btn-outline-secondary text-white'}`}
                      onClick={() => setQuickTx({ ...quickTx, type: 'income' })}
                    >
                      Income 💵
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-light fw-semibold small">Title / Note</label>
                  <input
                    type="text"
                    className="form-control bg-dark border-secondary text-white fw-medium"
                    placeholder="e.g. Grocery Shopping, Coffee, Freelance"
                    value={quickTx.title}
                    onChange={(e) => setQuickTx({ ...quickTx, title: e.target.value })}
                    required
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label text-light fw-semibold small">Amount ({currencySymbols[currency]})</label>
                    <input
                      type="number"
                      className="form-control bg-dark border-secondary text-white fw-bold"
                      placeholder="0.00"
                      value={quickTx.amount}
                      onChange={(e) => setQuickTx({ ...quickTx, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-light fw-semibold small">Category</label>
                    <select
                      className="form-select bg-dark border-secondary text-white fw-medium"
                      value={quickTx.category}
                      onChange={(e) => setQuickTx({ ...quickTx, category: e.target.value })}
                    >
                      <option value="Food & Dining">Food & Dining</option>
                      <option value="Shopping & Apparel">Shopping</option>
                      <option value="Travel & Transit">Transit</option>
                      <option value="Bills & Utilities">Utilities</option>
                      <option value="Salary & Income">Salary</option>
                      <option value="Investments">Investments</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" className="btn btn-outline-secondary btn-sm px-3 rounded-pill text-white" onClick={() => setShowQuickAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm px-4 rounded-pill fw-bold shadow">
                    Save Transaction
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Safe-to-Spend Telemetry Modal */}
      {showSafeSpendModal && (
        <div className="modal-backdrop-custom d-flex align-items-center justify-content-center" style={{ position: 'fixed', inset: 0, zIndex: 1060, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="finora-card p-4 shadow-lg border-info rounded-4" style={{ maxWidth: '460px', width: '92%', backgroundColor: '#0f172a', borderColor: '#38bdf8' }}>
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary">
              <div className="d-flex align-items-center gap-2">
                <span className="p-2 bg-info bg-opacity-25 text-info rounded-circle border border-info">
                  <FiZap size={20} />
                </span>
                <h5 className="fw-bold text-white mb-0">Daily Safe-to-Spend Telemetry</h5>
              </div>
              <button className="btn-close btn-close-white" onClick={() => setShowSafeSpendModal(false)}></button>
            </div>

            <div className="bg-dark p-3 rounded-3 border border-secondary mb-3 text-center">
              <small className="text-muted text-uppercase fw-bold d-block mb-1" style={{ fontSize: '0.75rem' }}>TODAY'S REMAINING SAFE LIMIT</small>
              <h2 className="fw-extrabold text-success mb-1" style={{ fontSize: '2.2rem' }}>
                {currencySymbols[currency]}970.00
              </h2>
              <small className="text-info fw-semibold">Calculated by AI Engine based on 18 days left in month</small>
            </div>

            <div className="d-flex flex-column gap-2 mb-4">
              <div className="d-flex justify-content-between p-2 rounded bg-dark border border-secondary text-light small">
                <span>Monthly Uncommitted Funds:</span>
                <strong className="text-white">{currencySymbols[currency]}25,560.00</strong>
              </div>
              <div className="d-flex justify-content-between p-2 rounded bg-dark border border-secondary text-light small">
                <span>Recommended Daily Budget:</span>
                <strong className="text-info">{currencySymbols[currency]}1,420.00 / day</strong>
              </div>
              <div className="d-flex justify-content-between p-2 rounded bg-dark border border-secondary text-light small">
                <span>Logged Today (Food & Coffee):</span>
                <strong className="text-warning">{currencySymbols[currency]}450.00</strong>
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between text-light small mb-1">
                <span>Daily Usage Meter</span>
                <span className="fw-bold text-success">31.7% Spent</span>
              </div>
              <div className="progress bg-dark" style={{ height: '10px' }}>
                <div className="progress-bar bg-success" role="progressbar" style={{ width: '31.7%' }}></div>
              </div>
            </div>

            <button className="btn btn-primary w-100 rounded-pill fw-bold py-2 mt-2" onClick={() => setShowSafeSpendModal(false)}>
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="modal-backdrop-custom d-flex align-items-center justify-content-center" style={{ position: 'fixed', inset: 0, zIndex: 1060, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="finora-card p-4 shadow-lg border-info rounded-4" style={{ maxWidth: '480px', width: '92%', backgroundColor: '#0f172a', borderColor: '#38bdf8' }}>
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary">
              <div className="d-flex align-items-center gap-2">
                <span className="p-2 bg-info bg-opacity-25 text-info rounded-circle border border-info">
                  <FiHelpCircle size={22} />
                </span>
                <h5 className="fw-bold text-white mb-0">FINORA 2026 User Guide</h5>
              </div>
              <button className="btn-close btn-close-white" onClick={() => setShowHelpModal(false)}></button>
            </div>

            <p className="fw-medium mb-3 text-light" style={{ fontSize: '0.92rem', lineHeight: '1.5' }}>
              Learn how to navigate your intelligent financial command center.
            </p>

            <ul className="list-unstyled mb-4 d-flex flex-column gap-2.5">
              <li className="p-2.5 rounded-3 bg-dark border border-secondary d-flex align-items-start gap-2">
                <span className="fs-5">🏠</span>
                <div>
                  <strong style={{ color: '#38bdf8' }}>Dashboard:</strong>
                  <span className="d-block fw-medium text-light" style={{ fontSize: '0.88rem' }}>Real-time Financial Pulse & Net Worth overview.</span>
                </div>
              </li>
              <li className="p-2.5 rounded-3 bg-dark border border-secondary d-flex align-items-start gap-2">
                <span className="fs-5">➕</span>
                <div>
                  <strong style={{ color: '#34d399' }}>Quick Add:</strong>
                  <span className="d-block fw-medium text-light" style={{ fontSize: '0.88rem' }}>Log transactions instantly from anywhere in the navbar.</span>
                </div>
              </li>
              <li className="p-2.5 rounded-3 bg-dark border border-secondary d-flex align-items-start gap-2">
                <span className="fs-5">⚡</span>
                <div>
                  <strong style={{ color: '#fbbf24' }}>Safe-to-Spend:</strong>
                  <span className="d-block fw-medium text-light" style={{ fontSize: '0.88rem' }}>Live daily spending allowance telemetry calculator.</span>
                </div>
              </li>
            </ul>

            <button className="btn btn-primary w-100 rounded-pill fw-bold py-2 shadow" onClick={() => setShowHelpModal(false)}>
              Got It, Close Guide
            </button>
          </div>
        </div>
      )}
    </>
  );
}
