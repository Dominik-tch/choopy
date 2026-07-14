package com.taschion.choopy.dto;

import com.taschion.choopy.model.HouseholdMembership;
import com.taschion.choopy.model.User;

public record MemberRoleResponse(
        String role
) {
    public static MemberRoleResponse fromEntity(HouseholdMembership membership) {
        return new MemberRoleResponse(membership.getRole());
    }
}
