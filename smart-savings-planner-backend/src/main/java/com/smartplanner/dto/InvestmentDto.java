package com.smartplanner.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class InvestmentDto {
    private String investmentName;
    private String investmentType;
    private BigDecimal investedAmount;
    private LocalDate investmentDate;
    private BigDecimal expectedReturn;
    private String description;

    public InvestmentDto() {}

    public String getInvestmentName() { return investmentName; }
    public void setInvestmentName(String investmentName) { this.investmentName = investmentName; }

    public String getInvestmentType() { return investmentType; }
    public void setInvestmentType(String investmentType) { this.investmentType = investmentType; }

    public BigDecimal getInvestedAmount() { return investedAmount; }
    public void setInvestedAmount(BigDecimal investedAmount) { this.investedAmount = investedAmount; }

    public LocalDate getInvestmentDate() { return investmentDate; }
    public void setInvestmentDate(LocalDate investmentDate) { this.investmentDate = investmentDate; }

    public BigDecimal getExpectedReturn() { return expectedReturn; }
    public void setExpectedReturn(BigDecimal expectedReturn) { this.expectedReturn = expectedReturn; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
