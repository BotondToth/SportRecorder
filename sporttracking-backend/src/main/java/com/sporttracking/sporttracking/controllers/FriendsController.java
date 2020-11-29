package com.sporttracking.sporttracking.controllers;

import com.sporttracking.sporttracking.data.Friend;
import com.sporttracking.sporttracking.data.FriendWithShare;
import com.sporttracking.sporttracking.data.dto.FriendDTO;
import com.sporttracking.sporttracking.exceptions.FriendNotFoundException;
import com.sporttracking.sporttracking.exceptions.UserNotFoundException;
import com.sporttracking.sporttracking.services.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FriendsController implements BaseController {

    @Autowired
    private FriendService friendService;

    @GetMapping("/friends")
    public List<Friend> getFriendsForUser(@RequestHeader final HttpHeaders headers) {
        return friendService.getFriendsForUser(headers);
    }

    @PostMapping("/friends")
    public List<Friend> saveFriends(@RequestHeader final HttpHeaders headers, @RequestBody final FriendDTO friendDTO) throws UserNotFoundException {
        return friendService.createFriend(headers, friendDTO);
    }

    @DeleteMapping("/friends")
    public ResponseEntity<String> deleteFriends(@RequestParam final String friendshipId) {
        try {
            friendService.deleteFriendship(friendshipId);
        } catch (FriendNotFoundException ex) {
            return new ResponseEntity<>("Error while deleting friends", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("Friend deleted", HttpStatus.OK);
    }

    @GetMapping("/friendsForWorkout")
    public List<FriendWithShare> getFriendsWithoutShareByWorkout(@RequestHeader final HttpHeaders headers, @RequestParam final String workoutId) {
        return friendService.getFriendsWithoutShareByWorkout(headers, workoutId);
    }


}
