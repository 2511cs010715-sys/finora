import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiPieChart, FiCpu, FiBookmark, FiBell, FiUser, FiMoon, FiSun, FiLogOut, FiMenu, FiX, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AssetSearchBar from './AssetSearchBar';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg border-bottom sticky-top glass-panel px-3 px-lg-4 py-2" style={{ zIndex: 1040 }}>
      <div className="container-fluid px-0">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 me-4" to="/">
          <div className="bg-primary text-white rounded-3 p-2 d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
            <FiTrendingUp size={22} />
          </div>
          <div>
            <span className="fw-extrabold fs-4 gradient-title tracking-tight">FinVerse</span>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle ms-2" style={{ fontSize: '0.65rem' }}>AI 2.0</span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <div className="d-none d-md-block me-auto">
          <AssetSearchBar />
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler text-light border-0 d-lg-none"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Navigation Links */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show mt-3' : ''}`} id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1 ms-lg-3">
            <li className="nav-item">
              <NavLink className="nav-link px-3 py-2 rounded-2 text-muted" to="/dashboard">
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3 py-2 rounded-2 text-muted" to="/market">
                Markets
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3 py-2 rounded-2 text-muted" to="/predictions">
                <FiCpu className="me-1 text-primary" /> AI Predictions
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3 py-2 rounded-2 text-muted" to="/portfolio">
                <FiPieChart className="me-1" /> Portfolio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3 py-2 rounded-2 text-muted" to="/watchlist">
                <FiBookmark className="me-1" /> Watchlist
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link px-3 py-2 rounded-2 text-muted" to="/insights">
                Insights
              </NavLink>
            </li>
          </ul>

          {/* Action Buttons & Profile */}
          <div className="d-flex align-items-center gap-3">
            {/* Theme Toggle */}
            <button
              className="btn btn-outline-secondary btn-sm p-2 rounded-circle border-0 text-muted"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <FiSun size={20} className="text-warning" /> : <FiMoon size={20} className="text-primary" />}
            </button>

            {/* Notifications */}
            <Link to="/notifications" className="btn btn-outline-secondary btn-sm p-2 rounded-circle border-0 position-relative text-muted">
              <FiBell size={20} />
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            </Link>

            {/* Auth Buttons / Profile Menu */}
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary btn-sm rounded-pill px-3 py-2 dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FiUser size={16} />
                  <span>{user?.name || 'Investor'}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end finverse-card shadow-lg p-2 mt-2">
                  <li>
                    <Link className="dropdown-item py-2 text-light rounded" to="/profile">
                      <FiUser className="me-2 text-primary" /> Profile & Risk Settings
                    </Link>
                  </li>
                  {user?.role === 'ROLE_ADMIN' && (
                    <li>
                      <Link className="dropdown-item py-2 text-warning rounded" to="/admin">
                        <FiShield className="me-2" /> Admin Portal
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <button className="dropdown-item py-2 text-danger rounded" onClick={logout}>
                      <FiLogOut className="me-2" /> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary btn-sm px-3 rounded-pill">
                  Sign In
                </Link>
                <Link to="/login" className="btn btn-primary btn-sm px-3 rounded-pill fw-semibold">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
