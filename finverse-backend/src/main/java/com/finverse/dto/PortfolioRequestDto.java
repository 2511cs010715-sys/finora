package com.finverse.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PortfolioRequestDto {
    private Long assetId;
    private BigDecimal quantity;
    private BigDecimal purchasePrice;
    private LocalDate purchaseDate;

    public PortfolioRequestDto() {}

    public Long getAssetId() { return assetId; }
    public void setAssetId(Long assetId) { this.assetId = assetId; }

    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }

    public BigDecimal getPurchasePrice() { return purchasePrice; }
    public void setPurchasePrice(BigDecimal purchasePrice) { this.purchasePrice = purchasePrice; }

    public LocalDate getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }
}
