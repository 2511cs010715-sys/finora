package com.smartplanner.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reminders")
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "reminder_type", nullable = false, length = 50)
    private String reminderType; // 'Monthly Savings', 'Expense Review', 'Goal Contribution', 'Investment Contribution', 'Bill Reminder'

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "reminder_date", nullable = false)
    private LocalDate reminderDate;

    @Column(length = 20)
    private String status = "ACTIVE"; // 'ACTIVE', 'DISABLED', 'COMPLETED'

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Reminder() {}

    public Reminder(User user, String reminderType, String title, LocalDate reminderDate, String status) {
        this.user = user;
        this.reminderType = reminderType;
        this.title = title;
        this.reminderDate = reminderDate;
        this.status = status != null ? status : "ACTIVE";
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getReminderType() { return reminderType; }
    public void setReminderType(String reminderType) { this.reminderType = reminderType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDate getReminderDate() { return reminderDate; }
    public void setReminderDate(LocalDate reminderDate) { this.reminderDate = reminderDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
