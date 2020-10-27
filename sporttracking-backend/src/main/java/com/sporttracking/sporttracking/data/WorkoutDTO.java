package com.sporttracking.sporttracking.data;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class WorkoutDTO {
    private String title;
    private String description;
    private String type;
    private long duration;
    private long distance;
    private long calories;
}
