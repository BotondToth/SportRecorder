package com.sporttracking.sporttracking.exceptions;

public class UsernameAlreadyTakenException extends Exception {
    public UsernameAlreadyTakenException() {
        super("username-taken");
    }
}
