package com.fundflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fundflow.enums.CampaignStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
   name = "campaigns"
)
public class Campaign {
   @Id
   @GeneratedValue(
      strategy = GenerationType.IDENTITY
   )
   private Long id;
   @Column(
      nullable = false,
      length = 90
   )
   private String title;
   @Column(
      nullable = false,
      length = 400
   )
   private String description;
   @Column(
      nullable = false,
      precision = 14,
      scale = 2
   )
   private BigDecimal goalAmount;
   @Column(
      nullable = false,
      precision = 14,
      scale = 2
   )
   private BigDecimal raisedAmount;
   @Column(
      length = 40
   )
   private String category;
   @Column(
      length = 80
   )
   private String location;
   @Column(
      length = 1200
   )
   private String story;
   @Column(
      length = 2048
   )
   private String imageUrl;
   @Column
   private LocalDate endDate;
   @Enumerated(EnumType.STRING)
   @Column(
      nullable = false,
      length = 20
   )
   private CampaignStatus status;
   @Column(
      nullable = false,
      updatable = false
   )
   private Instant createdAt;
   @ManyToOne(
      fetch = FetchType.LAZY,
      optional = false
   )
   @JoinColumn(
      name = "organizer_id"
   )
   private User organizer;
   @OneToMany(
      mappedBy = "campaign"
   )
   @JsonIgnore
   private List<Donation> donations;

   protected Campaign() {
      this.raisedAmount = BigDecimal.ZERO;
      this.status = CampaignStatus.PENDING;
      this.createdAt = Instant.now();
      this.donations = new ArrayList();
   }

   public Campaign(String title, String description, BigDecimal goalAmount) {
      this.raisedAmount = BigDecimal.ZERO;
      this.status = CampaignStatus.PENDING;
      this.createdAt = Instant.now();
      this.donations = new ArrayList();
      this.title = title;
      this.description = description;
      this.goalAmount = goalAmount;
   }

   public Long getId() {
      return this.id;
   }

   public void setId(Long id) {
      this.id = id;
   }

   public String getTitle() {
      return this.title;
   }

   public void setTitle(String title) {
      this.title = title;
   }

   public String getDescription() {
      return this.description;
   }

   public void setDescription(String description) {
      this.description = description;
   }

   public BigDecimal getGoalAmount() {
      return this.goalAmount;
   }

   public void setGoalAmount(BigDecimal goalAmount) {
      this.goalAmount = goalAmount;
   }

   public BigDecimal getRaisedAmount() {
      return this.raisedAmount;
   }

   public void setRaisedAmount(BigDecimal raisedAmount) {
      this.raisedAmount = raisedAmount;
   }

   public String getCategory() {
      return this.category;
   }

   public void setCategory(String category) {
      this.category = category;
   }

   public String getLocation() {
      return this.location;
   }

   public void setLocation(String location) {
      this.location = location;
   }

   public String getStory() {
      return this.story;
   }

   public void setStory(String story) {
      this.story = story;
   }

   public String getImageUrl() {
      return this.imageUrl;
   }

   public void setImageUrl(String imageUrl) {
      this.imageUrl = imageUrl;
   }

   public LocalDate getEndDate() {
      return this.endDate;
   }

   public void setEndDate(LocalDate endDate) {
      this.endDate = endDate;
   }

   public CampaignStatus getStatus() {
      return this.status;
   }

   public void setStatus(CampaignStatus status) {
      this.status = status;
   }

   public Instant getCreatedAt() {
      return this.createdAt;
   }

   public User getOrganizer() {
      return this.organizer;
   }

   public void setOrganizer(User organizer) {
      this.organizer = organizer;
   }
}
