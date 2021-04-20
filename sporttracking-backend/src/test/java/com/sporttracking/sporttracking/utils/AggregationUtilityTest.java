package com.sporttracking.sporttracking.utils;

import com.sporttracking.sporttracking.data.Workout;
import com.sporttracking.sporttracking.utility.AggregationUtility;
import org.junit.jupiter.api.Test;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class AggregationUtilityTest {

    final List<Workout> WORKOUTS = new ArrayList<>() {
        {
            final Workout.WorkoutBuilder builder = new Workout.WorkoutBuilder();
            add(builder
                    .setCalories(10)
                    .setBeersPerWorkout(1)
                    .setDescription("first workout")
                    .setTitle("first title")
                    .setDate(Date.valueOf(LocalDate.parse("2020-12-15")))
                    .setDistance(1)
                    .setDuration(5)
                    .build());
            add(builder
                    .setCalories(20)
                    .setBeersPerWorkout(2)
                    .setDescription("second workout")
                    .setTitle("second title")
                    .setDate(Date.valueOf(LocalDate.parse("2020-12-17")))
                    .setDistance(2)
                    .setDuration(10)
                    .build());
            add(builder
                    .setCalories(40)
                    .setBeersPerWorkout(4)
                    .setDescription("third workout")
                    .setTitle("third title")
                    .setDate(Date.valueOf(LocalDate.parse("2021-01-03")))
                    .setDistance(4)
                    .setDuration(20)
                    .build());
            add(builder
                    .setCalories(80)
                    .setBeersPerWorkout(8)
                    .setDescription("fourth workout")
                    .setTitle("fourth title")
                    .setDate(Date.valueOf(LocalDate.parse("2021-01-10")))
                    .setDistance(8)
                    .setDuration(40)
                    .build());
            add(builder
                    .setCalories(160)
                    .setBeersPerWorkout(16)
                    .setDescription("fifth workout")
                    .setTitle("fifth title")
                    .setDate(Date.valueOf(LocalDate.parse("2021-02-15")))
                    .setDistance(16)
                    .setDuration(80)
                    .build());
        }
    };

    @Test
    public void testAggregatingByMonth() {
        final Map<String, Long> groupedWorkoutsByMonth = AggregationUtility.aggregate(WORKOUTS, "month");

        assertNotNull(groupedWorkoutsByMonth);
        assertEquals(Map.of("3", 1L, "15", 2L, "17", 1L, "10", 1L), groupedWorkoutsByMonth);
    }

}
