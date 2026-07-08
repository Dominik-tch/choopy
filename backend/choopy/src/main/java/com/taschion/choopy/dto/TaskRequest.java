package com.taschion.choopy.dto;

public record TaskRequest(
        String title,
        String description,
        String category,
        Integer duration,
        Integer points,
        String assignedTo,
        Long householdId
) {}