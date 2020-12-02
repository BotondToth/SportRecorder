package com.sporttracking.sporttracking.data;

import lombok.Data;

@Data
public class FriendWithShare {
    private String id;
    private ApplicationUser user;
    private ApplicationUser friend;
    private boolean isWorkoutSharedWith;

    private FriendWithShare() {}

    public static class FriendWithShareBuilder {
        private final FriendWithShare friendWithShare;

        public FriendWithShareBuilder() {
            friendWithShare = new FriendWithShare();
        }

        public FriendWithShareBuilder setId(final String id) {
            friendWithShare.setId(id);
            return this;
        }

        public FriendWithShareBuilder setUser(final ApplicationUser user) {
            friendWithShare.setUser(user);
            return this;
        }

        public FriendWithShareBuilder setFriend(final ApplicationUser friend) {
            friendWithShare.setFriend(friend);
            return this;
        }

        public FriendWithShareBuilder setIsWorkoutSharedWith(final boolean isWorkoutSharedWith) {
            friendWithShare.setWorkoutSharedWith(isWorkoutSharedWith);
            return this;
        }

        public FriendWithShare build() {
            return friendWithShare;
        }
    }
}
