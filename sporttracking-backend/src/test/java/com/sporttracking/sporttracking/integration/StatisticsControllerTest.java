package com.sporttracking.sporttracking.integration;

import com.auth0.jwt.JWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.Friend;
import com.sporttracking.sporttracking.data.Share;
import com.sporttracking.sporttracking.helper.TestHelper;
import com.sporttracking.sporttracking.repositories.FriendMongoRepository;
import com.sporttracking.sporttracking.repositories.ShareMongoRepository;
import com.sporttracking.sporttracking.repositories.UserMongoRepository;
import com.sporttracking.sporttracking.repositories.WorkoutMongoRepository;
import com.sporttracking.sporttracking.utility.AuthUtility;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Collections;
import java.util.Date;
import java.util.Optional;

import static com.auth0.jwt.algorithms.Algorithm.HMAC512;
import static com.sporttracking.sporttracking.security.SecurityConstants.EXPIRATION_TIME;
import static com.sporttracking.sporttracking.security.SecurityConstants.SECRET;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import static org.mockito.ArgumentMatchers.any;

@SpringBootTest
@AutoConfigureMockMvc
public class StatisticsControllerTest {
    
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FriendMongoRepository mockFriendRepository;

    @MockBean
    private UserMongoRepository mockUserMongoRepository;

    @MockBean
    private WorkoutMongoRepository mockWorkoutMongoRepository;

    @MockBean
    private AuthUtility authUtility;

    private final ApplicationUser.ApplicationUserBuilder userBuilder = new ApplicationUser.ApplicationUserBuilder();

    private final ApplicationUser TEST_USER_1 = userBuilder
            .setId("user1")
            .setEmail("test@test.com")
            .setFullName("Test Elek")
            .setHeight("190")
            .setPassword("randomPassword1")
            .setSex("male")
            .setUsername("test")
            .setWeight("80")
            .build();

    private final ApplicationUser TEST_USER_2 = userBuilder
            .setId("user2")
            .setEmail("test2@test.com")
            .setFullName("Test Elek2")
            .setHeight("190")
            .setPassword("randomPassword1")
            .setSex("female")
            .setUsername("test2")
            .setWeight("80")
            .build();

    @BeforeEach
    public void init() {
        when(authUtility.getUserFromHeader(any())).thenReturn(TEST_USER_1);
        when(mockUserMongoRepository.findById(TEST_USER_2.getId())).thenReturn(Optional.of(TEST_USER_2));
        when(mockWorkoutMongoRepository.findAllByUserIdAndDateBetween(any(), any(), any())).thenReturn(TestHelper.getMockedWorkouts());
    }

    @Test
    public void testGetStatisticsForUserHappyPath() throws Exception {
        final String token = JWT.create()
                .withSubject(TEST_USER_1.getEmail())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(HMAC512(SECRET.getBytes()));

        final MvcResult result = mockMvc.perform(get("/statistics")
                .param("from", String.valueOf(213424L))
                .param("to", String.valueOf(121251515L))
                .param("mode", "Running")
                .header("Authorization", "Bearer " + token))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
        final String content = result.getResponse().getContentAsString();


        verify(mockWorkoutMongoRepository, times(1)).findAllByUserIdAndDateBetween(any(), any(), any());
        assertNotNull(result);
        assertNotNull(content);
        assertEquals("{\"1\":2}", content);
    }

    @Test
    public void testGetStatisticsForUserBadPath() throws Exception {
        final MvcResult result = mockMvc.perform(get("/statistics")
                .param("from", String.valueOf(213424L))
                .param("to", String.valueOf(121251515L))
                .param("mode", "Running")
                )
                .andExpect(status().isForbidden())
                .andReturn();
        final String content = result.getResponse().getContentAsString();

        assertNotNull(result);
        assertNotNull(content);
        assertEquals("", content);
    }
}
