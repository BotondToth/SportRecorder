package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.Friend;
import com.sporttracking.sporttracking.data.Workout;
import com.sporttracking.sporttracking.data.dto.WorkoutDTO;
import com.sporttracking.sporttracking.exceptions.ResourceNotFoundException;
import com.sporttracking.sporttracking.repositories.WorkoutMongoRepository;
import com.sporttracking.sporttracking.utility.AuthUtility;
import com.sporttracking.sporttracking.utility.CalorieCalculatorUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class WorkoutServiceImpl implements WorkoutService {

    final static long BEER_CALORIE = 150;
    final static int FEED_LIMIT = 20;

    @Autowired
    private WorkoutMongoRepository workoutMongoRepository;

    @Autowired
    private AuthUtility authUtility;

    @Autowired
    private FriendService friendService;

    @Autowired
    private ShareService shareService;

    @Override
    public List<Workout> getFeed(final HttpHeaders headers) {
        final List<Friend> followedUsers = friendService.getFriendsForUser(headers);
        final ApplicationUser user = authUtility.getUserFromHeader(headers);
        final List<Workout> allWorkouts = getWorkoutsForUser(user);
        final List<String> sharedWorkoutIds = shareService.getSharesForFriend(user.getId())
                .stream()
                .map(workout -> workout.getWorkout().getId())
                .collect(Collectors.toList());

        followedUsers.forEach(followedUser -> {
            final List<Workout> workoutForFollowedUser = getWorkoutsForUser(followedUser.getFriend())
                    .stream()
                    .filter(workout -> sharedWorkoutIds.contains(workout.getId()))
                    .collect(Collectors.toList());

            allWorkouts.addAll(workoutForFollowedUser);
        });
        allWorkouts.sort(Comparator.comparing(Workout::getDate));
        final List<Workout> limited = allWorkouts.stream().limit(FEED_LIMIT).collect(Collectors.toList());
        Collections.reverse(limited);
        return limited;
    }

    @Override
    public Workout getWorkoutById(final String workoutId) {
        return workoutMongoRepository.findById(workoutId).orElse(null);
    }

    @Override
    public List<Workout> getWorkoutsForUser(final HttpHeaders headers) {
        final ApplicationUser user = authUtility.getUserFromHeader(headers);
        return getWorkoutsForUser(user);
    }

    @Override
    public List<Workout> getWorkoutsForUser(final ApplicationUser user) {
        return workoutMongoRepository.findAllByUserIdOrderByDateDesc(user.getId());
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
        final long calories = CalorieCalculatorUtility.calculate(workoutDTO.getDuration(), Long.parseLong(user.getWeight()), workoutDTO.getType());
        final Workout.WorkoutBuilder builder = new Workout.WorkoutBuilder();

        return workoutMongoRepository.save(builder
                .setUser(user)
                .setCalories(calories)
                .setBeersPerWorkout(calculateBeersPerWorkout(calories))
                .setDuration(workoutDTO.getDuration())
                .setLocationPoints(workoutDTO.getLocationPoints())
                .setTitle(workoutDTO.getTitle())
                .setDescription(workoutDTO.getDescription())
                .setType(workoutDTO.getType())
                .setDate(new Date())
                .setDistance(workoutDTO.getDistance())
                .build());
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

    private long calculateBeersPerWorkout(final long burntCalories) {
        return (long) Math.floor(burntCalories / BEER_CALORIE);
    }
}
