package com.fundflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(@NotBlank @Size(
   min = 2,
   max = 60
) String name, @Size(
   max = 80
) String location, @Size(
   max = 240
) String bio) {
}
