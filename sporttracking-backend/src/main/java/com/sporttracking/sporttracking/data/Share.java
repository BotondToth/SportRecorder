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

    private Share() {
    }

    private Share(final ShareBuilder builder) {
        user = builder.user;
        friend = builder.friend;
        workout = builder.workout;
    }

    public static class ShareBuilder {
        private ApplicationUser user;
        private ApplicationUser friend;
        private Workout workout;

        public ShareBuilder setUser(final ApplicationUser user) {
            this.user = user;
            return this;
        }

        public ShareBuilder setFriend(final ApplicationUser friend) {
            this.friend = friend;
            return this;
        }

        public ShareBuilder setWorkout(final Workout workout) {
            this.workout = workout;
            return this;
        }

        public Share build() {
            return new Share(this);
        }
    }
}
