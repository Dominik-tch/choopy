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
import java.util.List;

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

    @Transactional
    public void completeTask(Long taskId, String username) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task with ID " + taskId + " not found."));
        checkMembership(task.getHousehold().getId(), username);
        if (task.getCompletedBy() != null) {
            throw new IllegalStateException("Task already completed.");
        }
        User user = userRepo.findByUsername(username).orElseThrow();
        HouseholdMembership membership = houseMemberRepo
                .findByHousehold_IdAndMember(task.getHousehold().getId(), user)
                .orElseThrow(() -> new MembershipNotFoundException("Membership not found."));
        membership.setScore(membership.getScore() + task.getPoints());
        task.setCompletedBy(user);
        task.setCompletionDate(LocalDateTime.now());
    }

    @Transactional
    public void confirmTask(Long taskId, String username) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task with ID " + taskId + " not found."));
        checkMembership(task.getHousehold().getId(), username);
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));

        if (task.getCompletedBy() == null) {
            throw new IllegalStateException("Task is not completed yet.");
        }
        if (task.getCompletedBy().equals(user)) {
            throw new AccessDeniedException("You cannot confirm your own task.");
        }
        if (task.getConfirmedBy() != null) {
            throw new IllegalStateException("Task already confirmed.");
        }
        task.setConfirmedBy(user);
    }

    @Transactional
    public void rejectTask(Long taskId, String username) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task with ID " + taskId + " not found."));
        checkMembership(task.getHousehold().getId(), username);
        if (task.getCompletedBy() == null) {
            throw new IllegalStateException("Task is not completed yet.");
        }
        HouseholdMembership membership = houseMemberRepo
                .findByHousehold_IdAndMember(task.getHousehold().getId(), task.getCompletedBy())
                .orElseThrow(() -> new MembershipNotFoundException("Membership not found."));
        membership.setScore(membership.getScore() - task.getPoints());
        task.setCompletedBy(null);
    }

    @Transactional
    public void deleteTask(Long taskId) {
        Task task = taskRepo.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task with ID " + taskId + " not found."));

        if (task.getCompletedBy() != null) {
            HouseholdMembership membership = houseMemberRepo
                    .findByHousehold_IdAndMember(task.getHousehold().getId(), task.getCompletedBy())
                    .orElseThrow(() -> new MembershipNotFoundException("Membership not found."));
            membership.setScore(membership.getScore() - task.getPoints());
        }
        taskRepo.delete(task);
    }

    private void checkMembership(Long householdId, String username) {
        boolean isMember = houseMemberRepo.existsByHouseholdIdAndMemberUsername(householdId, username);
        if (!isMember) {
            throw new AccessDeniedException("Access denied: You are not a member of this household!");
        }
    }

    public List<TaskResponse> getTasksToConfirm(String username) {
        User user = userRepo.findByUsername(username).orElseThrow();
        return taskRepo.findTasksToConfirmByUserId(user.getId())
                .stream()
                .map(TaskResponse::fromEntity)
                .toList();
    }


}
