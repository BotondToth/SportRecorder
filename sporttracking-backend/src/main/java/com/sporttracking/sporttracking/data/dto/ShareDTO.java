package com.sporttracking.sporttracking.data.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShareDTO {
    private String friendId;
    private String workoutId;
}
