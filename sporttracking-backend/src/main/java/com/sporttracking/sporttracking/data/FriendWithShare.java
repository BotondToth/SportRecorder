package com.sporttracking.sporttracking.data;

import lombok.Data;

@Data
public class FriendWithShare {
    private String id;
    private ApplicationUser user;
    private ApplicationUser friend;
    private boolean isWorkoutSharedWith;

    private FriendWithShare() {
    }

    private FriendWithShare(final FriendWithShareBuilder builder) {
        id = builder.id;
        user = builder.user;
        friend = builder.friend;
        isWorkoutSharedWith = builder.isWorkoutSharedWith;
    }

    public static class FriendWithShareBuilder {
        private String id;
        private ApplicationUser user;
        private ApplicationUser friend;
        private boolean isWorkoutSharedWith;

        public FriendWithShareBuilder() {
        }

        public FriendWithShareBuilder setId(final String id) {
            this.id = id;
            return this;
        }

        public FriendWithShareBuilder setUser(final ApplicationUser user) {
            this.user = user;
            return this;
        }

        public FriendWithShareBuilder setFriend(final ApplicationUser friend) {
            this.friend = friend;
            return this;
        }

        public FriendWithShareBuilder setIsWorkoutSharedWith(final boolean isWorkoutSharedWith) {
            this.isWorkoutSharedWith = isWorkoutSharedWith;
            return this;
        }

        public FriendWithShare build() {
            return new FriendWithShare(this);
        }
    }
}
