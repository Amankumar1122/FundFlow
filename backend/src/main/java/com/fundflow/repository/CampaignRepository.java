package com.fundflow.repository;

import com.fundflow.entity.Campaign;
import com.fundflow.enums.CampaignStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
   List<Campaign> findByOrganizerIdOrderByCreatedAtDesc(Long organizerId);

   List<Campaign> findAllByOrderByCreatedAtDesc();

   List<Campaign> findByStatusOrderByCreatedAtDesc(CampaignStatus status);
}
