package com.fundflow.service.impl;

import com.fundflow.dto.request.ProfileUpdateRequest;
import com.fundflow.dto.response.UserResponse;
import com.fundflow.entity.User;
import com.fundflow.exception.ResourceNotFoundException;
import com.fundflow.repository.UserRepository;
import com.fundflow.service.UserService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {
   private final UserRepository userRepository;

   public UserServiceImpl(UserRepository userRepository) {
      this.userRepository = userRepository;
   }

   @Transactional(
      readOnly = true
   )
   public UserResponse getUser(Long userId, String email) {
      User viewer = this.findUser(email);
      if (!viewer.getId().equals(userId) && !viewer.getRole().equals("ADMIN")) {
         throw new AccessDeniedException("You cannot view another user's profile");
      } else {
         return this.toResponse((User)this.userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found")));
      }
   }

   @Transactional
   public UserResponse updateUser(Long userId, ProfileUpdateRequest request, String email) {
      User user = this.findUser(email);
      if (!user.getId().equals(userId)) {
         throw new AccessDeniedException("You cannot modify another user's profile");
      } else {
         user.setName(request.name().trim());
         user.setLocation(request.location() == null ? null : request.location().trim());
         user.setBio(request.bio() == null ? null : request.bio().trim());
         return this.toResponse(user);
      }
   }

   @Transactional(
      readOnly = true
   )
   public UserResponse getMyProfile(String email) {
      return this.toResponse(this.findUser(email));
   }

   @Transactional
   public UserResponse updateMyProfile(ProfileUpdateRequest request, String email) {
      User user = this.findUser(email);
      user.setName(request.name().trim());
      user.setLocation(request.location() == null ? null : request.location().trim());
      user.setBio(request.bio() == null ? null : request.bio().trim());
      return this.toResponse(user);
   }

   private User findUser(String email) {
      return (User)this.userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
   }

   private UserResponse toResponse(User user) {
      return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().toLowerCase(), user.getLocation(), user.getBio(), user.getCreatedAt(), user.isEnabled());
   }
}
