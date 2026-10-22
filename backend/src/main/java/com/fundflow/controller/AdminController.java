package com.fundflow.controller;

import com.fundflow.dto.request.CampaignStatusRequest;
import com.fundflow.dto.request.UserEnabledRequest;
import com.fundflow.dto.response.CampaignResponse;
import com.fundflow.dto.response.DonationResponse;
import com.fundflow.dto.response.UserResponse;
import com.fundflow.service.AdminService;
import com.fundflow.service.CampaignService;
import com.fundflow.service.DonationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/admin"})
public class AdminController {
   private final AdminService adminService;
   private final CampaignService campaignService;
   private final DonationService donationService;

   public AdminController(AdminService adminService, CampaignService campaignService, DonationService donationService) {
      this.adminService = adminService;
      this.campaignService = campaignService;
      this.donationService = donationService;
   }

   @GetMapping({"/campaigns"})
   public List<CampaignResponse> getCampaigns() {
      return this.campaignService.getAllCampaigns();
   }

   @PatchMapping({"/campaigns/{campaignId}/status"})
   public CampaignResponse updateCampaignStatus(@PathVariable Long campaignId, @RequestBody @Valid CampaignStatusRequest request) {
      return this.campaignService.updateStatus(campaignId, request.status());
   }

   @GetMapping({"/donations"})
   public List<DonationResponse> getDonations() {
      return this.donationService.getAllDonations();
   }

   @GetMapping({"/users"})
   public List<UserResponse> getUsers() {
      return this.adminService.getUsers();
   }

   @PutMapping({"/users/{userId}/enabled"})
   public UserResponse setUserEnabled(@PathVariable Long userId, @RequestBody @Valid UserEnabledRequest request) {
      return this.adminService.setUserEnabled(userId, request.enabled());
   }

   @GetMapping({"/summary"})
   public AdminSummary getSummary() {
      return new AdminSummary(this.adminService.getUserCount(), this.adminService.getCampaignCount(), this.adminService.getDonationCount());
   }

   public static record AdminSummary(long users, long campaigns, long donations) {
   }
}
