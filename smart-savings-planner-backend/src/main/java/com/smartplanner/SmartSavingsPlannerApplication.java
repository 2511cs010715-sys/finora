package com.smartplanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SmartSavingsPlannerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartSavingsPlannerApplication.class, args);
        System.out.println("\n==================================================");
        System.out.println("🚀 Smart Savings & Investment Planner Server Ready!");
        System.out.println("   API Endpoint: http://localhost:8080/api");
        System.out.println("   H2 Console:   http://localhost:8080/h2-console");
        System.out.println("==================================================\n");
    }
}
