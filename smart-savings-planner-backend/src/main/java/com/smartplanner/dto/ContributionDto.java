package com.smartplanner.dto;

import java.math.BigDecimal;

public class ContributionDto {
    private BigDecimal amount;

    public ContributionDto() {}
    public ContributionDto(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
