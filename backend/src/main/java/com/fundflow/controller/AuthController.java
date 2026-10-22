package com.fundflow.controller;

import com.fundflow.dto.request.LoginRequest;
import com.fundflow.dto.request.RegisterRequest;
import com.fundflow.dto.response.AuthResponse;
import com.fundflow.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/auth"})
public class AuthController {
   private final AuthService authService;

   public AuthController(AuthService authService) {
      this.authService = authService;
   }

   @PostMapping({"/register"})
   @ResponseStatus(HttpStatus.CREATED)
   public AuthResponse register(@RequestBody @Valid RegisterRequest request) {
      return this.authService.register(request);
   }

   @PostMapping({"/login"})
   public AuthResponse login(@RequestBody @Valid LoginRequest request) {
      return this.authService.login(request);
   }
}
