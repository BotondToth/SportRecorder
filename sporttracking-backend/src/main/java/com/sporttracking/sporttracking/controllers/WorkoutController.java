package com.sporttracking.sporttracking.controllers;

import com.sporttracking.sporttracking.data.Workout;
import com.sporttracking.sporttracking.data.WorkoutDTO;
import com.sporttracking.sporttracking.services.WorkoutServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class WorkoutController implements BaseController {

    @Autowired
    private WorkoutServiceImpl workoutService;

    @PostMapping("/workout")
    public Workout saveWorkout(@RequestBody final WorkoutDTO workoutDTO, @RequestHeader HttpHeaders headers) {
       return workoutService.saveWorkout(workoutDTO, headers);
    }

    @GetMapping("/workouts")
    public List<Workout> getWorkoutsForUser(@RequestHeader HttpHeaders headers) {
        return workoutService.getWorkoutsForUser(headers);
    }
}
