package com.sporttracking.sporttracking.exceptions;

public class UserNotFoundException extends Exception {
    public UserNotFoundException() {
        super("user-not-found");
    }
}
