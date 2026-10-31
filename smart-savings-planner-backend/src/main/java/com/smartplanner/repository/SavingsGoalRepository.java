package com.smartplanner.repository;

import com.smartplanner.model.SavingsGoal;
import com.smartplanner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavingsGoalRepository extends JpaRepository<SavingsGoal, Long> {
    List<SavingsGoal> findByUserOrderByTargetDateAsc(User user);
    List<SavingsGoal> findByUserIdOrderByTargetDateAsc(Long userId);
}
