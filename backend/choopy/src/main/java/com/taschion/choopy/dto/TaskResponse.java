package com.taschion.choopy.dto;

import com.taschion.choopy.model.ScheduledTask;
import com.taschion.choopy.model.Task;

import java.time.LocalDateTime;

public record TaskResponse(
        Long id,
        String title,
        String description,
        String category,
        Integer duration,
        Integer points,
        LocalDateTime completionDate,
        Long householdId,
        UserResponse creator,
        UserResponse assignedTo,
        UserResponse completedBy,
        UserResponse confirmedBy,
        boolean generatedByScheduler
) {
    public static TaskResponse fromEntity(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getCategory(),
                task.getDuration(),
                task.getPoints(),
                task.getCompletionDate(),
                task.getHousehold().getId(),
                UserResponse.fromEntity(task.getCreator()),
                UserResponse.fromEntity(task.getAssignedTo()),
                UserResponse.fromEntity(task.getCompletedBy()),
                UserResponse.fromEntity(task.getConfirmedBy()),
                task.getGeneratedBy() != null
        );
    }
}