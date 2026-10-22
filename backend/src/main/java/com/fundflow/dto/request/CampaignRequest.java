package com.fundflow.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CampaignRequest(@NotBlank @Size(
   min = 8,
   max = 90
) String title, @NotBlank @Size(
   min = 40,
   max = 400
) String description, @NotNull @DecimalMin("0.01") BigDecimal goalAmount, @NotBlank @Size(
   max = 40
) String category, @NotBlank @Size(
   max = 80
) String location, @Size(
   max = 1200
) String story, @Size(
   max = 2048
) String imageUrl, @NotNull LocalDate endDate) {
}
