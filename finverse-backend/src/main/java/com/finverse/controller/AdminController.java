package com.finverse.controller;

import com.finverse.model.Asset;
import com.finverse.model.User;
import com.finverse.repository.AssetRepository;
import com.finverse.repository.PredictionRepository;
import com.finverse.repository.UserRepository;
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
    private AssetRepository assetRepository;

    @Autowired
    private PredictionRepository predictionRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getSystemStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalAssets", assetRepository.count());
        stats.put("totalPredictionsGenerated", predictionRepository.count());
        stats.put("mlServiceStatus", "UP");
        stats.put("activeEngine", "RandomForest + LinearRegression");
        stats.put("systemUptime", "99.98%");
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/assets")
    public ResponseEntity<Asset> createAsset(@RequestBody Asset asset) {
        return ResponseEntity.ok(assetRepository.save(asset));
    }
}
