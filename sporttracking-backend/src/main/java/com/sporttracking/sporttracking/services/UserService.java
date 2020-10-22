package com.sporttracking.sporttracking.services;

import com.sporttracking.sporttracking.data.User;
import com.sporttracking.sporttracking.data.UserDTO;
import com.sporttracking.sporttracking.exceptions.EmailAddressTakenException;

public interface UserService {

    User registerUser(UserDTO userToRegister) throws EmailAddressTakenException;
}
