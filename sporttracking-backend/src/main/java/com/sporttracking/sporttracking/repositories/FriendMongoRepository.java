package com.sporttracking.sporttracking.repositories;

import com.sporttracking.sporttracking.data.Friend;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendMongoRepository extends MongoRepository<Friend, String> {
    List<Friend> findAllByUserId(String userId);

    void deleteFriendsByUserIdAndFriendId(String userId, String friendId);
}
