package com.smartplanner.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 20)
    private String role = "ROLE_USER";

    @Column(name = "monthly_income", precision = 15, scale = 2)
    private BigDecimal monthlyIncome = BigDecimal.ZERO;

    @Column(name = "financial_goal_pref")
    private String financialGoalPref = "Balanced Savings & Growth";

    @Column(name = "theme_preference")
    private String themePreference = "dark";

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {}

    public User(String name, String email, String password, String role, BigDecimal monthlyIncome, String financialGoalPref) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role != null ? role : "ROLE_USER";
        this.monthlyIncome = monthlyIncome != null ? monthlyIncome : BigDecimal.ZERO;
        this.financialGoalPref = financialGoalPref != null ? financialGoalPref : "Balanced Savings & Growth";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public BigDecimal getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public String getFinancialGoalPref() { return financialGoalPref; }
    public void setFinancialGoalPref(String financialGoalPref) { this.financialGoalPref = financialGoalPref; }

    public String getThemePreference() { return themePreference; }
    public void setThemePreference(String themePreference) { this.themePreference = themePreference; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
