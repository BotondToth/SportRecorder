package com.sporttracking.sporttracking.data;

import lombok.Data;
import org.joda.time.DateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@Document(collection = "Workouts")
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

    private Workout() {
        date = new Date();
    }

    public static class WorkoutBuilder {

        private final Workout workout;

        public WorkoutBuilder() {
            workout = new Workout();
        }

        public WorkoutBuilder setWorkoutDTO(final WorkoutDTO wdto) {
            workout.setTitle(wdto.getTitle());
            workout.setDescription(wdto.getDescription());
            workout.setType(wdto.getType());
            workout.setDuration(wdto.getDuration());
            workout.setDistance(wdto.getDistance());
            return this;
        }

        public WorkoutBuilder setUser(final ApplicationUser user) {
            workout.setUser(user);
            return this;
        }

        public WorkoutBuilder setCaloriesBurnt(final long calories) {
            workout.setCalories(calories);
            return this;
        }

        public WorkoutBuilder setBeersPerWorkout(final long beers) {
            workout.setBeersPerWorkout(beers);
            return this;
        }

        public Workout build() {
            workout.setDate(new DateTime().plusHours(1).toDate());
            return workout;
        }
    }
}
