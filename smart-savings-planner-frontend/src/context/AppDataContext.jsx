import React, { createContext, useContext, useState } from 'react';

const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  // 1. Income Data State
  const [incomeData, setIncomeData] = useState({
    totalIncome: 65000,
    items: [
      { id: 1, title: 'Primary Tech Salary', amount: 65000, category: 'Salary', date: '2026-10-01' }
    ]
  });

  // 2. Expense Data State
  const [expenseData, setExpenseData] = useState({
    totalExpenses: 42000,
    categories: {
      food: 10080,
      shopping: 7560,
      rent: 15000,
      utilities: 4320,
      transit: 5040
    },
    items: [
      { id: 1, title: 'Housing Rent', amount: 15000, category: 'Housing', date: '2026-10-01' },
      { id: 2, title: 'Food & Dining Outflow', amount: 10080, category: 'Food & Dining', date: '2026-10-02' },
      { id: 3, title: 'Shopping & Apparel', amount: 7560, category: 'Shopping', date: '2026-10-03' },
      { id: 4, title: 'Fuel & Transit', amount: 5040, category: 'Transit', date: '2026-10-04' },
      { id: 5, title: 'Electricity & Utilities', amount: 4320, category: 'Utilities', date: '2026-10-04' }
    ]
  });

  // 3. Accounts & Wallets State
  const [accountsData, setAccountsData] = useState([
    { id: 1, name: '🏦 HDFC Bank Salary Account', type: 'Bank Account', balance: 82450.00, accountNo: '•••• 4892' },
    { id: 2, name: '🏦 SBI Savings Account', type: 'Bank Account', balance: 42800.00, accountNo: '•••• 1120' },
    { id: 3, name: '💳 HDFC Regalia Credit Card', type: 'Credit Card', balance: -12450.00, accountNo: '•••• 8831' },
    { id: 4, name: '👛 Cash Wallet Reserve', type: 'Cash', balance: 5200.00, accountNo: 'Physical Cash' },
    { id: 5, name: '📱 Paytm / PhonePe UPI Wallet', type: 'UPI Wallet', balance: 2800.00, accountNo: 'varshini@upi' }
  ]);

  // 4. EMI Loans State (Includes Rate of Interest % p.a. for every EMI!)
  const [emis, setEmis] = useState([
    { id: 1, title: '🏡 Home Loan EMI', lender: 'HDFC Bank Home Finance', amount: 15000, dueDate: 3, tenureTotal: 240, tenureRemaining: 184, interestRate: 8.5, status: 'OVERDUE', category: 'Housing' },
    { id: 2, title: '🚗 Hyundai Creta Car Loan EMI', lender: 'SBI Auto Loans', amount: 6500, dueDate: 10, tenureTotal: 60, tenureRemaining: 32, interestRate: 9.1, status: 'UPCOMING', category: 'Vehicle' },
    { id: 3, title: '📱 iPhone 15 Pro No-Cost EMI', lender: 'Bajaj Finserv EMI Card', amount: 4200, dueDate: 15, tenureTotal: 12, tenureRemaining: 4, interestRate: 0.0, status: 'UPCOMING', category: 'Electronics' }
  ]);

  // 5. Goals State
  const [goals, setGoals] = useState([
    { id: 1, title: '💻 M3 MacBook Air Goal', target: 80000, current: 65600, percentage: 82, category: 'Tech Gadget' },
    { id: 2, title: '🛡️ Emergency Reserve Fund', target: 100000, current: 54000, percentage: 54, category: 'Safety Reserve' },
    { id: 3, title: '🌴 Wealth & Retirement Fund', target: 500000, current: 150000, percentage: 30, category: 'Long Term' }
  ]);

  // 6. Investments State
  const [investments, setInvestments] = useState({
    totalValue: 82500,
    allocation: {
      mutualFunds: 37125, // 45%
      stocks: 28875,       // 35%
      fixedDeposits: 12375,// 15%
      gold: 4125          // 5%
    }
  });

  // Calculate Computed Telemetry Metrics
  const totalIncome = incomeData.totalIncome;
  const totalExpenses = expenseData.totalExpenses;
  const monthlySavings = Math.max(0, totalIncome - totalExpenses);
  const savingsRatePercent = totalIncome > 0 ? Number(((monthlySavings / totalIncome) * 100).toFixed(1)) : 0;

  const totalAssets = accountsData.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0);
  const totalLiabilities = Math.abs(accountsData.filter(a => a.balance < 0).reduce((sum, a) => sum + a.balance, 0));
  const netWorth = totalAssets + investments.totalValue - totalLiabilities;

  const overdueEmis = emis.filter(e => e.status === 'OVERDUE');
  const totalMonthlyEmi = emis.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalOverdueEmiAmount = overdueEmis.reduce((sum, e) => sum + Number(e.amount), 0);

  const safeDailyLimit = Math.round(monthlySavings > 0 ? (monthlySavings * 0.6) / 30 : 500);
  const financialHealthScore = Math.min(98, Math.max(30, Math.round((savingsRatePercent * 1.2) + 45)));

  // Handlers to mutate application state
  const addIncomeItem = (newItem) => {
    setIncomeData(prev => {
      const updatedItems = [...prev.items, { id: Date.now(), ...newItem }];
      const newTotal = updatedItems.reduce((s, i) => s + Number(i.amount), 0);
      return { totalIncome: newTotal, items: updatedItems };
    });
  };

  const addExpenseItem = (newItem) => {
    setExpenseData(prev => {
      const updatedItems = [...prev.items, { id: Date.now(), ...newItem }];
      const newTotal = updatedItems.reduce((s, i) => s + Number(i.amount), 0);
      return { ...prev, totalExpenses: newTotal, items: updatedItems };
    });
  };

  const payEmi = (emiId) => {
    setEmis(prev => prev.map(e => e.id === emiId ? { ...e, status: 'PAID' } : e));
  };

  const addEmi = (newEmi) => {
    setEmis(prev => [...prev, { id: Date.now(), ...newEmi }]);
  };

  const deleteEmi = (emiId) => {
    setEmis(prev => prev.filter(e => e.id !== emiId));
  };

  const addAccount = (newAcc) => {
    setAccountsData(prev => [...prev, { id: Date.now(), ...newAcc }]);
  };

  const addGoalContribution = (goalId, amount) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const newCurrent = Math.min(g.target, g.current + Number(amount));
        const newPct = Math.round((newCurrent / g.target) * 100);
        return { ...g, current: newCurrent, percentage: newPct };
      }
      return g;
    }));
  };

  // Package full live telemetry snapshot for AI Assistant Monitor
  const getFullTelemetrySnapshot = () => {
    return {
      income: {
        totalIncome,
        itemsCount: incomeData.items.length
      },
      expenses: {
        totalExpenses,
        categories: expenseData.categories,
        itemsCount: expenseData.items.length
      },
      savings: {
        monthlySavings,
        savingsRatePercent,
        safeDailyLimit
      },
      accounts: {
        totalAssets,
        totalLiabilities,
        netPosition: totalAssets - totalLiabilities,
        accountsList: accountsData.map(a => ({ name: a.name, balance: a.balance }))
      },
      emis: {
        totalMonthlyEmi,
        overdueCount: overdueEmis.length,
        totalOverdueEmiAmount,
        overdueList: overdueEmis.map(e => ({
          title: e.title,
          amount: e.amount,
          lender: e.lender,
          interestRate: e.interestRate
        })),
        emisList: emis.map(e => ({
          title: e.title,
          amount: e.amount,
          status: e.status,
          dueDate: e.dueDate,
          lender: e.lender,
          interestRate: e.interestRate
        }))
      },
      goals: {
        activeCount: goals.length,
        goalsList: goals.map(g => ({ title: g.title, target: g.target, current: g.current, percentage: g.percentage }))
      },
      investments: {
        totalValue: investments.totalValue,
        allocation: investments.allocation
      },
      telemetry: {
        netWorth,
        financialHealthScore
      }
    };
  };

  return (
    <AppDataContext.Provider value={{
      incomeData,
      expenseData,
      accountsData,
      emis,
      setEmis,
      goals,
      investments,
      totalIncome,
      totalExpenses,
      monthlySavings,
      savingsRatePercent,
      netWorth,
      totalAssets,
      totalLiabilities,
      totalMonthlyEmi,
      overdueEmis,
      totalOverdueEmiAmount,
      safeDailyLimit,
      financialHealthScore,
      addIncomeItem,
      addExpenseItem,
      payEmi,
      addEmi,
      deleteEmi,
      addAccount,
      addGoalContribution,
      getFullTelemetrySnapshot
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}
