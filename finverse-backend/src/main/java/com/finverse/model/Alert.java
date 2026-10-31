package com.finverse.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "alert_type", nullable = false, length = 30)
    private String alertType; // 'PRICE_ABOVE', 'PRICE_BELOW', 'PERCENT_CHANGE'

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal threshold;

    @Column(length = 20)
    private String status = "ACTIVE"; // 'ACTIVE', 'TRIGGERED', 'DISABLED'

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Alert() {}

    public Alert(User user, Asset asset, String alertType, BigDecimal threshold, String status) {
        this.user = user;
        this.asset = asset;
        this.alertType = alertType;
        this.threshold = threshold;
        this.status = status != null ? status : "ACTIVE";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Asset getAsset() { return asset; }
    public void setAsset(Asset asset) { this.asset = asset; }

    public String getAlertType() { return alertType; }
    public void setAlertType(String alertType) { this.alertType = alertType; }

    public BigDecimal getThreshold() { return threshold; }
    public void setThreshold(BigDecimal threshold) { this.threshold = threshold; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
