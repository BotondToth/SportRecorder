package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.Share;
import com.sporttracking.sporttracking.data.Workout;
import com.sporttracking.sporttracking.data.dto.BulkShareDTO;
import com.sporttracking.sporttracking.exceptions.*;
import com.sporttracking.sporttracking.helper.TestHelper;
import com.sporttracking.sporttracking.repositories.FriendMongoRepository;
import com.sporttracking.sporttracking.repositories.ShareMongoRepository;
import com.sporttracking.sporttracking.repositories.UserMongoRepository;
import com.sporttracking.sporttracking.repositories.WorkoutMongoRepository;
import com.sporttracking.sporttracking.utility.AuthUtility;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
public class ShareServiceTest {

    @Mock
    private ShareMongoRepository mockShareMongoRepository;

    @Mock
    private FriendMongoRepository mockFriendMongoRepository;

    @Mock
    private WorkoutMongoRepository mockWorkoutMongoRepository;

    @Mock
    private UserMongoRepository mockUserMongoRepository;

    @Mock
    private AuthUtility mockAuthUtility;

    @InjectMocks
    private ShareServiceImpl shareService;

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
            .setEmail("test2@test.com")
            .setFullName("Test Elek2")
            .setHeight("190")
            .setPassword("randomPassword1")
            .setSex("female")
            .setUsername("test2")
            .setWeight("80")
            .build();

    private final static List<Share> MOCKED_SHARES = TestHelper.getMockedShares();

    private final static List<Share> MOCKED_SHARES_WITH_BULK_DTO = new ArrayList<>() {
        {
            final Share.ShareBuilder shareBuilder = new Share.ShareBuilder();
            addAll(TestHelper.getMockedShares());
            final Workout.WorkoutBuilder workoutBuilder = new Workout.WorkoutBuilder();
            add(shareBuilder
                    .setFriend(TestHelper.getUserWithUserName("friend1"))
                    .setUser(TestHelper.getUserWithUserName("user1"))
                    .setWorkout(workoutBuilder
                            .setUser(TestHelper.getUserWithUserName("user2"))
                            .build())
                    .build());
        }
    };

    private final static List<Share> MOCKED_SHARES_FOR_USER_1 = MOCKED_SHARES.stream()
            .filter(s -> "user1".equals(s.getUser().getId())).collect(Collectors.toList());

    private final static List<Share> MOCKED_SHARES_FOR_FRIEND_1 = MOCKED_SHARES.stream()
            .filter(s -> "user1".equals(s.getFriend().getId())).collect(Collectors.toList());


    @BeforeEach
    public void setUpMocks() {
        when(mockUserMongoRepository.findByEmail("test@test.com")).thenReturn(TEST_USER_1);
        when(mockUserMongoRepository.findByUsername("test2")).thenReturn(TEST_USER_2);
        when(mockUserMongoRepository.findById("mockId")).thenReturn(java.util.Optional.ofNullable(TEST_USER_2));
        when(mockAuthUtility.getUserFromHeader(any())).thenReturn(TEST_USER_1);
        when(mockShareMongoRepository.findAllByFriendId("friendId")).thenReturn(MOCKED_SHARES);
        when(mockShareMongoRepository.findAllByUserId("user1")).thenReturn(MOCKED_SHARES_FOR_USER_1);
        when(mockShareMongoRepository.findAllByFriendId("user1")).thenReturn(MOCKED_SHARES_FOR_FRIEND_1);
        when(mockShareMongoRepository.findAllByWorkoutId(any())).thenReturn(Collections.singletonList(MOCKED_SHARES.get(0)));
    }

    @Test
    public void testGetSharesForFriend() {
        final List<Share> shares = shareService.getSharesForFriend("friendId");
        assertNotNull(shares);
        assertEquals(4, shares.size());
        assertEquals(MOCKED_SHARES, shares);
    }

    @Test
    public void testGetSharesFromUser() {
        final List<Share> shares = shareService.getSharesFromUser(new HttpHeaders());
        assertNotNull(shares);
        assertEquals(2, shares.size());
        assertEquals(MOCKED_SHARES_FOR_USER_1, shares);
    }

    @Test
    public void testGetSharesToUser() {
        final List<Share> shares = shareService.getSharesToUser(new HttpHeaders());
        assertNotNull(shares);
        assertEquals(1, shares.size());
        assertEquals(MOCKED_SHARES_FOR_FRIEND_1, shares);
    }

