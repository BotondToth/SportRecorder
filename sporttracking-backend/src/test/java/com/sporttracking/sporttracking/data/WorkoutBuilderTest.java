package com.sporttracking.sporttracking.data;

import com.sporttracking.sporttracking.helper.TestHelper;
import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class WorkoutBuilderTest {

    @Test
    public void testWorkoutBuilder() {
        final Workout.WorkoutBuilder workoutBuilder = new Workout.WorkoutBuilder();
        final ApplicationUser user = TestHelper.getUserWithUserName("user");
        final Date date = new Date();
        final Workout workout = workoutBuilder
                .setDuration(10L)
                .setDistance(5L)
                .setDate(date)
                .setTitle("title")
                .setDescription("desc")
                .setBeersPerWorkout(5L)
                .setCalories(1000)
                .setLocationPoints(new Point[] {
                        new Point(5.5f, 2.3f)
                })
                .setType("Running")
                .setUser(user)
                .build();

        assertNotNull(workout);
        assertEquals(10L, workout.getDuration());
        assertEquals(5L, workout.getDistance());
        assertEquals(date, workout.getDate());
        assertEquals("title", workout.getTitle());
        assertEquals("desc", workout.getDescription());
        assertEquals(5L, workout.getBeersPerWorkout());
        assertEquals(1000, workout.getCalories());
        assertEquals(1, workout.getLocationPoints().length);
        assertEquals(new Point(5.5f, 2.3f), workout.getLocationPoints()[0]);
        assertEquals("Running", workout.getType());
        assertEquals(user, workout.getUser());
    }

    private ApplicationUser getUser(final String userName) {
        final ApplicationUser.ApplicationUserBuilder builder = new ApplicationUser.ApplicationUserBuilder();
        return builder
                .setUsername(userName)
                .build();
    }
}
