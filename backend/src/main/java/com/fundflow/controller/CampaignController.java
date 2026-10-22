package com.fundflow.controller;

import com.fundflow.dto.request.CampaignRequest;
import com.fundflow.dto.response.CampaignResponse;
import com.fundflow.service.CampaignService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
@RequestMapping({"/api/campaigns"})
public class CampaignController {
   private final CampaignService campaignService;

   public CampaignController(CampaignService campaignService) {
      this.campaignService = campaignService;
   }

   @GetMapping
   public List<CampaignResponse> getCampaigns() {
      return this.campaignService.getCampaigns();
   }

   @PostMapping
   @ResponseStatus(HttpStatus.CREATED)
   public CampaignResponse createCampaign(@RequestBody @Valid CampaignRequest request) {
      return this.campaignService.createCampaign(request, this.authenticatedEmail());
   }

   @GetMapping({"/{campaignId}"})
   public CampaignResponse getCampaign(@PathVariable Long campaignId, Authentication authentication) {
      return this.campaignService.getCampaign(campaignId, authentication == null ? null : authentication.getName());
   }

   @PutMapping({"/{campaignId}"})
   public CampaignResponse updateCampaign(@PathVariable Long campaignId, @RequestBody @Valid CampaignRequest request, Authentication authentication) {
      return this.campaignService.updateCampaign(campaignId, request, authentication.getName());
   }

   @DeleteMapping({"/{campaignId}"})
   @ResponseStatus(HttpStatus.NO_CONTENT)
   public void deleteCampaign(@PathVariable Long campaignId, Authentication authentication) {
      this.campaignService.deleteCampaign(campaignId, authentication.getName());
   }

   @GetMapping({"/mine"})
   public List<CampaignResponse> getMyCampaigns(Authentication authentication) {
      return this.campaignService.getMyCampaigns(authentication.getName());
   }

   private String authenticatedEmail() {
      return SecurityContextHolder.getContext().getAuthentication().getName();
   }
}
