package com.smartplanner.controller;

import com.smartplanner.model.User;
import com.smartplanner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }
        return userRepository.findByEmail(authentication.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody Map<String, Object> payload, Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();

        if (payload.containsKey("name")) user.setName((String) payload.get("name"));
        if (payload.containsKey("monthlyIncome")) user.setMonthlyIncome(new BigDecimal(payload.get("monthlyIncome").toString()));
        if (payload.containsKey("financialGoalPref")) user.setFinancialGoalPref((String) payload.get("financialGoalPref"));
        if (payload.containsKey("themePreference")) user.setThemePreference((String) payload.get("themePreference"));

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }
}
