package com.sporttracking.sporttracking.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BulkShareDTO {
    private String workoutId;
    private String[] friendIds;
}
