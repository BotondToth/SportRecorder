package com.sporttracking.sporttracking.exceptions;

public class EmailAddressTakenException extends Exception {

    public EmailAddressTakenException() {
        super("email-taken");
    }
}
