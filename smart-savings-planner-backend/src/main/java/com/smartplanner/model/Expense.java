package com.smartplanner.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "expense_name", nullable = false, length = 100)
    private String expenseName;

    @Column(nullable = false, length = 50)
    private String category; // 'Food', 'Transport', 'Education', 'Shopping', 'Entertainment', 'Bills', 'Healthcare', 'Travel', 'Other'

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;

    @Column(name = "payment_method", length = 50)
    private String paymentMethod = "UPI"; // 'UPI', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer'

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Expense() {}

    public Expense(User user, String expenseName, String category, BigDecimal amount, LocalDate expenseDate, String paymentMethod, String description) {
        this.user = user;
        this.expenseName = expenseName;
        this.category = category;
        this.amount = amount;
        this.expenseDate = expenseDate;
        this.paymentMethod = paymentMethod != null ? paymentMethod : "UPI";
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getExpenseName() { return expenseName; }
    public void setExpenseName(String expenseName) { this.expenseName = expenseName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
