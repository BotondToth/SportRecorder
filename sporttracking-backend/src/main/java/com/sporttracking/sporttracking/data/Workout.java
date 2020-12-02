package com.sporttracking.sporttracking.data;

import lombok.Data;
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
    @Field
    private Point[] locationPoints;

    private Workout() {}

    public static class WorkoutBuilder {
        private final Workout workout;

        public WorkoutBuilder() {
            workout = new Workout();
        }

        public WorkoutBuilder setType(final String type) {
            workout.setType(type);
            return this;
        }


        public WorkoutBuilder setTitle(final String title) {
            workout.setTitle(title);
            return this;
        }

        public WorkoutBuilder setDescription(final String description) {
            workout.setDescription(description);
            return this;
        }

        public WorkoutBuilder setDuration(final long duration) {
            workout.setDuration(duration);
            return this;
        }

        public WorkoutBuilder setDistance(final long distance) {
            workout.setDistance(distance);
            return this;
        }

        public WorkoutBuilder setCalories(final long calories) {
            workout.setCalories(calories);
            return this;
        }

        public WorkoutBuilder setUser(final ApplicationUser user) {
            workout.setUser(user);
            return this;
        }

        public WorkoutBuilder setLocationPoints(final Point[] points) {
            workout.setLocationPoints(points);
            return this;
        }

        public WorkoutBuilder setBeersPerWorkout(final long beers) {
            workout.setBeersPerWorkout(beers);
            return this;
        }

        public WorkoutBuilder setDate(final Date date) {
            workout.setDate(date);
            return this;
        }

        public Workout build() {
            return workout;
        }
    }
}
