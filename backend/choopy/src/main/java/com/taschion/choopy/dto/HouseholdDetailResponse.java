package com.taschion.choopy.dto;

import com.taschion.choopy.model.Household;

public record HouseholdDetailResponse(
        Long id,
        String name,
        String inviteCode,
        int memberCount
) {
    public static HouseholdDetailResponse fromEntity(Household household, int memberCount) {
        return new HouseholdDetailResponse(
                household.getId(),
                household.getName(),
                household.getInviteCode(),
                memberCount
        );
    }
}