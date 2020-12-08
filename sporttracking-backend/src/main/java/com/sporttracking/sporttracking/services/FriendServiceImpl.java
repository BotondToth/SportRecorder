package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.Friend;
import com.sporttracking.sporttracking.data.FriendWithShare;
import com.sporttracking.sporttracking.data.Share;
import com.sporttracking.sporttracking.data.dto.FriendDTO;
import com.sporttracking.sporttracking.exceptions.FriendNotFoundException;
import com.sporttracking.sporttracking.exceptions.UserNotFoundException;
import com.sporttracking.sporttracking.repositories.FriendMongoRepository;
import com.sporttracking.sporttracking.repositories.UserMongoRepository;
import com.sporttracking.sporttracking.utility.AuthUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FriendServiceImpl implements FriendService {

    @Autowired
    private FriendMongoRepository friendMongoRepository;

    @Autowired
    private ShareService shareService;

    @Autowired
    private UserMongoRepository userMongoRepository;

    @Autowired
    private AuthUtility authUtility;

    @Override
    public List<Friend> getFriendsForUser(final HttpHeaders headers) {
        final ApplicationUser user = authUtility.getUserFromHeader(headers);
        return friendMongoRepository.findAllByUserId(user.getId());
    }

    @Override
    public List<FriendWithShare> getFriendsWithoutShareByWorkout(final HttpHeaders headers, final String workoutId) {
        final List<Share> sharesForWorkout = shareService.getSharesForWorkout(workoutId);
        final List<String> friendsInSharedWorkouts = sharesForWorkout.stream()
                .map(Share::getFriend)
                .map(ApplicationUser::getId)
                .collect(Collectors.toList());
        final List<Friend> friends = getFriendsForUser(headers);
        return friends.stream()
                .map(friend -> new FriendWithShare.FriendWithShareBuilder()
                        .setId(friend.getId())
                        .setFriend(friend.getFriend())
                        .setUser(friend.getUser())
                        .setIsWorkoutSharedWith(friendsInSharedWorkouts.contains(friend.getFriend().getId()))
                        .build()).collect(Collectors.toList());
    }

    @Override
    public void deleteFriendship(final String friendshipId) throws FriendNotFoundException {
        final Optional<Friend> friend = friendMongoRepository.findById(friendshipId);

        if (friend.isPresent()) {
            final List<Share> sharedWorkoutsForFriend = shareService.getSharesForFriend(friend.get().getId());
            shareService.deleteShares(sharedWorkoutsForFriend);
            friendMongoRepository.deleteFriendsByUserIdAndFriendId(friend.get().getUser().getId(), friend.get().getFriend().getId());
        } else {
            throw new FriendNotFoundException();
        }
    }

    @Override
    public List<Friend> createFriend(final HttpHeaders headers, final FriendDTO friendDTO) throws UserNotFoundException {
        final Optional<ApplicationUser> userToBeAFriend = userMongoRepository.findById(friendDTO.getFriendId());
        if (userToBeAFriend.isEmpty()) {
            throw new UserNotFoundException();
        }
        final ApplicationUser user = authUtility.getUserFromHeader(headers);
        final Friend.FriendBuilder builder = new Friend.FriendBuilder();
        friendMongoRepository.save(builder
                .setUser(user)
                .setFriend(userToBeAFriend.get())
                .build());

        return friendMongoRepository.findAllByUserId(user.getId());
    }
}
