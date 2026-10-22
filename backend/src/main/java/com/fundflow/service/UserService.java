package com.fundflow.service;

import com.fundflow.dto.request.ProfileUpdateRequest;
import com.fundflow.dto.response.UserResponse;

public interface UserService {
   UserResponse getUser(Long userId, String email);

   UserResponse updateUser(Long userId, ProfileUpdateRequest request, String email);

   UserResponse getMyProfile(String email);

   UserResponse updateMyProfile(ProfileUpdateRequest request, String email);
}
