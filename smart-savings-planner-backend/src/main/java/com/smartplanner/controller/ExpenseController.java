package com.smartplanner.controller;

import com.smartplanner.dto.ExpenseDto;
import com.smartplanner.model.Expense;
import com.smartplanner.model.User;
import com.smartplanner.repository.ExpenseRepository;
import com.smartplanner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication != null && authentication.getName() != null) {
            return userRepository.findByEmail(authentication.getName()).orElse(null);
        }
        return userRepository.findById(1L).orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getUserExpenses(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(expenseRepository.findByUserOrderByExpenseDateDesc(user));
    }

    @PostMapping
    public ResponseEntity<?> addExpense(@RequestBody ExpenseDto request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Expense expense = new Expense(
                user,
                request.getExpenseName(),
                request.getCategory() != null ? request.getCategory() : "Food",
                request.getAmount(),
                request.getExpenseDate() != null ? request.getExpenseDate() : LocalDate.now(),
                request.getPaymentMethod() != null ? request.getPaymentMethod() : "UPI",
                request.getDescription()
        );

        expenseRepository.save(expense);
        return ResponseEntity.ok(expense);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id, @RequestBody ExpenseDto request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Optional<Expense> expenseOpt = expenseRepository.findById(id);
        if (expenseOpt.isEmpty()) return ResponseEntity.notFound().build();

        Expense expense = expenseOpt.get();
        if (request.getExpenseName() != null) expense.setExpenseName(request.getExpenseName());
        if (request.getCategory() != null) expense.setCategory(request.getCategory());
        if (request.getAmount() != null) expense.setAmount(request.getAmount());
        if (request.getExpenseDate() != null) expense.setExpenseDate(request.getExpenseDate());
        if (request.getPaymentMethod() != null) expense.setPaymentMethod(request.getPaymentMethod());
        if (request.getDescription() != null) expense.setDescription(request.getDescription());

        expenseRepository.save(expense);
        return ResponseEntity.ok(expense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Optional<Expense> expenseOpt = expenseRepository.findById(id);
        if (expenseOpt.isPresent()) {
            expenseRepository.delete(expenseOpt.get());
            return ResponseEntity.ok(Map.of("message", "Expense entry deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
