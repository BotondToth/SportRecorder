package com.sporttracking.sporttracking.utils;

import com.auth0.jwt.JWT;
import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.repositories.UserMongoRepository;
import com.sporttracking.sporttracking.utility.AuthUtility;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.http.HttpHeaders;

import java.util.Date;

import static com.auth0.jwt.algorithms.Algorithm.HMAC512;
import static com.sporttracking.sporttracking.security.SecurityConstants.EXPIRATION_TIME;
import static com.sporttracking.sporttracking.security.SecurityConstants.SECRET;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@SpringBootTest
public class AuthUtilityTest {

    @Mock
    private UserMongoRepository userMongoRepository;

    @InjectMocks
    private AuthUtility authUtility;

    private ApplicationUser.ApplicationUserBuilder userBuilder = new ApplicationUser.ApplicationUserBuilder();

    private final ApplicationUser TEST_USER_1 = userBuilder
            .setEmail("test@test.com")
            .setFullName("Test Elek")
            .setHeight("190")
            .setPassword("randomPassword1")
            .setSex("male")
            .setUsername("test")
            .setWeight("80")
            .build();

    private final ApplicationUser TEST_USER_2 = userBuilder
            .setEmail("test2@test.com")
            .setFullName("Test Elek2")
            .setHeight("190")
            .setPassword("randomPassword1")
            .setSex("female")
            .setUsername("test2")
            .setWeight("80")
            .build();

    @BeforeEach
    public void setUpMocks() {
        when(userMongoRepository.findByEmail("test@test.com")).thenReturn(TEST_USER_1);
        when(userMongoRepository.findByUsername("test2")).thenReturn(TEST_USER_2);
    }

    @Test
    public void testGetUserFromHeaderByEmail() {
        final String token = JWT.create()
                .withSubject(TEST_USER_1.getEmail())
                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .sign(HMAC512(SECRET.getBytes()));

        final HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        final ApplicationUser userByToken = authUtility.getUserFromHeader(headers);

        assertNotNull(userByToken);
        assertEquals("test@test.com", userByToken.getEmail());
    }


}
