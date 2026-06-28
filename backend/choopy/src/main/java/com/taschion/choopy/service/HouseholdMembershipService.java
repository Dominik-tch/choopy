package com.taschion.choopy.service;

import com.taschion.choopy.model.Household;
import com.taschion.choopy.model.HouseholdMembership;
import com.taschion.choopy.model.User;
import com.taschion.choopy.repository.HouseholdMembershipRepository;
import com.taschion.choopy.repository.HouseholdRepository;
import com.taschion.choopy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HouseholdMembershipService {
    private final HouseholdMembershipRepository houseMemberRepo;
    private final HouseholdRepository householdRepo;
    private final UserRepository userRepo;

    public void createMembership(Household household, User member, String role) {
        HouseholdMembership membership = HouseholdMembership.builder()
                .household(household)
                .member(member)
                .role(role)
                .build();
        houseMemberRepo.save(membership);
    }

    public HouseholdMembership joinWithCode(String inviteCode, String username) {
        HouseholdMembership membership = HouseholdMembership.builder()
                .household(householdRepo.findByInviteCode(inviteCode))
                .member(userRepo.findByUsername(username).orElseThrow())
                .role("MEMBER")
                .build();
        return houseMemberRepo.save(membership);
    }
}
