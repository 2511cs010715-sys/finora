package com.finverse.controller;

import com.finverse.model.Asset;
import com.finverse.repository.AssetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*")
public class AssetController {

    @Autowired
    private AssetRepository assetRepository;

    @GetMapping
    public ResponseEntity<List<Asset>> getAllAssets(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(assetRepository.findBySymbolContainingIgnoreCaseOrAssetNameContainingIgnoreCase(search.trim(), search.trim()));
        }
        return ResponseEntity.ok(assetRepository.findAll());
    }

    @GetMapping("/{symbol}")
    public ResponseEntity<?> getAssetBySymbol(@PathVariable String symbol) {
        return assetRepository.findBySymbol(symbol.toUpperCase())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{assetType}")
    public ResponseEntity<List<Asset>> getAssetsByType(@PathVariable String assetType) {
        return ResponseEntity.ok(assetRepository.findByAssetType(assetType.toUpperCase()));
    }
}
