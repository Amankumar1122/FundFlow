package com.fundflow.enums;

public enum CampaignStatus {
   PENDING,
   APPROVED,
   REJECTED,
   PAUSED,
   COMPLETED;

   // $FF: synthetic method
   private static CampaignStatus[] $values() {
      return new CampaignStatus[]{PENDING, APPROVED, REJECTED, PAUSED, COMPLETED};
   }
}
