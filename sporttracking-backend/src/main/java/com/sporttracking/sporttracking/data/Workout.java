package com.sporttracking.sporttracking.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.joda.time.DateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@Document(collection = "Workouts")
@NoArgsConstructor
@AllArgsConstructor
public class Workout {
    @Id
    private String id;
    @Field
    @DBRef
    private ApplicationUser user;
    @Field
    private String title;
    @Field
    private String description;
    @Field
    private String type;
    @Field
    private long duration;
    @Field
    private long distance;
    @Field
    private long calories;
    @Field
    private Date date;
    @Field
    private long beersPerWorkout;

    public Workout(final WorkoutDTO workoutDTO, final ApplicationUser user, final long caloriesBurnt, final long beers) {
        title = workoutDTO.getTitle();
        description = workoutDTO.getDescription();
        type = workoutDTO.getType();
        calories = caloriesBurnt;
        duration = workoutDTO.getDuration();
        distance = workoutDTO.getDistance();
        this.user = user;
        date = new DateTime().plusHours(1).toDate();
        beersPerWorkout = beers;
    }
}
