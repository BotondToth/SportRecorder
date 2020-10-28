package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.Workout;
import com.sporttracking.sporttracking.data.WorkoutDTO;
import com.sporttracking.sporttracking.exceptions.ResourceNotFoundException;
import org.springframework.http.HttpHeaders;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface WorkoutService {

    List<Workout> getWorkoutsForUser(HttpHeaders headers);

    Optional<Workout> getWorkoutForUser(String trainingId, HttpHeaders headers) throws ResourceNotFoundException;

    Map<String, Boolean> deleteWorkout(String trainingId, HttpHeaders headers) throws ResourceNotFoundException;

    Workout saveWorkout(WorkoutDTO workoutDTO, HttpHeaders headers);
}
