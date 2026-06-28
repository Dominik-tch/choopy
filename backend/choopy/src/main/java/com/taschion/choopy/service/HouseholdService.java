package com.taschion.choopy.service;

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

@Service
@RequiredArgsConstructor
public class HouseholdService {
    private final HouseholdRepository houseRepo;
    private final TaskRepository taskRepo;
    private final UserRepository userRepo;
    private final HouseholdMembershipRepository houseMemberRepo;
    private final HouseholdMembershipService membershipService;


    public Household createHousehold(Household household, String username) {
        String inviteCode = InviteCodeGenerator.generate();
        household.setInviteCode(inviteCode);
        User creator = userRepo.findByUsername(username).orElseThrow();
        Household savedHousehold = houseRepo.save(household);
        membershipService.createMembership(household, creator, "ADMIN");
        return savedHousehold;
    }

    public List<Task> getTasksForHousehold(Long householdId, String username) {
        boolean isMember = houseMemberRepo.existsByHouseholdIdAndMemberUsername(householdId, username);

        if (!isMember) {
            throw new AccessDeniedException("Access denied: You are not a member of this household.");
        }
        return taskRepo.findByHouseholdId(householdId);
    }
}
