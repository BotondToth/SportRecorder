package com.sporttracking.sporttracking.repositories;

import com.sporttracking.sporttracking.data.Friend;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FriendMongoRepository extends MongoRepository<Friend, String> {

    List<Friend> findAllByUserId(String userId);

    void deleteFriendsByUserIdAndFriendId(String userId, String friendId);
}
