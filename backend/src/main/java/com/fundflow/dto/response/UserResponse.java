package com.fundflow.dto.response;

import java.time.Instant;

public record UserResponse(Long id, String name, String email, String role, String location, String bio, Instant createdAt, boolean enabled) {
}
