-- Smart Savings and Investment Planner Database Schema
-- Compatible with MySQL 8.0+ and H2 Database Engine

CREATE DATABASE IF NOT EXISTS smart_savings_db;
USE smart_savings_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    monthly_income DECIMAL(15, 2) DEFAULT 0.00,
    financial_goal_pref VARCHAR(50) DEFAULT 'Balanced Savings & Growth',
    theme_preference VARCHAR(10) DEFAULT 'dark',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Income Table
CREATE TABLE IF NOT EXISTS income (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    source VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Salary', 'Freelance', 'Business', 'Allowance', 'Interest', 'Other'
    amount DECIMAL(15, 2) NOT NULL,
    income_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    expense_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Food', 'Transport', 'Education', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Travel', 'Other'
    amount DECIMAL(15, 2) NOT NULL,
    expense_date DATE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'UPI / Card', -- 'UPI', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Savings Goals Table
CREATE TABLE IF NOT EXISTS savings_goals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    goal_name VARCHAR(100) NOT NULL,
    target_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    target_date DATE NOT NULL,
    priority VARCHAR(20) DEFAULT 'Medium', -- 'High', 'Medium', 'Low'
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Investments Table
CREATE TABLE IF NOT EXISTS investments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    investment_name VARCHAR(100) NOT NULL,
    investment_type VARCHAR(50) NOT NULL, -- 'Mutual Funds', 'Stocks', 'Fixed Deposits', 'Bonds', 'Gold', 'Other'
    invested_amount DECIMAL(15, 2) NOT NULL,
    investment_date DATE NOT NULL,
    expected_return DECIMAL(5, 2) DEFAULT 8.00,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Reminders Table
CREATE TABLE IF NOT EXISTS reminders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    reminder_type VARCHAR(50) NOT NULL, -- 'Monthly Savings', 'Expense Review', 'Goal Contribution', 'Investment Contribution', 'Bill Reminder'
    title VARCHAR(150) NOT NULL,
    reminder_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- 'ACTIVE', 'DISABLED', 'COMPLETED'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for optimal performance
CREATE INDEX idx_income_user_date ON income(user_id, income_date);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, expense_date);
CREATE INDEX idx_goals_user ON savings_goals(user_id);
CREATE INDEX idx_investments_user ON investments(user_id);
