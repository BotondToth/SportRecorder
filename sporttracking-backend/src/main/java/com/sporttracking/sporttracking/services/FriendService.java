package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.Friend;
import com.sporttracking.sporttracking.data.FriendWithShare;
import com.sporttracking.sporttracking.data.dto.FriendDTO;
import com.sporttracking.sporttracking.exceptions.FriendNotFoundException;
import com.sporttracking.sporttracking.exceptions.UserNotFoundException;
import org.springframework.http.HttpHeaders;

import java.util.List;

public interface FriendService {

    List<Friend> getFriendsForUser(HttpHeaders headers);

    List<FriendWithShare> getFriendsWithoutShareByWorkout(HttpHeaders headers, String workoutId);

    void deleteFriendship(String friendshipId) throws FriendNotFoundException;

    List<Friend> createFriend(HttpHeaders headers, FriendDTO friendDTO) throws UserNotFoundException;
}
