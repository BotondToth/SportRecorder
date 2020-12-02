package com.sporttracking.sporttracking.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "Friends")
@AllArgsConstructor
public class Friend {
    @Id
    private String id;
    @Field
    @DBRef
    private ApplicationUser user;
    @Field
    @DBRef
    private ApplicationUser friend;

    private Friend() {}

    public static class FriendBuilder {
        private final Friend friend;

        public FriendBuilder() {
            friend = new Friend();
        }

        public FriendBuilder setUser(final ApplicationUser user) {
            friend.setUser(user);
            return this;
        }

        public FriendBuilder setFriend(final ApplicationUser friend) {
            this.friend.setFriend(friend);
            return this;
        }

        public Friend build() {
            return friend;
        }
    }
}
