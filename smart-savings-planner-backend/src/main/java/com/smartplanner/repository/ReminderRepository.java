package com.smartplanner.repository;

import com.smartplanner.model.Reminder;
import com.smartplanner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByUserOrderByReminderDateAsc(User user);
    List<Reminder> findByUserIdOrderByReminderDateAsc(Long userId);
}
