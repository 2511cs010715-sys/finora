package com.smartplanner.controller;

import com.smartplanner.dto.IncomeDto;
import com.smartplanner.model.Income;
import com.smartplanner.model.User;
import com.smartplanner.repository.IncomeRepository;
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
@RequestMapping("/api/income")
@CrossOrigin(origins = "*")
public class IncomeController {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication != null && authentication.getName() != null) {
            return userRepository.findByEmail(authentication.getName()).orElse(null);
        }
        return userRepository.findById(1L).orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
    }

    @GetMapping
    public ResponseEntity<List<Income>> getUserIncome(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(incomeRepository.findByUserOrderByIncomeDateDesc(user));
    }

    @PostMapping
    public ResponseEntity<?> addIncome(@RequestBody IncomeDto request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Income income = new Income(
                user,
                request.getSource(),
                request.getCategory() != null ? request.getCategory() : "Salary",
                request.getAmount(),
                request.getIncomeDate() != null ? request.getIncomeDate() : LocalDate.now(),
                request.getDescription()
        );

        incomeRepository.save(income);
        return ResponseEntity.ok(income);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateIncome(@PathVariable Long id, @RequestBody IncomeDto request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Optional<Income> incomeOpt = incomeRepository.findById(id);
        if (incomeOpt.isEmpty()) return ResponseEntity.notFound().build();

        Income income = incomeOpt.get();
        if (request.getSource() != null) income.setSource(request.getSource());
        if (request.getCategory() != null) income.setCategory(request.getCategory());
        if (request.getAmount() != null) income.setAmount(request.getAmount());
        if (request.getIncomeDate() != null) income.setIncomeDate(request.getIncomeDate());
        if (request.getDescription() != null) income.setDescription(request.getDescription());

        incomeRepository.save(income);
        return ResponseEntity.ok(income);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIncome(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Optional<Income> incomeOpt = incomeRepository.findById(id);
        if (incomeOpt.isPresent()) {
            incomeRepository.delete(incomeOpt.get());
            return ResponseEntity.ok(Map.of("message", "Income entry deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
