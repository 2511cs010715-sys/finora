package com.smartplanner.repository;

import com.smartplanner.model.Expense;
import com.smartplanner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserOrderByExpenseDateDesc(User user);
    List<Expense> findByUserIdOrderByExpenseDateDesc(Long userId);
}
