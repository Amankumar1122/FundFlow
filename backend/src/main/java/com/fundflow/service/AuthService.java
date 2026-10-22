package com.fundflow.service;

import com.fundflow.dto.request.LoginRequest;
import com.fundflow.dto.request.RegisterRequest;
import com.fundflow.dto.response.AuthResponse;

public interface AuthService {
   AuthResponse register(RegisterRequest request);

   AuthResponse login(LoginRequest request);
}
