package com.smartplanner.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class IncomeDto {
    private String source;
    private String category;
    private BigDecimal amount;
    private LocalDate incomeDate;
    private String description;

    public IncomeDto() {}

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDate getIncomeDate() { return incomeDate; }
    public void setIncomeDate(LocalDate incomeDate) { this.incomeDate = incomeDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
