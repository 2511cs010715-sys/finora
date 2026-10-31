package com.finverse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FinverseBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinverseBackendApplication.class, args);
        System.out.println("\n==================================================");
        System.out.println("🚀 FinVerse Spring Boot REST Backend Server Ready!");
        System.out.println("   API Endpoint: http://localhost:8080/api");
        System.out.println("   H2 Console:   http://localhost:8080/h2-console");
        System.out.println("==================================================\n");
    }
}
