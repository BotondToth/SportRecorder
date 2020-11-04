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
    @DBRef
    private ApplicationUser user;
    @Field
    @DBRef
    private ApplicationUser friend;
    @DBRef
    @Field
    private Workout workout;

    public Share(ApplicationUser user, ApplicationUser friend, Workout workout) {
        this.user = user;
        this.friend = friend;
        this.workout = workout;
    }
}
