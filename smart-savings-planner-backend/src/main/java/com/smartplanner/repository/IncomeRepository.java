package com.smartplanner.repository;

import com.smartplanner.model.Income;
import com.smartplanner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUserOrderByIncomeDateDesc(User user);
    List<Income> findByUserIdOrderByIncomeDateDesc(Long userId);
}
