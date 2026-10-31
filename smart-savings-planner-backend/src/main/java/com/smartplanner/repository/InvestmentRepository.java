package com.smartplanner.repository;

import com.smartplanner.model.Investment;
import com.smartplanner.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestmentRepository extends JpaRepository<Investment, Long> {
    List<Investment> findByUserOrderByInvestmentDateDesc(User user);
    List<Investment> findByUserIdOrderByInvestmentDateDesc(Long userId);
}
