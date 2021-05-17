package com.sporttracking.sporttracking.data;

import com.sporttracking.sporttracking.helper.TestHelper;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class ShareBuilderTest {

    @Test
    public void testShareBuilder() {
        final Share.ShareBuilder builder = new Share.ShareBuilder();
        final Workout.WorkoutBuilder workoutBuilder = new Workout.WorkoutBuilder();
        final ApplicationUser user = TestHelper.getUserWithUserName("user");
        final ApplicationUser friend = TestHelper.getUserWithUserName("friend");
        final Workout workout = workoutBuilder
                .setUser(user)
                .build();
        final Share share = builder
                .setFriend(friend)
                .setUser(user)
                .setWorkout(workout)
                .build();

        assertNotNull(share);
        assertEquals(friend, share.getFriend());
        assertEquals(user, share.getUser());
        assertEquals(workout, share.getWorkout());
    }
}
