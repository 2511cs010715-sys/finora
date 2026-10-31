package com.finverse.controller;

import com.finverse.model.Asset;
import com.finverse.model.MarketData;
import com.finverse.repository.AssetRepository;
import com.finverse.repository.MarketDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/market")
@CrossOrigin(origins = "*")
public class MarketDataController {

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private MarketDataRepository marketDataRepository;

    @GetMapping("/overview")
    public ResponseEntity<?> getMarketOverview() {
        List<Asset> allAssets = assetRepository.findAll();
        List<Asset> indices = assetRepository.findByAssetType("INDEX");
        
        List<Asset> topGainers = new ArrayList<>(allAssets);
        topGainers.sort((a, b) -> b.getDailyChangePercent().compareTo(a.getDailyChangePercent()));
        
        List<Asset> topLosers = new ArrayList<>(allAssets);
        topLosers.sort((a, b) -> a.getDailyChangePercent().compareTo(b.getDailyChangePercent()));

        Map<String, Object> overview = new HashMap<>();
        overview.put("indices", indices);
        overview.put("topGainers", topGainers.stream().limit(5).toList());
        overview.put("topLosers", topLosers.stream().limit(5).toList());
        overview.put("marketSentiment", "BULLISH");
        overview.put("activeVolumeTotal", "485.2M");

        return ResponseEntity.ok(overview);
    }

    @GetMapping("/{symbol}/history")
    public ResponseEntity<?> getAssetHistory(@PathVariable String symbol) {
        Optional<Asset> assetOpt = assetRepository.findBySymbol(symbol.toUpperCase());
        if (assetOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Asset asset = assetOpt.get();
        List<MarketData> history = marketDataRepository.findByAssetOrderByTradingDateAsc(asset);

        return ResponseEntity.ok(Map.of(
                "asset", asset,
                "history", history
        ));
    }
}
