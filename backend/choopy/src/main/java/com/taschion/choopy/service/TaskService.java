package com.taschion.choopy.service;

import com.taschion.choopy.dto.TaskRequest;
import com.taschion.choopy.dto.TaskResponse;
import com.taschion.choopy.exception.TaskNotFoundException;
import com.taschion.choopy.model.Household;
import com.taschion.choopy.model.Task;
import com.taschion.choopy.model.User;
import com.taschion.choopy.repository.HouseholdMembershipRepository;
import com.taschion.choopy.repository.HouseholdRepository;
import com.taschion.choopy.repository.TaskRepository;
import com.taschion.choopy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepo;
    private final UserRepository userRepo;
    private final HouseholdRepository householdRepo;
    private final HouseholdMembershipRepository houseMemberRepo;

    public TaskResponse createTask(TaskRequest request, String username) {
        checkMembership(request.householdId(), username);
        Household household = householdRepo.findById(request.householdId())
                .orElseThrow(() -> new RuntimeException("Household not found"));
        User creator = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Task task =  Task.builder()
                .title(request.title())
                .description(request.description())
                .category(request.category())
                .duration(request.duration())
                .points(request.points())
                .household(household)
                .creator(creator)
                .build();
        Task savedTask = taskRepo.save(task);
        return TaskResponse.fromEntity(savedTask);
    }

//    public List<Task> getAllTasks() {
//        return taskRepo.findAll();
//    }

    public TaskResponse completeTask(Long taskId, String username) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task with ID " + taskId + " not found."));
        checkMembership(task.getHousehold().getId(), username);
        User user = userRepo.findByUsername(username).orElseThrow();
        task.setCompletedBy(user);
        Task savedTask = taskRepo.save(task);
        return TaskResponse.fromEntity(savedTask);
    }

    public void deleteTask(Long taskId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task with ID " + taskId + " not found."));
        taskRepo.delete(task);
    }

    private void checkMembership(Long householdId, String username) {
        boolean isMember = houseMemberRepo.existsByHouseholdIdAndMemberUsername(householdId, username);
        if (!isMember) {
            throw new AccessDeniedException("Zugriff verweigert: Du bist kein Mitglied in diesem Haushalt!");
        }
    }
}
