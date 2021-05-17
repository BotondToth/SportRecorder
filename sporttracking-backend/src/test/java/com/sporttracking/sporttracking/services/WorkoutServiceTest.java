package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.Point;
import com.sporttracking.sporttracking.data.Workout;
import com.sporttracking.sporttracking.data.dto.WorkoutDTO;
import com.sporttracking.sporttracking.exceptions.FriendNotFoundException;
import com.sporttracking.sporttracking.exceptions.ResourceNotFoundException;
import com.sporttracking.sporttracking.helper.TestHelper;
import com.sporttracking.sporttracking.repositories.WorkoutMongoRepository;
import com.sporttracking.sporttracking.utility.AuthUtility;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
public class WorkoutServiceTest {

    @Mock
    private WorkoutMongoRepository mockWorkoutMongoRepository;

    @Mock
    private AuthUtility mockAuthUtility;

    @Mock
    private FriendService mockFriendService;

    @Mock
    private ShareService mockShareService;

    @InjectMocks
    private WorkoutServiceImpl workoutService;

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
    public void setUpMocks() {
        when(mockAuthUtility.getUserFromHeader(any())).thenReturn(TEST_USER_1);
        when(mockFriendService.getFriendsForUser(any())).thenReturn(TestHelper.getMockedFriendsList());
        when(mockWorkoutMongoRepository.findAllByUserIdOrderByDateDesc(any()))
                .thenReturn(TestHelper.getMockedWorkouts());
        when(mockShareService.getSharesForFriend(any()))
                .thenReturn(TestHelper.getMockedShares());
    }

    @Test
    public void testGetFeed() {
        final List<Workout> feed = workoutService.getFeed(new HttpHeaders());
        assertNotNull(feed);
        assertEquals(8, feed.size());
    }

    @Test
    public void testGetWorkoutById() {
        when(mockWorkoutMongoRepository.findById("workoutId")).thenReturn(Optional.of(new Workout.WorkoutBuilder().build()));
        final Workout workout = workoutService.getWorkoutById("workoutId");
        assertNotNull(workout);
    }

    @Test
    public void testGetWorkoutByNullId() {
        final Workout workout = workoutService.getWorkoutById(null);
        assertNull(workout);
    }


    @Test
    public void testGetWorkoutsForUser() {
        final List<Workout> workouts = workoutService.getWorkoutsForUser(new HttpHeaders());
        assertNotNull(workouts);
        assertEquals(2, workouts.size());
    }

    @Test
    public void testGetWorkoutsForApplicationUser() {
        final List<Workout> workouts = workoutService.getWorkoutsForUser(TEST_USER_1);
        assertNotNull(workouts);
        assertEquals(2, workouts.size());
    }

    @Test
    public void testGetWorkoutForUser() throws ResourceNotFoundException {
        when(mockWorkoutMongoRepository.findByIdAndUserId("workoutId", TEST_USER_1.getId())).thenReturn(Optional.of(TestHelper.getMockedWorkouts().get(0)));
        final Workout workout = workoutService.getWorkoutForUser("workoutId", new HttpHeaders()).get();
        assertNotNull(workout);
        assertEquals(TestHelper.getMockedWorkouts().get(0), TestHelper.getMockedWorkouts().get(0));
    }

    @Test
    public void testGetWorkoutForUserExpectException() {
        assertThrows(ResourceNotFoundException.class, () -> {
            workoutService.getWorkoutForUser("workoutId", new HttpHeaders());
        });
    }

    @Test
    public void testSaveWorkout() {
        WorkoutDTO workoutDTOToSave = new WorkoutDTO();
        final Date date = new Date();
        workoutDTOToSave.setDate(date);
        workoutDTOToSave.setType("Running");
        workoutDTOToSave.setCalories(500);
        workoutDTOToSave.setDescription("description");
        workoutDTOToSave.setDistance(40);
        workoutDTOToSave.setLocationPoints(new Point[] {
                new Point(5.5f, 2.3f)
        });
        workoutDTOToSave.setTitle("title");
        when(mockWorkoutMongoRepository.save(any())).thenReturn(TestHelper.getWorkoutByDTO(workoutDTOToSave));

        final Workout workout = workoutService.saveWorkout(workoutDTOToSave, new HttpHeaders());

        assertNotNull(workout);
        assertEquals(date, workout.getDate());
        assertEquals("Running", workout.getType());
        assertEquals(500, workout.getCalories());
        assertEquals("description", workout.getDescription());
        assertEquals(0, workout.getBeersPerWorkout());
        assertEquals(40, workout.getDistance());
        assertEquals(1, workout.getLocationPoints().length);
        assertEquals("title", workout.getTitle());
    }

}
