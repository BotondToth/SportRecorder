package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.Workout;
import com.sporttracking.sporttracking.data.WorkoutDTO;
import com.sporttracking.sporttracking.exceptions.ResourceNotFoundException;
import com.sporttracking.sporttracking.repositories.WorkoutMongoRepository;
import com.sporttracking.sporttracking.utility.AuthUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class WorkoutServiceImpl implements WorkoutService {

    @Autowired
    private WorkoutMongoRepository workoutMongoRepository;

    @Autowired
    private AuthUtility authUtility;

    @Override
    public List<Workout> getWorkoutsForUser(final HttpHeaders headers) {
        final ApplicationUser user = authUtility.getUserFromHeader(headers);
        System.out.println(user.getId());
        return workoutMongoRepository.findAllByUserId(user.getId());
    }

    @Override
    public Optional<Workout> getWorkoutForUser(String trainingId, HttpHeaders headers) throws ResourceNotFoundException {
        final ApplicationUser user = authUtility.getUserFromHeader(headers);
        Optional<Workout> workout =  workoutMongoRepository.findByIdAndUserId(trainingId, user.getId());
        if (workout.isEmpty()) {
            throw new ResourceNotFoundException();
        }
        return workout;
    }

    @Override
    public Workout saveWorkout(final WorkoutDTO workoutDTO, final HttpHeaders headers) {
        return workoutMongoRepository.save(new Workout(workoutDTO, authUtility.getUserFromHeader(headers)));
    }

    @Override
    public boolean deleteWorkout(final String trainingId, final HttpHeaders headers) throws ResourceNotFoundException {
        final ApplicationUser user = authUtility.getUserFromHeader(headers);

        if (workoutMongoRepository.findByIdAndUserId(trainingId, user.getId()).isEmpty()) {
            throw new ResourceNotFoundException();
        }
        workoutMongoRepository.deleteById(trainingId);
        return true;
    }
}
