package com.taschion.choopy.controller;

import com.taschion.choopy.dto.ScheduledTaskRequest;
import com.taschion.choopy.dto.ScheduledTaskResponse;
import com.taschion.choopy.service.ScheduledTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scheduled-tasks")
@RequiredArgsConstructor
public class ScheduledTaskController {

    private final ScheduledTaskService scheduledTaskService;

    @PostMapping
    public ResponseEntity<ScheduledTaskResponse> createScheduledTask(@RequestBody ScheduledTaskRequest request, Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(scheduledTaskService.createScheduledTask(request, username));
    }

    @GetMapping("/household/{householdId}")
    public ResponseEntity<List<ScheduledTaskResponse>> getScheduledTasks(@PathVariable Long householdId, Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(scheduledTaskService.getScheduledTasks(householdId, username));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScheduledTaskResponse> updateScheduledTask(
            @PathVariable Long id,
            @RequestBody ScheduledTaskRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(scheduledTaskService.updateScheduledTask(id, request, username));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScheduledTask(@PathVariable Long id, Authentication authentication) {
        throw new IllegalStateException("For safety reasons, deletion of scheduled tasks is currently not supported.");
//        String username = authentication.getName();
//        scheduledTaskService.deleteScheduledTask(id, username);
//        return ResponseEntity.noContent().build();
    }
}