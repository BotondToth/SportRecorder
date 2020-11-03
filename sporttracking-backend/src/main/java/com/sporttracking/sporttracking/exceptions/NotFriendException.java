package com.sporttracking.sporttracking.exceptions;

public class NotFriendException extends Exception{
    public NotFriendException() {
        super("user-is-not-a-friend");
    }
}
