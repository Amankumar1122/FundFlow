package com.fundflow.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
   private final JwtService jwtService;
   private final UserDetailsService userDetailsService;

   public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
      this.jwtService = jwtService;
      this.userDetailsService = userDetailsService;
   }

   protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
      String authorization = request.getHeader("Authorization");
      if (authorization != null && authorization.startsWith("Bearer ") && SecurityContextHolder.getContext().getAuthentication() == null) {
         String token = authorization.substring(7);

         try {
            String email = this.jwtService.extractSubject(token);
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(email);
            if (userDetails.isEnabled() && this.jwtService.isTokenValid(token, userDetails.getUsername())) {
               UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
               authentication.setDetails((new WebAuthenticationDetailsSource()).buildDetails(request));
               SecurityContextHolder.getContext().setAuthentication(authentication);
            }
         } catch (IllegalArgumentException | JwtException var9) {
            SecurityContextHolder.clearContext();
         } catch (UsernameNotFoundException var10) {
            SecurityContextHolder.clearContext();
         }
      }

      filterChain.doFilter(request, response);
   }
}
