package com.fundflow.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fundflow.repository.UserRepository;
import com.fundflow.security.JwtAuthenticationFilter;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {
   @Bean
   public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter, ObjectMapper objectMapper) throws Exception {
      return (SecurityFilterChain)http.csrf(AbstractHttpConfigurer::disable).cors((cors) -> {
      }).sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).exceptionHandling((exceptions) -> exceptions.authenticationEntryPoint((request, response, exception) -> {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType("application/json");
            objectMapper.writeValue(response.getOutputStream(), Map.of("message", "Authentication is required"));
         }).accessDeniedHandler((request, response, exception) -> {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType("application/json");
            objectMapper.writeValue(response.getOutputStream(), Map.of("message", "Access is denied"));
         })).authorizeHttpRequests((authorize) -> ((AuthorizeHttpRequestsConfigurer.AuthorizedUrl)((AuthorizeHttpRequestsConfigurer.AuthorizedUrl)((AuthorizeHttpRequestsConfigurer.AuthorizedUrl)((AuthorizeHttpRequestsConfigurer.AuthorizedUrl)((AuthorizeHttpRequestsConfigurer.AuthorizedUrl)((AuthorizeHttpRequestsConfigurer.AuthorizedUrl)authorize.requestMatchers(HttpMethod.OPTIONS, new String[]{"/**"})).permitAll().requestMatchers(new String[]{"/api/auth/**"})).permitAll().requestMatchers(new String[]{"/api/campaigns/mine"})).authenticated().requestMatchers(HttpMethod.GET, new String[]{"/api/campaigns", "/api/campaigns/{campaignId}"})).permitAll().requestMatchers(new String[]{"/api/admin/**"})).hasRole("ADMIN").anyRequest()).authenticated()).addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class).build();
   }

   @Bean
   public UserDetailsService userDetailsService(UserRepository userRepository) {
      return (email) -> (UserDetails)userRepository.findByEmailIgnoreCase(email).map((user) -> {
            User.UserBuilder var10000 = User.withUsername(user.getEmail()).password(user.getPassword());
            String[] var10001 = new String[1];
            String var10004 = user.getRole();
            var10001[0] = "ROLE_" + var10004;
            return var10000.authorities(var10001).disabled(!user.isEnabled()).build();
         }).orElseThrow(() -> new UsernameNotFoundException("User not found"));
   }

   @Bean
   public PasswordEncoder passwordEncoder() {
      return new BCryptPasswordEncoder();
   }

   @Bean
   public CorsConfigurationSource corsConfigurationSource(@Value("${app.cors.allowed-origin:http://localhost:5173}") String origin) {
      CorsConfiguration config = new CorsConfiguration();
      config.setAllowedOrigins(List.of(origin));
      config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
      config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
      config.setAllowCredentials(true);
      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", config);
      return source;
   }
}
