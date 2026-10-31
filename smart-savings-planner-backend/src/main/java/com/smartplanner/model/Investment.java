package com.smartplanner.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "investments")
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "investment_name", nullable = false, length = 100)
    private String investmentName;

    @Column(name = "investment_type", nullable = false, length = 50)
    private String investmentType; // 'Mutual Funds', 'Stocks', 'Fixed Deposits', 'Bonds', 'Gold', 'Other'

    @Column(name = "invested_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal investedAmount;

    @Column(name = "investment_date", nullable = false)
    private LocalDate investmentDate;

    @Column(name = "expected_return", precision = 5, scale = 2)
    private BigDecimal expectedReturn = new BigDecimal("8.00");

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Investment() {}

    public Investment(User user, String investmentName, String investmentType, BigDecimal investedAmount, LocalDate investmentDate, BigDecimal expectedReturn, String description) {
        this.user = user;
        this.investmentName = investmentName;
        this.investmentType = investmentType;
        this.investedAmount = investedAmount;
        this.investmentDate = investmentDate;
        this.expectedReturn = expectedReturn != null ? expectedReturn : new BigDecimal("8.00");
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
