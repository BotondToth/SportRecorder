package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.Workout;
import com.sporttracking.sporttracking.helper.TestHelper;
import com.sporttracking.sporttracking.repositories.WorkoutMongoRepository;
import com.sporttracking.sporttracking.utility.AuthUtility;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.shadow.com.univocity.parsers.annotations.Headers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
public class StatisticsServiceTest {

    @Mock
    private WorkoutMongoRepository mockWorkoutRepository;

    @Mock
    private AuthUtility mockAuthUtility;

    @InjectMocks
    private StatisticsServiceImpl statisticsService;

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

    private final List<Workout> MOCKED_WORKOUTS = TestHelper.getMockedWorkouts();

    @BeforeEach
    public void setUpMocks() {
        when(mockAuthUtility.getUserFromHeader(any())).thenReturn(TEST_USER_1);
        when(mockWorkoutRepository.findAllByUserIdAndDateBetween(any(), any(), any()))
                .thenReturn(MOCKED_WORKOUTS);
    }

    @Test
    public void testStatisticsForUserByDay() {
        final Map<String, Long> aggregatedWorkoutsByDay = statisticsService.getStatisticsForUser(new HttpHeaders(),
                new Date(), new Date(), "day");
        assertNotNull(aggregatedWorkoutsByDay);
        assertEquals(Map.of("1", 2L), aggregatedWorkoutsByDay);
    }

    @Test
    public void testStatisticsForUserByMonth() {
        final Map<String, Long> aggregatedWorkoutsByMonth = statisticsService.getStatisticsForUser(new HttpHeaders(),
                new Date(), new Date(), "month");
        assertNotNull(aggregatedWorkoutsByMonth);
        assertEquals(Map.of("1", 2L), aggregatedWorkoutsByMonth);
    }

    @Test
    public void testStatisticsForUserByYear() {
        final Map<String, Long> aggregatedWorkoutsByYear = statisticsService.getStatisticsForUser(new HttpHeaders(),
                new Date(), new Date(), "year");
        assertNotNull(aggregatedWorkoutsByYear);
        assertEquals(Map.of("Jan", 2L), aggregatedWorkoutsByYear);
    }

    @Test
    public void testGetStatisticsByType() {
        final Map<String, Long> aggregatedWorkoutsByType = statisticsService.getStatisticsByType(new HttpHeaders(),
                new Date(), new Date());
        assertNotNull(aggregatedWorkoutsByType);
        assertEquals(Map.of("Walking", 1L, "Running", 1L), aggregatedWorkoutsByType);
    }
}
