package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.Workout;
import com.sporttracking.sporttracking.data.WorkoutDTO;
import com.sporttracking.sporttracking.exceptions.ResourceNotFoundException;
import org.springframework.http.HttpHeaders;

import java.util.List;
import java.util.Optional;

public interface WorkoutService {

    Workout getWorkoutById(String workoutId);

    List<Workout> getWorkoutsForUser(HttpHeaders headers) throws ResourceNotFoundException;

    Optional<Workout> getWorkoutForUser(String trainingId, HttpHeaders headers) throws ResourceNotFoundException;

    boolean deleteWorkout(String trainingId, HttpHeaders headers) throws ResourceNotFoundException;

    Workout saveWorkout(WorkoutDTO workoutDTO, HttpHeaders headers);

    List<Workout> getFeed(HttpHeaders headers);

    List<Workout> getWorkoutsForUser(ApplicationUser user);
}
