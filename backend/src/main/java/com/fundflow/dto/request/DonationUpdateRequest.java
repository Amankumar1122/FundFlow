package com.fundflow.dto.request;

import jakarta.validation.constraints.Size;

public record DonationUpdateRequest(@Size(
   max = 180
) String message) {
}
