package com.taschion.choopy.service;

import com.taschion.choopy.dto.HouseholdRequest;
import com.taschion.choopy.dto.HouseholdResponse;
import com.taschion.choopy.dto.TaskResponse;
import com.taschion.choopy.model.Household;
import com.taschion.choopy.model.HouseholdMembership;
import com.taschion.choopy.model.Task;
import com.taschion.choopy.model.User;
import com.taschion.choopy.repository.HouseholdMembershipRepository;
import com.taschion.choopy.repository.HouseholdRepository;
import com.taschion.choopy.repository.TaskRepository;
import com.taschion.choopy.repository.UserRepository;
import com.taschion.choopy.util.InviteCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HouseholdService {
    private final HouseholdRepository houseRepo;
    private final TaskRepository taskRepo;
    private final UserRepository userRepo;
    private final HouseholdMembershipRepository houseMemberRepo;
    private final HouseholdMembershipService membershipService;


    public HouseholdResponse createHousehold(HouseholdRequest request, String username) {
        Household household = Household.builder()
                .name(request.name())
                .inviteCode(InviteCodeGenerator.generate())
                .build();
        User creator = userRepo.findByUsername(username).orElseThrow();
        Household savedHousehold = houseRepo.save(household);
        membershipService.createMembership(household, creator, "ADMIN");
        return HouseholdResponse.fromEntity(savedHousehold);
    }

    public List<TaskResponse> getTasksForHousehold(Long householdId, String username) {
        boolean isMember = houseMemberRepo.existsByHouseholdIdAndMemberUsername(householdId, username);
        if (!isMember) {
            throw new AccessDeniedException("Access denied: You are not a member of this household.");
        }
        List<Task> tasks = taskRepo.findByHouseholdId(householdId);
        return tasks.stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
