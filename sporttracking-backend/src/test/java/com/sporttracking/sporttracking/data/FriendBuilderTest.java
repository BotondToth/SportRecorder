package com.sporttracking.sporttracking.data;


import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

public class FriendBuilderTest {

    @Test
    public void testFriendBuilder() {
        final Friend.FriendBuilder builder = new Friend.FriendBuilder();
        final ApplicationUser user = getUser("user");
        final ApplicationUser friend = getUser("friend");
        final Friend builtFriend = builder
                .setUser(user)
                .setFriend(friend)
                .build();

        assertNotNull(builtFriend);
        assertEquals(user, builtFriend.getUser());
        assertEquals(friend, builtFriend.getFriend());
    }

    private ApplicationUser getUser(final String userName) {
        final ApplicationUser.ApplicationUserBuilder builder = new ApplicationUser.ApplicationUserBuilder();
        return builder
                .setUsername(userName)
                .build();
    }
}
