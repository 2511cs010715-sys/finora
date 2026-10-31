package com.finverse.controller;

import com.finverse.model.Asset;
import com.finverse.model.Portfolio;
import com.finverse.model.User;
import com.finverse.repository.AssetRepository;
import com.finverse.repository.PortfolioRepository;
import com.finverse.repository.UserRepository;
import com.finverse.repository.WatchlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private WatchlistRepository watchlistRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication != null && authentication.getName() != null) {
            return userRepository.findByEmail(authentication.getName()).orElse(null);
        }
        return userRepository.findById(1L).orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
    }

    @GetMapping
    public ResponseEntity<?> getDashboardMetrics(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        List<Asset> allAssets = assetRepository.findAll();
        List<Portfolio> userPortfolios = user != null ? portfolioRepository.findByUser(user) : Collections.emptyList();
        int watchlistCount = user != null ? watchlistRepository.findByUser(user).size() : 4;

        BigDecimal totalPortfolioValue = BigDecimal.ZERO;
        BigDecimal totalInvested = BigDecimal.ZERO;

        for (Portfolio p : userPortfolios) {
            totalPortfolioValue = totalPortfolioValue.add(p.getAsset().getCurrentPrice().multiply(p.getQuantity()));
            totalInvested = totalInvested.add(p.getPurchasePrice().multiply(p.getQuantity()));
        }

        BigDecimal todayChangePct = new BigDecimal("1.25");
        BigDecimal predictionAccuracy = new BigDecimal("89.40");

        Map<String, Object> summaryCards = new HashMap<>();
        summaryCards.put("marketStatus", "OPEN");
        summaryCards.put("portfolioValue", totalPortfolioValue);
        summaryCards.put("totalInvested", totalInvested);
        summaryCards.put("todayChangePercent", todayChangePct);
        summaryCards.put("watchlistAssetsCount", watchlistCount);
        summaryCards.put("aiAccuracyScore", predictionAccuracy);

        Map<String, Object> response = new HashMap<>();
        response.put("summaryCards", summaryCards);
        response.put("featuredAssets", allAssets.stream().limit(6).toList());
        response.put("marketSentiment", "BULLISH");

        return ResponseEntity.ok(response);
    }
}
