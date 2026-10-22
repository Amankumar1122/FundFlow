package com.fundflow.service;

import com.fundflow.dto.request.CampaignRequest;
import com.fundflow.dto.response.CampaignResponse;
import com.fundflow.enums.CampaignStatus;
import java.util.List;

public interface CampaignService {
   List<CampaignResponse> getCampaigns();

   CampaignResponse getCampaign(Long campaignId, String viewerEmail);

   CampaignResponse createCampaign(CampaignRequest request, String email);

   CampaignResponse updateCampaign(Long campaignId, CampaignRequest request, String email);

   void deleteCampaign(Long campaignId, String email);

   List<CampaignResponse> getMyCampaigns(String email);

   List<CampaignResponse> getAllCampaigns();

   CampaignResponse updateStatus(Long campaignId, CampaignStatus status);
}
