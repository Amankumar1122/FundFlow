package com.fundflow.dto.response;

import java.math.BigDecimal;
import java.time.Instant;

public record DonationResponse(Long id, Long userId, String donorName, Long campaignId, BigDecimal amount, String message, Instant donationDate, String status) {
}
