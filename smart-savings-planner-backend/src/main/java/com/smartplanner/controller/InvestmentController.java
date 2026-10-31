package com.smartplanner.controller;

import com.smartplanner.dto.InvestmentDto;
import com.smartplanner.model.Investment;
import com.smartplanner.model.User;
import com.smartplanner.repository.InvestmentRepository;
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
@RequestMapping("/api/investments")
@CrossOrigin(origins = "*")
public class InvestmentController {

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication != null && authentication.getName() != null) {
            return userRepository.findByEmail(authentication.getName()).orElse(null);
        }
        return userRepository.findById(1L).orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
    }

    @GetMapping
    public ResponseEntity<List<Investment>> getUserInvestments(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(investmentRepository.findByUserOrderByInvestmentDateDesc(user));
    }

    @PostMapping
    public ResponseEntity<?> addInvestment(@RequestBody InvestmentDto request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Investment investment = new Investment(
                user,
                request.getInvestmentName(),
                request.getInvestmentType() != null ? request.getInvestmentType() : "Mutual Funds",
                request.getInvestedAmount(),
                request.getInvestmentDate() != null ? request.getInvestmentDate() : LocalDate.now(),
                request.getExpectedReturn() != null ? request.getExpectedReturn() : new BigDecimal("8.00"),
                request.getDescription()
        );

        investmentRepository.save(investment);
        return ResponseEntity.ok(investment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateInvestment(@PathVariable Long id, @RequestBody InvestmentDto request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Optional<Investment> invOpt = investmentRepository.findById(id);
        if (invOpt.isEmpty()) return ResponseEntity.notFound().build();

        Investment investment = invOpt.get();
        if (request.getInvestmentName() != null) investment.setInvestmentName(request.getInvestmentName());
        if (request.getInvestmentType() != null) investment.setInvestmentType(request.getInvestmentType());
        if (request.getInvestedAmount() != null) investment.setInvestedAmount(request.getInvestedAmount());
        if (request.getInvestmentDate() != null) investment.setInvestmentDate(request.getInvestmentDate());
        if (request.getExpectedReturn() != null) investment.setExpectedReturn(request.getExpectedReturn());
        if (request.getDescription() != null) investment.setDescription(request.getDescription());

        investmentRepository.save(investment);
        return ResponseEntity.ok(investment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInvestment(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Optional<Investment> invOpt = investmentRepository.findById(id);
        if (invOpt.isPresent()) {
            investmentRepository.delete(invOpt.get());
            return ResponseEntity.ok(Map.of("message", "Investment deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
