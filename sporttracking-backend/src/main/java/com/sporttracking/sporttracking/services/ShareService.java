package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.dto.BulkShareDTO;
import com.sporttracking.sporttracking.data.Share;
import com.sporttracking.sporttracking.data.dto.ShareDTO;
import com.sporttracking.sporttracking.exceptions.NotFriendException;
import com.sporttracking.sporttracking.exceptions.ShareAlreadyExistException;
import com.sporttracking.sporttracking.exceptions.UserNotFoundException;
import com.sporttracking.sporttracking.exceptions.WorkoutNotFoundException;
import org.springframework.http.HttpHeaders;

import java.util.List;

public interface ShareService {
    List<Share> getSharesForFriend(String friendId);

    List<Share> getSharesFromUser(HttpHeaders headers);

    List<Share> getSharesToUser(HttpHeaders headers);

    List<Share> bulkCreateShares(HttpHeaders headers, BulkShareDTO bulkShareDTO) throws UserNotFoundException, ShareAlreadyExistException, NotFriendException, WorkoutNotFoundException;

    List<Share> getSharesForWorkout(String workoutId);

    Share createShare(HttpHeaders headers, ShareDTO shareDTO) throws UserNotFoundException, WorkoutNotFoundException, ShareAlreadyExistException, NotFriendException;

    void deleteShares(List<Share> sharesToDelete);
}
