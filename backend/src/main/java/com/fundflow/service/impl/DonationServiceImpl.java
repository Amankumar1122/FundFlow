package com.fundflow.service.impl;

import com.fundflow.dto.request.DonationRequest;
import com.fundflow.dto.request.DonationUpdateRequest;
import com.fundflow.dto.response.DonationResponse;
import com.fundflow.entity.Campaign;
import com.fundflow.entity.Donation;
import com.fundflow.entity.User;
import com.fundflow.enums.CampaignStatus;
import com.fundflow.exception.ConflictException;
import com.fundflow.exception.ResourceNotFoundException;
import com.fundflow.repository.CampaignRepository;
import com.fundflow.repository.DonationRepository;
import com.fundflow.repository.UserRepository;
import com.fundflow.service.DonationService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DonationServiceImpl implements DonationService {
   private final DonationRepository donationRepository;
   private final UserRepository userRepository;
   private final CampaignRepository campaignRepository;

   public DonationServiceImpl(DonationRepository donationRepository, UserRepository userRepository, CampaignRepository campaignRepository) {
      this.donationRepository = donationRepository;
      this.userRepository = userRepository;
      this.campaignRepository = campaignRepository;
   }

   @Transactional
   public DonationResponse createDonation(Long userId, DonationRequest request, String email) {
      User donor = (User)this.userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
      if (!donor.getEmail().equalsIgnoreCase(email) && !donor.getRole().equals("ADMIN")) {
         throw new AccessDeniedException("You cannot create donations for another user");
      } else {
         return this.create(donor, request);
      }
   }

   @Transactional
   public DonationResponse createDonation(DonationRequest request, String email) {
      User donor = this.findUser(email);
      return this.create(donor, request);
   }

   private DonationResponse create(User donor, DonationRequest request) {
      Campaign campaign = (Campaign)this.campaignRepository.findById(request.campaignId()).orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
      if (campaign.getStatus() == CampaignStatus.APPROVED && campaign.getEndDate() != null && campaign.getEndDate().isAfter(LocalDate.now())) {
         Donation donation = (Donation)this.donationRepository.save(new Donation(donor, campaign, request.amount(), request.message() == null ? null : request.message().trim()));
         campaign.setRaisedAmount(campaign.getRaisedAmount().add(request.amount()));
         return this.toResponse(donation);
      } else {
         throw new ConflictException("Campaign is not accepting donations");
      }
   }

   @Transactional(
      readOnly = true
   )
   public List<DonationResponse> getDonationsForUser(Long userId, String email) {
      User viewer = this.findUser(email);
      if (!viewer.getId().equals(userId) && !viewer.getRole().equals("ADMIN")) {
         throw new AccessDeniedException("You cannot view another user's donations");
      } else {
         return this.donationRepository.findByUserIdOrderByDonationDateDesc(userId).stream().map(this::toResponse).toList();
      }
   }

   @Transactional(
      readOnly = true
   )
   public List<DonationResponse> getDonationsForCampaign(Long campaignId) {
      if (!this.campaignRepository.existsById(campaignId)) {
         throw new ResourceNotFoundException("Campaign not found");
      } else {
         return this.donationRepository.findByCampaignIdAndStatusOrderByDonationDateDesc(campaignId, "RECORDED").stream().map(this::toResponse).toList();
      }
   }

   @Transactional(
      readOnly = true
   )
   public DonationResponse getDonation(Long donationId, String email) {
      Donation donation = this.findDonation(donationId);
      this.requireOwnerOrAdmin(donation, email);
      return this.toResponse(donation);
   }

   @Transactional(
      readOnly = true
   )
   public List<DonationResponse> getAllDonations() {
      return this.donationRepository.findAllByOrderByDonationDateDesc().stream().map(this::toResponse).toList();
   }

   @Transactional
   public DonationResponse updateDonation(Long donationId, DonationUpdateRequest request, String email) {
      Donation donation = this.findDonation(donationId);
      this.requireOwnerOrAdmin(donation, email);
      donation.setMessage(request.message() == null ? null : request.message().trim());
      return this.toResponse(donation);
   }

   @Transactional
   public void deleteDonation(Long donationId, String email) {
      Donation donation = this.findDonation(donationId);
      this.requireOwnerOrAdmin(donation, email);
      Campaign campaign = donation.getCampaign();
      campaign.setRaisedAmount(campaign.getRaisedAmount().subtract(donation.getAmount()).max(BigDecimal.ZERO));
      this.donationRepository.delete(donation);
   }

   private Donation findDonation(Long id) {
      return (Donation)this.donationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Donation not found"));
   }

   private User findUser(String email) {
      return (User)this.userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
   }

   private void requireOwnerOrAdmin(Donation donation, String email) {
      User viewer = this.findUser(email);
      if (!viewer.getRole().equals("ADMIN") && !viewer.getId().equals(donation.getUser().getId())) {
         throw new AccessDeniedException("You cannot modify this donation");
      }
   }

   private DonationResponse toResponse(Donation donation) {
      return new DonationResponse(donation.getId(), donation.getUser().getId(), donation.getUser().getName(), donation.getCampaign().getId(), donation.getAmount(), donation.getMessage(), donation.getDonationDate(), donation.getStatus());
   }
}
