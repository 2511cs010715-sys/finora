package com.finverse.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "prediction_date", nullable = false)
    private LocalDate predictionDate;

    @Column(name = "target_date", nullable = false)
    private LocalDate targetDate;

    @Column(name = "predicted_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal predictedPrice;

    @Column(name = "current_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal currentPrice;

    @Column(name = "confidence_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal confidenceScore;

    @Column(name = "model_name", nullable = false, length = 50)
    private String modelName;

    @Column(name = "trend_direction", nullable = false, length = 20)
    private String trendDirection; // 'BULLISH', 'BEARISH', 'NEUTRAL'

    @Column(name = "prediction_horizon_days", nullable = false)
    private Integer predictionHorizonDays = 7;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Prediction() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Asset getAsset() { return asset; }
    public void setAsset(Asset asset) { this.asset = asset; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDate getPredictionDate() { return predictionDate; }
    public void setPredictionDate(LocalDate predictionDate) { this.predictionDate = predictionDate; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public BigDecimal getPredictedPrice() { return predictedPrice; }
    public void setPredictedPrice(BigDecimal predictedPrice) { this.predictedPrice = predictedPrice; }

    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }

    public BigDecimal getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(BigDecimal confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public String getTrendDirection() { return trendDirection; }
    public void setTrendDirection(String trendDirection) { this.trendDirection = trendDirection; }

    public Integer getPredictionHorizonDays() { return predictionHorizonDays; }
    public void setPredictionHorizonDays(Integer predictionHorizonDays) { this.predictionHorizonDays = predictionHorizonDays; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
