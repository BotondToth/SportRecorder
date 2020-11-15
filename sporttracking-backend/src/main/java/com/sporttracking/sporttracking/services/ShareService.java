package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.BulkShareDTO;
import com.sporttracking.sporttracking.data.Share;
import com.sporttracking.sporttracking.data.ShareDTO;
import com.sporttracking.sporttracking.exceptions.NotFriendException;
import com.sporttracking.sporttracking.exceptions.ShareAlreadyExistException;
import com.sporttracking.sporttracking.exceptions.UserNotFoundException;
import com.sporttracking.sporttracking.exceptions.WorkoutNotFoundException;
import org.springframework.http.HttpHeaders;

import java.util.List;

public interface ShareService {
    List<Share> getSharesFromUser(final HttpHeaders headers);

    List<Share> getSharesToUser(final HttpHeaders headers);

    List<Share> bulkCreateShares(final HttpHeaders headers, final BulkShareDTO bulkShareDTO) throws UserNotFoundException, ShareAlreadyExistException, NotFriendException, WorkoutNotFoundException;

    List<Share> getSharesForWorkout(final String workoutId);

    Share createShare(final HttpHeaders headers, final ShareDTO shareDTO) throws UserNotFoundException, WorkoutNotFoundException, ShareAlreadyExistException, NotFriendException;
}
