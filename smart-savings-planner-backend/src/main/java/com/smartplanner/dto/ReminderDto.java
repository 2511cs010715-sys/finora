package com.smartplanner.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ReminderDto {
    private String reminderType;
    private String title;
    private LocalDate reminderDate;
    private String status;

    public ReminderDto() {}

    public String getReminderType() { return reminderType; }
    public void setReminderType(String reminderType) { this.reminderType = reminderType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDate getReminderDate() { return reminderDate; }
    public void setReminderDate(LocalDate reminderDate) { this.reminderDate = reminderDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
