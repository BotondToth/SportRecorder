package com.sporttracking.sporttracking.repositories;

import com.sporttracking.sporttracking.data.Share;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ShareMongoRepository extends MongoRepository<Share, String> {

    List<Share> findAllByUserId(String userId);

    List<Share> findAllByFriendId(String friendId);

    List<Share> findAllByWorkoutId(String workoutId);

    Optional<Share> findByUserIdAndFriendIdAndWorkoutId(String userId, String friendId, String workoutId);
}
