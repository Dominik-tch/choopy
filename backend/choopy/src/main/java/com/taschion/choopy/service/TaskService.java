package com.taschion.choopy.service;

import com.taschion.choopy.dto.TaskRequest;
import com.taschion.choopy.dto.TaskResponse;
import com.taschion.choopy.exception.MembershipNotFoundException;
import com.taschion.choopy.exception.TaskNotFoundException;
import com.taschion.choopy.model.Household;
import com.taschion.choopy.model.HouseholdMembership;
import com.taschion.choopy.model.Task;
import com.taschion.choopy.model.User;
import com.taschion.choopy.repository.HouseholdMembershipRepository;
import com.taschion.choopy.repository.HouseholdRepository;
import com.taschion.choopy.repository.TaskRepository;
import com.taschion.choopy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

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
                .orElseThrow(() -> new UsernameNotFoundException("Creator not found"));
        User assignee = null;
        if (request.assignedTo() != null && !request.assignedTo().isBlank() && !request.assignedTo().equalsIgnoreCase("None")) {
            assignee = userRepo.findByUsername(request.assignedTo())
                    .orElseThrow(() -> new UsernameNotFoundException("Assignee not found"));
            checkMembership(request.householdId(), assignee.getUsername());
        }
        Task task =  Task.builder()
                .title(request.title())
                .description(request.description())
                .category(request.category())
                .duration(request.duration())
                .points(request.points())
                .household(household)
                .creator(creator)
                .assignedTo(assignee)
                .build();
        Task savedTask = taskRepo.save(task);
        return TaskResponse.fromEntity(savedTask);
    }

//    public List<Task> getAllTasks() {
//        return taskRepo.findAll();
//    }
@Transactional
public void completeTask(Long taskId, String username) {
    Task task = taskRepo.findById(taskId)
            .orElseThrow(() -> new TaskNotFoundException("Task with ID " + taskId + " not found."));
    checkMembership(task.getHousehold().getId(), username);
    User user = userRepo.findByUsername(username).orElseThrow();
    HouseholdMembership membership = houseMemberRepo
            .findByHousehold_IdAndMember(task.getHousehold().getId(), user)
            .orElseThrow(() -> new MembershipNotFoundException("Membership not found."));
    membership.setScore(membership.getScore() + task.getPoints());
    task.setCompletedBy(user);
    task.setCompletionDate(LocalDateTime.now());
}

    public void deleteTask(Long taskId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task with ID " + taskId + " not found."));
        taskRepo.delete(task);
    }

    private void checkMembership(Long householdId, String username) {
        boolean isMember = houseMemberRepo.existsByHouseholdIdAndMemberUsername(householdId, username);
        if (!isMember) {
            throw new AccessDeniedException("Access denied: You are not a member of this household!");
        }
    }
}
