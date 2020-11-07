package com.sporttracking.sporttracking.repositories;

import com.sporttracking.sporttracking.data.Workout;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutMongoRepository extends MongoRepository<Workout, String> {
    List<Workout> findAllByUserId(String userId);
    Optional<Workout> findByIdAndUserId(String id, String userId);
}
