package com.fundflow.controller;

import com.fundflow.dto.request.DonationRequest;
import com.fundflow.dto.request.DonationUpdateRequest;
import com.fundflow.dto.response.DonationResponse;
import com.fundflow.service.DonationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/donations"})
public class DonationController {
   private final DonationService donationService;

   public DonationController(DonationService donationService) {
      this.donationService = donationService;
   }

   @PostMapping
   @ResponseStatus(HttpStatus.CREATED)
   public DonationResponse createDonation(@RequestBody @Valid DonationRequest request, Authentication authentication) {
      return this.donationService.createDonation(request, authentication.getName());
   }

   @GetMapping({"/user/{userId}"})
   public List<DonationResponse> getDonations(@PathVariable Long userId, Authentication authentication) {
      return this.donationService.getDonationsForUser(userId, authentication.getName());
   }

   @GetMapping({"/campaign/{campaignId}"})
   public List<DonationResponse> getCampaignDonations(@PathVariable Long campaignId) {
      return this.donationService.getDonationsForCampaign(campaignId);
   }

   @GetMapping({"/{donationId}"})
   public DonationResponse getDonation(@PathVariable Long donationId, Authentication authentication) {
      return this.donationService.getDonation(donationId, authentication.getName());
   }

   @PutMapping({"/{donationId}"})
   public DonationResponse updateDonation(@PathVariable Long donationId, @RequestBody @Valid DonationUpdateRequest request, Authentication authentication) {
      return this.donationService.updateDonation(donationId, request, authentication.getName());
   }

   @DeleteMapping({"/{donationId}"})
   @ResponseStatus(HttpStatus.NO_CONTENT)
   public void deleteDonation(@PathVariable Long donationId, Authentication authentication) {
      this.donationService.deleteDonation(donationId, authentication.getName());
   }
}
