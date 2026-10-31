package com.smartplanner.config;

import com.smartplanner.model.*;
import com.smartplanner.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private SavingsGoalRepository goalRepository;

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println("Smart Savings Planner database already contains initial seeded data.");
            return;
        }

        System.out.println("Seeding Smart Savings & Investment Planner database...");

        // 1. Create Users
        User demoUser = new User("Alex Mercer", "user@finplanner.com", passwordEncoder.encode("password123"), "ROLE_USER", new BigDecimal("50000.00"), "Balanced Savings & Growth");
        User adminUser = new User("Admin Manager", "admin@finplanner.com", passwordEncoder.encode("password123"), "ROLE_ADMIN", new BigDecimal("85000.00"), "Aggressive Wealth Building");
        userRepository.saveAll(Arrays.asList(demoUser, adminUser));

        // 2. Create Income Streams for Demo User
        Income i1 = new Income(demoUser, "Tech Corp Salary", "Salary", new BigDecimal("45000.00"), LocalDate.now().minusDays(12), "Monthly primary paycheck");
        Income i2 = new Income(demoUser, "Freelance Web Design", "Freelance", new BigDecimal("5000.00"), LocalDate.now().minusDays(3), "UI/UX redesign client invoice");
        incomeRepository.saveAll(Arrays.asList(i1, i2));

        // 3. Create Expense Records for Demo User
        Expense e1 = new Expense(demoUser, "Grocery & Organics", "Food", new BigDecimal("6500.00"), LocalDate.now().minusDays(11), "UPI", "Supermarket monthly groceries");
        Expense e2 = new Expense(demoUser, "Apartment Rent & Maint.", "Bills", new BigDecimal("12000.00"), LocalDate.now().minusDays(10), "Bank Transfer", "Monthly housing rent");
        Expense e3 = new Expense(demoUser, "Fuel & Transit", "Transport", new BigDecimal("3200.00"), LocalDate.now().minusDays(8), "Credit Card", "Vehicle petrol & Metro passes");
        Expense e4 = new Expense(demoUser, "Online Learning Course", "Education", new BigDecimal("4000.00"), LocalDate.now().minusDays(5), "UPI", "Full-Stack Certification");
        Expense e5 = new Expense(demoUser, "Cinema & Dining", "Entertainment", new BigDecimal("2300.00"), LocalDate.now().minusDays(2), "Debit Card", "Weekend movie and dinner");
        Expense e6 = new Expense(demoUser, "Broadband & Power", "Bills", new BigDecimal("2800.00"), LocalDate.now().minusDays(1), "UPI", "Internet and utility bill");
        expenseRepository.saveAll(Arrays.asList(e1, e2, e3, e4, e5, e6));

        // 4. Create Savings Goals for Demo User
        SavingsGoal g1 = new SavingsGoal(demoUser, "Emergency Reserve Fund", new BigDecimal("100000.00"), new BigDecimal("60000.00"), LocalDate.now().plusMonths(4), "High", "6 months liquidity reserve");
        SavingsGoal g2 = new SavingsGoal(demoUser, "M3 MacBook Air Laptop", new BigDecimal("95000.00"), new BigDecimal("45000.00"), LocalDate.now().plusMonths(2), "High", "Engineering workstation upgrade");
        SavingsGoal g3 = new SavingsGoal(demoUser, "Goa Annual Vacation", new BigDecimal("35000.00"), new BigDecimal("15000.00"), LocalDate.now().plusMonths(3), "Medium", "Year-end vacation trip");
        goalRepository.saveAll(Arrays.asList(g1, g2, g3));

        // 5. Create Investment Records for Demo User
        Investment inv1 = new Investment(demoUser, "Nifty 50 Index Fund SIP", "Mutual Funds", new BigDecimal("30000.00"), LocalDate.now().minusMonths(6), new BigDecimal("12.50"), "Index fund monthly SIP");
        Investment inv2 = new Investment(demoUser, "Tech Equities Basket", "Stocks", new BigDecimal("25000.00"), LocalDate.now().minusMonths(4), new BigDecimal("15.00"), "Blue-chip tech stocks");
        Investment inv3 = new Investment(demoUser, "Bank Fixed Deposit", "Fixed Deposits", new BigDecimal("15000.00"), LocalDate.now().minusMonths(3), new BigDecimal("7.20"), "Guaranteed interest term deposit");
        Investment inv4 = new Investment(demoUser, "Digital Sovereign Gold", "Gold", new BigDecimal("5000.00"), LocalDate.now().minusMonths(2), new BigDecimal("9.00"), "Gold ETF allocation");
        investmentRepository.saveAll(Arrays.asList(inv1, inv2, inv3, inv4));

        // 6. Create Reminders
        Reminder r1 = new Reminder(demoUser, "Monthly Savings", "Transfer ₹15,000 to Emergency Fund Goal", LocalDate.now().plusDays(12), "ACTIVE");
        Reminder r2 = new Reminder(demoUser, "Bill Reminder", "Pay Broadband & Utility Bill", LocalDate.now().plusDays(15), "ACTIVE");
        Reminder r3 = new Reminder(demoUser, "Investment Contribution", "Execute Monthly Index Fund SIP", LocalDate.now().plusDays(18), "ACTIVE");
        reminderRepository.saveAll(Arrays.asList(r1, r2, r3));

        // 7. Create Notifications
        Notification n1 = new Notification(demoUser, "Welcome to FinPlanner!", "Start managing income, expenses, and savings goals with intelligent AI suggestions.", "INFO");
        Notification n2 = new Notification(demoUser, "Goal Milestone Reached", "Your Emergency Reserve Fund has crossed 60% completion!", "SUCCESS");
        notificationRepository.saveAll(Arrays.asList(n1, n2));

        System.out.println("Smart Savings Planner database seeding completed successfully!");
    }
}
