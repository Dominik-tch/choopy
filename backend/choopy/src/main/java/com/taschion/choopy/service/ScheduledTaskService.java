package com.taschion.choopy.service;

import com.taschion.choopy.dto.ScheduledTaskRequest;
import com.taschion.choopy.dto.ScheduledTaskResponse;
import com.taschion.choopy.model.Household;
import com.taschion.choopy.model.ScheduledTask;
import com.taschion.choopy.repository.HouseholdMembershipRepository;
import com.taschion.choopy.repository.HouseholdRepository;
import com.taschion.choopy.repository.ScheduledTaskRepository;
import com.taschion.choopy.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduledTaskService {

    private final ScheduledTaskRepository scheduledTaskRepo;
    private final HouseholdRepository householdRepo;
    private final HouseholdMembershipRepository membershipRepo;
    private final TaskRepository taskRepo;
    private final HouseholdMembershipService householdMembershipService;

    public ScheduledTaskResponse createScheduledTask(ScheduledTaskRequest request, String username) {
        verifyMembership(request.householdId(), username);
        //Hinzufügen, dass auch überprüft wird, ob noch kein normaler task mit demselben titel vorherrscht
        if (taskRepo.existsByTitleAndHouseholdId(request.title(), request.householdId())) {
            throw new IllegalArgumentException("A task with this title already exists.");
        }
        if (scheduledTaskRepo.existsByTitleAndHouseholdId(request.title(), request.householdId())) {
            throw new IllegalArgumentException("A scheduled task with this title already exists.");
        }


        Household household = householdRepo.findById(request.householdId())
                .orElseThrow(() -> new RuntimeException("Household not found"));

        ScheduledTask scheduledTask = ScheduledTask.builder()
                .title(request.title())
                .description(request.description())
                .category(request.category())
                .duration(request.duration())
                .points(request.points())
                .household(household)
                .scheduledDays(request.scheduledDays())
                .build();

        return ScheduledTaskResponse.fromEntity(scheduledTaskRepo.save(scheduledTask));
    }

    public List<ScheduledTaskResponse> getScheduledTasks(Long householdId, String username) {
        verifyMembership(householdId, username);

        return scheduledTaskRepo.findByHouseholdId(householdId)
                .stream()
                .map(ScheduledTaskResponse::fromEntity)
                .toList();
    }

    @Transactional
    public ScheduledTaskResponse updateScheduledTask(Long id, ScheduledTaskRequest request, String username) {
        ScheduledTask scheduledTask = scheduledTaskRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Scheduled Task not found"));
        verifyMembership(scheduledTask.getHousehold().getId(), username);

        if (scheduledTaskRepo.existsByTitleAndHouseholdIdAndIdNot(request.title(), request.householdId(), id)) {
            throw new IllegalArgumentException("A scheduled task with this title already exists.");
        }

        if (taskRepo.existsConflictingTaskByTitle(request.title(), request.householdId(), id)) {
            throw new IllegalArgumentException("A task with this title already exists.");
        }

        scheduledTask.setTitle(request.title());
        scheduledTask.setDescription(request.description());
        scheduledTask.setCategory(request.category());
        scheduledTask.setDuration(request.duration());
        scheduledTask.setPoints(request.points());
        scheduledTask.setScheduledDays(request.scheduledDays());

        ScheduledTask updated = scheduledTaskRepo.save(scheduledTask);

        taskRepo.updateAllTasksFromScheduler(
                id,
                request.title(),
                request.description(),
                request.category(),
                request.duration(),
                request.points()
        );

        householdMembershipService.recalculateScores(request.householdId());

        return ScheduledTaskResponse.fromEntity(updated);
    }

    public void deleteScheduledTask(Long id, String username) {
        ScheduledTask scheduledTask = scheduledTaskRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Scheduled Task not found"));

        verifyMembership(scheduledTask.getHousehold().getId(), username);

        // (Optional: Wenn du den Scheduler löschst, könntest du hier auch entscheiden,
        // ob noch offene, generierte Tasks ebenfalls gelöscht werden sollen.)

        scheduledTaskRepo.delete(scheduledTask);
    }

    private void verifyMembership(Long householdId, String username) {
        if (!membershipRepo.existsByHouseholdIdAndMemberUsername(householdId, username)) {
            throw new AccessDeniedException("You are not a member of this household.");
        }
    }
}