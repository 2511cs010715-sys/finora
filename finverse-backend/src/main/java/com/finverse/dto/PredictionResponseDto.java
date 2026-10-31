package com.finverse.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class PredictionResponseDto {
    private String symbol;
    private BigDecimal currentPrice;
    private BigDecimal predictedPrice;
    private BigDecimal priceChange;
    private BigDecimal priceChangePercent;
    private BigDecimal confidenceScore;
    private String modelName;
    private String trendDirection;
    private Integer predictionHorizonDays;
    private List<Map<String, Object>> forecastPoints;
    private String disclaimer;

    public PredictionResponseDto() {}

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }

    public BigDecimal getPredictedPrice() { return predictedPrice; }
    public void setPredictedPrice(BigDecimal predictedPrice) { this.predictedPrice = predictedPrice; }

    public BigDecimal getPriceChange() { return priceChange; }
    public void setPriceChange(BigDecimal priceChange) { this.priceChange = priceChange; }

    public BigDecimal getPriceChangePercent() { return priceChangePercent; }
    public void setPriceChangePercent(BigDecimal priceChangePercent) { this.priceChangePercent = priceChangePercent; }

    public BigDecimal getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(BigDecimal confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getTrendDirection() { return trendDirection; }
    public void setTrendDirection(String trendDirection) { this.trendDirection = trendDirection; }

    public Integer getPredictionHorizonDays() { return predictionHorizonDays; }
    public void setPredictionHorizonDays(Integer predictionHorizonDays) { this.predictionHorizonDays = predictionHorizonDays; }

    public List<Map<String, Object>> getForecastPoints() { return forecastPoints; }
    public void setForecastPoints(List<Map<String, Object>> forecastPoints) { this.forecastPoints = forecastPoints; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
}
