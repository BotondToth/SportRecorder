package com.sporttracking.sporttracking.repositories;

import com.sporttracking.sporttracking.data.Friend;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendMongoRepository extends MongoRepository<Friend, String> {
    List<Friend> findAllByUserId(String userId);

    Optional<Friend> findByUserIdAndFriendId(String userId, String friendId);

    void deleteFriendsByUserIdAndFriendId(String userId, String friendId);
}
