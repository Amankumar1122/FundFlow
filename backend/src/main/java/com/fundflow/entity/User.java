package com.fundflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
   name = "users"
)
public class User {
   @Id
   @GeneratedValue(
      strategy = GenerationType.IDENTITY
   )
   private Long id;
   @Column(
      nullable = false,
      length = 60
   )
   private String name;
   @Column(
      nullable = false,
      unique = true,
      length = 254
   )
   private String email;
   @Column(
      nullable = false
   )
   @JsonIgnore
   private String password;
   @Column(
      nullable = false,
      length = 20
   )
   private String role = "USER";
   @Column(
      nullable = false
   )
   private boolean enabled = true;
   @Column(
      length = 80
   )
   private String location;
   @Column(
      length = 240
   )
   private String bio;
   @Column(
      nullable = false,
      updatable = false
   )
   private Instant createdAt = Instant.now();
   @OneToMany(
      mappedBy = "organizer"
   )
   @JsonIgnore
   private List<Campaign> campaigns = new ArrayList();
   @OneToMany(
      mappedBy = "user"
   )
   @JsonIgnore
   private List<Donation> donations = new ArrayList();

   protected User() {
   }

   public User(String name, String email, String password) {
      this.name = name;
      this.email = email;
      this.password = password;
   }

   public Long getId() {
      return this.id;
   }

   public void setId(Long id) {
      this.id = id;
   }

   public String getName() {
      return this.name;
   }

   public void setName(String name) {
      this.name = name;
   }

   public String getEmail() {
      return this.email;
   }

   public void setEmail(String email) {
      this.email = email;
   }

   public String getPassword() {
      return this.password;
   }

   public void setPassword(String password) {
      this.password = password;
   }

   public String getRole() {
      return this.role;
   }

   public void setRole(String role) {
      this.role = role;
   }

   public boolean isEnabled() {
      return this.enabled;
   }

   public void setEnabled(boolean enabled) {
      this.enabled = enabled;
   }

   public String getLocation() {
      return this.location;
   }

   public void setLocation(String location) {
      this.location = location;
   }

   public String getBio() {
      return this.bio;
   }

   public void setBio(String bio) {
      this.bio = bio;
   }

   public Instant getCreatedAt() {
      return this.createdAt;
   }
}
