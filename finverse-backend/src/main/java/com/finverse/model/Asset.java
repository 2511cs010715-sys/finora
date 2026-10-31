package com.finverse.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "assets")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String symbol;

    @Column(name = "asset_name", nullable = false, length = 100)
    private String assetName;

    @Column(name = "asset_type", nullable = false, length = 30)
    private String assetType; // 'STOCK', 'INDEX', 'CRYPTO', 'ETF'

    @Column(name = "current_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal currentPrice;

    @Column(name = "daily_change", precision = 8, scale = 2)
    private BigDecimal dailyChange = BigDecimal.ZERO;

    @Column(name = "daily_change_percent", precision = 6, scale = 2)
    private BigDecimal dailyChangePercent = BigDecimal.ZERO;

    @Column(name = "market_status", length = 20)
    private String marketStatus = "OPEN";

    @Column(length = 50)
    private String sector = "General";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Asset() {}

    public Asset(String symbol, String assetName, String assetType, BigDecimal currentPrice, BigDecimal dailyChange, BigDecimal dailyChangePercent, String sector) {
        this.symbol = symbol;
        this.assetName = assetName;
        this.assetType = assetType;
        this.currentPrice = currentPrice;
        this.dailyChange = dailyChange;
        this.dailyChangePercent = dailyChangePercent;
        this.sector = sector;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getAssetName() { return assetName; }
    public void setAssetName(String assetName) { this.assetName = assetName; }

    public String getAssetType() { return assetType; }
    public void setAssetType(String assetType) { this.assetType = assetType; }

    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }

    public BigDecimal getDailyChange() { return dailyChange; }
    public void setDailyChange(BigDecimal dailyChange) { this.dailyChange = dailyChange; }

    public BigDecimal getDailyChangePercent() { return dailyChangePercent; }
    public void setDailyChangePercent(BigDecimal dailyChangePercent) { this.dailyChangePercent = dailyChangePercent; }

    public String getMarketStatus() { return marketStatus; }
    public void setMarketStatus(String marketStatus) { this.marketStatus = marketStatus; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
