package com.sporttracking.sporttracking.controllers;

import com.sporttracking.sporttracking.data.Workout;
import com.sporttracking.sporttracking.data.dto.WorkoutDTO;
import com.sporttracking.sporttracking.exceptions.ResourceNotFoundException;
import com.sporttracking.sporttracking.services.WorkoutServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class WorkoutsController implements BaseController {

    @Autowired
    private WorkoutServiceImpl workoutService;

    @PostMapping("/workout")
    public Workout saveWorkout(@RequestBody final WorkoutDTO workoutDTO, @RequestHeader final HttpHeaders headers) {
        return workoutService.saveWorkout(workoutDTO, headers);
    }

    @GetMapping("/workouts")
    public List<Workout> getWorkoutsForUser(@RequestHeader final HttpHeaders headers) {
        return workoutService.getWorkoutsForUser(headers);
    }

    @GetMapping("/workout/{id}")
    public Optional<Workout> getWorkoutsForUser(@PathVariable(value = "id") final String workoutId, @RequestHeader final HttpHeaders headers) throws ResourceNotFoundException {
        return workoutService.getWorkoutForUser(workoutId, headers);
    }

    @DeleteMapping("/workout/{id}")
    public boolean deleteWorkout(@PathVariable(value = "id") final String workoutId, @RequestHeader final HttpHeaders headers) throws ResourceNotFoundException {
        return workoutService.deleteWorkout(workoutId, headers);
    }

    @GetMapping("/feed")
    public List<Workout> getFeed(@RequestHeader final HttpHeaders headers) {
        return workoutService.getFeed(headers);
    }
}
