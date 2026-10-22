package com.fundflow.config;

import com.fundflow.entity.Campaign;
import com.fundflow.entity.Donation;
import com.fundflow.entity.User;
import com.fundflow.enums.CampaignStatus;
import com.fundflow.repository.CampaignRepository;
import com.fundflow.repository.DonationRepository;
import com.fundflow.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DatabaseSeeder implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final UserRepository userRepository;
    private final CampaignRepository campaignRepository;
    private final DonationRepository donationRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UserRepository userRepository,
                          CampaignRepository campaignRepository,
                          DonationRepository donationRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.campaignRepository = campaignRepository;
        this.donationRepository = donationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains data; skipping seed.");
            return;
        }

        log.info("Seeding initial FundFlow users and campaigns...");

        User admin = new User("FundFlow Admin", "admin@fundflow.demo", passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        admin.setLocation("India");
        admin.setBio("Platform administrator.");
        userRepository.save(admin);

        User maya = new User("Maya Patel", "maya@example.com", passwordEncoder.encode("password123"));
        maya.setRole("USER");
        maya.setLocation("Pune, India");
        maya.setBio("Community educator and lifelong learner.");
        userRepository.save(maya);

        User rohan = new User("Rohan Mehta", "rohan@example.com", passwordEncoder.encode("password123"));
        rohan.setRole("USER");
        rohan.setLocation("Nashik, India");
        rohan.setBio("Working together for a stronger neighborhood.");
        userRepository.save(rohan);

        User ananya = new User("Ananya Rao", "ananya@example.com", passwordEncoder.encode("password123"));
        ananya.setRole("USER");
        ananya.setLocation("Bengaluru, India");
        ananya.setBio("Animal lover and volunteer.");
        userRepository.save(ananya);

        User dev = new User("Dev Shah", "dev@example.com", passwordEncoder.encode("password123"));
        dev.setRole("USER");
        dev.setLocation("Mumbai, India");
        dev.setBio("Making our city a little greener.");
        userRepository.save(dev);

        Campaign c1 = new Campaign("A brighter start for every child",
                "Every child deserves a quiet place to learn, a book to call their own, and someone who believes in their future. We are building a welcoming after-school learning room for children in our neighborhood.",
                new BigDecimal("180000.00"));
        c1.setRaisedAmount(new BigDecimal("1500.00"));
        c1.setCategory("Education");
        c1.setLocation("Pune, India");
        c1.setStory("In our community, many children share one crowded room to study. Together, we can give them a bright, safe space to discover what they are capable of. Funds will go toward renovating the room and buying books.");
        c1.setImageUrl("https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=85");
        c1.setEndDate(LocalDate.now().plusDays(18));
        c1.setStatus(CampaignStatus.APPROVED);
        c1.setOrganizer(maya);
        campaignRepository.save(c1);

        Campaign c2 = new Campaign("Clean water, closer to home",
                "Help our village bring safe, reliable drinking water within reach of every family. A new community well and filtration system will make a lasting difference for hundreds of neighbors.",
                new BigDecimal("250000.00"));
        c2.setRaisedAmount(new BigDecimal("2500.00"));
        c2.setCategory("Community");
        c2.setLocation("Nashik, India");
        c2.setStory("Families currently walk long distances for water. We have a local team ready to install a community well and maintain a simple filtration system.");
        c2.setImageUrl("https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&w=1200&q=85");
        c2.setEndDate(LocalDate.now().plusDays(12));
        c2.setStatus(CampaignStatus.APPROVED);
        c2.setOrganizer(rohan);
        campaignRepository.save(c2);

        Campaign c3 = new Campaign("A second chance for street dogs",
                "Our volunteer-run rescue is creating a safe recovery space for injured street dogs. Donations provide veterinary care, warm shelter, and the chance to find a loving forever home.",
                new BigDecimal("120000.00"));
        c3.setRaisedAmount(new BigDecimal("1000.00"));
        c3.setCategory("Animals");
        c3.setLocation("Bengaluru, India");
        c3.setStory("A small group of neighbors began rescuing dogs from the streets. A dedicated recovery space means more animals can heal safely and find families who will love them.");
        c3.setImageUrl("https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=85");
        c3.setEndDate(LocalDate.now().plusDays(26));
        c3.setStatus(CampaignStatus.APPROVED);
        c3.setOrganizer(ananya);
        campaignRepository.save(c3);

        Campaign c4 = new Campaign("Keep the neighborhood garden growing",
                "We are turning an unused corner of our neighborhood into a thriving community garden. Help us bring fresh food, greener streets, and a shared space for neighbors to grow together.",
                new BigDecimal("90000.00"));
        c4.setRaisedAmount(BigDecimal.ZERO);
        c4.setCategory("Environment");
        c4.setLocation("Mumbai, India");
        c4.setStory("The garden is planned by neighbors of all ages. Your contribution helps us prepare the soil, build raised beds, and plant native flowers.");
        c4.setImageUrl("https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=85");
        c4.setEndDate(LocalDate.now().plusDays(31));
        c4.setStatus(CampaignStatus.APPROVED);
        c4.setOrganizer(dev);
        campaignRepository.save(c4);

        Campaign c5 = new Campaign("Music lessons for all",
                "Music opens doors. We are collecting instruments and funding free weekend lessons so every young person in our community can find their rhythm.",
                new BigDecimal("150000.00"));
        c5.setRaisedAmount(BigDecimal.ZERO);
        c5.setCategory("Arts");
        c5.setLocation("Kochi, India");
        c5.setStory("Our volunteer teachers are ready to get started; we need instruments that students can share and maintain.");
        c5.setImageUrl("https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=85");
        c5.setEndDate(LocalDate.now().plusDays(9));
        c5.setStatus(CampaignStatus.APPROVED);
        c5.setOrganizer(maya);
        campaignRepository.save(c5);

        Campaign c6 = new Campaign("Care kits for a fresh beginning",
                "Help local volunteers deliver essential care kits and health resources to families who need a little extra support this season.",
                new BigDecimal("200000.00"));
        c6.setRaisedAmount(BigDecimal.ZERO);
        c6.setCategory("Health");
        c6.setLocation("Delhi, India");
        c6.setStory("Our community health partners know which families need support most. With your help, they can prepare thoughtful care kits.");
        c6.setImageUrl("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85");
        c6.setEndDate(LocalDate.now().plusDays(15));
        c6.setStatus(CampaignStatus.PENDING);
        c6.setOrganizer(rohan);
        campaignRepository.save(c6);

        // Seed initial donations
        Donation d1 = new Donation(rohan, c1, new BigDecimal("1500.00"), "A wonderful cause. Keep going!");
        donationRepository.save(d1);

        Donation d2 = new Donation(ananya, c2, new BigDecimal("2500.00"), "Safe water makes everything possible.");
        donationRepository.save(d2);

        Donation d3 = new Donation(dev, c3, new BigDecimal("1000.00"), "Thank you for helping our furry friends.");
        donationRepository.save(d3);

        log.info("Database seeding completed successfully with 5 users, 6 campaigns, and 3 donations.");
    }
}
