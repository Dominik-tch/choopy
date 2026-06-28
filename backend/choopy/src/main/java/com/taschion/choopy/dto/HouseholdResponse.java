package com.taschion.choopy.dto;

import com.taschion.choopy.model.Household;

public record HouseholdResponse(
        Long id,
        String name,
        String inviteCode
) {
    public static HouseholdResponse fromEntity(Household household) {
        return new HouseholdResponse(
                household.getId(),
                household.getName(),
                household.getInviteCode()
        );
    }
}