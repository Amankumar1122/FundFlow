package com.fundflow.service.impl;

import com.fundflow.dto.request.LoginRequest;
import com.fundflow.dto.request.RegisterRequest;
import com.fundflow.dto.response.AuthResponse;
import com.fundflow.entity.User;
import com.fundflow.exception.ConflictException;
import com.fundflow.repository.UserRepository;
import com.fundflow.security.JwtService;
import com.fundflow.service.AuthService;
import java.util.Locale;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {
   private final UserRepository userRepository;
   private final PasswordEncoder passwordEncoder;
   private final JwtService jwtService;

   public AuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
      this.userRepository = userRepository;
      this.passwordEncoder = passwordEncoder;
      this.jwtService = jwtService;
   }

   @Transactional
   public AuthResponse register(RegisterRequest request) {
      String email = request.email().trim().toLowerCase(Locale.ROOT);
      if (this.userRepository.existsByEmailIgnoreCase(email)) {
         throw new ConflictException("An account with this email already exists");
      } else {
         User user = (User)this.userRepository.save(new User(request.name().trim(), email, this.passwordEncoder.encode(request.password())));
         return this.toResponse(user);
      }
   }

   public AuthResponse login(LoginRequest request) {
      User user = (User)this.userRepository.findByEmailIgnoreCase(request.email().trim()).orElseThrow(() -> new BadCredentialsException("Invalid email or password"));
      if (user.isEnabled() && this.passwordEncoder.matches(request.password(), user.getPassword())) {
         return this.toResponse(user);
      } else {
         throw new BadCredentialsException("Invalid email or password");
      }
   }

   private AuthResponse toResponse(User user) {
      return new AuthResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().toLowerCase(), this.jwtService.generateToken(user.getEmail()));
   }
}
