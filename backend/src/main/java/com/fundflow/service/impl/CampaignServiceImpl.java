package com.fundflow.service.impl;

import com.fundflow.dto.request.CampaignRequest;
import com.fundflow.dto.response.CampaignResponse;
import com.fundflow.entity.Campaign;
import com.fundflow.entity.User;
import com.fundflow.enums.CampaignStatus;
import com.fundflow.exception.ConflictException;
import com.fundflow.exception.ResourceNotFoundException;
import com.fundflow.repository.CampaignRepository;
import com.fundflow.repository.DonationRepository;
import com.fundflow.repository.UserRepository;
import com.fundflow.service.CampaignService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CampaignServiceImpl implements CampaignService {
   private final CampaignRepository campaignRepository;
   private final DonationRepository donationRepository;
   private final UserRepository userRepository;

   public CampaignServiceImpl(CampaignRepository campaignRepository, DonationRepository donationRepository, UserRepository userRepository) {
      this.campaignRepository = campaignRepository;
      this.donationRepository = donationRepository;
      this.userRepository = userRepository;
   }

   @Transactional(
      readOnly = true
   )
   public List<CampaignResponse> getCampaigns() {
      return this.campaignRepository.findByStatusOrderByCreatedAtDesc(CampaignStatus.APPROVED).stream().map(this::toResponse).toList();
   }

   @Transactional(
      readOnly = true
   )
   public CampaignResponse getCampaign(Long campaignId, String viewerEmail) {
      Campaign campaign = this.findCampaign(campaignId);
      if (campaign.getStatus() != CampaignStatus.APPROVED && !this.isOwnerOrAdmin(campaign, viewerEmail)) {
         throw new ResourceNotFoundException("Campaign not found");
      } else {
         return this.toResponse(campaign);
      }
   }

   @Transactional
   public CampaignResponse createCampaign(CampaignRequest request, String email) {
      this.validateEndDate(request.endDate());
      User organizer = this.findUser(email);
      Campaign campaign = new Campaign(request.title().trim(), request.description().trim(), request.goalAmount());
      this.applyRequest(campaign, request);
      campaign.setRaisedAmount(BigDecimal.ZERO);
      campaign.setStatus(CampaignStatus.PENDING);
      campaign.setOrganizer(organizer);
      return this.toResponse((Campaign)this.campaignRepository.save(campaign));
   }

   @Transactional
   public CampaignResponse updateCampaign(Long campaignId, CampaignRequest request, String email) {
      Campaign campaign = this.findCampaign(campaignId);
      this.requireOwnerOrAdmin(campaign, email);
      this.validateEndDate(request.endDate());
      this.applyRequest(campaign, request);
      return this.toResponse(campaign);
   }

   @Transactional
   public void deleteCampaign(Long campaignId, String email) {
      Campaign campaign = this.findCampaign(campaignId);
      this.requireOwnerOrAdmin(campaign, email);
      if (this.donationRepository.countByCampaignIdAndStatus(campaignId, "RECORDED") > 0L) {
         throw new ConflictException("A campaign with recorded donations cannot be deleted");
      } else {
         this.campaignRepository.delete(campaign);
      }
   }

   @Transactional(
      readOnly = true
   )
   public List<CampaignResponse> getMyCampaigns(String email) {
      User organizer = this.findUser(email);
      return this.campaignRepository.findByOrganizerIdOrderByCreatedAtDesc(organizer.getId()).stream().map(this::toResponse).toList();
   }

   @Transactional(
      readOnly = true
   )
   public List<CampaignResponse> getAllCampaigns() {
      return this.campaignRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toResponse).toList();
   }

   @Transactional
   public CampaignResponse updateStatus(Long campaignId, CampaignStatus status) {
      Campaign campaign = this.findCampaign(campaignId);
      campaign.setStatus(status);
      return this.toResponse(campaign);
   }

   private void applyRequest(Campaign campaign, CampaignRequest request) {
      campaign.setTitle(request.title().trim());
      campaign.setDescription(request.description().trim());
      campaign.setGoalAmount(request.goalAmount());
      campaign.setCategory(request.category().trim());
      campaign.setLocation(request.location().trim());
      campaign.setStory(request.story() == null ? null : request.story().trim());
      campaign.setImageUrl(request.imageUrl() != null && !request.imageUrl().isBlank() ? request.imageUrl().trim() : null);
      campaign.setEndDate(request.endDate());
   }

   private void validateEndDate(LocalDate endDate) {
      if (!endDate.isAfter(LocalDate.now())) {
         throw new IllegalArgumentException("Campaign end date must be in the future");
      }
   }

   private Campaign findCampaign(Long id) {
      return (Campaign)this.campaignRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
   }

   private User findUser(String email) {
      return (User)this.userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
   }

   private boolean isOwnerOrAdmin(Campaign campaign, String email) {
      if (email == null) {
         return false;
      } else {
         User viewer = this.userRepository.findByEmailIgnoreCase(email).orElse(null);
         return viewer != null && (viewer.getRole().equals("ADMIN") || campaign.getOrganizer() != null && campaign.getOrganizer().getId().equals(viewer.getId()));
      }
   }

   private void requireOwnerOrAdmin(Campaign campaign, String email) {
      if (!this.isOwnerOrAdmin(campaign, email)) {
         throw new AccessDeniedException("You cannot modify this campaign");
      }
   }

   private CampaignResponse toResponse(Campaign campaign) {
      return new CampaignResponse(campaign.getId(), campaign.getTitle(), campaign.getDescription(), campaign.getGoalAmount(), campaign.getRaisedAmount(), campaign.getCategory(), campaign.getLocation(), campaign.getStory(), campaign.getImageUrl(), campaign.getEndDate(), campaign.getStatus(), campaign.getCreatedAt(), campaign.getOrganizer() == null ? null : campaign.getOrganizer().getId(), campaign.getOrganizer() == null ? null : campaign.getOrganizer().getName(), this.donationRepository.countByCampaignIdAndStatus(campaign.getId(), "RECORDED"));
   }
}
