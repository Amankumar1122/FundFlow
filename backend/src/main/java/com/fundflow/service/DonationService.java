package com.fundflow.service;

import com.fundflow.dto.request.DonationRequest;
import com.fundflow.dto.request.DonationUpdateRequest;
import com.fundflow.dto.response.DonationResponse;
import java.util.List;

public interface DonationService {
   DonationResponse createDonation(Long userId, DonationRequest request, String email);

   DonationResponse createDonation(DonationRequest request, String email);

   List<DonationResponse> getDonationsForUser(Long userId, String email);

   List<DonationResponse> getDonationsForCampaign(Long campaignId);

   DonationResponse getDonation(Long donationId, String email);

   List<DonationResponse> getAllDonations();

   DonationResponse updateDonation(Long donationId, DonationUpdateRequest request, String email);

   void deleteDonation(Long donationId, String email);
}
