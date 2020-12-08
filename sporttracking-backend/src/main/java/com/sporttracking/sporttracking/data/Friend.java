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

    private Friend(final FriendBuilder builder) {
        user = builder.user;
        friend = builder.friend;
    }

    public static class FriendBuilder {
        private ApplicationUser user;
        private ApplicationUser friend;

        public FriendBuilder() {

        }

        public FriendBuilder setUser(final ApplicationUser user) {
            this.user = user;
            return this;
        }

        public FriendBuilder setFriend(final ApplicationUser friend) {
            this.friend = friend;
            return this;
        }

        public Friend build() {
            return new Friend(this);
        }
    }
}
