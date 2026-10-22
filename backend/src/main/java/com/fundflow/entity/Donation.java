package com.fundflow.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(
   name = "donations"
)
public class Donation {
   @Id
   @GeneratedValue(
      strategy = GenerationType.IDENTITY
   )
   private Long id;
   @ManyToOne(
      fetch = FetchType.LAZY,
      optional = false
   )
   @JoinColumn(
      name = "user_id",
      nullable = false
   )
   private User user;
   @ManyToOne(
      fetch = FetchType.LAZY,
      optional = false
   )
   @JoinColumn(
      name = "campaign_id",
      nullable = false
   )
   private Campaign campaign;
   @Column(
      nullable = false,
      precision = 14,
      scale = 2
   )
   private BigDecimal amount;
   @Column(
      length = 180
   )
   private String message;
   @Column(
      nullable = false,
      updatable = false
   )
   private Instant donationDate = Instant.now();
   @Column(
      nullable = false,
      length = 20
   )
   private String status = "RECORDED";

   protected Donation() {
   }

   public Donation(User user, Campaign campaign, BigDecimal amount, String message) {
      this.user = user;
      this.campaign = campaign;
      this.amount = amount;
      this.message = message;
   }

   public Long getId() {
      return this.id;
   }

   public void setId(Long id) {
      this.id = id;
   }

   public User getUser() {
      return this.user;
   }

   public Campaign getCampaign() {
      return this.campaign;
   }

   public BigDecimal getAmount() {
      return this.amount;
   }

   public void setAmount(BigDecimal amount) {
      this.amount = amount;
   }

   public String getMessage() {
      return this.message;
   }

   public void setMessage(String message) {
      this.message = message;
   }

   public Instant getDonationDate() {
      return this.donationDate;
   }

   public String getStatus() {
      return this.status;
   }
}
