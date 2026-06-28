package com.taschion.choopy.dto;

import com.taschion.choopy.model.Task;

public record TaskResponse(
        Long id,
        String title,
        String description,
        String category,
        Integer duration,
        Integer points,
        Long householdId,
        UserResponse creator,
        UserResponse completedBy
) {
    public static TaskResponse fromEntity(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getCategory(),
                task.getDuration(),
                task.getPoints(),
                task.getHousehold().getId(),
                UserResponse.fromEntity(task.getCreator()),
                UserResponse.fromEntity(task.getCompletedBy()) // Kann null sein
        );
    }
}