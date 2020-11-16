package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.Friend;
import com.sporttracking.sporttracking.data.Workout;
import com.sporttracking.sporttracking.data.WorkoutDTO;
import com.sporttracking.sporttracking.exceptions.ResourceNotFoundException;
import com.sporttracking.sporttracking.repositories.WorkoutMongoRepository;
import com.sporttracking.sporttracking.utility.AuthUtility;
import com.sporttracking.sporttracking.utility.CalorieCalculatorUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WorkoutServiceImpl implements WorkoutService {

    final long BEER_CALORIE = 150;

    @Autowired
    private WorkoutMongoRepository workoutMongoRepository;

    @Autowired
    private AuthUtility authUtility;

    @Autowired
    private FriendService friendService;

    @Override
    public List<Workout> getFeed(final HttpHeaders headers) {
        final List<Friend> followedUsers = friendService.getFriendsForUser(headers);
        final List<Workout> allWorkouts = getWorkoutsForLoggedInUser(headers);
        for (Friend followedAccount : followedUsers) {
            allWorkouts.addAll(getWorkoutsForUser(followedAccount.getFriend()));
        }
        allWorkouts.sort(Comparator.comparing(Workout::getDate));
        return allWorkouts.stream().limit(20).collect(Collectors.toList());
    }

    @Override
    public Workout getWorkoutById(final String workoutId) {
        return workoutMongoRepository.findById(workoutId).orElse(null);
    }

    @Override
    public List<Workout> getWorkoutsForLoggedInUser(final HttpHeaders headers) {
        final ApplicationUser user = authUtility.getUserFromHeader(headers);
        return workoutMongoRepository.findAllByUserId(user.getId());
    }

    @Override
    public List<Workout> getWorkoutsForUser(final ApplicationUser user) {
        return workoutMongoRepository.findAllByUserId(user.getId());
    }

    @Override
    public Optional<Workout> getWorkoutForUser(final String workoutId, final HttpHeaders headers) throws ResourceNotFoundException {
        final ApplicationUser user = authUtility.getUserFromHeader(headers);
        final Optional<Workout> workout = workoutMongoRepository.findByIdAndUserId(workoutId, user.getId());
        if (workout.isEmpty()) {
            throw new ResourceNotFoundException();
        }
        return workout;
    }

    @Override
    public Workout saveWorkout(final WorkoutDTO workoutDTO, final HttpHeaders headers) {
        final ApplicationUser user = authUtility.getUserFromHeader(headers);
        final long calories  = CalorieCalculatorUtility.calculate(workoutDTO.getDuration(), Long.parseLong(user.getWeight()), workoutDTO.getType());

        return workoutMongoRepository.save(new Workout(
            workoutDTO,
            user,
            calories,
            calculateBeersPerWorkout(calories))
        );
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

    private long calculateBeersPerWorkout(long burntCalories) {
        return (long) Math.floor(burntCalories / BEER_CALORIE);
    }
}
