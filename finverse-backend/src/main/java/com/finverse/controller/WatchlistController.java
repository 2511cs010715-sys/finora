package com.finverse.controller;

import com.finverse.model.Asset;
import com.finverse.model.User;
import com.finverse.model.Watchlist;
import com.finverse.repository.AssetRepository;
import com.finverse.repository.UserRepository;
import com.finverse.repository.WatchlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/watchlist")
@CrossOrigin(origins = "*")
public class WatchlistController {

    @Autowired
    private WatchlistRepository watchlistRepository;

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
    public ResponseEntity<List<Watchlist>> getUserWatchlist(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(watchlistRepository.findByUser(user));
    }

    @PostMapping
    public ResponseEntity<?> addToWatchlist(@RequestBody Map<String, Long> payload, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Long assetId = payload.get("assetId");
        if (assetId == null) return ResponseEntity.badRequest().body(Map.of("error", "assetId is required"));

        Optional<Asset> assetOpt = assetRepository.findById(assetId);
        if (assetOpt.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Asset not found"));

        if (watchlistRepository.existsByUserAndAsset(user, assetOpt.get())) {
            return ResponseEntity.ok(Map.of("message", "Asset already in watchlist"));
        }

        Watchlist watchlist = new Watchlist(user, assetOpt.get());
        watchlistRepository.save(watchlist);
        return ResponseEntity.ok(watchlist);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromWatchlist(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Optional<Watchlist> wOpt = watchlistRepository.findById(id);
        if (wOpt.isPresent()) {
            watchlistRepository.delete(wOpt.get());
            return ResponseEntity.ok(Map.of("message", "Item removed from watchlist"));
        }
        return ResponseEntity.notFound().build();
    }
}
