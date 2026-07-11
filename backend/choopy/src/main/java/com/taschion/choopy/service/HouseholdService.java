package com.taschion.choopy.service;

import com.taschion.choopy.dto.*;
import com.taschion.choopy.model.Household;
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
        membershipService.createMembership(savedHousehold, creator, "ADMIN");
        return HouseholdResponse.fromEntity(savedHousehold);
    }

    public List<HouseholdResponse> getHouseholds(String username) {
        User user = userRepo.findByUsername(username).orElseThrow();
        List<Household> householdList = houseMemberRepo.findHouseholdsByUserId(user.getId());
        return householdList.stream()
                .map(HouseholdResponse::fromEntity)
                .toList();
    }

    public List<TaskResponse> getTasksForHousehold(Long householdId, String username, String status, Long completedByUserId) {
        boolean isMember = houseMemberRepo.existsByHouseholdIdAndMemberUsername(householdId, username);
        if (!isMember) {
            throw new AccessDeniedException("Access denied: You are not a member of this household.");
        }
        if ("OPEN".equalsIgnoreCase(status)) {
            return taskRepo.findByHouseholdIdAndCompletedByIsNull(householdId)
                    .stream()
                    .map(TaskResponse::fromEntity)
                    .toList();
        } else if (completedByUserId != null) {
            return taskRepo.findByHouseholdIdAndCompletedByIdOrderByCompletionDateDesc(householdId, completedByUserId)
                    .stream()
                    .map(TaskResponse::fromEntity)
                    .toList();

        } else if ("COMPLETED".equalsIgnoreCase(status)) {
            return taskRepo.findByHouseholdIdAndCompletedByIsNotNullOrderByCompletionDateDesc(householdId)
                    .stream()
                    .map(TaskResponse::fromEntity)
                    .toList();

        }
        return taskRepo.findByHouseholdId(householdId).stream()
                .map(TaskResponse::fromEntity)
                .toList();
    }

    public List<HouseholdDetailResponse> getHouseholdDetails(String username) {
        User user = userRepo.findByUsername(username).orElseThrow();
        List<Household> householdList = houseMemberRepo.findHouseholdsByUserId(user.getId());
        return householdList.stream()
                .map(household -> HouseholdDetailResponse.fromEntity(household, houseMemberRepo.getMemberCount(household.getId())))
                .toList();
    }
}
