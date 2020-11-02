package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.Friend;
import com.sporttracking.sporttracking.data.FriendDTO;
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

@Service
public class FriendServiceImpl implements FriendService {

    @Autowired
    private FriendMongoRepository friendMongoRepository;

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
    public void deleteFriendship(String friendshipId) throws FriendNotFoundException {
        final Optional<Friend> friend = friendMongoRepository.findById(friendshipId);
        if (friend.isPresent()) {
            friendMongoRepository.deleteFriendsByUserIdAndFriendId(friend.get().getUserId(), friend.get().getFriendId());
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
        friendMongoRepository.save(new Friend(user, userToBeAFriend.get()));

        return friendMongoRepository.findAllByUserId(user.getId());
    }
}
