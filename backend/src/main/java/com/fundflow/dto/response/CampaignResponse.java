package com.fundflow.dto.response;

import com.fundflow.enums.CampaignStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record CampaignResponse(Long id, String title, String description, BigDecimal goalAmount, BigDecimal raisedAmount, String category, String location, String story, String imageUrl, LocalDate endDate, CampaignStatus status, Instant createdAt, Long organizerId, String organizerName, long backers) {
}
