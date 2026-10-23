package com.fundflow.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fundflow.dto.request.CampaignRequest;
import com.fundflow.dto.request.CampaignStatusRequest;
import com.fundflow.dto.request.DonationRequest;
import com.fundflow.dto.request.LoginRequest;
import com.fundflow.dto.request.RegisterRequest;
import com.fundflow.enums.CampaignStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class IntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String loginAndGetToken(String email, String password) throws Exception {
        LoginRequest login = new LoginRequest(email, password);
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn();
        String json = result.getResponse().getContentAsString();
        return objectMapper.readTree(json).get("token").asText();
    }

    @Test
    @Order(1)
    void loginWithValidCredentialsReturnsJwtToken() throws Exception {
        LoginRequest login = new LoginRequest("admin@fundflow.demo", "admin123");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.role", is("admin")))
                .andExpect(jsonPath("$.email", is("admin@fundflow.demo")));
    }

    @Test
    @Order(2)
    void loginWithInvalidCredentialsReturns401() throws Exception {
        LoginRequest login = new LoginRequest("admin@fundflow.demo", "wrongpassword");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message", is("Invalid email or password")));
    }

    @Test
    @Order(3)
    void registerNewUserSucceedsAndReturnsToken() throws Exception {
        String email = "testuser" + System.currentTimeMillis() + "@example.com";
        RegisterRequest register = new RegisterRequest("Test User", email, "secretPass123");
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.role", is("user")))
                .andExpect(jsonPath("$.email", is(email)));
    }

    @Test
    @Order(4)
    void registerWithExistingEmailReturns409Conflict() throws Exception {
        RegisterRequest register = new RegisterRequest("Duplicate Admin", "admin@fundflow.demo", "secretPass123");
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isConflict());
    }

    @Test
    @Order(5)
    void getPublicCampaignsReturnsApprovedCampaigns() throws Exception {
        mockMvc.perform(get("/api/campaigns"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(5))))
                .andExpect(jsonPath("$[0].status", is("APPROVED")));
    }

    @Test
    @Order(6)
    void getCampaignDetailsReturnsCampaign() throws Exception {
        mockMvc.perform(get("/api/campaigns/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("A brighter start for every child")));
    }

    @Test
    @Order(7)
    void createCampaignRequiresAuthentication() throws Exception {
        CampaignRequest request = new CampaignRequest(
                "A community initiative",
                "This is a valid campaign description that is long enough to pass validation.",
                new BigDecimal("50000.00"),
                "Education",
                "Mumbai, India",
                "This is the detailed story of why this campaign matters to our local neighborhood.",
                "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
                LocalDate.now().plusDays(30)
        );

        mockMvc.perform(post("/api/campaigns")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(8)
    void createCampaignWithTokenSucceedsAndSetsStatusPending() throws Exception {
        String token = loginAndGetToken("maya@example.com", "password123");

        CampaignRequest request = new CampaignRequest(
                "New community reading space",
                "This is a valid campaign description that is long enough to pass validation.",
                new BigDecimal("50000.00"),
                "Education",
                "Pune, India",
                "This is the detailed story of why this campaign matters to our local neighborhood.",
                "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
                LocalDate.now().plusDays(30)
        );

        mockMvc.perform(post("/api/campaigns")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status", is("PENDING")))
                .andExpect(jsonPath("$.organizerName", is("Maya Patel")));
    }

    @Test
    @Order(9)
    void createDonationRequiresAuthentication() throws Exception {
        DonationRequest request = new DonationRequest(1L, new BigDecimal("500.00"), "Keep it up!");
        mockMvc.perform(post("/api/donations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(10)
    void createDonationWithTokenSucceedsAndIncrementsCampaignRaised() throws Exception {
        String token = loginAndGetToken("rohan@example.com", "password123");
        DonationRequest request = new DonationRequest(1L, new BigDecimal("500.00"), "Great work!");

        mockMvc.perform(post("/api/donations")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.amount", is(500.00)))
                .andExpect(jsonPath("$.donorName", is("Rohan Mehta")));
    }

    @Test
    @Order(11)
    void adminEndpointsRejectNonAdminUserWith403() throws Exception {
        String userToken = loginAndGetToken("rohan@example.com", "password123");

        mockMvc.perform(get("/api/admin/summary")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(12)
    void adminEndpointsAcceptAdminUserWith200() throws Exception {
        String adminToken = loginAndGetToken("admin@fundflow.demo", "admin123");

        mockMvc.perform(get("/api/admin/summary")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.users", greaterThanOrEqualTo(5)))
                .andExpect(jsonPath("$.campaigns", greaterThanOrEqualTo(6)))
                .andExpect(jsonPath("$.donations", greaterThanOrEqualTo(3)));
    }

    @Test
    @Order(13)
    void adminCanApprovePendingCampaign() throws Exception {
        String adminToken = loginAndGetToken("admin@fundflow.demo", "admin123");

        CampaignStatusRequest statusRequest = new CampaignStatusRequest(CampaignStatus.APPROVED);
        mockMvc.perform(patch("/api/admin/campaigns/6/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(6)))
                .andExpect(jsonPath("$.status", is("APPROVED")));
    }

    @Test
    @Order(14)
    void optionsPreflightFromApprovedVercelOriginReturns200AndCorsHeaders() throws Exception {
        mockMvc.perform(options("/api/auth/register")
                        .header("Origin", "https://fundflow-luiunlv77-aman-kumar-s-projects9.vercel.app")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "Authorization,Content-Type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://fundflow-luiunlv77-aman-kumar-s-projects9.vercel.app"))
                .andExpect(header().string("Access-Control-Allow-Credentials", "true"));
    }

    @Test
    @Order(15)
    void optionsPreflightForGetCampaignsReturnsCorsHeaders() throws Exception {
        mockMvc.perform(options("/api/campaigns")
                        .header("Origin", "https://fundflow-luiunlv77-aman-kumar-s-projects9.vercel.app")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://fundflow-luiunlv77-aman-kumar-s-projects9.vercel.app"));
    }

    @Test
    @Order(16)
    void optionsPreflightFromUnapprovedOriginDoesNotAllowCors() throws Exception {
        mockMvc.perform(options("/api/auth/register")
                        .header("Origin", "https://malicious-unapproved-site.com")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
}
