package com.sporttracking.sporttracking.data;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FriendWithShare {
    private String id;
    private ApplicationUser user;
    private ApplicationUser friend;
    private boolean isWorkoutSharedWith;
}
