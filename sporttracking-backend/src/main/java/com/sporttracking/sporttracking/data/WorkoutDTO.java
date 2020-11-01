package com.sporttracking.sporttracking.data;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class WorkoutDTO {
    private String title;
    private String description;
    private String type;
    private long duration;
    private long distance;
    private long calories;
    private Date date;
}
