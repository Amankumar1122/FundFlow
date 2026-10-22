package com.fundflow.service.impl;

import com.fundflow.dto.response.UserResponse;
import com.fundflow.entity.User;
import com.fundflow.exception.ResourceNotFoundException;
import com.fundflow.repository.CampaignRepository;
import com.fundflow.repository.DonationRepository;
import com.fundflow.repository.UserRepository;
import com.fundflow.service.AdminService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminServiceImpl implements AdminService {
   private final UserRepository userRepository;
   private final CampaignRepository campaignRepository;
   private final DonationRepository donationRepository;

   public AdminServiceImpl(UserRepository userRepository, CampaignRepository campaignRepository, DonationRepository donationRepository) {
      this.userRepository = userRepository;
      this.campaignRepository = campaignRepository;
      this.donationRepository = donationRepository;
   }

   public long getUserCount() {
      return this.userRepository.count();
   }

   public long getCampaignCount() {
      return this.campaignRepository.count();
   }

   public long getDonationCount() {
      return this.donationRepository.count();
   }

   @Transactional(
      readOnly = true
   )
   public List<UserResponse> getUsers() {
      return this.userRepository.findAll().stream().map((user) -> new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().toLowerCase(), user.getLocation(), user.getBio(), user.getCreatedAt(), user.isEnabled())).toList();
   }

   @Transactional
   public UserResponse setUserEnabled(Long userId, boolean enabled) {
      User user = (User)this.userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
      if (user.getRole().equals("ADMIN") && !enabled) {
         throw new IllegalArgumentException("Administrator accounts cannot be disabled through this endpoint");
      } else {
         user.setEnabled(enabled);
         return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().toLowerCase(), user.getLocation(), user.getBio(), user.getCreatedAt(), user.isEnabled());
      }
   }
}
