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

    private Workout() {
    }

    private Workout(final WorkoutBuilder builder) {
        title = builder.title;
        description = builder.description;
        type = builder.type;
        duration = builder.duration;
        distance = builder.distance;
        calories = builder.calories;
        date = builder.date;
        beersPerWorkout = builder.beersPerWorkout;
        locationPoints = builder.locationPoints;
        user = builder.user;
    }

    public static class WorkoutBuilder {
        private String title = "Default workout title";
        private String description = "Default workout ddescription";
        private String type = "Running";
        private long duration = 0;
        private long distance = 0;
        private long calories = 0;
        private Date date = new Date();
        private long beersPerWorkout = 0;
        private Point[] locationPoints = new Point[0];
        private ApplicationUser user;

        public WorkoutBuilder setType(final String type) {
            this.type = type;
            return this;
        }


        public WorkoutBuilder setTitle(final String title) {
            this.title = title;
            return this;
        }

        public WorkoutBuilder setDescription(final String description) {
            this.description = description;
            return this;
        }

        public WorkoutBuilder setDuration(final long duration) {
            this.duration = duration;
            return this;
        }

        public WorkoutBuilder setDistance(final long distance) {
            this.distance = distance;
            return this;
        }

        public WorkoutBuilder setCalories(final long calories) {
            this.calories = calories;
            return this;
        }

        public WorkoutBuilder setUser(final ApplicationUser user) {
            this.user = user;
            return this;
        }

        public WorkoutBuilder setLocationPoints(final Point[] points) {
            locationPoints = points;
            return this;
        }

        public WorkoutBuilder setBeersPerWorkout(final long beers) {
            beersPerWorkout = beers;
            return this;
        }

        public WorkoutBuilder setDate(final Date date) {
            this.date = date;
            return this;
        }

        public Workout build() {
            return new Workout(this);
        }
    }
}
