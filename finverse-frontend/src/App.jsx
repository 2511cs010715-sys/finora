import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AiAssistantWidget from './components/AiAssistantWidget';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MarketOverviewPage from './pages/MarketOverviewPage';
import AssetAnalysisPage from './pages/AssetAnalysisPage';
import AiPredictionPage from './pages/AiPredictionPage';
import MarketTrendPage from './pages/MarketTrendPage';
import PortfolioPage from './pages/PortfolioPage';
import WatchlistPage from './pages/WatchlistPage';
import PriceAlertsPage from './pages/PriceAlertsPage';
import PersonalizedInsightsPage from './pages/PersonalizedInsightsPage';
import MonthlySummaryPage from './pages/MonthlySummaryPage';
import NotificationCenterPage from './pages/NotificationCenterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100 position-relative">
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/market" element={<MarketOverviewPage />} />
                <Route path="/analysis" element={<AssetAnalysisPage />} />
                <Route path="/predictions" element={<AiPredictionPage />} />
                <Route path="/trend-analysis" element={<MarketTrendPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                <Route path="/alerts" element={<PriceAlertsPage />} />
                <Route path="/insights" element={<PersonalizedInsightsPage />} />
                <Route path="/summary" element={<MonthlySummaryPage />} />
                <Route path="/notifications" element={<NotificationCenterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Routes>
            </main>
            <Footer />
            <AiAssistantWidget />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

