package com.smartplanner.dto;

import java.math.BigDecimal;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String name;
    private String email;
    private String role;
    private BigDecimal monthlyIncome;
    private String financialGoalPref;
    private String themePreference;

    public AuthResponse() {}

    public AuthResponse(String token, Long id, String name, String email, String role, BigDecimal monthlyIncome, String financialGoalPref, String themePreference) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.monthlyIncome = monthlyIncome;
        this.financialGoalPref = financialGoalPref;
        this.themePreference = themePreference;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public BigDecimal getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public String getFinancialGoalPref() { return financialGoalPref; }
    public void setFinancialGoalPref(String financialGoalPref) { this.financialGoalPref = financialGoalPref; }

    public String getThemePreference() { return themePreference; }
    public void setThemePreference(String themePreference) { this.themePreference = themePreference; }
}
