package com.smartplanner.controller;

import com.smartplanner.dto.ContributionDto;
import com.smartplanner.dto.GoalDto;
import com.smartplanner.model.SavingsGoal;
import com.smartplanner.model.User;
import com.smartplanner.repository.SavingsGoalRepository;
import com.smartplanner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*")
public class GoalController {

    @Autowired
    private SavingsGoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication != null && authentication.getName() != null) {
            return userRepository.findByEmail(authentication.getName()).orElse(null);
        }
        return userRepository.findById(1L).orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
    }

    @GetMapping
    public ResponseEntity<List<SavingsGoal>> getUserGoals(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(goalRepository.findByUserOrderByTargetDateAsc(user));
    }

    @PostMapping
    public ResponseEntity<?> createGoal(@RequestBody GoalDto request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        SavingsGoal goal = new SavingsGoal(
                user,
                request.getGoalName(),
                request.getTargetAmount(),
                request.getCurrentAmount() != null ? request.getCurrentAmount() : BigDecimal.ZERO,
                request.getTargetDate() != null ? request.getTargetDate() : LocalDate.now().plusMonths(6),
                request.getPriority() != null ? request.getPriority() : "Medium",
                request.getDescription()
        );

        goalRepository.save(goal);
        return ResponseEntity.ok(goal);
    }

    @PostMapping("/{id}/contribution")
    public ResponseEntity<?> addContribution(@PathVariable Long id, @RequestBody ContributionDto request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Optional<SavingsGoal> goalOpt = goalRepository.findById(id);
        if (goalOpt.isEmpty()) return ResponseEntity.notFound().build();

        SavingsGoal goal = goalOpt.get();
        BigDecimal current = goal.getCurrentAmount() != null ? goal.getCurrentAmount() : BigDecimal.ZERO;
        BigDecimal newTotal = current.add(request.getAmount() != null ? request.getAmount() : BigDecimal.ZERO);
        goal.setCurrentAmount(newTotal);

        goalRepository.save(goal);
        return ResponseEntity.ok(goal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGoal(@PathVariable Long id, @RequestBody GoalDto request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Optional<SavingsGoal> goalOpt = goalRepository.findById(id);
        if (goalOpt.isEmpty()) return ResponseEntity.notFound().build();

        SavingsGoal goal = goalOpt.get();
        if (request.getGoalName() != null) goal.setGoalName(request.getGoalName());
        if (request.getTargetAmount() != null) goal.setTargetAmount(request.getTargetAmount());
        if (request.getCurrentAmount() != null) goal.setCurrentAmount(request.getCurrentAmount());
        if (request.getTargetDate() != null) goal.setTargetDate(request.getTargetDate());
        if (request.getPriority() != null) goal.setPriority(request.getPriority());
        if (request.getDescription() != null) goal.setDescription(request.getDescription());

        goalRepository.save(goal);
        return ResponseEntity.ok(goal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Optional<SavingsGoal> goalOpt = goalRepository.findById(id);
        if (goalOpt.isPresent()) {
            goalRepository.delete(goalOpt.get());
            return ResponseEntity.ok(Map.of("message", "Savings goal deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
