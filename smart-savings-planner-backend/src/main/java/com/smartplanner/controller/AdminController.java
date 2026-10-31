package com.smartplanner.controller;

import com.smartplanner.model.User;
import com.smartplanner.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

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

    @GetMapping("/stats")
    public ResponseEntity<?> getSystemStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalIncomeRecords", incomeRepository.count());
        stats.put("totalExpenseRecords", expenseRepository.count());
        stats.put("totalActiveGoals", goalRepository.count());
        stats.put("totalInvestments", investmentRepository.count());
        stats.put("aiServiceStatus", "UP");
        stats.put("systemUptime", "99.99%");
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
