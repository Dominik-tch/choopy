package com.taschion.choopy.controller;

import com.taschion.choopy.dto.UserRequest;
import com.taschion.choopy.dto.UserResponse;
import com.taschion.choopy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.Authenticator;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping()
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(userService.getProfile(username));
    }

    @PutMapping()
    public void updateProfile(@RequestBody UserRequest userRequest, Authentication authentication) {
        String username = authentication.getName();
        userService.updateProfile(userRequest, username);
    }
}
