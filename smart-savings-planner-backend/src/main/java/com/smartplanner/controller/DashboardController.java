package com.smartplanner.controller;

import com.smartplanner.model.*;
import com.smartplanner.repository.*;
import com.smartplanner.service.AiAdvisorClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

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
    private AiAdvisorClient aiAdvisorClient;

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication != null && authentication.getName() != null) {
            return userRepository.findByEmail(authentication.getName()).orElse(null);
        }
        return userRepository.findById(1L).orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
    }

    @GetMapping
    public ResponseEntity<?> getDashboardMetrics(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        List<Income> incomes = user != null ? incomeRepository.findByUserOrderByIncomeDateDesc(user) : Collections.emptyList();
        List<Expense> expenses = user != null ? expenseRepository.findByUserOrderByExpenseDateDesc(user) : Collections.emptyList();
        List<SavingsGoal> goals = user != null ? goalRepository.findByUserOrderByTargetDateAsc(user) : Collections.emptyList();
        List<Investment> investments = user != null ? investmentRepository.findByUserOrderByInvestmentDateDesc(user) : Collections.emptyList();

        BigDecimal totalIncome = incomes.stream().map(Income::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        if (totalIncome.compareTo(BigDecimal.ZERO) == 0 && user != null && user.getMonthlyIncome() != null) {
            totalIncome = user.getMonthlyIncome();
        }

        BigDecimal totalExpenses = expenses.stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal monthlySavings = totalIncome.subtract(totalExpenses);
        if (monthlySavings.compareTo(BigDecimal.ZERO) < 0) monthlySavings = BigDecimal.ZERO;

        BigDecimal savingsRate = totalIncome.compareTo(BigDecimal.ZERO) > 0 ?
                monthlySavings.multiply(new BigDecimal(100)).divide(totalIncome, 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;

        BigDecimal totalInvestments = investments.stream().map(Investment::getInvestedAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        // Highest Expense Category
        Map<String, BigDecimal> categoryTotals = new HashMap<>();
        for (Expense e : expenses) {
            categoryTotals.put(e.getCategory(), categoryTotals.getOrDefault(e.getCategory(), BigDecimal.ZERO).add(e.getAmount()));
        }
        String highestCategory = categoryTotals.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Bills");

        // Goals Avg Progress %
        double totalGoalProgress = 0.0;
        for (SavingsGoal g : goals) {
            if (g.getTargetAmount().compareTo(BigDecimal.ZERO) > 0) {
                double pct = g.getCurrentAmount().doubleValue() / g.getTargetAmount().doubleValue() * 100.0;
                totalGoalProgress += Math.min(100.0, pct);
            }
        }
        double avgGoalProgress = goals.size() > 0 ? (totalGoalProgress / goals.size()) : 50.0;

        // Fetch AI Analysis & Health Score from Python Microservice
        Map<String, Object> aiResponse = aiAdvisorClient.fetchFinancialAnalysis(
                totalIncome, totalExpenses, monthlySavings, totalInvestments, highestCategory, avgGoalProgress
        );

        Map<String, Object> response = new HashMap<>();
        response.put("totalIncome", totalIncome);
        response.put("totalExpenses", totalExpenses);
        response.put("monthlySavings", monthlySavings);
        response.put("savingsRatePercent", savingsRate);
        response.put("totalInvestments", totalInvestments);
        response.put("activeGoalsCount", goals.size());
        response.put("highestExpenseCategory", highestCategory);
        response.put("financialHealthScore", aiResponse.getOrDefault("financial_health_score", 78));
        response.put("suggestions", aiResponse.get("suggestions"));
        response.put("recentExpenses", expenses.stream().limit(5).toList());
        response.put("recentIncome", incomes.stream().limit(5).toList());
        response.put("disclaimer", "Smart Savings & Investment Planner calculations are educational estimates and not guaranteed financial advice.");

        return ResponseEntity.ok(response);
    }
}
