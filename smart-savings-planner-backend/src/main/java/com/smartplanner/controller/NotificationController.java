package com.smartplanner.controller;

import com.smartplanner.model.Notification;
import com.smartplanner.model.User;
import com.smartplanner.repository.NotificationRepository;
import com.smartplanner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication != null && authentication.getName() != null) {
            return userRepository.findByEmail(authentication.getName()).orElse(null);
        }
        return userRepository.findById(1L).orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(notificationRepository.findByUserOrderByCreatedAtDesc(user));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();

        Optional<Notification> notifOpt = notificationRepository.findById(id);
        if (notifOpt.isPresent()) {
            Notification n = notifOpt.get();
            n.setIsRead(true);
            notificationRepository.save(n);
            return ResponseEntity.ok(n);
        }
        return ResponseEntity.notFound().build();
    }
}
