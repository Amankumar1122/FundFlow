package com.fundflow.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
   private final SecretKey signingKey;
   private final long expirationMs;

   public JwtService(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiration-ms}") long expirationMs) {
      this.signingKey = Keys.hmacShaKeyFor((byte[])Decoders.BASE64.decode(secret));
      this.expirationMs = expirationMs;
   }

   public String generateToken(String subject) {
      Date now = new Date();
      return Jwts.builder().subject(subject).issuedAt(now).expiration(new Date(now.getTime() + this.expirationMs)).signWith(this.signingKey).compact();
   }

   public String extractSubject(String token) {
      return this.claims(token).getSubject();
   }

   public boolean isTokenValid(String token, String subject) {
      return subject.equals(this.extractSubject(token)) && this.claims(token).getExpiration().after(new Date());
   }

   private Claims claims(String token) {
      return (Claims)Jwts.parser().verifyWith(this.signingKey).build().parseSignedClaims(token).getPayload();
   }
}
