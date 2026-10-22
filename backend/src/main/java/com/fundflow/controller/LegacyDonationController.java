package com.fundflow.controller;

import com.fundflow.dto.request.DonationRequest;
import com.fundflow.dto.response.DonationResponse;
import com.fundflow.service.DonationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/users/{userId}/donations"})
public class LegacyDonationController {
   private final DonationService donationService;

   public LegacyDonationController(DonationService donationService) {
      this.donationService = donationService;
   }

   @PostMapping
   @ResponseStatus(HttpStatus.CREATED)
   public DonationResponse createDonation(@PathVariable Long userId, @RequestBody @Valid DonationRequest request, Authentication authentication) {
      return this.donationService.createDonation(userId, request, authentication.getName());
   }

   @GetMapping
   public List<DonationResponse> getDonations(@PathVariable Long userId, Authentication authentication) {
      return this.donationService.getDonationsForUser(userId, authentication.getName());
   }
}
