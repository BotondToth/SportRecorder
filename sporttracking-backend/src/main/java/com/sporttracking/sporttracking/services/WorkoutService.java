package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.Workout;
import com.sporttracking.sporttracking.data.WorkoutDTO;
import org.springframework.http.HttpHeaders;

import java.util.List;

public interface WorkoutService {

    List<Workout> getWorkoutsForUser(HttpHeaders headers);

    Workout saveWorkout(WorkoutDTO workoutDTO, HttpHeaders headers);
}
