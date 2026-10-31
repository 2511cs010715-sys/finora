package com.smartplanner.controller;

import com.smartplanner.dto.ReminderDto;
import com.smartplanner.model.Reminder;
import com.smartplanner.model.User;
import com.smartplanner.repository.ReminderRepository;
import com.smartplanner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin(origins = "*")
public class ReminderController {

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication != null && authentication.getName() != null) {
            return userRepository.findByEmail(authentication.getName()).orElse(null);
        }
        return userRepository.findById(1L).orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
    }

    @GetMapping
    public ResponseEntity<List<Reminder>> getUserReminders(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(reminderRepository.findByUserOrderByReminderDateAsc(user));
    }

    @PostMapping
    public ResponseEntity<?> createReminder(@RequestBody ReminderDto request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Reminder reminder = new Reminder(
                user,
                request.getReminderType() != null ? request.getReminderType() : "Monthly Savings",
                request.getTitle(),
                request.getReminderDate() != null ? request.getReminderDate() : LocalDate.now().plusDays(7),
                request.getStatus() != null ? request.getStatus() : "ACTIVE"
        );

        reminderRepository.save(reminder);
        return ResponseEntity.ok(reminder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReminder(@PathVariable Long id, @RequestBody ReminderDto request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Optional<Reminder> remOpt = reminderRepository.findById(id);
        if (remOpt.isEmpty()) return ResponseEntity.notFound().build();

        Reminder reminder = remOpt.get();
        if (request.getReminderType() != null) reminder.setReminderType(request.getReminderType());
        if (request.getTitle() != null) reminder.setTitle(request.getTitle());
        if (request.getReminderDate() != null) reminder.setReminderDate(request.getReminderDate());
        if (request.getStatus() != null) reminder.setStatus(request.getStatus());

        reminderRepository.save(reminder);
        return ResponseEntity.ok(reminder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReminder(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Optional<Reminder> remOpt = reminderRepository.findById(id);
        if (remOpt.isPresent()) {
            reminderRepository.delete(remOpt.get());
            return ResponseEntity.ok(Map.of("message", "Reminder deleted successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
