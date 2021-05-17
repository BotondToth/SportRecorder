package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.*;
import com.sporttracking.sporttracking.data.dto.FriendDTO;
import com.sporttracking.sporttracking.exceptions.FriendNotFoundException;
import com.sporttracking.sporttracking.exceptions.UserNotFoundException;
import com.sporttracking.sporttracking.helper.TestHelper;
import com.sporttracking.sporttracking.repositories.FriendMongoRepository;
import com.sporttracking.sporttracking.repositories.ShareMongoRepository;
import com.sporttracking.sporttracking.repositories.UserMongoRepository;
import com.sporttracking.sporttracking.utility.AuthUtility;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
public class FriendServiceTest {

    @Mock
    private FriendMongoRepository mockFriendMongoRepository;

    @Mock
    private ShareService mockShareService;

    @Mock
    private ShareMongoRepository mockShareMongoRepository;

    @Mock
    private UserMongoRepository mockUserMongoRepository;

    @Mock
    private AuthUtility mockAuthUtility;

    @InjectMocks
    private FriendServiceImpl friendService;

    private final ApplicationUser.ApplicationUserBuilder userBuilder = new ApplicationUser.ApplicationUserBuilder();

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


    private static final List<Share> SHARES_FOR_WORKOUT = new ArrayList<>() {
        {
            final ApplicationUser.ApplicationUserBuilder userBuilder = new ApplicationUser.ApplicationUserBuilder();
            final Share.ShareBuilder shareBuilder = new Share.ShareBuilder();
            final Workout.WorkoutBuilder workoutBuilder = new Workout.WorkoutBuilder();
            final ApplicationUser user_1 = userBuilder
                    .setEmail("test@test.com")
                    .setFullName("Test Elek")
                    .setHeight("190")
                    .setPassword("randomPassword1")
                    .setSex("male")
                    .setUsername("test")
                    .setWeight("80")
                    .build();
            add(shareBuilder
                    .setUser(user_1)
                    .setFriend(userBuilder
                            .setEmail("test2@test.com")
                            .setFullName("Test Elek2")
                            .setHeight("190")
                            .setPassword("randomPassword1")
                            .setSex("female")
                            .setUsername("test2")
                            .setWeight("80")
                            .build())
                    .setWorkout(workoutBuilder
                            .setUser(user_1)
                            .build())
                    .build());
        }
    };

    private static final List<Friend> FRIENDS_FOR_TEST_USER_1 = TestHelper.getMockedFriendsList();

    private static final List<Friend> FRIENDS_FOR_TEST_USER_1_WITH_CREATED = new ArrayList<>() {
        {
            addAll(TestHelper.getMockedFriendsList());
            add(new Friend.FriendBuilder().build());
        }
    };

    private static final List<FriendWithShare> FRIENDS_WITH_SHARE_FOR_TEST_USER_1 = TestHelper.getMockedFriendsWithShare();


    @BeforeEach
    public void setUpMocks() {
        when(mockUserMongoRepository.findByEmail("test@test.com")).thenReturn(TEST_USER_1);
        when(mockUserMongoRepository.findByUsername("test2")).thenReturn(TEST_USER_2);
        when(mockUserMongoRepository.findById("mockId")).thenReturn(java.util.Optional.ofNullable(TEST_USER_2));
        when(mockAuthUtility.getUserFromHeader(any())).thenReturn(TEST_USER_1);
        when(mockFriendMongoRepository.findAllByUserId(any())).thenReturn(FRIENDS_FOR_TEST_USER_1);
        when(mockShareService.getSharesForWorkout("workoutId")).thenReturn(SHARES_FOR_WORKOUT);
    }

    @Test
    public void testGetFriendsForUser() {
        final List<Friend> friendsForUser = friendService.getFriendsForUser(new HttpHeaders());

        assertNotNull(friendsForUser);
        assertNotEquals(0, friendsForUser.size());
        assertEquals(2, friendsForUser.size());
        assertEquals(friendsForUser, FRIENDS_FOR_TEST_USER_1);
    }

    @Test
    public void testGetFriendsWithoutShareByWorkout() {
        final List<FriendWithShare> friendsWithoutShare =
                friendService.getFriendsWithoutShareByWorkout(new HttpHeaders(), "workoutId");

        assertNotNull(friendsWithoutShare);
        assertNotEquals(0, friendsWithoutShare.size());
        assertEquals(2, friendsWithoutShare.size());
        assertEquals(friendsWithoutShare, FRIENDS_WITH_SHARE_FOR_TEST_USER_1);
    }

    @Test
    public void testCreateFriend() throws UserNotFoundException {
        final List<Friend> friendsBeforeCreate = friendService.getFriendsForUser(new HttpHeaders());
        when(mockFriendMongoRepository.findAllByUserId(any())).thenReturn(FRIENDS_FOR_TEST_USER_1_WITH_CREATED);
        final List<Friend> friendsAfterCreate = friendService.createFriend(new HttpHeaders(), new FriendDTO("mockId"));

        assertNotNull(friendsBeforeCreate);
        assertEquals(2, friendsBeforeCreate.size());
        assertEquals(3, friendsAfterCreate.size());
    }

    @Test
    public void testDeleteFriend() throws FriendNotFoundException {
        when(mockFriendMongoRepository.findById("validFriendshipId")).thenReturn(
                Optional.of(new Friend.FriendBuilder()
                        .setUser(TEST_USER_1)
                        .setFriend(TEST_USER_2)
                        .build())
        );
        when(mockFriendMongoRepository.findById("invalidFriendshipId")).thenReturn(
                Optional.empty()
        );

        friendService.deleteFriendship("validFriendshipId");
    }

    @Test
    public void testInvalidDeleteFriend() {
        when(mockFriendMongoRepository.findById("invalidFriendshipId")).thenReturn(
                Optional.empty()
        );

        assertThrows(FriendNotFoundException.class, () -> {
            friendService.deleteFriendship("invalidFriendshipId");
        });
    }


}
