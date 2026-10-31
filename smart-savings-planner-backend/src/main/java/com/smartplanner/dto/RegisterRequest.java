package com.smartplanner.dto;

import java.math.BigDecimal;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private BigDecimal monthlyIncome;
    private String financialGoalPref;

    public RegisterRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public BigDecimal getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public String getFinancialGoalPref() { return financialGoalPref; }
    public void setFinancialGoalPref(String financialGoalPref) { this.financialGoalPref = financialGoalPref; }
}
