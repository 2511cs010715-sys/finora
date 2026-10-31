package com.finverse.controller;

import com.finverse.dto.AlertRequestDto;
import com.finverse.model.Alert;
import com.finverse.model.Asset;
import com.finverse.model.User;
import com.finverse.repository.AlertRepository;
import com.finverse.repository.AssetRepository;
import com.finverse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssetRepository assetRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication != null && authentication.getName() != null) {
            return userRepository.findByEmail(authentication.getName()).orElse(null);
        }
        return userRepository.findById(1L).orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
    }

    @GetMapping
    public ResponseEntity<List<Alert>> getUserAlerts(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(alertRepository.findByUser(user));
    }

    @PostMapping
    public ResponseEntity<?> createAlert(@RequestBody AlertRequestDto request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Optional<Asset> assetOpt = assetRepository.findById(request.getAssetId());
        if (assetOpt.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Asset not found"));

        Alert alert = new Alert(
                user,
                assetOpt.get(),
                request.getAlertType() != null ? request.getAlertType() : "PRICE_ABOVE",
                request.getThreshold(),
                "ACTIVE"
        );

        alertRepository.save(alert);
        return ResponseEntity.ok(alert);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAlert(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Optional<Alert> aOpt = alertRepository.findById(id);
        if (aOpt.isPresent()) {
            alertRepository.delete(aOpt.get());
            return ResponseEntity.ok(Map.of("message", "Price alert deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
