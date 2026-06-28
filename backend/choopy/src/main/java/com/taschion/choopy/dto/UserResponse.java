package com.taschion.choopy.dto;

import com.taschion.choopy.model.User;

public record UserResponse(
        Long id,
        String username
) {
    public static UserResponse fromEntity(User user) {
        if (user == null) return null;
        return new UserResponse(user.getId(), user.getUsername());
    }
}
