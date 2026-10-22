package com.fundflow.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record DonationRequest(@NotNull Long campaignId, @NotNull @DecimalMin("0.01") BigDecimal amount, @Size(
   max = 180
) String message) {
}
