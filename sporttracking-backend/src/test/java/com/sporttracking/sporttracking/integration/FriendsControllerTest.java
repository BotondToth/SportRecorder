package com.sporttracking.sporttracking.integration;

import com.auth0.jwt.JWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.Friend;
import com.sporttracking.sporttracking.data.dto.FriendDTO;
import com.sporttracking.sporttracking.repositories.FriendMongoRepository;
import com.sporttracking.sporttracking.repositories.UserMongoRepository;
import com.sporttracking.sporttracking.utility.AuthUtility;
import org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Arrays;
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
public class FriendsControllerTest {

    private static final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FriendMongoRepository mockFriendRepository;

    @MockBean
    private UserMongoRepository mockUserMongoRepository;

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

    @BeforeEach
    public void init() {
        when(authUtility.getUserFromHeader(any())).thenReturn(TEST_USER_1);
        when(mockFriendRepository.findAllByUserId(TEST_USER_1.getId())).thenReturn(Collections.singletonList(friend1));
        when(mockUserMongoRepository.findById(TEST_USER_2.getId())).thenReturn(Optional.of(TEST_USER_2));
    }

    @Test
    public void testGetFriendsHappyPath() throws Exception {
        final String token = JWT.create()
                .withSubject(TEST_USER_1.getEmail())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(HMAC512(SECRET.getBytes()));

        final MvcResult result = mockMvc.perform(get("/friends")
                .header("Authorization", "Bearer " + token))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
        final String content = result.getResponse().getContentAsString();


        verify(mockFriendRepository, times(1)).findAllByUserId("user1");
        assertNotNull(result);
        assertNotNull(content);
        assertEquals(mapper.writeValueAsString(Collections.singletonList(friend1)), content);
    }

    @Test
    public void testGetFriendsBadPath() throws Exception {
        final MvcResult result = mockMvc.perform(get("/friends"))
                .andExpect(status().isForbidden())
                .andReturn();
        final String content = result.getResponse().getContentAsString();

        assertNotNull(result);
        assertNotNull(content);
        assertEquals(StringUtils.EMPTY, content);
    }

    @Test
    public void testSaveFriendHappyPath() throws Exception {
        when(mockFriendRepository.findAllByUserId(TEST_USER_1.getId())).thenReturn(Arrays.asList(friend1, friend2));
        when(mockUserMongoRepository.findById(any())).thenReturn(Optional.of(TEST_USER_1));

        final String token = JWT.create()
                .withSubject(TEST_USER_1.getEmail())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(HMAC512(SECRET.getBytes()));

        final FriendDTO friendDTO = new FriendDTO();
        friendDTO.setFriendId("user3");

        final MvcResult result = mockMvc.perform(post("/friends")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(friendDTO)))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();
        final String content = result.getResponse().getContentAsString();


        verify(mockFriendRepository, times(1)).findAllByUserId("user1");
        assertNotNull(result);
        assertNotNull(content);
        assertEquals(mapper.writeValueAsString(Arrays.asList(friend1, friend2)), content);
    }

    @Test
    public void testSaveFriendBadPath() throws Exception {
        final FriendDTO friendDTO = new FriendDTO();
        friendDTO.setFriendId("user3");

        final MvcResult result = mockMvc.perform(post("/friends")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(friendDTO)))
                .andExpect(status().isForbidden())
                .andReturn();
        final String content = result.getResponse().getContentAsString();

        assertNotNull(result);
        assertNotNull(content);
        assertEquals(StringUtils.EMPTY, content);
    }
}
