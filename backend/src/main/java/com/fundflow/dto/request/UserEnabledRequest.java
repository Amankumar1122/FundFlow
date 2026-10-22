package com.fundflow.dto.request;

import jakarta.validation.constraints.NotNull;

public record UserEnabledRequest(@NotNull Boolean enabled) {
}
