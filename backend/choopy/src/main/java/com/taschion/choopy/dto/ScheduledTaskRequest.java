package com.taschion.choopy.dto;

public record ScheduledTaskRequest(
        String title,
        String description,
        String category,
        Integer duration,
        Integer points,
        Long householdId,
        String scheduledDays
) {}