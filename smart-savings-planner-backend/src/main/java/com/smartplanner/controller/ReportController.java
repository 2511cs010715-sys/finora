package com.smartplanner.controller;

import com.smartplanner.model.*;
import com.smartplanner.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

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

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication != null && authentication.getName() != null) {
            return userRepository.findByEmail(authentication.getName()).orElse(null);
        }
        return userRepository.findById(1L).orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
    }

    @GetMapping("/monthly")
    public ResponseEntity<?> getMonthlyReport(@RequestParam(required = false) String month, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        List<Income> incomes = user != null ? incomeRepository.findByUserOrderByIncomeDateDesc(user) : Collections.emptyList();
        List<Expense> expenses = user != null ? expenseRepository.findByUserOrderByExpenseDateDesc(user) : Collections.emptyList();
        List<SavingsGoal> goals = user != null ? goalRepository.findByUserOrderByTargetDateAsc(user) : Collections.emptyList();
        List<Investment> investments = user != null ? investmentRepository.findByUserOrderByInvestmentDateDesc(user) : Collections.emptyList();

        BigDecimal totalIncome = incomes.stream().map(Income::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalExpenses = expenses.stream().map(Expense::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal monthlySavings = totalIncome.subtract(totalExpenses);
        if (monthlySavings.compareTo(BigDecimal.ZERO) < 0) monthlySavings = BigDecimal.ZERO;

        BigDecimal savingsRate = totalIncome.compareTo(BigDecimal.ZERO) > 0 ?
                monthlySavings.multiply(new BigDecimal(100)).divide(totalIncome, 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;

        BigDecimal totalInvestments = investments.stream().map(Investment::getInvestedAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> categoryExpenses = new HashMap<>();
        for (Expense e : expenses) {
            categoryExpenses.put(e.getCategory(), categoryExpenses.getOrDefault(e.getCategory(), BigDecimal.ZERO).add(e.getAmount()));
        }

        Map<String, Object> report = new HashMap<>();
        report.put("user", user);
        report.put("month", month != null ? month : "August 2026");
        report.put("totalIncome", totalIncome);
        report.put("totalExpenses", totalExpenses);
        report.put("monthlySavings", monthlySavings);
        report.put("savingsRatePercent", savingsRate);
        report.put("totalInvestments", totalInvestments);
        report.put("goalsCount", goals.size());
        report.put("categoryExpenses", categoryExpenses);

        return ResponseEntity.ok(report);
    }
}
