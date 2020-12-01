package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.Workout;
import com.sporttracking.sporttracking.repositories.WorkoutMongoRepository;
import com.sporttracking.sporttracking.utility.AggregationUtility;
import com.sporttracking.sporttracking.utility.AuthUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.counting;
import static java.util.stream.Collectors.groupingBy;

@Service
public class StatisticsServiceImpl implements StatisticsService {

    @Autowired
    private WorkoutMongoRepository workoutMongoRepository;

    @Autowired
    private AuthUtility authUtility;

    @Override
    public Map<String, Long> getStatisticsForUser(
            final HttpHeaders headers,
            final Date from,
            final Date to,
            final String mode) {
        final ApplicationUser user = authUtility.getUserFromHeader(headers);
        final List<Workout> workouts = workoutMongoRepository.findAllByUserIdAndDateBetween(user.getId(), from, to);
        return AggregationUtility.aggregate(workouts, mode);
    }

    @Override
    public Map<String, Long> getStatisticsByType(
            final HttpHeaders headers,
            final Date from,
            final Date to) {
        final ApplicationUser user = authUtility.getUserFromHeader(headers);
        final List<Workout> workouts = workoutMongoRepository.findAllByUserIdAndDateBetween(user.getId(), from, to);
        return workouts
                .stream()
                .collect(groupingBy(Workout::getType, counting()));

    }
}
