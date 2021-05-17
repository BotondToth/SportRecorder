package com.sporttracking.sporttracking.data;

import com.sporttracking.sporttracking.helper.TestHelper;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class FriendWithShareBuilderTest {

    @Test
    public void testFriendWithShareBuilder() {
        final FriendWithShare.FriendWithShareBuilder builder = new FriendWithShare.FriendWithShareBuilder();
        final ApplicationUser user = TestHelper.getUserWithUserName("user");
        final ApplicationUser friend = TestHelper.getUserWithUserName("friend");
        final String id = UUID.randomUUID().toString();
        final FriendWithShare friendWithShare = builder
                .setFriend(friend)
                .setUser(user)
                .setIsWorkoutSharedWith(true)
                .setId(id)
                .build();

        assertNotNull(friendWithShare);
        assertEquals(id, friendWithShare.getId());
        assertEquals(user, friendWithShare.getUser());
        assertEquals(friend, friendWithShare.getFriend());
        assertTrue(friendWithShare.isWorkoutSharedWith());
    }
}
