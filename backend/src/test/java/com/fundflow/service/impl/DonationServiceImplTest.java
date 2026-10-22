package com.fundflow.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fundflow.dto.request.DonationRequest;
import com.fundflow.entity.Campaign;
import com.fundflow.entity.Donation;
import com.fundflow.entity.User;
import com.fundflow.enums.CampaignStatus;
import com.fundflow.repository.CampaignRepository;
import com.fundflow.repository.DonationRepository;
import com.fundflow.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DonationServiceImplTest {
    private DonationRepository donationRepository;
    private UserRepository userRepository;
    private CampaignRepository campaignRepository;
    private DonationServiceImpl service;
    private User donor;
    private Campaign campaign;

    @BeforeEach
    void setUp() {
        donationRepository = mock(DonationRepository.class);
        userRepository = mock(UserRepository.class);
        campaignRepository = mock(CampaignRepository.class);
        service = new DonationServiceImpl(donationRepository, userRepository, campaignRepository);
        donor = new User("Maya Patel", "maya@example.com", "password-hash");
        donor.setId(4L);
        campaign = new Campaign("A community learning room", "A".repeat(50), new BigDecimal("5000.00"));
        campaign.setId(8L);
        campaign.setStatus(CampaignStatus.APPROVED);
        campaign.setEndDate(LocalDate.now().plusDays(10));
    }

    @Test
    void recordsDonationAndIncrementsCampaignTotalExactlyOnce() {
        when(userRepository.findByEmailIgnoreCase("maya@example.com")).thenReturn(Optional.of(donor));
        when(campaignRepository.findById(8L)).thenReturn(Optional.of(campaign));
        when(donationRepository.save(any(Donation.class))).thenAnswer(invocation -> {
            Donation saved = invocation.getArgument(0);
            saved.setId(21L);
            return saved;
        });

        var result = service.createDonation(
                new DonationRequest(8L, new BigDecimal("125.50"), "Good luck!"), "maya@example.com");

        assertEquals(new BigDecimal("125.50"), campaign.getRaisedAmount());
        assertEquals("RECORDED", result.status());
        assertEquals(21L, result.id());
        verify(donationRepository).save(any(Donation.class));
    }

    @Test
    void cancellingDonationReversesItsAmountOnce() {
        campaign.setRaisedAmount(new BigDecimal("1000.00"));
        Donation donation = new Donation(donor, campaign, new BigDecimal("250.00"), null);
        donation.setId(10L);
        when(donationRepository.findById(10L)).thenReturn(Optional.of(donation));
        when(userRepository.findByEmailIgnoreCase("maya@example.com")).thenReturn(Optional.of(donor));

        service.deleteDonation(10L, "maya@example.com");

        assertEquals(new BigDecimal("750.00"), campaign.getRaisedAmount());
        verify(donationRepository).delete(donation);
    }
}
