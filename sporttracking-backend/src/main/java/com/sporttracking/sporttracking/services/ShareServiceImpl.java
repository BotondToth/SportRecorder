package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.*;
import com.sporttracking.sporttracking.data.dto.BulkShareDTO;
import com.sporttracking.sporttracking.data.dto.ShareDTO;
import com.sporttracking.sporttracking.exceptions.NotFriendException;
import com.sporttracking.sporttracking.exceptions.ShareAlreadyExistException;
import com.sporttracking.sporttracking.exceptions.UserNotFoundException;
import com.sporttracking.sporttracking.exceptions.WorkoutNotFoundException;
import com.sporttracking.sporttracking.repositories.FriendMongoRepository;
import com.sporttracking.sporttracking.repositories.ShareMongoRepository;
import com.sporttracking.sporttracking.repositories.UserMongoRepository;
import com.sporttracking.sporttracking.repositories.WorkoutMongoRepository;
import com.sporttracking.sporttracking.utility.AuthUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;
import java.util.Optional;

@Service
public class ShareServiceImpl implements ShareService{

    @Autowired
    private ShareMongoRepository shareMongoRepository;

    @Autowired
    private FriendMongoRepository friendMongoRepository;

    @Autowired
    private WorkoutMongoRepository workoutMongoRepository;

    @Autowired
    private UserMongoRepository userMongoRepository;

    @Autowired
    private AuthUtility authUtility;

    @Override
    public List<Share> getSharesForFriend(final String friendId) {
        return shareMongoRepository.findAllByFriendId(friendId);
    }

    @Override
    public List<Share> getSharesFromUser(@RequestHeader final HttpHeaders headers) {
        final ApplicationUser user = authUtility.getUserFromHeader(headers);
        return shareMongoRepository.findAllByUserId(user.getId());
    }

    @Override
    public List<Share> getSharesToUser(@RequestHeader final HttpHeaders headers) {
        final ApplicationUser user = authUtility.getUserFromHeader(headers);
        return shareMongoRepository.findAllByFriendId(user.getId());
    }

    @Override
    public List<Share> bulkCreateShares(final HttpHeaders headers, final BulkShareDTO bulkShareDTO) throws UserNotFoundException, ShareAlreadyExistException, NotFriendException, WorkoutNotFoundException {
        final List<Share> sharesForThisWorkout = getSharesForWorkout(bulkShareDTO.getWorkoutId());
        if (sharesForThisWorkout.size() > 0) {
            shareMongoRepository.deleteAll(sharesForThisWorkout);
        }

        for (final String friendId: bulkShareDTO.getFriendIds()) {
            createShare(headers, new ShareDTO(friendId, bulkShareDTO.getWorkoutId()));
        }

        return getSharesFromUser(headers);
    }

    @Override
    public List<Share> getSharesForWorkout(final String workoutId) {
        return shareMongoRepository.findAllByWorkoutId(workoutId);
    }

    @Override
    public Share createShare(HttpHeaders headers, ShareDTO shareDTO) throws UserNotFoundException, WorkoutNotFoundException, ShareAlreadyExistException, NotFriendException {
        final Optional<ApplicationUser> friend = userMongoRepository.findById(shareDTO.getFriendId());
        if (friend.isEmpty()) {
            throw new UserNotFoundException();
        }
        final Optional<Workout> workout = workoutMongoRepository.findById(shareDTO.getWorkoutId());
        if (workout.isEmpty()) {
            throw new WorkoutNotFoundException();
        }
        final ApplicationUser user = authUtility.getUserFromHeader(headers);

        final Optional<Share> share = shareMongoRepository.findByUserIdAndFriendIdAndWorkoutId(user.getId(), friend.get().getId(), workout.get().getId());
        if (share.isPresent()) {
            throw new ShareAlreadyExistException();
        }

        final Optional<Friend> friendWith = friendMongoRepository.findByUserIdAndFriendId(user.getId() ,friend.get().getId());
        if (friendWith.isEmpty()) {
            throw new NotFriendException();
        }

        final Share.ShareBuilder builder = new Share.ShareBuilder();

        return shareMongoRepository.save(builder.setUser(user).setFriend(friend.get()).setWorkout(workout.get()).build());
    }

    @Override
    public void deleteShares(List<Share> sharesToDelete) {
        shareMongoRepository.deleteAll(sharesToDelete);
    }
}
