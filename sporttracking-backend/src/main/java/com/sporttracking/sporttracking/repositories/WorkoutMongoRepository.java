package com.sporttracking.sporttracking.repositories;

import com.sporttracking.sporttracking.data.Workout;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WorkoutMongoRepository extends MongoRepository<Workout, String> {
    List<Workout> findAllByUserId(final String userId);

    Optional<Workout> findByIdAndUserId(final String Id, final String userId);
}
