package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.Workout;
import com.sporttracking.sporttracking.data.WorkoutDTO;
import com.sporttracking.sporttracking.filters.JWTAuthorizationFilter;
import com.sporttracking.sporttracking.repositories.UserMongoRepository;
import com.sporttracking.sporttracking.repositories.WorkoutMongoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class WorkoutServiceImpl implements WorkoutService {

    @Autowired
    private WorkoutMongoRepository workoutMongoRepository;

    @Autowired
    private UserMongoRepository userMongoRepository;

    @Override
    public List<Workout> getWorkoutsForUser(final HttpHeaders headers) {
        final ApplicationUser user = getUserFromHeader(headers);
        return workoutMongoRepository.findAllByUserId(user.getId());
    }

    @Override
    public Workout saveWorkout(final WorkoutDTO workoutDTO, final HttpHeaders headers) {
        final ApplicationUser user = getUserFromHeader(headers);
        return workoutMongoRepository.save(new Workout(workoutDTO, user.getId()));
    }

    private ApplicationUser getUserFromHeader(final HttpHeaders headers) {
        final String token = Objects.requireNonNull(headers.get("authorization")).get(0);
        return userMongoRepository.findByEmail(JWTAuthorizationFilter.getUserFromToken(token));
    }
}
