package com.finverse.dto;

import java.math.BigDecimal;

public class AlertRequestDto {
    private Long assetId;
    private String alertType; // 'PRICE_ABOVE', 'PRICE_BELOW', 'PERCENT_CHANGE'
    private BigDecimal threshold;

    public AlertRequestDto() {}

    public Long getAssetId() { return assetId; }
    public void setAssetId(Long assetId) { this.assetId = assetId; }

    public String getAlertType() { return alertType; }
    public void setAlertType(String alertType) { this.alertType = alertType; }

    public BigDecimal getThreshold() { return threshold; }
    public void setThreshold(BigDecimal threshold) { this.threshold = threshold; }
}
