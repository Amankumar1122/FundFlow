package com.fundflow.dto.request;

import com.fundflow.enums.CampaignStatus;
import jakarta.validation.constraints.NotNull;

public record CampaignStatusRequest(@NotNull CampaignStatus status) {
}
