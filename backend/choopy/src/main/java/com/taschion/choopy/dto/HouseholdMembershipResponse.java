package com.taschion.choopy.dto;

import com.taschion.choopy.model.HouseholdMembership;

public record HouseholdMembershipResponse(
        Long id,
        HouseholdResponse household,
        UserResponse member,
        String role,
        Integer score
) {
    public static HouseholdMembershipResponse fromEntity(HouseholdMembership membership) {
        return new HouseholdMembershipResponse(
                membership.getId(),
                HouseholdResponse.fromEntity(membership.getHousehold()),
                UserResponse.fromEntity(membership.getMember()),
                membership.getRole(),
                membership.getScore()
        );
    }
}