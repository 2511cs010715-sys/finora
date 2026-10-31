package com.finverse.dto;

import java.math.BigDecimal;

public class PredictionRequestDto {
    private String symbol;
    private BigDecimal currentPrice;
    private Integer horizonDays = 7;
    private String modelName = "Random Forest Regression";
    private Long userId;

    public PredictionRequestDto() {}

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }

    public Integer getHorizonDays() { return horizonDays; }
    public void setHorizonDays(Integer horizonDays) { this.horizonDays = horizonDays; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