    @Test
    public void testBulkCreateShares() throws UserNotFoundException, ShareAlreadyExistException, WorkoutNotFoundException, NotFriendException {
        final Workout.WorkoutBuilder workoutBuilder = new Workout.WorkoutBuilder();
        when(mockUserMongoRepository.findById("friend1")).thenReturn(java.util.Optional.ofNullable(TEST_USER_1));
        when(mockWorkoutMongoRepository.findById("workoutId")).thenReturn(Optional.of(workoutBuilder
                .setUser(TestHelper.getUserWithUserName("user1"))
                .build()));
        when(mockFriendMongoRepository.findByUserIdAndFriendId(any(), any())).thenReturn(Optional.ofNullable(TestHelper.getMockedFriendsList().get(0)));
        final BulkShareDTO bulkShareDTO = new BulkShareDTO();
        bulkShareDTO.setFriendIds(new String[] {"friend1"});
        bulkShareDTO.setWorkoutId("workoutId");
        when(shareService.getSharesFromUser(any())).thenReturn(MOCKED_SHARES_WITH_BULK_DTO);
        final List<Share> bulkCreatedShares = shareService.bulkCreateShares(new HttpHeaders(), bulkShareDTO);
        assertNotNull(bulkCreatedShares);
        assertEquals(5, bulkCreatedShares.size());
        assertEquals(MOCKED_SHARES_WITH_BULK_DTO, bulkCreatedShares);
    }

    @Test
    public void testBulkCreateNotFriendException() {
        final Workout.WorkoutBuilder workoutBuilder = new Workout.WorkoutBuilder();
        when(mockUserMongoRepository.findById("friend1")).thenReturn(java.util.Optional.ofNullable(TEST_USER_1));
        when(mockWorkoutMongoRepository.findById("workoutId")).thenReturn(Optional.of(workoutBuilder
                .setUser(TestHelper.getUserWithUserName("user1"))
                .build()));
        when(mockShareMongoRepository.findByUserIdAndFriendIdAndWorkoutId(any(), any(), any())).thenReturn(Optional.empty());
        final BulkShareDTO bulkShareDTO = new BulkShareDTO();
        bulkShareDTO.setFriendIds(new String[] {"friend1"});
        bulkShareDTO.setWorkoutId("workoutId");

        assertThrows(NotFriendException.class, () -> {
            shareService.bulkCreateShares(new HttpHeaders(), bulkShareDTO);;
        });
    }

    @Test
    public void testBulkCreateShareAlreadyExistException() {
        final Workout.WorkoutBuilder workoutBuilder = new Workout.WorkoutBuilder();
        when(mockUserMongoRepository.findById("friend1")).thenReturn(java.util.Optional.ofNullable(TEST_USER_1));
        when(mockWorkoutMongoRepository.findById("workoutId")).thenReturn(Optional.of(workoutBuilder
                .setUser(TestHelper.getUserWithUserName("user1"))
                .build()));
        when(mockShareMongoRepository.findByUserIdAndFriendIdAndWorkoutId(any(), any(), any())).thenReturn(Optional.ofNullable(MOCKED_SHARES.get(0)));
        final BulkShareDTO bulkShareDTO = new BulkShareDTO();
        bulkShareDTO.setFriendIds(new String[] {"friend1"});
        bulkShareDTO.setWorkoutId("workoutId");

        assertThrows(ShareAlreadyExistException.class, () -> {
            shareService.bulkCreateShares(new HttpHeaders(), bulkShareDTO);;
        });
    }

    @Test
    public void testBulkCreateSharesUserNotFoundException() {
        final BulkShareDTO bulkShareDTO = new BulkShareDTO();
        bulkShareDTO.setFriendIds(new String[] {"friend1"});
        bulkShareDTO.setWorkoutId("workoutId");
        when(shareService.getSharesFromUser(any())).thenReturn(MOCKED_SHARES_WITH_BULK_DTO);

        assertThrows(UserNotFoundException.class, () -> {
            shareService.bulkCreateShares(new HttpHeaders(), bulkShareDTO);;
        });
    }

    @Test
    public void testBulkCreateWorkoutNotFoundException() {
        when(mockUserMongoRepository.findById("friend1")).thenReturn(java.util.Optional.ofNullable(TEST_USER_1));
        final BulkShareDTO bulkShareDTO = new BulkShareDTO();
        bulkShareDTO.setFriendIds(new String[] {"friend1"});
        bulkShareDTO.setWorkoutId("workoutId");
        when(shareService.getSharesFromUser(any())).thenReturn(MOCKED_SHARES_WITH_BULK_DTO);

        assertThrows(WorkoutNotFoundException.class, () -> {
            shareService.bulkCreateShares(new HttpHeaders(), bulkShareDTO);;
        });
    }

    @Test
    public void testGetSharesForWorkout() {
        final List<Share> sharesForWorkout = shareService.getSharesForWorkout("workout");
        assertNotNull(sharesForWorkout);
        assertEquals(1, sharesForWorkout.size());
        assertEquals(MOCKED_SHARES.get(0), sharesForWorkout.get(0));
    }



}
