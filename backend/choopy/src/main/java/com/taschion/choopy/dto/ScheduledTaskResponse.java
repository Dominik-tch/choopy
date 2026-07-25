package com.taschion.choopy.dto;

import com.taschion.choopy.model.ScheduledTask;

public record ScheduledTaskResponse(
        Long id,
        String title,
        String description,
        String category,
        Integer duration,
        Integer points,
        Long householdId,
        String scheduledDays
) {
    public static ScheduledTaskResponse fromEntity(ScheduledTask task) {
        return new ScheduledTaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getCategory(),
                task.getDuration(),
                task.getPoints(),
                task.getHousehold().getId(),
                task.getScheduledDays()
        );
    }
}