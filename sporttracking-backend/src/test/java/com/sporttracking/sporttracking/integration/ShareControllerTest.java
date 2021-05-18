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
public class ShareControllerTest {

    private static final ObjectMapper mapper = new ObjectMapper();

    @MockBean
    private UserMongoRepository mockUserMongoRepository;

    @MockBean
    private ShareMongoRepository mockShareMongoRepository;

    @MockBean
    private FriendMongoRepository mockFriendRepository;

    @MockBean
    private WorkoutMongoRepository mockWorkoutRepository;

    @MockBean
    private AuthUtility authUtility;

    @Autowired
    private MockMvc mockMvc;

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

    private final ApplicationUser TEST_USER_3 = userBuilder
            .setId("user3")
            .setEmail("test3@test.com")
            .setFullName("Test Elek3")
            .setHeight("190")
            .setPassword("randomPassword1")
            .setSex("female")
            .setUsername("test3")
            .setWeight("80")
            .build();


    private final static Friend.FriendBuilder friendBuilder = new Friend.FriendBuilder();
    private final Friend friend1 = friendBuilder
            .setFriend(TEST_USER_2)
            .setUser(TEST_USER_1)
            .build();

    private final Friend friend2 = friendBuilder
            .setFriend(TEST_USER_3)
            .setUser(TEST_USER_1)
            .build();

    private final static Share.ShareBuilder shareBuilder = new Share.ShareBuilder();
    private final Share share1 = shareBuilder
            .setUser(TEST_USER_1)
            .setFriend(TEST_USER_2)
            .setWorkout(TestHelper.getMockedWorkouts().get(0))
            .build();

    @BeforeEach
    public void init() {
        when(authUtility.getUserFromHeader(any())).thenReturn(TEST_USER_1);
        when(mockFriendRepository.findAllByUserId(TEST_USER_1.getId())).thenReturn(Collections.singletonList(friend1));
        when(mockUserMongoRepository.findById(TEST_USER_2.getId())).thenReturn(Optional.of(TEST_USER_2));
        when(mockShareMongoRepository.findAllByFriendId(any())).thenReturn(Collections.singletonList(share1));
        when(mockShareMongoRepository.findAllByUserId(any())).thenReturn(Collections.singletonList(share1));
    }

    @Test
    public void testGetSharesFromUserHappyPath() throws Exception {
        final String token = JWT.create()
                .withSubject(TEST_USER_1.getEmail())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(HMAC512(SECRET.getBytes()));

        final MvcResult result = mockMvc.perform(get("/shares-from")
                .header("Authorization", "Bearer " + token))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
        final String content = result.getResponse().getContentAsString();


        verify(mockShareMongoRepository, times(1)).findAllByUserId("user1");
        assertNotNull(result);
        assertNotNull(content);
    }

    @Test
    public void testGetSharesFromUserBadPath() throws Exception {
        final MvcResult result = mockMvc.perform(get("/shares-from"))
                .andExpect(status().isForbidden())
                .andReturn();
        final String content = result.getResponse().getContentAsString();


        assertNotNull(result);
        assertNotNull(content);
        assertEquals("", content);
    }
}