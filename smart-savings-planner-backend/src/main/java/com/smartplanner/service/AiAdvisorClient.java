package com.smartplanner.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;

@Service
public class AiAdvisorClient {

    @Value("${smartplanner.ai.service.url:http://localhost:5001}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> fetchFinancialAnalysis(BigDecimal totalIncome, BigDecimal totalExpenses, BigDecimal monthlySavings, BigDecimal totalInvestments, String highestCategory, double goalsAvgProgress) {
        try {
            String url = aiServiceUrl + "/analyze";

            Map<String, Object> payload = new HashMap<>();
            payload.put("total_income", totalIncome);
            payload.put("total_expenses", totalExpenses);
            payload.put("monthly_savings", monthlySavings);
            payload.put("total_investments", totalInvestments);
            payload.put("highest_category", highestCategory != null ? highestCategory : "Bills");
            payload.put("goals_avg_progress", goalsAvgProgress);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            System.err.println("Note: Python AI microservice unreachable. Using Spring Boot Java fallback advisory engine: " + e.getMessage());
        }

        return createFallbackAnalysis(totalIncome, totalExpenses, monthlySavings, totalInvestments, highestCategory, goalsAvgProgress);
    }

    private Map<String, Object> createFallbackAnalysis(BigDecimal totalIncome, BigDecimal totalExpenses, BigDecimal monthlySavings, BigDecimal totalInvestments, String highestCategory, double goalsAvgProgress) {
        double inc = totalIncome != null ? totalIncome.doubleValue() : 50000.0;
        double exp = totalExpenses != null ? totalExpenses.doubleValue() : 30800.0;
        double sav = monthlySavings != null ? monthlySavings.doubleValue() : (inc - exp);
        
        double savRate = inc > 0 ? (sav / inc * 100.0) : 0.0;
        double expRatio = inc > 0 ? (exp / inc * 100.0) : 0.0;

        int score = (int) Math.round(Math.min(96, Math.max(30, (savRate * 1.5) + ((100 - expRatio) * 0.4) + (goalsAvgProgress * 0.3))));

        List<Map<String, String>> suggestions = new ArrayList<>();
        if (savRate < 20.0) {
            suggestions.add(Map.of(
                "type", "WARNING",
                "category", "Savings Optimization",
                "title", "Savings Rate Below Benchmark",
                "message", String.format("Your current savings rate is %.1f%%. Aim to allocate at least 20%% of monthly income to savings.", savRate)
            ));
        } else {
            suggestions.add(Map.of(
                "type", "SUCCESS",
                "category", "Savings Discipline",
                "title", "Healthy Savings Margin",
                "message", String.format("Great job! Your savings rate of %.1f%% provides a solid foundation for wealth growth.", savRate)
            ));
        }

        if (expRatio > 70.0) {
            suggestions.add(Map.of(
                "type", "WARNING",
                "category", "Expense Management",
                "title", "Elevated Expense Ratio",
                "message", String.format("Expenses consume %.1f%% of your monthly income. Highest spending category is currently '%s'.", expRatio, highestCategory != null ? highestCategory : "Bills")
            ));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("financial_health_score", score);
        result.put("savings_rate_percent", Math.round(savRate * 100.0) / 100.0);
        result.put("expense_ratio_percent", Math.round(expRatio * 100.0) / 100.0);
        result.put("suggestions", suggestions);
        result.put("disclaimer", "Smart Savings & Investment Planner is an educational tool. Suggestions are informational estimates and not regulated financial advice.");
        return result;
    }
}
