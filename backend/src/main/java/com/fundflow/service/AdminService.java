package com.fundflow.service;

import com.fundflow.dto.response.UserResponse;
import java.util.List;

public interface AdminService {
   long getUserCount();

   long getCampaignCount();

   long getDonationCount();

   List<UserResponse> getUsers();

   UserResponse setUserEnabled(Long userId, boolean enabled);
}
