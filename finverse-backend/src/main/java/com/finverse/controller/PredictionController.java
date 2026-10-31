package com.finverse.controller;

import com.finverse.dto.PredictionRequestDto;
import com.finverse.dto.PredictionResponseDto;
import com.finverse.model.Asset;
import com.finverse.model.MarketData;
import com.finverse.model.Prediction;
import com.finverse.repository.AssetRepository;
import com.finverse.repository.MarketDataRepository;
import com.finverse.repository.PredictionRepository;
import com.finverse.service.MlPredictionClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin(origins = "*")
public class PredictionController {

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private MarketDataRepository marketDataRepository;

    @Autowired
    private PredictionRepository predictionRepository;

    @Autowired
    private MlPredictionClient mlPredictionClient;

    @PostMapping
    public ResponseEntity<?> generatePrediction(@RequestBody PredictionRequestDto request) {
        String symbol = request.getSymbol() != null ? request.getSymbol().toUpperCase() : "NIFTY50";
        Optional<Asset> assetOpt = assetRepository.findBySymbol(symbol);
        
        Asset asset;
        if (assetOpt.isPresent()) {
            asset = assetOpt.get();
        } else {
            asset = assetRepository.findAll().stream().findFirst().orElse(null);
        }

        if (asset != null && request.getCurrentPrice() == null) {
            request.setCurrentPrice(asset.getCurrentPrice());
        }

        List<MarketData> history = asset != null ? marketDataRepository.findByAssetOrderByTradingDateAsc(asset) : Collections.emptyList();
        List<Map<String, Object>> histFormatted = new ArrayList<>();
        for (MarketData m : history) {
            Map<String, Object> map = new HashMap<>();
            map.put("trading_date", m.getTradingDate().toString());
            map.put("close_price", m.getClosePrice());
            map.put("open_price", m.getOpenPrice());
            map.put("high_price", m.getHighPrice());
            map.put("low_price", m.getLowPrice());
            map.put("volume", m.getVolume());
            histFormatted.add(map);
        }

        PredictionResponseDto response = mlPredictionClient.requestPrediction(request, histFormatted);

        // Persist prediction entity to Database
        if (asset != null) {
            try {
                Prediction p = new Prediction();
                p.setAsset(asset);
                p.setPredictionDate(LocalDate.now());
                p.setTargetDate(LocalDate.now().plusDays(response.getPredictionHorizonDays()));
                p.setPredictedPrice(response.getPredictedPrice());
                p.setCurrentPrice(response.getCurrentPrice());
                p.setConfidenceScore(response.getConfidenceScore());
                p.setModelName(response.getModelName());
                p.setTrendDirection(response.getTrendDirection());
                p.setPredictionHorizonDays(response.getPredictionHorizonDays());
                predictionRepository.save(p);
            } catch (Exception e) {
                System.err.println("Note: Could not save prediction log to DB: " + e.getMessage());
            }
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{symbol}")
    public ResponseEntity<?> getPredictionsForSymbol(@PathVariable String symbol) {
        Optional<Asset> assetOpt = assetRepository.findBySymbol(symbol.toUpperCase());
        if (assetOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<Prediction> predictions = predictionRepository.findByAssetOrderByCreatedAtDesc(assetOpt.get());
        return ResponseEntity.ok(predictions);
    }
}
