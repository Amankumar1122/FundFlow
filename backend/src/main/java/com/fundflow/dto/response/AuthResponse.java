package com.fundflow.dto.response;

public record AuthResponse(Long userId, String name, String email, String role, String token) {
}
