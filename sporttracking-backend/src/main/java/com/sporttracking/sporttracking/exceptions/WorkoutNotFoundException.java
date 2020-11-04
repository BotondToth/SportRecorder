package com.sporttracking.sporttracking.exceptions;

public class WorkoutNotFoundException extends Exception{
    public WorkoutNotFoundException() {
        super("workout-not-found");
    }
}
