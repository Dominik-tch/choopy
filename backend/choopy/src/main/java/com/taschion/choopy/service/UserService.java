package com.taschion.choopy.service;

import com.taschion.choopy.dto.UserRequest;
import com.taschion.choopy.dto.UserResponse;
import com.taschion.choopy.model.User;
import com.taschion.choopy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepo;

    public UserResponse getProfile(String username) {
        User user = userRepo.findByUsername(username).orElseThrow();
        return UserResponse.fromEntity(user);
    }

    @Transactional
    public void updateProfile(UserRequest userRequest, String authenticatedUsername) {
        User user = userRepo.findByUsername(authenticatedUsername).orElseThrow();

        if (userRequest.username() != null && !userRequest.username().isBlank()) {
            user.setUsername(userRequest.username());
        }

        if (userRequest.email() != null && !userRequest.email().isBlank()) {
            user.setEmail(userRequest.email());
        }

        if (userRequest.fullname() != null && !userRequest.fullname().isBlank()) {
            user.setFullname(userRequest.fullname());
        }
    }
}
