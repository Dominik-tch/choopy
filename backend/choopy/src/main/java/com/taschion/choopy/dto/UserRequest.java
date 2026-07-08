package com.taschion.choopy.dto;

public record UserRequest(
        String username,
        String fullname,
        String email
) { }
