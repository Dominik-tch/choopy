package com.taschion.choopy.dto;

import com.taschion.choopy.model.User;

public record MemberResponse(
        Long id,
        String username,
        int score
) {
    public static MemberResponse fromEntity(User user, int score) {
        if (user == null) return null;
        return new MemberResponse(user.getId(), user.getUsername(), score);
    }
}
