package com.finverse.dto;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String riskPreference;
    private String investmentHorizon;

    public RegisterRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRiskPreference() { return riskPreference; }
    public void setRiskPreference(String riskPreference) { this.riskPreference = riskPreference; }

    public String getInvestmentHorizon() { return investmentHorizon; }
    public void setInvestmentHorizon(String investmentHorizon) { this.investmentHorizon = investmentHorizon; }
}
