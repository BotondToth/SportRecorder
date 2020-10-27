package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.ApplicationUser;
import com.sporttracking.sporttracking.data.UserDTO;
import com.sporttracking.sporttracking.exceptions.EmailAddressTakenException;

public interface UserService {

    ApplicationUser registerUser(UserDTO userToRegister) throws EmailAddressTakenException;
}
