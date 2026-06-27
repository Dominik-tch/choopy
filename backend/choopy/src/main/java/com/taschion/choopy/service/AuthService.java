package com.taschion.choopy.service;

import com.taschion.choopy.model.User;
import com.taschion.choopy.repository.UserRepository;
import com.taschion.choopy.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public Map<String, String> register(User requestUser) {
        var user = User.builder()
                .username(requestUser.getUsername())
                .password(passwordEncoder.encode(requestUser.getPassword()))
                .build();
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return Map.of("token", jwtToken);
    }

    public Map<String, String> login(User requestUser) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        requestUser.getUsername(),
                        requestUser.getPassword()
                )
        );
        var user = userRepository.findByUsername(requestUser.getUsername()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return Map.of("token", jwtToken);
    }
}
