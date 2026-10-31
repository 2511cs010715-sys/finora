import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AiAssistantWidget from './components/AiAssistantWidget';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import IncomePage from './pages/IncomePage';
import ExpensePage from './pages/ExpensePage';
import SavingsPage from './pages/SavingsPage';
import GoalsPage from './pages/GoalsPage';
import InvestmentPage from './pages/InvestmentPage';
import FinancialCalculatorPage from './pages/FinancialCalculatorPage';
import BillCalendarPage from './pages/BillCalendarPage';
import CashFlowForecastPage from './pages/CashFlowForecastPage';
import PersonalizedSuggestionsPage from './pages/PersonalizedSuggestionsPage';
import MonthlyReportPage from './pages/MonthlyReportPage';
import NotificationCenterPage from './pages/NotificationCenterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// 2026 Finora Advanced Modules
import FinancialTwinPage from './pages/FinancialTwinPage';
import AccountsWalletsPage from './pages/AccountsWalletsPage';
import FinancialChallengesPage from './pages/FinancialChallengesPage';
import MarketIntelligencePage from './pages/MarketIntelligencePage';
import EmiTrackerPage from './pages/EmiTrackerPage';

import { AppDataProvider } from './context/AppDataContext';

function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="d-flex min-vh-100 position-relative">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="d-flex flex-column flex-grow-1 min-vw-0 page-left-aligned-layout" style={{ minWidth: 0 }}>
        <Navbar onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <main className="flex-grow-1 px-3 px-md-4 py-3 pb-5 w-100" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/expenses" element={<ExpensePage />} />
            <Route path="/savings" element={<SavingsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/investments" element={<InvestmentPage />} />
            <Route path="/calculator" element={<FinancialCalculatorPage />} />
            <Route path="/calendar" element={<BillCalendarPage />} />
            <Route path="/forecast" element={<CashFlowForecastPage />} />
            <Route path="/reports" element={<MonthlyReportPage />} />
            <Route path="/suggestions" element={<PersonalizedSuggestionsPage />} />
            <Route path="/notifications" element={<NotificationCenterPage />} />
            <Route path="/reminders" element={<NotificationCenterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />

            {/* Finora 2026 New Routes */}
            <Route path="/twin" element={<FinancialTwinPage />} />
            <Route path="/accounts" element={<AccountsWalletsPage />} />
            <Route path="/challenges" element={<FinancialChallengesPage />} />
            <Route path="/market" element={<MarketIntelligencePage />} />
            <Route path="/emi" element={<EmiTrackerPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <AiAssistantWidget />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppDataProvider>
          <Router>
            <AppLayout />
          </Router>
        </AppDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
