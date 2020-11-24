package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.UserDTO;
import com.sporttracking.sporttracking.exceptions.EmailAddressTakenException;
import com.sporttracking.sporttracking.exceptions.UsernameAlreadyTakenException;
import org.springframework.http.HttpHeaders;

import java.util.List;

public interface UserService {

    ApplicationUser registerUser(UserDTO userToRegister) throws EmailAddressTakenException, UsernameAlreadyTakenException;

    List<ApplicationUser> getUsers(HttpHeaders headers);

    ApplicationUser getCurrentUser(HttpHeaders headers);
}
