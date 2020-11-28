package com.sporttracking.sporttracking.data.dto;

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
