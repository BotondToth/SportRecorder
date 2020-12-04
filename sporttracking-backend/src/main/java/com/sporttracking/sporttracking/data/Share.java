package com.sporttracking.sporttracking.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "Shares")
@AllArgsConstructor
public class Share {
    @Id
    private String id;
    @Field
    @DBRef
    private ApplicationUser user;
    @Field
    @DBRef
    private ApplicationUser friend;
    @DBRef
    @Field
    private Workout workout;

    private Share() {}

    public static class ShareBuilder {
        private final Share share;

        public ShareBuilder() {
            share = new Share();
        }

        public ShareBuilder setUser(final ApplicationUser user) {
            share.setUser(user);
            return this;
        }

        public ShareBuilder setFriend(final ApplicationUser friend) {
            share.setFriend(friend);
            return this;
        }

        public ShareBuilder setWorkout(final Workout workout) {
            share.setWorkout(workout);
            return this;
        }

        public Share build() {
            return share;
        }
    }
}
