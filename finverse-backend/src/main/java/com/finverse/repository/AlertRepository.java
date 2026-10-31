package com.finverse.repository;

import com.finverse.model.Alert;
import com.finverse.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByUser(User user);
    List<Alert> findByUserId(Long userId);
}
