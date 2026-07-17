package com.taschion.choopy.service;

import com.taschion.choopy.dto.*;
import com.taschion.choopy.model.Household;
import com.taschion.choopy.model.HouseholdMembership;
import com.taschion.choopy.model.User;
import com.taschion.choopy.repository.HouseholdMembershipRepository;
import com.taschion.choopy.repository.HouseholdRepository;
import com.taschion.choopy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    public HouseholdMembershipResponse joinWithCode(String inviteCode, String username) {
        HouseholdMembership membership = HouseholdMembership.builder()
                .household(householdRepo.findByInviteCode(inviteCode).orElseThrow())
                .member(userRepo.findByUsername(username).orElseThrow())
                .role("MEMBER")
                .build();
        return HouseholdMembershipResponse.fromEntity(houseMemberRepo.save(membership));
    }

    public List<MemberResponse> getHouseholdMembers(Long id) {
        return houseMemberRepo.findMemberResponsesByHouseholdId(id);
    }

    public MemberRoleResponse getMemberRole(Long id, String memberName) {
        User member = userRepo.findByUsername(memberName).orElseThrow();
        return MemberRoleResponse.fromEntity(houseMemberRepo.findByHousehold_IdAndMember(id, member).orElseThrow());
    }

    @Transactional
    public PreferenceResponse updatePreferences(String username, Long id, PreferenceRequest preferences) {
        Household household = householdRepo.findById(id).orElseThrow();
        household.setName(preferences.householdName());
        HouseholdMembership memberShip = houseMemberRepo.findByHousehold_IdAndMember(id, userRepo.findByUsername(username).orElseThrow()).orElseThrow();
        memberShip.setColor(preferences.color());
        return new PreferenceResponse(household.getName(), memberShip.getColor());
    }

    public PreferenceResponse getPreferences(String username, Long id) {
        Household household = householdRepo.findById(id).orElseThrow();
        HouseholdMembership memberShip = houseMemberRepo.findByHousehold_IdAndMember(id, userRepo.findByUsername(username).orElseThrow()).orElseThrow();
        return new PreferenceResponse(household.getName(), memberShip.getColor());
    }
}
