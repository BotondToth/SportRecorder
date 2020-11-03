package com.sporttracking.sporttracking.repositories;

import com.sporttracking.sporttracking.data.Friend;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FriendMongoRepository extends MongoRepository<Friend, String> {

    List<Friend> findAllByUserId(String userId);

    Optional<Friend> findByUserIdAndFriendId(String userId, String friendId);

    void deleteFriendsByUserIdAndFriendId(String userId, String friendId);
}
