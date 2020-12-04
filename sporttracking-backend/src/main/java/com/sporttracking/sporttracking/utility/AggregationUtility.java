package com.sporttracking.sporttracking.utility;

import com.sporttracking.sporttracking.data.Workout;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.function.Function;
import java.util.stream.Collectors;

public class AggregationUtility {

    private static Map<String, Long> groupWorkoutsBy(final List<Workout> workouts, final String pattern) {
        final SimpleDateFormat formatter = new SimpleDateFormat(pattern);
        formatter.setTimeZone(TimeZone.getTimeZone("GMT+1"));
        return workouts.stream()
                .map(workout -> formatter.format(workout.getDate()))
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
    }

    public static Map<String, Long> aggregate(final List<Workout> workouts, final String mode) {
        switch (mode) {
            case "year":
                return groupWorkoutsBy(workouts, "MMM");
            case "month":
                return groupWorkoutsBy(workouts, "d");
            case "day":
            default:
                return groupWorkoutsBy(workouts, "H");
        }
    }
}
