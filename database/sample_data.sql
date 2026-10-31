-- Smart Savings and Investment Planner Sample Data Seed Script

-- 1. Insert Demo Users (BCrypt hash for 'password123': $2a$10$8.UnVuG9HHgffUDAlk8qfOUVGkqRzgVym50cr0ED719g5m/4lTHhC)
INSERT INTO users (id, name, email, password, role, monthly_income, financial_goal_pref, theme_preference) VALUES
(1, 'Alex Mercer', 'user@finplanner.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOUVGkqRzgVym50cr0ED719g5m/4lTHhC', 'ROLE_USER', 50000.00, 'Balanced Savings & Growth', 'dark'),
(2, 'Admin Manager', 'admin@finplanner.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOUVGkqRzgVym50cr0ED719g5m/4lTHhC', 'ROLE_ADMIN', 85000.00, 'Aggressive Wealth Building', 'dark');

-- 2. Insert Income Records for Demo User
INSERT INTO income (user_id, source, category, amount, income_date, description) VALUES
(1, 'Tech Corp Salary', 'Salary', 45000.00, '2026-08-01', 'Monthly primary employment paycheck'),
(1, 'Freelance Web Design', 'Freelance', 5000.00, '2026-08-10', 'UI/UX redesign project for client');

-- 3. Insert Expense Records for Demo User
INSERT INTO expenses (user_id, expense_name, category, amount, expense_date, payment_method, description) VALUES
(1, 'Grocery & Organics', 'Food', 6500.00, '2026-08-02', 'UPI', 'Supermarket monthly groceries'),
(1, 'Apartment Rent & Maintenance', 'Bills', 12000.00, '2026-08-03', 'Bank Transfer', 'Monthly housing rent'),
(1, 'Fuel & Transit', 'Transport', 3200.00, '2026-08-05', 'Credit Card', 'Vehicle petrol & Metro passes'),
(1, 'Online Learning Course', 'Education', 4000.00, '2026-08-08', 'UPI', 'Full-Stack Development Certification'),
(1, 'Cinema & Dining', 'Entertainment', 2300.00, '2026-08-11', 'Debit Card', 'Weekend movie and dinner'),
(1, 'Electricity & Internet Bill', 'Bills', 2800.00, '2026-08-12', 'UPI', 'High-speed broadband and power bill');

-- 4. Insert Savings Goals for Demo User
INSERT INTO savings_goals (user_id, goal_name, target_amount, current_amount, target_date, priority, description) VALUES
(1, 'Emergency Reserve Fund', 100000.00, 60000.00, '2026-12-31', 'High', '6 months liquidity reserve buffer'),
(1, 'M3 MacBook Air Laptop', 95000.00, 45000.00, '2026-10-15', 'High', 'Workstation upgrade for software engineering'),
(1, 'Goa Annual Vacation', 35000.00, 15000.00, '2026-11-20', 'Medium', 'Year-end leisure trip with friends');

-- 5. Insert Investments for Demo User
INSERT INTO investments (user_id, investment_name, investment_type, invested_amount, investment_date, expected_return, description) VALUES
(1, 'Nifty 50 Index Fund SIP', 'Mutual Funds', 30000.00, '2026-01-15', 12.50, 'Low-cost index fund monthly SIP'),
(1, 'Tech Equities Basket', 'Stocks', 25000.00, '2026-03-10', 15.00, 'Blue-chip technology stocks portfolio'),
(1, 'Bank Fixed Deposit', 'Fixed Deposits', 15000.00, '2026-05-01', 7.20, 'Guaranteed interest term deposit'),
(1, 'Digital Sovereign Gold', 'Gold', 5000.00, '2026-06-20', 9.00, 'Gold ETF asset allocation');

-- 6. Insert Reminders for Demo User
INSERT INTO reminders (user_id, reminder_type, title, reminder_date, status) VALUES
(1, 'Monthly Savings', 'Transfer ₹15,000 to Emergency Fund Goal', '2026-08-25', 'ACTIVE'),
(1, 'Bill Reminder', 'Pay Broadband & Utility Bill', '2026-08-28', 'ACTIVE'),
(1, 'Investment Contribution', 'Execute Monthly Index Fund SIP', '2026-09-01', 'ACTIVE');

-- 7. Insert Initial Notifications
INSERT INTO notifications (user_id, title, message, notification_type, is_read) VALUES
(1, 'Welcome to FinPlanner!', 'Start tracking your income, expenses, and savings goals with intelligent advice.', 'INFO', TRUE),
(1, 'Savings Goal Milestone', 'Your Emergency Reserve Fund has crossed 60% completion!', 'SUCCESS', FALSE);
