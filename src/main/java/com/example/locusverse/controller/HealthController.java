package com.example.locusverse.controller;

import jakarta.persistence.EntityManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/health")
public class HealthController {

    private final EntityManager entityManager;

    public HealthController(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @GetMapping
    public String checkDatabase() {
        try {
            entityManager.createNativeQuery("SELECT 1").getSingleResult();

            return "Database connection is working!";

        } catch (Exception e) {
            return "Database connection failed!";
        }
    }
}