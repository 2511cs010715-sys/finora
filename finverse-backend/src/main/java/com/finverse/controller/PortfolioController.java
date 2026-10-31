package com.finverse.controller;

import com.finverse.dto.PortfolioRequestDto;
import com.finverse.model.Asset;
import com.finverse.model.Portfolio;
import com.finverse.model.User;
import com.finverse.repository.AssetRepository;
import com.finverse.repository.PortfolioRepository;
import com.finverse.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "*")
public class PortfolioController {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssetRepository assetRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication != null && authentication.getName() != null) {
            return userRepository.findByEmail(authentication.getName()).orElse(null);
        }
        // Fallback demo user
        return userRepository.findById(1L).orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
    }

    @GetMapping
    public ResponseEntity<?> getUserPortfolio(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        List<Portfolio> items = portfolioRepository.findByUser(user);
        
        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal totalInvested = BigDecimal.ZERO;

        List<Map<String, Object>> portfolioList = new ArrayList<>();
        for (Portfolio p : items) {
            Asset asset = p.getAsset();
            BigDecimal currentValue = asset.getCurrentPrice().multiply(p.getQuantity());
            BigDecimal investedValue = p.getPurchasePrice().multiply(p.getQuantity());
            BigDecimal gainLoss = currentValue.subtract(investedValue);
            BigDecimal gainLossPct = investedValue.compareTo(BigDecimal.ZERO) > 0 ?
                    gainLoss.multiply(new BigDecimal(100)).divide(investedValue, 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;

            totalValue = totalValue.add(currentValue);
            totalInvested = totalInvested.add(investedValue);

            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("asset", asset);
            map.put("quantity", p.getQuantity());
            map.put("purchasePrice", p.getPurchasePrice());
            map.put("purchaseDate", p.getPurchaseDate());
            map.put("currentValue", currentValue);
            map.put("investedValue", investedValue);
            map.put("gainLoss", gainLoss);
            map.put("gainLossPercent", gainLossPct);
            portfolioList.add(map);
        }

        BigDecimal totalGainLoss = totalValue.subtract(totalInvested);
        BigDecimal totalGainLossPct = totalInvested.compareTo(BigDecimal.ZERO) > 0 ?
                totalGainLoss.multiply(new BigDecimal(100)).divide(totalInvested, 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;

        Map<String, Object> response = new HashMap<>();
        response.put("items", portfolioList);
        response.put("totalValue", totalValue);
        response.put("totalInvested", totalInvested);
        response.put("totalGainLoss", totalGainLoss);
        response.put("totalGainLossPercent", totalGainLossPct);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> addPortfolioItem(@RequestBody PortfolioRequestDto request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Optional<Asset> assetOpt = assetRepository.findById(request.getAssetId());
        if (assetOpt.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Asset not found"));

        Portfolio p = new Portfolio(
                user,
                assetOpt.get(),
                request.getQuantity(),
                request.getPurchasePrice() != null ? request.getPurchasePrice() : assetOpt.get().getCurrentPrice(),
                request.getPurchaseDate() != null ? request.getPurchaseDate() : LocalDate.now()
        );

        portfolioRepository.save(p);
        return ResponseEntity.ok(p);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removePortfolioItem(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Optional<Portfolio> pOpt = portfolioRepository.findById(id);
        if (pOpt.isPresent()) {
            portfolioRepository.delete(pOpt.get());
            return ResponseEntity.ok(Map.of("message", "Portfolio position deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
