package com.fundflow.repository;

import com.fundflow.entity.Donation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DonationRepository extends JpaRepository<Donation, Long> {
   List<Donation> findByUserIdOrderByDonationDateDesc(Long userId);

   List<Donation> findByCampaignIdAndStatusOrderByDonationDateDesc(Long campaignId, String status);

   List<Donation> findAllByOrderByDonationDateDesc();

   long countByCampaignIdAndStatus(Long campaignId, String status);
}
