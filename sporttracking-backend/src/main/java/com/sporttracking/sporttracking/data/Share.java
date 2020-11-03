package com.sporttracking.sporttracking.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "Shares")
@NoArgsConstructor
@AllArgsConstructor
public class Share {

    @Id
    private String id;
    @Field
    private String userId;
    @Field
    @DBRef
    private ApplicationUser user;
    @Field
    private String friendId;
    @Field
    @DBRef
    private ApplicationUser friend;
    @Field
    private String workoutId;
    @DBRef
    @Field
    private Workout workout;

    public Share(ApplicationUser user, ApplicationUser friend, Workout workout) {
        this.userId = user.getId();
        this.user = user;
        this.friendId = friend.getId();
        this.friend = friend;
        this.workoutId = workout.getId();
        this.workout = workout;
    }
}
