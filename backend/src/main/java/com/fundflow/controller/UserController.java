package com.fundflow.controller;

import com.fundflow.dto.request.ProfileUpdateRequest;
import com.fundflow.dto.response.UserResponse;
import com.fundflow.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/users"})
public class UserController {
   private final UserService userService;

   public UserController(UserService userService) {
      this.userService = userService;
   }

   @GetMapping({"/{userId}"})
   public UserResponse getUser(@PathVariable Long userId, Authentication authentication) {
      return this.userService.getUser(userId, authentication.getName());
   }

   @GetMapping({"/me"})
   public UserResponse getMyProfile(Authentication authentication) {
      return this.userService.getMyProfile(authentication.getName());
   }

   @PatchMapping({"/me"})
   public UserResponse updateMyProfile(@RequestBody @Valid ProfileUpdateRequest request, Authentication authentication) {
      return this.userService.updateMyProfile(request, authentication.getName());
   }
}
