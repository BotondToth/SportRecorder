package com.sporttracking.sporttracking.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "Workouts")
@NoArgsConstructor
@AllArgsConstructor
public class Workout {
    @Id
    private String id;
    @Field
    private String userId;
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

    public Workout(final WorkoutDTO workoutDTO, final String userId) {
        this.title = workoutDTO.getTitle();
        this.description = workoutDTO.getDescription();
        this.type = workoutDTO.getType();
        this.calories = workoutDTO.getCalories();
        this.duration = workoutDTO.getDuration();
        this.distance = workoutDTO.getDistance();
        this.userId = userId;
    }
}
